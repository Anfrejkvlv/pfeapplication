package com.emma.pfe.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity @Data
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    @Column(nullable = false, unique = true)
    private String grade;
    @Column(unique = true, nullable = false, length = 10)
    private String code;

    /*@JsonIgnore
    @OneToMany(mappedBy = "grade", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GradeObtenu> gradeObtenus;*/

}
