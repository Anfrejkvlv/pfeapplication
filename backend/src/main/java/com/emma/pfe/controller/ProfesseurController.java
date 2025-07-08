package com.emma.pfe.controller;

import com.emma.pfe.domain.HttpResponse;
import com.emma.pfe.domain.dto.GradeObtenuDTO;
import com.emma.pfe.domain.dto.ProfDTO;
import com.emma.pfe.domain.dto.RespAssumeDTO;
import com.emma.pfe.domain.entity.Professeur;
import com.emma.pfe.service.ProfesseurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/professeur")
public class ProfesseurController {
    private final ProfesseurService profService;
    
    
    @PostMapping("/ajouter")
    public ResponseEntity<ProfDTO> create(@Valid @RequestBody ProfDTO dto) {
        ProfDTO created = profService.create(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/liste")
    public ResponseEntity<List<ProfDTO>> list() {
        List<ProfDTO> all = profService.findAll();
        return ResponseEntity.ok(all);
    }

    @GetMapping("/{code}")
    public ResponseEntity<ProfDTO> get(@PathVariable String code) {
        ProfDTO dto = profService.getOne(code);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{code}")
    public ResponseEntity<ProfDTO> update(
            @PathVariable String code,
            @Valid @RequestBody ProfDTO dto
    ) {
        ProfDTO updated = profService.update(code, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{code}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String code) {
        profService.delete(code);
        return ResponseEntity.noContent().build();
    }


    //ICI C'EST LA PARTIE DE L'ATTRIBUTION DES GRADE ET RESPONSABILITES AU PROF
    /**************GRADE OBTENU***************/
    @GetMapping("/code/{code}/grade-obtenus")
    public ResponseEntity<List<GradeObtenuDTO>> listeGradeObtenu(@PathVariable String code) {
        return ResponseEntity.ok(profService.getGradeToProfesseur(code));
    }

    @PostMapping("/attribuer-grade/{code}")
    public ResponseEntity<GradeObtenuDTO> addGradeObtenu(@PathVariable String code,@Valid @RequestBody GradeObtenuDTO dto) {
        return ResponseEntity.ok(profService.addGradeToProfesseur(code, dto));
    }

    @PutMapping("/code/{code}/grade-obtenus/{gradeId}")
    public ResponseEntity<GradeObtenuDTO> updateGradeObtenu(@PathVariable String code,@PathVariable Integer gradeId,@Valid @RequestBody GradeObtenuDTO dto){
        return ResponseEntity.ok(profService.updateGradeToProfesseur(code, gradeId, dto));
    }

    @DeleteMapping("code/{code}/grade-obtenu/{gradeId}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteGradeObtenu(@PathVariable String code,@PathVariable Integer gradeId) {
        profService.deleteGradeToProfesseur(code, gradeId);
        return ResponseEntity.noContent().build();
    }

    /**************RESPONSABILITE ASSUMEE***************/

    @GetMapping("/code/{code}/responsabilites-assumees")
    public ResponseEntity<List<RespAssumeDTO>> listeResponsabilitesAssumee(@PathVariable String code) {
        return ResponseEntity.ok(profService.getResponsabiliteToProfesseur(code));
    }

    @PostMapping("/attribuer-resp/{code}")
    public ResponseEntity<RespAssumeDTO> addRespAssume(@PathVariable String code,@Valid @RequestBody RespAssumeDTO dto) {
        return ResponseEntity.ok(profService.addResponsabiliteToProfesseur(code, dto));
    }

    @PutMapping("/code/{code}/responsabilites-assumees/{idResp}")
    public ResponseEntity<RespAssumeDTO> updateResponsabiliteAssumee(@PathVariable String code,@PathVariable Integer idResp,@Valid @RequestBody RespAssumeDTO dto) {
        return ResponseEntity.ok(profService.updateResponsabitiviteToProfesseur(code, idResp, dto));
    }

    @DeleteMapping("/code/{code}/responsabilites-assumees/{idResp}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResponsabiliteAssumee(@PathVariable String code,@PathVariable Integer idResp) {
        profService.deleteResponsabiliteToProfesseur(code, idResp);
        return ResponseEntity.noContent().build();
    }
}
