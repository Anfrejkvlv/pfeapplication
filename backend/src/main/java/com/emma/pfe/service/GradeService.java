package com.emma.pfe.service;

import com.emma.pfe.domain.entity.Grade;
import com.emma.pfe.repository.GradeRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class GradeService {
    private final GradeRepo gradeRepo;

    public Collection<Grade> getAllGrades() {
        log.info("Tous les grades de l'application");
        return gradeRepo.findAll();
    }

    public Grade getGrade(String code) {
        log.info("Grade recuperer avec ID: {}", code);
        Optional<Grade> grade = gradeRepo.findByCode(code);
        return grade.orElse(null);
    }

    public Grade addGrade(String code, String grade) {
        Grade newGrade;
        newGrade=gradeRepo.findGradeByGrade(grade);
        if(newGrade!=null) {
            throw new IllegalArgumentException("Le grade "+grade+"existe");
        }
        newGrade=gradeRepo.findGradeByCode(code);
        if(newGrade!=null) {
            throw new IllegalArgumentException("Un grade "+grade+"avec ce code"+code+"existe");
        }
        log.info("Ajout du nouveau grade");
        newGrade = new Grade();
        newGrade.setCode(code);
        newGrade.setGrade(grade);
        return gradeRepo.save(newGrade);
    }
    public Grade updateGrade(String code,String codeNew,String grade) {
        Grade gradeUpdate = gradeRepo.findByCode(code)
                .orElseThrow(()
                        -> new IllegalArgumentException("Le grade n'existe pas"));
        gradeUpdate.setGrade(grade);
        gradeUpdate.setCode(codeNew);
        log.info("Grade mis a jour avec succes");
        return gradeRepo.save(gradeUpdate);
    }
    public void deleteGrade(String code) {
        log.info("Le grade est supprimé");
        gradeRepo.deleteByCode(code);
    }

}
