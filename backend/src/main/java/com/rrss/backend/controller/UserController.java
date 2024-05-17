package com.rrss.backend.controller;


import com.rrss.backend.dto.*;
import com.rrss.backend.service.UserService;
import com.rrss.backend.util.UserUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

import static org.springframework.util.MimeTypeUtils.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/api/v1/users")
@Validated
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> createUser(@RequestBody @Valid RegistrationRequest userRequest) throws IOException {
        return new ResponseEntity<>(userService.createUser(userRequest), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        return ResponseEntity.ok(userService.login(loginRequest));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        userService.refreshToken(request,response);
    }

    @GetMapping
    public ResponseEntity<UserDto> getUserSettings(Principal currentUser) {
        return ResponseEntity.ok(userService.getUserSettings(currentUser));
    }

    @PutMapping
    public ResponseEntity<UserSettingsDto> changeSettings(Principal currentUser, @RequestBody @Valid ChangeUserSettingsRequest changeUserSettingsRequest) {
        return ResponseEntity.ok(userService.changeSettings(currentUser, changeUserSettingsRequest));
    }

    @PutMapping("/picture")
    public ResponseEntity<byte[]> uploadProfilePicture(@RequestParam("image") MultipartFile file, Principal currentUser) throws IOException {
        byte[] imageData = userService.uploadProfilePicture(file, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .contentType(MediaType.valueOf(IMAGE_PNG_VALUE))
                .body(imageData);
    }

    @GetMapping("/picture")
    public ResponseEntity<byte[]> downloadProfilePicture(Principal currentUser) {
        byte[] imageData = userService.downloadProfilePicture(currentUser);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf(IMAGE_PNG_VALUE))
                .body(imageData);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteUser(Principal currentUser) {
        return ResponseEntity.ok(userService.deleteUser(currentUser));
    }

    @PutMapping("/ban/{user-id}")
    @PreAuthorize("hasAuthority('BAN_USER')")
    public ResponseEntity<String> banUser(@PathVariable("user-id") String userId) {
        return ResponseEntity.ok(userService.banUser(userId));
    }

    @GetMapping("/banned-users")
    @PreAuthorize("hasAuthority('BAN_USER')")
    public ResponseEntity<List<UserDto>> searchBannedUsers(@RequestBody SearchBannedUserRequest searchBannedUserRequest) {
        return ResponseEntity.ok(userService.searchBannedUsers(searchBannedUserRequest));
    }

}