package com.emma.pfe.repository;

import com.emma.pfe.domain.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Utilisateur, Integer> {
 Utilisateur findByUsername(String username);
 Utilisateur findByEmail(String email);
 Boolean existsByUsername(String username);

 void deleteByUsername(String username);
}
