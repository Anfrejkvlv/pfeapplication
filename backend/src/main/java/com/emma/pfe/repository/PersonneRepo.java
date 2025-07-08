package com.emma.pfe.repository;

import com.emma.pfe.domain.entity.Personne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonneRepo extends JpaRepository<Personne, Long> {
    Personne findByEmail(String email);
    Personne findByNom(String nom);
    Personne findByCin(String cin);
    void deleteByCin(String cin);
}
