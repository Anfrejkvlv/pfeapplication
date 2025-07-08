package com.emma.pfe.controller;

import com.emma.pfe.domain.HttpResponse;
import com.emma.pfe.domain.entity.Departement;
import com.emma.pfe.domain.entity.Grade;
import com.emma.pfe.service.GradeService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/grade")
public class GradeController {
    private final GradeService gradeService;

    @GetMapping("/liste")
    public ResponseEntity<HttpResponse> liste() {
        return ResponseEntity.ok(
                HttpResponse.builder().timeStamp(LocalDateTime.now())
                        .message("Liste des grades récupérés")
                        .data(Map.of("grades",gradeService.getAllGrades()))
                        .status(OK).statusCode(OK.value()).build()
        );
    }

    @PostMapping("/ajouter")
    public ResponseEntity<HttpResponse> ajouterGrade(@RequestParam("code") String code,@RequestParam("grade") String grade) {
        return ResponseEntity.ok(
                HttpResponse.builder().timeStamp(LocalDateTime.now())
                        .message("Grade crée")
                        .data(Map.of("grade",gradeService.addGrade(code,grade)))
                        .status(CREATED).statusCode(CREATED.value()).build()
        );
    }

    @GetMapping("/find/{code}")
    public ResponseEntity<Grade> findGrade(@PathVariable String code) {
        System.out.println("Searching for grade with code: " + code); // Debug
        Optional<Grade> dept = Optional.ofNullable(gradeService.getGrade(code));
        dept.ifPresentOrElse(
                d -> System.out.println("Found: " + d),
                () -> System.out.println("Not found")
        );
        return dept.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{code}")
    public ResponseEntity<HttpResponse> updateGrade(@PathVariable String code,@RequestParam("code") String codeNew, @RequestParam("grade") String grade) {
        return ResponseEntity.ok(
                HttpResponse.builder().timeStamp(LocalDateTime.now())
                        .message("Grade update")
                        .data(Map.of("grade",gradeService.updateGrade(code,codeNew,grade)))
                        .status(OK).statusCode(OK.value()).build()
        );
    }

    @DeleteMapping("/delete/{code}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpResponse> deleteGrade(@PathVariable String code) {
        gradeService.deleteGrade(code);
        return ResponseEntity.ok(
                HttpResponse.builder().timeStamp(LocalDateTime.now())
                        .message("Grade supprimé avec succès")
                        .status(OK).statusCode(OK.value()).build()
        );
    }


}
