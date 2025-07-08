package com.emma.pfe.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
public class UtilisateurDTO {
    private  String userId;
    @NotBlank
    private String password;

    @NotBlank
    private String username;
    private boolean actif ;
    private boolean notLocked ;
    private String role;
    @JsonIgnore
    private Set<String> authorities;
    private LocalDateTime joinedDate;
    private LocalDateTime lastLoginDate;

    private Integer version;
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

}
