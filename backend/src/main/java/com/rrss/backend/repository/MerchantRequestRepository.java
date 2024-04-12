package com.rrss.backend.repository;

import com.rrss.backend.model.MerchantRequest;
import com.rrss.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MerchantRequestRepository extends JpaRepository<MerchantRequest, Long> {

    @Query("SELECT mr FROM MerchantRequest mr WHERE mr.user.username = :username")
    Optional<MerchantRequest> findMerchantRequestByUsername(String username);
}