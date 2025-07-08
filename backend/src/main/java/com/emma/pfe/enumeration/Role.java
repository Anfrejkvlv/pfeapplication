package com.emma.pfe.enumeration;

import lombok.Getter;

import java.util.Set;

import static com.emma.pfe.constantes.Authority.*;

@Getter
public enum Role {
    ROLE_ADMIN(ADMIN_AUTHORITY),
    ROLE_GESTIONNAIRE(GESTIONNAIRE_AUTHORITY),
    ROLE_JURY(JURY_AUTHORITY);

    private final Set<String> authorities;

    Role(Set<String> authorities) {
        this.authorities=authorities;
    }
}
