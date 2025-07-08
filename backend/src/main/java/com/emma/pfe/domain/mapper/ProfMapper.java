package com.emma.pfe.domain.mapper;

import com.emma.pfe.domain.dto.ProfDTO;
import com.emma.pfe.domain.entity.Professeur;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ProfMapper {
    //@Mapping(target = "id", ignore = true)
    @Mapping(target = "code", source = "code")
    @Mapping(target = "nom", source = "nom")
    @Mapping(target = "prenom", source = "prenom")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "cin", source = "cin")
    @Mapping(target = "dateNaissance", source = "dateNaissance")
    @Mapping(target = "telephone", source = "telephone")
    @Mapping(target = "sexe", source = "sexe")
    @Mapping(target = "departement.id", source = "idDepartement")
    Professeur toEntity(ProfDTO dto);

    @Mapping(target = "code", source = "code")
    //@Mapping(target = "id", source = "id")
    @Mapping(target = "nom", source = "nom")
    @Mapping(target = "prenom", source = "prenom")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "cin", source = "cin")
    @Mapping(target = "dateNaissance", source = "dateNaissance")
    @Mapping(target = "telephone", source = "telephone")
    @Mapping(target = "sexe", source = "sexe")
    @Mapping(target = "idDepartement", source = "departement.id")
    @Mapping(target = "gradesIds", ignore = true)
    @Mapping(target = "responsabilitesIds", ignore = true)
    ProfDTO toDto(Professeur entity);
}