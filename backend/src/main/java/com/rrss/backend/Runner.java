package com.rrss.backend;

import com.rrss.backend.model.Authority;
import com.rrss.backend.model.Role;
import com.rrss.backend.repository.AuthorityRepository;
import com.rrss.backend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class Runner implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final AuthorityRepository authorityRepository;


    public Runner(RoleRepository roleRepository, AuthorityRepository authorityRepository) {
        this.roleRepository = roleRepository;
        this.authorityRepository = authorityRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        Role role = new Role("USER");
        roleRepository.save(role);
    }
}