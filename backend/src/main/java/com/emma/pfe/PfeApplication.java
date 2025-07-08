package com.emma.pfe;

import com.emma.pfe.domain.Utilisateur;
import com.emma.pfe.domain.dto.UtilisateurDTO;
import com.emma.pfe.repository.UserRepository;
import com.emma.pfe.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;

@SpringBootApplication
public class PfeApplication {

    public static void main(String[] args) {
        SpringApplication.run(PfeApplication.class, args);
    }
/*
    @Bean
    CommandLineRunner run(UserService service) {
        UtilisateurDTO dto=new UtilisateurDTO();
        dto.setNom("ADMIN");
        dto.setPrenom("ADMIN");
        dto.setSexe("Masculin");
        dto.setTelephone("076472421");
        dto.setCin("D42E54");
        dto.setEmail("kilingm19@gmail.com");
        dto.setDateNaissance(LocalDate.parse("1995-06-23"));
        dto.setRole("ROLE_ADMIN");
        return args -> {
            service.register(dto);
        };
    }
*/
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.addAllowedHeader("**");
        corsConfiguration.addAllowedMethod("**");
        corsConfiguration.addAllowedOrigin("**");
        corsConfiguration.setAllowedOrigins(Collections.singletonList("http://localhost:8089"));
        corsConfiguration.setAllowedHeaders(Arrays.asList("Origin", "Access-Control-Allow-Origin", "Content-Type",
                "Accept", "Jwt-Token", "Authorization", "Origin, Accept", "X-Requested-With",
                "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        corsConfiguration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Jwt-Token", "Authorization",
                "Access-Control-Allow-Origin", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        urlBasedCorsConfigurationSource.registerCorsConfiguration( "/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
