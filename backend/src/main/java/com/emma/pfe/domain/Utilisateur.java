package com.emma.pfe.domain;

import com.emma.pfe.domain.entity.Personne;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
@PrimaryKeyJoinColumn(name = "personne_id")
public class Utilisateur extends Personne {
    //@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private  String userId;

    @Column(nullable = false, unique = true)
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;
    private boolean actif ;
    private boolean notLocked ;
    private String role;

    private Set<String> authorities = new HashSet<>();
    private LocalDateTime joinedDate;
    private Date lastLoginDate;


}
