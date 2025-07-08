package com.emma.pfe.constantes;

public class SecurityConstant {
    public static final long EXPIRATION_TIME = 432_000_000;// 5 jours
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String JWT_TOKEN_HEADER = "Jwt-Token";
    public static final String TOKEN_NON_VERIFIER = "Token Non-Verifier";
    public static final String GET_ARRAYS_LCC = "Get Arrays LCC";
    public static final String GET_ARRAYS_ADMIN = "User management portal";
    public static final String AUTHORITIES = "Authorities";
    //public static final String FORBIDEN_MESSAGE = "You need to be logged in to access this page";
    public static final String FORBIDEN_MESSAGE = "Connectez-vous pour acceder à cette page";
    public static final String ACCES_DENIED_MESSAGES = "You do not have permission to access this page";
    public static final String OPTION_HTTP_METHOD = "OPTIONS";
    public static final String[] PUBLIC_URLS = {"/**","/user/login","/user/delete","/user/update","/user/liste", "/user/register","/user/resetPassword","/user/image/**","swagger-ui/**","/v3/api-docs*/**" };

}
