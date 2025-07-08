package com.emma.pfe.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity @Data
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Responsabilite {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    @Column(nullable = false, unique = true)
    private String titre;

    @Column(nullable = false, unique = true, length = 10)
    private String code;

  /*  @JsonIgnore
    @OneToMany(mappedBy = "responsabilite", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResponsabiliteAssumee> responsabilitesAssumees;
*/

}
