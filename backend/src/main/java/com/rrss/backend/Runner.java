package com.rrss.backend;

import com.rrss.backend.model.Authority;
import com.rrss.backend.model.Cart;
import com.rrss.backend.model.Role;
import com.rrss.backend.model.User;
import com.rrss.backend.repository.AuthorityRepository;
import com.rrss.backend.repository.CartRepository;
import com.rrss.backend.repository.RoleRepository;
import com.rrss.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class Runner implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final AuthorityRepository authorityRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;


    public Runner(RoleRepository roleRepository, AuthorityRepository authorityRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, CartRepository cartRepository) {
        this.roleRepository = roleRepository;
        this.authorityRepository = authorityRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cartRepository = cartRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        Role role = new Role("USER");
        roleRepository.save(role);

        Cart cart =  cartRepository.save(new Cart());

        User user = new User(
                "jon_doe",
                passwordEncoder.encode("securepass"),
                "example@gmail.com",
                "jon",
                "doe",
                roleRepository.findByName("USER")
                        .orElseThrow(),
                LocalDate.of(1995, 5, 5),
                cart
        );

        userRepository.save(user);
    }
}