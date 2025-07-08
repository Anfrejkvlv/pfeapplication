package com.emma.pfe.domain.dto;

import com.emma.pfe.domain.entity.Professeur;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class ProfDTO {
    //private Integer id;

    @NotBlank @Size(max = 15)
    private String code;

    @NotBlank
    @Size(max = 100)
    private String nom;

    @NotBlank @Size(max = 100)
    private String prenom;

    @Email
    @Size(max = 150)
    private String email;

    @Size(max = 15)
    private String cin;

    @Past
    private LocalDate dateNaissance;


    @NotBlank @Size(max = 10)
    private String sexe;
    @NotBlank @Size(max = 15)
    private String telephone;



    @NotNull
    private Integer idDepartement;

    private List<Integer> gradesIds;
    private List<Integer> responsabilitesIds;
};
