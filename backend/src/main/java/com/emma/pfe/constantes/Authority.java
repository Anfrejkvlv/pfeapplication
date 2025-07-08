package com.emma.pfe.constantes;

import java.util.HashSet;
import java.util.Set;

public class Authority {
    public static final Set<String> ADMIN_AUTHORITY;
    static {
        ADMIN_AUTHORITY = new HashSet<>();
        ADMIN_AUTHORITY.add("user:read");
        ADMIN_AUTHORITY.add("user:update");
        ADMIN_AUTHORITY.add("user:create");
        ADMIN_AUTHORITY.add("user:delete");
    }

    public static final Set<String> GESTIONNAIRE_AUTHORITY;
    static {
        GESTIONNAIRE_AUTHORITY = new HashSet<>();
        GESTIONNAIRE_AUTHORITY.add("user:read");
        GESTIONNAIRE_AUTHORITY.add("user:update");
        GESTIONNAIRE_AUTHORITY.add("user:create");
    }
    public static final Set<String> JURY_AUTHORITY;
    static {
        JURY_AUTHORITY = new HashSet<>();
        JURY_AUTHORITY.add("user:read");
    }
    //public static final String[] GESTIONNAIRE_AUTHORITY = {"user:read","user:update","user:create"};
    //public static final String[] JURY_AUTHORITY = {"user:read"};
}
