package com.emma.pfe.controller;

import com.emma.pfe.domain.HttpResponse;
import com.emma.pfe.domain.entity.Responsabilite;
import com.emma.pfe.service.ResponsabiliteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/responsabilite")
public class ResponsabiliteController {
    private final ResponsabiliteService respService;

    @GetMapping("/liste")
    public ResponseEntity<HttpResponse> listeResponsabilite() {
        return ResponseEntity.ok(
                HttpResponse.builder().timeStamp(LocalDateTime.now())
                        .message("Liste des responsabilités récupérée")
                        .data(Map.of("responsabilites",respService.getAllResponsabilites()))
                        .status(OK).statusCode(OK.value()).build()
        );
    }

    @GetMapping("/find/{code}")
    public ResponseEntity<Responsabilite> findResponsabilite(@PathVariable String code) {
        Optional<Responsabilite> resp = Optional.ofNullable(respService.getResponsabilite(code));
        resp.ifPresentOrElse(
                d -> System.out.println("Found: " + d),
                () -> System.out.println("Not found")
        );
        return resp.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Responsabilite> findResponsabiliteById(@PathVariable Integer id) {
        Optional<Responsabilite> resp = respService.getResponsabilite(id);
        resp.ifPresentOrElse(
                d -> System.out.println("Found: " + d),
                () -> System.out.println("Not found")
        );
        return resp.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/ajouter")
    public ResponseEntity<HttpResponse> ajouterResponsabilite(@RequestParam("code") String code, @RequestParam("titre") String titre) {
        return ResponseEntity.ok(
                HttpResponse.builder().timeStamp(LocalDateTime.now())
                        .message("Responsabilité ajoutée")
                        .data(Map.of("responsabilite",respService.save(code,titre )))
                        .status(CREATED).statusCode(CREATED.value()).build()
        );
    }

    @PutMapping("/update/{currentCode}")
    public ResponseEntity<HttpResponse> updateResponsabilite(@PathVariable String currentCode,@RequestParam("code") String codeNew, @RequestParam("titre") String titre) {
        return ResponseEntity.ok(
                HttpResponse.builder().timeStamp(LocalDateTime.now())
                        .message("Responsabilité mise à jour")
                        .data(Map.of("responsabilite",respService.update(currentCode, codeNew, titre)))
                        .status(OK).statusCode(OK.value()).build()
        );
    }

    @DeleteMapping("/delete/{code}")
    //@PreAuthorize("hasAnyAuthority('user:delete')")
    public ResponseEntity<HttpResponse> deleteResponsabilite(@PathVariable String code) {
        respService.delete(code);
        return ResponseEntity.ok(
                HttpResponse.builder().timeStamp(LocalDateTime.now())
                        .message("Responsabilité supprimée avec succès")
                        .status(OK).statusCode(OK.value()).build()
        );
    }
}
