package com.emma.pfe.repository;

import com.emma.pfe.domain.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GradeRepo extends JpaRepository<Grade, Integer> {
    Grade findGradeByGrade(String grade);
    Grade findGradeByCode(String code);
    Optional<Grade> findByCode(String code);
    void deleteByCode(String code);

}
