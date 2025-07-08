package com.emma.pfe.service;

import com.emma.pfe.domain.dto.GradeObtenuDTO;
import com.emma.pfe.domain.dto.ProfDTO;
import com.emma.pfe.domain.dto.RespAssumeDTO;
import com.emma.pfe.domain.entity.*;
import com.emma.pfe.domain.mapper.ProfMapper;
import com.emma.pfe.repository.*;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
//@RequiredArgsConstructor
@Slf4j
public class ProfesseurService {

    private final DepartementRepo deptRepo;
    private final ProfesseurRepo profRepo;
    private final ProfMapper mapper;
    private final GradeObtenuService gradeObtenuService;
    private final GradeRepo gradeRepo;
    private final ResponsabiliteAssumeeService respAssumeeService;


    public ProfesseurService(ProfesseurRepo profRepo, DepartementRepo deptRepo,  GradeRepo gradeRepo,  ProfMapper mapper, GradeObtenuService gradeObtenuService, ResponsabiliteAssumeeService respAssumeeService) {
        this.profRepo = profRepo;
        this.deptRepo = deptRepo;
        this.mapper = mapper;

        this.gradeObtenuService = gradeObtenuService;
        this.gradeRepo = gradeRepo;
        this.respAssumeeService = respAssumeeService;
    }


    public ProfDTO create(ProfDTO dto) {
        Professeur prof;
        if (profRepo.existsByCode(dto.getCode())) {
            throw new IllegalArgumentException("Le Professeur "+dto.getNom()+" "+dto.getPrenom()+"existe");
        }
        prof = mapper.toEntity(dto);
        Departement d = deptRepo.findById(dto.getIdDepartement())
                .orElseThrow(() -> new IllegalArgumentException("Département introuvable"));
        prof.setDepartement(d);
        prof = profRepo.save(prof);
        return mapper.toDto(prof);
    }

    public List<ProfDTO> findAll() {
        return profRepo.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public ProfDTO getOne(String code) {
        Professeur prof=profRepo.findByCode(code)
                .orElseThrow(()-> new IllegalArgumentException("Professeur introuvable, code"+code));
        return mapper.toDto(prof);
    }


    public ProfDTO update(String code, ProfDTO dto) {
        Professeur prof = profRepo.findByCode(code)
            .orElseThrow(() -> new IllegalArgumentException("Professeur introuvable, code: "+code));

        prof.setNom(dto.getNom());
        prof.setPrenom(dto.getPrenom());
        prof.setCin(dto.getCin());
        prof.setCode(dto.getCode());
        prof.setSexe(dto.getSexe());
        prof.setDateNaissance(dto.getDateNaissance());
        Departement d = deptRepo.findById(dto.getIdDepartement())
                .orElseThrow(() -> new IllegalArgumentException("Département introuvable, ID: "+dto.getIdDepartement()));
        prof.setDepartement(d);
        prof = profRepo.save(prof);
        return mapper.toDto(prof);
    }

    public void delete(String code) {
        if (!profRepo.existsByCode(code)){
            throw new IllegalArgumentException("Professeur introuvable, code: "+code);
        }
        profRepo.deleteByCode(code);
    }


    /***ICI C'EST LA PARTIE DE L'ATTRIBUTION DES GRADE ET RESPONSABILITES AU PROF********/

    // GRADE OBTENU

    public GradeObtenuDTO addGradeToProfesseur(String code,GradeObtenuDTO dto) {
        return gradeObtenuService.create(code,dto);
    }
    public GradeObtenuDTO updateGradeToProfesseur(String code,Integer id,GradeObtenuDTO dto) {
        return gradeObtenuService.update(code,id,dto);
    }

    public void deleteGradeToProfesseur(String code,Integer id) {
        gradeObtenuService.delete(code,id);
    }

    public List<GradeObtenuDTO> getGradeToProfesseur(String code) {
        return gradeObtenuService.listeByProfesseur(code);
    }

    // RESPONSABILITE AASSUMEES

    public RespAssumeDTO addResponsabiliteToProfesseur(String code,RespAssumeDTO dto) {
        return respAssumeeService.create(code,dto);
    }

    public RespAssumeDTO updateResponsabitiviteToProfesseur(String code,Integer id,RespAssumeDTO dto) {
        return respAssumeeService.update(code,id,dto);
    }

    public List<RespAssumeDTO> getResponsabiliteToProfesseur(String code) {
        return respAssumeeService.listeParProfesseur(code);
    }

    public void deleteResponsabiliteToProfesseur(String code,Integer id) {
        respAssumeeService.deleteResponsabiliteAssumee(code,id);
    }
}
