package com.emma.pfe.controller;

import com.emma.pfe.domain.HttpResponse;
import com.emma.pfe.domain.entity.Departement;
import com.emma.pfe.service.DepartementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

import static java.time.LocalDateTime.now;
import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/departement")
public class DepartementController {
    private final DepartementService dptService;

    @GetMapping("/liste")
    public ResponseEntity<HttpResponse> listeDepartement() {
        return ResponseEntity.ok(
                HttpResponse.builder()
                        .timeStamp(now())
                        .data(Map.of("deparments",dptService.findAll()))
                        .message("Département récupéré")
                        .status(OK)
                        .statusCode(OK.value())
                        .build()
        );
    }

    @PostMapping("/ajouter")
    public ResponseEntity<HttpResponse> ajouterDepartement(@RequestParam("nom") String nom, @RequestParam("code") String code) {
        return ResponseEntity.ok(
                HttpResponse.builder()
                        .timeStamp(now())
                        .data(Map.of("deparments",dptService.create(nom, code)))
                        .message("Département crée")
                        .status(CREATED)
                        .statusCode(CREATED.value())
                         .build()
       );
    }

    @GetMapping("/find/{code}")
    public ResponseEntity<Departement> getByCode(@PathVariable String code) {
        System.out.println("Searching for department with code: " + code); // Debug
        Optional<Departement> dept = Optional.ofNullable(dptService.getByCode(code));
        dept.ifPresentOrElse(
                d -> System.out.println("Found: " + d),
                () -> System.out.println("Not found")
        );
        return dept.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Departement> getById(@PathVariable Integer id) {
        System.out.println("Searching for department with code: " + id); // Debug
        Optional<Departement> dept = Optional.ofNullable(dptService.getById(id));
        dept.ifPresentOrElse(
                d -> System.out.println("Found: " + d),
                () -> System.out.println("Not found")
        );
        return dept.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{code}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpResponse> deleteDepartement(@PathVariable String code) {
        try {

            return ResponseEntity.ok(
                    HttpResponse.builder()
                            .timeStamp(now())
                            .data(Map.of("deparments", dptService.delete(code)))
                            .message("Département supprimé")
                            .status(OK)
                            .statusCode(OK.value())
                            .build()
            );
        }catch (IllegalArgumentException e){
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update/{code}")
    public ResponseEntity<HttpResponse> updateDepartement(@PathVariable String code
            , @RequestParam("code") String codeNew
            , @RequestParam("nom") String nomNew) {
        try {
            return ResponseEntity.ok(
                    HttpResponse.builder()
                            .timeStamp(now())
                            .data(Map.of("deparments", dptService.update(code, codeNew, nomNew)))
                            .message("Département update, CODE: " + code)
                            .status(OK)
                            .statusCode(OK.value())
                            .build()
            );
        }catch (IllegalArgumentException e){
            //throw new ResponseStatusException(HttpStatus.NO_CONTENT, e.getMessage());
            return ResponseEntity.ok(
                    HttpResponse.builder().message("Aucune donnee trouver pour ce code "+code)
                            .status(NOT_FOUND)
                            .statusCode(NOT_FOUND.value())
                            .reason(NOT_FOUND.getReasonPhrase())
                            .build()
            );
        }
    }


}
