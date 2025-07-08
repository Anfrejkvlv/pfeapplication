package com.emma.pfe.service;

import com.emma.pfe.domain.entity.Personne;
import com.emma.pfe.repository.PersonneRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Date;


import static java.lang.Boolean.*;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PersonneService {
    private final PersonneRepo repo;


    public Collection<Personne> findAll() {
        log.info("Find all personnes");
        return repo.findAll();
    }
    public Personne findOne(String CIN) {
        log.info("Find personne by CIN: {}", CIN);
        return repo.findByCin(CIN);
    }

    public Personne save(String cin,String nom, String prenom, String email, String tel, LocalDate dateNaissance, String sexe) {
        Personne personne= repo.findByCin(cin);

        if (personne != null) {
            throw new IllegalArgumentException("Personne exists ");
        }
        personne= new Personne();
        personne.setDateNaissance(dateNaissance);
        personne.setEmail(email);
        personne.setNom(nom);
        personne.setPrenom(prenom);
        personne.setCin(cin);
        personne.setTelephone(tel);
        personne.setSexe(sexe);

        log.info("Saving personne {}", personne);
        return repo.save(personne);
    }

    public Personne update(String cin,String cinNew,String nom, String prenom, String email, String tel, LocalDate dateNaissance, String sexe) {
        Personne person= repo.findByCin(cin);
        if (person == null) {
            log.error("Personne not found");
            throw new IllegalArgumentException("Personne does not exist");
        }

        log.info("Updating personne cin: {}", cin);
            person.setNom(nom);
            person.setPrenom(prenom);
            person.setEmail(email);
            person.setCin(cinNew);
            person.setTelephone(tel);
            person.setDateNaissance(dateNaissance);
            person.setSexe(sexe);
            return repo.save(person);
    }

    public Boolean delete(String cin) {
        if (repo.findByCin(cin) != null) {
            log.info("Deleting personne cin: " + cin);
            repo.deleteByCin(cin);
            return TRUE;
        }
        return FALSE;
    }


}
