package com.rrss.backend.service;

import com.rrss.backend.model.Token;
import com.rrss.backend.repository.TokenRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TokenService {

    private final TokenRepository repository;

    public TokenService(TokenRepository repository) {
        this.repository = repository;
    }

    public void addToken(Token token) {
        repository.save(token);
    }

    public List<Token> findAllValidTokensByUser(String id) {
        return repository.findAllValidTokensByUser(id);
    }

    public void addAll(List<Token> validUserTokens) {
        repository.saveAll(validUserTokens);
    }

    public Optional<Token> findByToken(String jwt) {
        return repository.findByToken(jwt);
    }

    public void save(Token storedToken) {
        repository.save(storedToken);
    }
}
