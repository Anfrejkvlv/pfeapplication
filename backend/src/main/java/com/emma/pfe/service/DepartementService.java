package com.emma.pfe.service;

import com.emma.pfe.domain.entity.Departement;
import com.emma.pfe.repository.DepartementRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static java.lang.Boolean.TRUE;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class DepartementService {
    private final DepartementRepo repo;

    public Departement create(String nom, String code){
        Departement dept;
        dept=getByNom(nom);
        if (dept==null) {
            throw new IllegalArgumentException("Le department "+nom+"avec ce code "+code+"existe");
        }
        dept=getByCode(code);
        if ( dept!= null) {
            throw new IllegalArgumentException("Un department "+dept.getNom()+"avec ce code "+code+"existe");
        }

        log.info("Department created successfully, department name: {}", nom);
        dept=new Departement();
        dept.setNom(nom);
        dept.setCode(code);
        return repo.save(dept);
    }

    public List<Departement> findAll(){
        return repo.findAll();
    }
    public Departement getByCode(String code){
        log.info("Department fetching successfully, department code: {}", code);
        return repo.findByCode(code);
    }

    public Departement getById(Integer id){
        log.info("Department fetching successfully, department Id: {}", id);
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Department not found"));
    }

    public Departement getByNom(String name) {
        log.info("Department fetching successfully, department nom: {}", name);
        return repo.findByNom(name);
    }

    public Departement update(String code,String codeNew, String nomNew){
        Departement departement = repo.findByCode(code);

        if (departement == null) {
            throw new IllegalArgumentException("Il n'existe pas un departement avec ce code:"+code);
        }
        log.info("Department updated successfully, department name: {}", nomNew);
        departement.setCode(codeNew);
        departement.setNom(nomNew);
        return repo.save(departement);
    }

    public Boolean delete(String code){
        log.info("Le departement a été bien supprimer, code:{}", code);
        if(repo.findByCode(code)==null){
         throw new IllegalArgumentException("Impossible de supprimer, il  n'existe pas un département avec ce code: "+code);
        }
        repo.deleteByCode(code);
        return TRUE;
    }
}
