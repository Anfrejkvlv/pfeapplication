package com.emma.pfe.repository;

import com.emma.pfe.domain.entity.ResponsabiliteAssumee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponsabiliteAssumeeRepo extends JpaRepository<ResponsabiliteAssumee, Integer> {

    List<ResponsabiliteAssumee> findByProfesseurCode(String code);

    List<ResponsabiliteAssumee> findByProfesseurCodeAndResponsabiliteId(String code, Integer responsabiliteId);



}
