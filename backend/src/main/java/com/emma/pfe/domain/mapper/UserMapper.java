package com.emma.pfe.domain.mapper;


import com.emma.pfe.domain.Utilisateur;
import com.emma.pfe.domain.dto.UtilisateurDTO;
import com.emma.pfe.domain.entity.Personne;
import jakarta.persistence.EntityManager;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "nom", source = "personne.nom")
    @Mapping(target = "prenom", source = "personne.prenom")
    @Mapping(target = "email", source = "personne.email")
    @Mapping(target = "telephone", source = "personne.telephone")
    @Mapping(target = "dateNaissance", source = "personne.dateNaissance")
    @Mapping(target = "sexe", source = "personne.sexe")
    @Mapping(target = "cin", source = "personne.cin")
    @Mapping(target = "username", source = "personne.email")
    @Mapping(target = "userId", source = "dto.userId")
    @Mapping(target = "password", source = "dto.password")
    @Mapping(target = "actif", source = "dto.actif")
    @Mapping(target = "notLocked", source = "dto.notLocked")
    @Mapping(target = "role", source = "dto.role")
    @Mapping(target = "authorities", source = "dto.authorities")
    @Mapping(target = "joinedDate", source = "dto.joinedDate")
    @Mapping(target = "lastLoginDate", source = "dto.lastLoginDate")
    Utilisateur fromPersonneAndDto(Personne personne, UtilisateurDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "username", source = "username")
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "notLocked", source = "notLocked")
    @Mapping(target = "lastLoginDate")
    @Mapping(target = "joinedDate", source = "joinedDate")
    @Mapping(target = "actif", source = "actif")
    @Mapping(target = "authorities", source = "authorities")
    @Mapping(target = "nom", source = "nom")
    @Mapping(target = "prenom", source = "prenom")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "cin", source = "cin")
    @Mapping(target = "dateNaissance", source = "dateNaissance")
    @Mapping(target = "telephone", source = "telephone")
    @Mapping(target = "role", source = "role")
    @Mapping(target = "sexe", source = "sexe")
    Utilisateur toEntity1(UtilisateurDTO dto);

    
    @Mapping(target = "username", source = "username")
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "notLocked", source = "notLocked")
    @Mapping(target = "authorities", source = "authorities")
    @Mapping(target = "role", source = "role")
    @Mapping(target = "actif", source = "actif")
    @Mapping(target = "lastLoginDate", source = "lastLoginDate")
    @Mapping(target = "joinedDate", source = "joinedDate")
    UtilisateurDTO toDto(Utilisateur entity);


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateFromDto(UtilisateurDTO dto, @MappingTarget Utilisateur entity);

}
