package com.rrss.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rrss.backend.dto.*;
import com.rrss.backend.enums.TokenType;
import com.rrss.backend.exception.custom.UsernameIsNotUniqueException;
import com.rrss.backend.model.*;
import com.rrss.backend.repository.MerchantRequestRepository;
import com.rrss.backend.repository.UserRepository;
import com.rrss.backend.util.ImageUtil;
import com.rrss.backend.util.UserUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.io.IOException;
import java.util.zip.DataFormatException;


@Service
public class UserService {

    private final UserRepository repository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final RoleService roleService;
    private final ConfirmationService confirmationService;
    private final MerchantRequestRepository merchantRequestRepository;
    private final CartService cartService;
    private final MerchantService merchantService;
    private final UserUtil userUtil;


    public UserService(UserRepository repository, JwtService jwtService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, TokenService tokenService, RoleService roleService, ConfirmationService confirmationService, MerchantRequestRepository merchantRequestRepository, CartService cartService, MerchantService merchantService, UserUtil userUtil) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.roleService = roleService;
        this.confirmationService = confirmationService;
        this.merchantRequestRepository = merchantRequestRepository;
        this.cartService = cartService;
        this.merchantService = merchantService;
        this.userUtil = userUtil;
    }

    public LoginResponse createUser(RegistrationRequest registrationRequest) {


        confirmationService.checkOtp(registrationRequest.otp(), registrationRequest.email());

        if (repository.findByUsername(registrationRequest.username()).isPresent())
            throw new UsernameIsNotUniqueException("Username is not unique");

        Cart cart = cartService.createCart();

        User user = new User(
                registrationRequest.username(),
                registrationRequest.password(),
                registrationRequest.email(),
                registrationRequest.firstName(),
                registrationRequest.lastName(),
                roleService.findRoleByName("USER"),
                registrationRequest.dateOfBirth(),
                cart
        );

        if (registrationRequest.role().equals("MERCHANT")) {
            merchantRequestRepository.save(new MerchantRequest(user));
        }
        
        var savedUser = repository.save(user);

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        saveUserToken(jwtToken, savedUser);
        return new LoginResponse(jwtToken, refreshToken, registrationRequest.role());
    }

    public LoginResponse login(LoginRequest loginRequest) {


        User user = repository.findByUsername(loginRequest.username())
                .filter(u -> passwordEncoder.matches(loginRequest.password(), u.getPassword()))
                .orElseThrow(() -> new RuntimeException("invalid email or password"));


        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.username(),
                        loginRequest.password()
                )
        );

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        revokeAllUserTokens(user);
        saveUserToken(jwtToken, user);
        return new LoginResponse(jwtToken, refreshToken, user.getRole().getName());
    }

    private void saveUserToken(String jwtToken, User savedUser) {
        var token = new Token(
                jwtToken,
                TokenType.BEARER,
                false,
                false,
                savedUser);

        tokenService.addToken(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenService.findAllValidTokensByUser(user.getId());

        if (validUserTokens.isEmpty()) {
            return;
        }
        validUserTokens.forEach(t -> {
            t.setExpired(true);
            t.setRevoked(true);
        });
        tokenService.addAll(validUserTokens);
    }



    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String username;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        username = jwtService.extractUsername(refreshToken);
        if (username != null) {
            var user = this.repository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("user not found"));
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(accessToken, user);
                var authResponse = new LoginResponse(accessToken, refreshToken, user.getRole().getName());
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    public byte[] uploadProfilePicture(MultipartFile file, Principal currentUser) throws IOException {

        var user = userUtil.extractUser(currentUser);

        User newUser = new User(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getDescription(),
                user.isEnabled(),
                user.isCredentialsNonExpired(),
                user.isAccountNonLocked(),
                user.isAccountNonExpired(),
                user.getFirstName(),
                user.getLastName(),
                ImageUtil.compressImage(file.getBytes()),
                user.getRole(),
                user.getDateOfBirth(),
                user.getMerchant(),
                user.getReviews(),
                user.getAccountBalance(),
                user.getCart(),
                user.getSocialCredit(),
                user.getPurchases()
        );

        byte[] userImage = user.getProfilePicture();

        if (userImage == null) return null;
        try {
            return ImageUtil.decompressImage(userImage);
        } catch (DataFormatException | IOException e) {
            throw new RuntimeException("change this....");
        }

    }

    public byte[] downloadProfilePicture(Principal currentUser) {
        var user = userUtil.extractUser(currentUser);

        byte[] userImage = user.getProfilePicture();

        if (userImage == null) return null;

        try {
            return ImageUtil.decompressImage(userImage);
        } catch (DataFormatException | IOException e) {
            throw new RuntimeException("change this....");
        }
    }


    protected void changeUserRole(User user, String role) {
        Role newRole = roleService.findByName(role)
                .orElseThrow(() -> new RuntimeException(role + " role not found"));

        Merchant merchant = null;
        if (user.getMerchant() != null) {
            merchant = user.getMerchant();
        } else if (role.equals("MERCHANT")) {
            merchant = merchantService.createMerchant(user);
        }

        User newUser = new User(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getDescription(),
                user.isEnabled(),
                user.isCredentialsNonExpired(),
                user.isAccountNonLocked(),
                user.isAccountNonExpired(),
                user.getFirstName(),
                user.getLastName(),
                user.getProfilePicture(),
                newRole,
                user.getDateOfBirth(),
                merchant,
                user.getCart()
        );

        repository.save(user);
    }

    public UserSettingsDto changeSettings(Principal currentUser, ChangeUserSettingsRequest request) {
        User user = userUtil.extractUser(currentUser);

        if (repository.findByUsername(request.username()).isPresent())
            throw new UsernameIsNotUniqueException("Username is not unique");

        new User(
                user.getId(),
                request.username(),
                user.getPassword(),
                user.getEmail(),
                request.description(),
                user.isEnabled(),
                user.isCredentialsNonExpired(),
                user.isAccountNonLocked(),
                user.isAccountNonExpired(),
                request.firstName(),
                request.lastName(),
                user.getProfilePicture(),
                user.getRole(),
                request.dateOfBirth(),
                user.getMerchant(),
                user.getCart()
        );

        return UserSettingsDto.convert(repository.save(user));
    }

    protected User findByUsername(String username) {
        return repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    protected String updatePassword(User user, String password) {
        User newUser = new User(
                user.getId(),
                user.getUsername(),
                passwordEncoder.encode(password),
                user.getEmail(),
                user.getDescription(),
                user.isEnabled(),
                user.isCredentialsNonExpired(),
                user.isAccountNonLocked(),
                user.isAccountNonExpired(),
                user.getFirstName(),
                user.getLastName(),
                user.getProfilePicture(),
                user.getRole(),
                user.getDateOfBirth(),
                user.getMerchant(),
                user.getCart()
        );
        repository.save(newUser);
        return "password updated successfully";
    }
}
