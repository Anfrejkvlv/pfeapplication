package com.emma.pfe.controller;

import com.emma.pfe.domain.dto.GradeObtenuDTO;
import com.emma.pfe.domain.entity.GradeObtenu;
import com.emma.pfe.service.GradeObtenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/professeurs/{code}/grades-obtenus")
public class GradeObtenuController {
    private final GradeObtenuService obtenuService;

    @GetMapping("/{idObtenu}")
    public ResponseEntity<GradeObtenu> getGradeObtenu(@PathVariable final String code, Integer idObtenu) {
        return ResponseEntity.ok(obtenuService.getOne(idObtenu));
    }

    @GetMapping
    public ResponseEntity<List<GradeObtenuDTO>> obtenus(@PathVariable("code") String code) {
        return ResponseEntity.ok(obtenuService.listeByProfesseur(code));
    }

    @PostMapping
    public ResponseEntity<GradeObtenuDTO> create(@PathVariable String code, @RequestBody GradeObtenuDTO dto) {
        return ResponseEntity.ok(obtenuService.create(code,dto));
    }

    @PutMapping("/{idGrade}")
    public ResponseEntity<GradeObtenuDTO> update(@PathVariable String code,@PathVariable Integer idGrade, @RequestBody GradeObtenuDTO dto) {
        return ResponseEntity.ok(obtenuService.update(code,idGrade,dto));
    }

    @DeleteMapping("/{idGrade}")
    //@PreAuthorize("hasAnyAuthority('user:delete')")
    public ResponseEntity<GradeObtenuDTO> delete(@PathVariable String code,@PathVariable Integer idGrade) {
        obtenuService.delete(code,idGrade);
        return ResponseEntity.noContent().build();
    }


}
