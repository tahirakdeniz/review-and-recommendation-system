package com.rrss.backend.service;

import com.rrss.backend.exception.custom.RoleNotFoundException;
import com.rrss.backend.model.Role;
import com.rrss.backend.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoleService {

    private final RoleRepository repository;

    public RoleService(RoleRepository repository) {
        this.repository = repository;
    }

    protected Role findRoleByName(String name) {
        return repository.findByName(name)
                .orElseThrow(() -> new RoleNotFoundException("role " + name + " not found"));
    }

    protected Optional<Role> findByName(String roleName) {
        return repository.findByName(roleName);
    }
}
