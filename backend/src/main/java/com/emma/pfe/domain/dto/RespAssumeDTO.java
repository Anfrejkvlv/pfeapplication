package com.emma.pfe.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RespAssumeDTO {
    private Integer id;
    @NotNull
    private int idResponsabilite;

    @NotNull @PastOrPresent
    private LocalDate dateDebut;

    @NotNull @PastOrPresent
    private LocalDate dateFin;

    private  boolean active=true;

    @NotNull
    private Integer idGradeObtenu;

    private String titre;

    private String grade;
}
