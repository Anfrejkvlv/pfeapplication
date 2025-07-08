package com.emma.pfe.repository;
import com.emma.pfe.domain.entity.GradeObtenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface GradeObtenuRepo  extends JpaRepository<GradeObtenu, Integer> {
    Collection<GradeObtenu> findByProfesseurId(Integer professeurId);
    List<GradeObtenu> findByProfesseurCode(String code);

    GradeObtenu findByProfesseurCodeAndGradeId(String code, Integer gradeId);
}
