package com.emma.pfe.service;

import com.emma.pfe.domain.entity.Responsabilite;
import com.emma.pfe.repository.ResponsabiliteRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ResponsabiliteService {
    private final ResponsabiliteRepo respRepo;

    public Responsabilite getResponsabilite(String code) {
        log.info("getResponsabiliteByCode");
        return respRepo.findByCode(code);
    }

    public Optional<Responsabilite> getResponsabilite(Integer id) {
        log.info("getResponsabilite");
        return respRepo.findById(id);
    }

    public Collection<Responsabilite> getAllResponsabilites() {
        log.info("getAllResponsabilites");
        return respRepo.findAll();
    }

    public Responsabilite save(String code, String titre) {
        Responsabilite resp=respRepo.findByCode(code);

        if(resp!=null) {
            throw new IllegalArgumentException("Cette Responsabilite  existe");
        }
        log.info("save Responsabilite");
        resp=new Responsabilite();
        resp.setTitre(titre);
        resp.setCode(code);
        return respRepo.save(resp);
    }

    public Responsabilite update(String code,String newCode,String titre) {
        Responsabilite resp = respRepo.findByCode(code);
        if(resp==null) {
            throw new IllegalArgumentException("Responsabilite does not exist");
        }
        resp.setCode(newCode);
        resp.setTitre(titre);
        log.info("update Responsabilite");
        return respRepo.save(resp);
    }

    public void delete(String code) {
        respRepo.deleteByCode(code);
    }

}
