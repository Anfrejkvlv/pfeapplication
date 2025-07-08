package com.emma.pfe.repository;

import com.emma.pfe.domain.entity.Departement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartementRepo extends JpaRepository<Departement, Integer> {
    Departement findByCode(String code);
    Departement findByNom(String departementName);
    void deleteByCode(String code);
}
