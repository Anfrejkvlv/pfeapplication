package com.emma.pfe.repository;

import com.emma.pfe.domain.entity.Responsabilite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResponsabiliteRepo extends JpaRepository<Responsabilite, Integer> {
    Responsabilite findByCode(String code);

    void deleteByCode(String code);
}
