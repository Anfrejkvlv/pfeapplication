package com.emma.pfe.service;

import com.emma.pfe.domain.dto.GradeObtenuDTO;
import com.emma.pfe.domain.entity.Grade;
import com.emma.pfe.domain.entity.GradeObtenu;
import com.emma.pfe.domain.entity.Professeur;
import com.emma.pfe.repository.GradeObtenuRepo;
import com.emma.pfe.repository.GradeRepo;
import com.emma.pfe.repository.ProfesseurRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class GradeObtenuService {
    private final GradeObtenuRepo obtenuRepo;
    private final ProfesseurRepo profRepo;
    private final GradeRepo gradeRepo;



    public List<GradeObtenuDTO> listeByProfesseur(String code){
            return obtenuRepo
                    .findByProfesseurCode(code)
                    .stream()
                    .map(go->{
                        GradeObtenuDTO dto = new GradeObtenuDTO();
                        dto.setId(go.getId());
                        dto.setGrade(go.getGrade().getGrade());
                        dto.setDataObtention(go.getDateObtention());
                        dto.setIdGrade(go.getGrade().getId());
                        dto.setActive(go.isActif());
                        return dto;
                    })
                    .collect(Collectors.toList());
    }

    public GradeObtenu getOne(Integer id){
        return obtenuRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Introuvable "));
    }

    public GradeObtenuDTO create(String code, GradeObtenuDTO dto) {
                Professeur p= profRepo.findByCode(code).orElseThrow(()-> new IllegalArgumentException("Professeur introuvable, code: "+code));

                Grade g= gradeRepo.findById(dto.getIdGrade()).orElseThrow(()-> new IllegalArgumentException("Grade introuvable, ID: "+dto.getIdGrade()));
        GradeObtenu go=obtenuRepo.findByProfesseurCodeAndGradeId(code,dto.getIdGrade());
        if (go!=null) {
            throw new IllegalArgumentException("Professeur et grade existent avec code: "+code+" ID_GRADE "+dto.getIdGrade());
        }
        go= new GradeObtenu();
        go.setProfesseur(p);
        go.setGrade(g);
        go.setActif(dto.isActive());
        go.setDateObtention(dto.getDataObtention());
        go = obtenuRepo.save(go);
        return toDTO(go);
    }

    public GradeObtenuDTO update(String code,Integer idGrade, GradeObtenuDTO dto) {

        GradeObtenu gro=obtenuRepo.findByProfesseurCodeAndGradeId(code,idGrade);
        if (gro==null) {
            throw new IllegalArgumentException("Professeur introuvable ou grade introuvable, code: "+code+" ID_GRADE "+idGrade);
        }
        Grade gr= gradeRepo.findById(dto.getIdGrade()).orElseThrow(()-> new IllegalArgumentException("Grade introuvable, ID: "+dto.getIdGrade()));
        gro.setDateObtention(dto.getDataObtention());
        gro.setActif(dto.isActive());
        gro.setGrade(gr);
        gro=obtenuRepo.save(gro);
        return toDTO(gro);
    }


    public void delete(String code,Integer idGrade) {

        GradeObtenu gro=obtenuRepo.findByProfesseurCodeAndGradeId(code,idGrade);
        if (gro==null) {
            throw new IllegalArgumentException("Professeur introuvable ou grade introuvable, code: "+code+" ID_GRADE "+idGrade);
        }
            log.info("Deleting gradeObtenu with idGrade: {} and ProfCode:{} \n", idGrade,code);

            obtenuRepo.delete(gro);
    }

    private GradeObtenuDTO toDTO(GradeObtenu g) {
            GradeObtenuDTO dto = new GradeObtenuDTO();
            //dto.setId(g.getId());
            //dto.setGrade(g.getGrade().getGrade());
            dto.setDataObtention(g.getDateObtention());
            dto.setIdGrade(g.getGrade().getId());
            dto.setActive(g.isActif());
            return dto;

    }
}
