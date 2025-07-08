package com.emma.pfe.domain.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class GradeObtenuDTO {
    private Integer id;

    @NotNull
    private Integer idGrade;

    @NotNull @PastOrPresent
    private LocalDate dataObtention;

    private boolean active=true;

    private String grade;
}