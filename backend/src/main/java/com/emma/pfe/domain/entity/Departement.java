package com.emma.pfe.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity @Data
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Departement {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    @Column(unique=true, nullable=false)
    private String code;
    @Column(unique=true, nullable=false)
    private String nom;

    @JsonIgnore
    @OneToMany(mappedBy = "departement", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Professeur> professeurs;

}
