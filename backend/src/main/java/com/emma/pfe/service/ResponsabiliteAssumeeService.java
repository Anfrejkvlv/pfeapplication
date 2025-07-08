package com.emma.pfe.service;

import com.emma.pfe.domain.dto.RespAssumeDTO;
import com.emma.pfe.domain.entity.*;
import com.emma.pfe.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ResponsabiliteAssumeeService {
    private final ResponsabiliteAssumeeRepo assumeeRepo;
    private final ResponsabiliteRepo respRepo;
    private final ProfesseurRepo profRepo;
    private final ResponsabiliteAssumeeRepo assRepo;
    private final GradeObtenuRepo gORepo;


    public List<RespAssumeDTO> listeParProfesseur(String code){
        return assumeeRepo
                .findByProfesseurCode(code)
                .stream().map(
                        ResponsabiliteAssumeeService::getDto
                )
                .collect(Collectors.toList());
    }

    public Optional<RespAssumeDTO> getResponsabiliteAssumee(Integer id){
        return assumeeRepo.findById(id).map(
                ResponsabiliteAssumeeService::getDto
        );
    }

    private static @NotNull RespAssumeDTO getDto(ResponsabiliteAssumee assumee) {
        RespAssumeDTO dto = new RespAssumeDTO();
        dto.setActive(assumee.isActive());
        dto.setId(assumee.getId());
        dto.setTitre(assumee.getResponsabilite().getTitre());
        dto.setGrade(assumee.getGradeObtenu().getGrade().getGrade());
        dto.setDateDebut(assumee.getDateDebut());
        dto.setDateFin(assumee.getDateFin());
        dto.setIdResponsabilite(assumee.getResponsabilite().getId());
        dto.setIdGradeObtenu(assumee.getGradeObtenu().getId());
        return dto;
    }
/*
    public RespAssumeDTO create(String code,RespAssumeDTO dto) {

        Professeur p= profRepo.findByCode(code).orElseThrow(()-> new IllegalArgumentException("Professeur introuvable, code: "+code));
        Responsabilite resp= respRepo.findById(dto.getIdResponsabilite()).orElseThrow(()->new IllegalArgumentException("Responsabilite introuvable, ID: "+dto.getIdResponsabilite()));



        GradeObtenu go=gORepo.findByProfesseurCodeAndGradeId(code,dto.getIdGradeObtenu());
        if (go==null) {
            throw new IllegalArgumentException("Grade Obtenu introuvable ou non rattache a ce Professeur ");
        }

        if(go.getDateObtention().isAfter(dto.getDateDebut()) && go.getDateObtention().isAfter(dto.getDateFin())){
            throw new IllegalArgumentException("Le grade doit etre bien avant le debut de la responsabilite");
        }

        List<ResponsabiliteAssumee> existe= assumeeRepo.findByProfesseurCodeAndResponsabiliteId(code, dto.getIdResponsabilite());
        log.info("LISTE: {}",assumeeRepo.findByProfesseurCodeAndResponsabiliteId(code, dto.getIdResponsabilite()));
        if(existe.size()>0){
            for (ResponsabiliteAssumee exist : existe) {

                LocalDate debut = exist.getDateDebut();
                LocalDate fin = exist.getDateFin();

                LocalDate debutNew = dto.getDateDebut();
                LocalDate finNew = dto.getDateFin();

                LocalDate effectiveEnd = fin != null ? fin : LocalDate.of(9999, Month.DECEMBER, 31);
                LocalDate effectiveNewEnd = finNew != null ? finNew : LocalDate.of(9999, Month.DECEMBER, 31);

                boolean verification = !debutNew.isAfter(effectiveEnd) && !debut.isAfter(effectiveNewEnd);
                if (verification && Objects.equals(exist.getGradeObtenu().getId(), dto.getIdGradeObtenu())) {
                    throw new IllegalArgumentException(String.format("Chevauchement détecté : professeur %s a deja une responsabilité %s " + " du %s au %s ", code, dto.getIdResponsabilite(), debut, (fin == null ? "En cours" : fin.toString())));
                }
            }
        }

        ResponsabiliteAssumee assumee=new ResponsabiliteAssumee();
        log.info("Create responsabilite assumee {}", dto);
        assumee.setProfesseur(p);
        assumee.setResponsabilite(resp);
        assumee.setActive(dto.getDateFin() != null);
        assumee.setDateDebut(dto.getDateDebut());
        assumee.setDateFin(dto.getDateFin());
        assumee.setGradeObtenu(go);
        assumee=assRepo.save(assumee);
        dto.setId(assumee.getId());
        dto.setTitre(resp.getTitre());
        dto.setGrade(go.getGrade().getGrade());
        return dto;
    }*/

    public RespAssumeDTO create(String code, RespAssumeDTO dto) {
        // Vérification de l'existence du professeur
        Professeur p = profRepo.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Professeur introuvable, code: " + code));

        // Vérification de l'existence de la responsabilité
        Responsabilite resp = respRepo.findById(dto.getIdResponsabilite())
                .orElseThrow(() -> new IllegalArgumentException("Responsabilite introuvable, ID: " + dto.getIdResponsabilite()));

        // Vérification de l'existence du grade obtenu pour ce professeur
        GradeObtenu go = gORepo.findByProfesseurCodeAndGradeId(code, dto.getIdGradeObtenu());
        if (go == null) {
            throw new IllegalArgumentException("Grade Obtenu introuvable ou non rattache a ce Professeur");
        }

        // Vérification de la date d'obtention du grade AVANT le début de la responsabilité
        if (go.getDateObtention().isAfter(dto.getDateDebut())) {
            throw new IllegalArgumentException("Le grade doit etre obtenu avant le debut de la responsabilite");
        }

        // Vérification des chevauchements de périodes
        List<ResponsabiliteAssumee> existantes = assumeeRepo.findByProfesseurCodeAndResponsabiliteId(code, dto.getIdResponsabilite());
        LocalDate debutNew = dto.getDateDebut();
        LocalDate finNew = dto.getDateFin();
        LocalDate effectiveNewEnd = (finNew != null) ? finNew : LocalDate.MAX;

        for (ResponsabiliteAssumee exist : existantes) {
            LocalDate debutExist = exist.getDateDebut();
            LocalDate finExist = exist.getDateFin();
            LocalDate effectiveEndExist = (finExist != null) ? finExist : LocalDate.MAX;

            // Vérification du chevauchement des périodes
            boolean chevauche =
                    !debutNew.isAfter(effectiveEndExist) &&
                            !debutExist.isAfter(effectiveNewEnd);

            // Vérification du même grade
            boolean memeGrade = Objects.equals(exist.getGradeObtenu().getId(), dto.getIdGradeObtenu());

            if (chevauche && memeGrade) {
                String periodeExist = debutExist + " - " + (finExist != null ? finExist : "En cours");
                throw new IllegalArgumentException(
                        "Chevauchement detecte : professeur " + code +
                                " a deja une responsabilite " + resp.getTitre() +
                                " (" + dto.getIdResponsabilite() + ") " +
                                "pour le grade " + dto.getIdGradeObtenu() +
                                " durant la periode: " + periodeExist
                );
            }
        }

        // Création de la nouvelle responsabilité assumée
        ResponsabiliteAssumee assumee = new ResponsabiliteAssumee();
        assumee.setProfesseur(p);
        assumee.setResponsabilite(resp);
        assumee.setActive(finNew == null); // Active si pas de date de fin
        assumee.setDateDebut(debutNew);
        assumee.setDateFin(finNew);
        assumee.setGradeObtenu(go);

        assumee = assRepo.save(assumee);

        // Mise à jour du DTO de retour
        dto.setId(assumee.getId());
        dto.setTitre(resp.getTitre());
        dto.setGrade(go.getGrade().getGrade());

        return dto;
    }

    public RespAssumeDTO update(String code,Integer id,RespAssumeDTO Newassume) {
        //Professeur p= profRepo.findByCode(code).orElseThrow(()-> new IllegalArgumentException("Professeur introuvable, code: "+code));
/*
        ResponsabiliteAssumee assumee=assumeeRepo.findByProfesseurCodeAndResponsabiliteId(code,id);
        if (assumee==null) {
            throw new IllegalArgumentException("Professeur and Responsibility introuvale");
        }*/

        if (Newassume==null) {
            throw new IllegalArgumentException("DTO VIDE ");
        }
        log.info("Update responsabilite assumee {}", Newassume);

        ResponsabiliteAssumee assumee=assumeeRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Responsabilite introuvable, ID: "+id));
/*
        GradeObtenu go=gORepo.findByProfesseurCodeAndGradeId(code,Newassume.getIdGradeObtenu());
        if (go==null) {
            throw new IllegalArgumentException("Grade Obtenu introuvable ou non rattache a ce Professeur , GO: "+Newassume.getIdGradeObtenu()+" DF: "+Newassume.getDateFin()+" DONNESS:"+Newassume);
        }*/

        GradeObtenu go=gORepo.findById(Newassume.getIdGradeObtenu()).orElseThrow(()->new IllegalArgumentException("GO INTROUVABABLE"));


        log.info("Update responsabilite assumee {}", Newassume);
        assumee.setDateDebut(Newassume.getDateDebut());
        assumee.setDateFin(Newassume.getDateFin());
        assumee.setActive(Newassume.isActive());
        assumee.setGradeObtenu(go);
        assumee=assumeeRepo.save(assumee);
        return toDTO(assumee);
    }

    public void deleteResponsabiliteAssumee(String code,Integer id) {
        ResponsabiliteAssumee assumee=assumeeRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Responsabilite introuvable, ID: "+id));
        if (assumee==null) {
            throw new IllegalArgumentException("Professeur and Responsibility introuvale");
        }
        log.info("Delete responsabilite and Professeur with id {} and code {}",id,code);
        assumeeRepo.delete(assumee);
    }

    private RespAssumeDTO toDTO(ResponsabiliteAssumee assume) {
        RespAssumeDTO dto = new RespAssumeDTO();
        dto.setActive(assume.isActive());
        dto.setDateDebut(assume.getDateDebut());
        dto.setDateFin(assume.getDateFin());
        dto.setIdResponsabilite(assume.getResponsabilite().getId());
        dto.setIdGradeObtenu(assume.getGradeObtenu().getId());
        return dto;
    }
}
