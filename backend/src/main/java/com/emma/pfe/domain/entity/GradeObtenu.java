package com.emma.pfe.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Entity @Data
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class GradeObtenu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnore
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "id_grade")
    private Grade grade;


    @JsonIgnore
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "id_professeur")
    private Professeur professeur;

    @Temporal(TemporalType.DATE)
    private LocalDate dateObtention;

    @Column(nullable = false)
    private boolean actif;

}
