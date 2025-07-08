package com.emma.pfe.controller;

import com.emma.pfe.domain.dto.RespAssumeDTO;
import com.emma.pfe.service.ResponsabiliteAssumeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/professeurs/{code}/responsabilites-assumees")
public class ResponsabiliteAssumeeController {
    private final ResponsabiliteAssumeeService respAssService;

    @GetMapping
    public ResponseEntity<List<RespAssumeDTO>> listeParProfesseur(@PathVariable String code) {
        return ResponseEntity.ok(respAssService.listeParProfesseur(code));
    }
    //@GetMapping("/assumee/{idAssume}")
    @GetMapping("/assumee/{idAssume}")
    public ResponseEntity<Optional<RespAssumeDTO>> getOne(@PathVariable String code, @PathVariable Integer idAssume) {
        return ResponseEntity.ok(respAssService.getResponsabiliteAssumee(idAssume));
    }

    @PostMapping
    public ResponseEntity<RespAssumeDTO> attribuer(@PathVariable String code, @RequestBody RespAssumeDTO dto) {
        return ResponseEntity.ok(respAssService.create(code, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RespAssumeDTO> update(@PathVariable String code,@PathVariable Integer id, @RequestBody RespAssumeDTO dto) {
        return ResponseEntity.ok(respAssService.update(code,id,dto));
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasAnyAuthority('user:delete')")
    public ResponseEntity<RespAssumeDTO> delete(@PathVariable String code,@PathVariable Integer id) {
        respAssService.deleteResponsabiliteAssumee(code,id);
        return ResponseEntity.noContent().build();
    }

}
