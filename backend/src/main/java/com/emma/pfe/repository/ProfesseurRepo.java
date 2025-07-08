package com.emma.pfe.repository;

import com.emma.pfe.domain.entity.Professeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface ProfesseurRepo extends JpaRepository<Professeur, Integer> {

    Optional<Professeur> findByCode(String code);
    void deleteByCode(String code);
    boolean existsByCode(String code);

}
