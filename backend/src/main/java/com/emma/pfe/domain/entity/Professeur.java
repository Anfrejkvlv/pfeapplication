package com.emma.pfe.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;
import java.util.List;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@PrimaryKeyJoinColumn(name = "personne_id")
public class Professeur extends Personne {
    @Column(unique = true, nullable = false, length = 15)
    private String code;

    @JsonIgnore
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "id_departement", nullable = false)
    private Departement departement;

    @OneToMany(mappedBy = "professeur", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GradeObtenu> gradeObtenus;



    @JsonIgnore
    @OneToMany(mappedBy = "professeur", cascade = CascadeType.ALL)
    private List<ResponsabiliteAssumee> responsabilites;
}
