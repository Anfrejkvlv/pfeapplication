package com.emma.pfe.controller;

import com.emma.pfe.domain.HttpResponse;
import com.emma.pfe.domain.entity.Grade;
import com.emma.pfe.domain.entity.Personne;
import com.emma.pfe.service.PersonneService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static java.time.LocalDateTime.now;
import static org.springframework.http.HttpStatus.*;


@RestController
@RequestMapping("/personne")
@RequiredArgsConstructor
public class PersonneController {

    public final PersonneService personneService;

    @GetMapping("/liste")
    public ResponseEntity<HttpResponse> getPersonListe() throws InterruptedException {
        TimeUnit.SECONDS.sleep(3);
        return ResponseEntity.ok(
                HttpResponse.builder()
                        .timeStamp(now())
                        .data(Map.of("personnes",personneService.findAll()))
                        .message("Personne récupérés")
                        .status(OK)
                        .statusCode(OK.value())
                        .build()
        );
    }

    @GetMapping("/find/{cin}")
    public ResponseEntity<Personne> getOnePerson(@PathVariable String cin){
        try{
            //System.out.println("Searching for department with code: " + cin); // Debug
            Optional<Personne> personne = Optional.ofNullable(personneService.findOne(cin));
            personne.ifPresentOrElse(
                    d -> System.out.println("Found: " + d),
                    () -> System.out.println("Not found")
            );
            return personne.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }catch (IllegalArgumentException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
//            return ResponseEntity.ok(
//                    builder().message("Aucune donnee trouver pour cet id "+id)
//                            .status(NOT_FOUND)
//                            .statusCode(NOT_FOUND.value())
//                            .reason(NOT_FOUND.getReasonPhrase())
//                            .build()
//            );
        }
    }

    @PostMapping(value = "/ajouter", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<HttpResponse> ajouterPerson(@RequestParam("cin") String cin,
                                                      @RequestParam("nom") String nom,
                                                      @RequestParam("prenom") String prenom,
                                                      @RequestParam("email") String email,
                                                      @RequestParam("telephone") String telephone,
                                                      @RequestParam("dateNaissance") LocalDate dateNaissance,
                                                      @RequestParam("sexe") String sexe
                                                      ){
        return ResponseEntity.ok(
                HttpResponse.builder().
                        timeStamp(now())
                        .data(Map.of("personne",personneService.save(cin,nom,prenom,email,telephone,dateNaissance,sexe)))
                        .message("Ajouter avec succes")
                        .status(CREATED).statusCode(CREATED.value()).build()
        );
    }

    @PutMapping(value = "/update/{cin}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<HttpResponse> updatePerson(@PathVariable String cin,
                                                     @RequestParam("cin") String cinNew,
                                                     @RequestParam("nom") String nom,
                                                     @RequestParam("prenom") String prenom,
                                                     @RequestParam("email") String email,
                                                     @RequestParam("telephone") String telephone,
                                                     @RequestParam("dateNaissance") LocalDate dateNaissance,
                                                     @RequestParam("sexe") String sexe
                                                     ){
        try{
            return ResponseEntity.ok(
                    HttpResponse.builder()
                            .timeStamp(now())
                            .message("Updated succssfully")
                            .data(Map.of("personne",personneService.update(cin, cinNew, nom,prenom,email,telephone,dateNaissance,sexe)))
                            .status(OK).statusCode(OK.value()).build()
            );
        }catch (IllegalArgumentException e){
            throw new ResponseStatusException(NOT_FOUND, e.getMessage());
        }
    }


    @DeleteMapping("/delete/{cni}")
    //@PreAuthorize("hasAnyAuthority('user:delete')")
    public ResponseEntity<HttpResponse> deletePerson(@PathVariable String cni){
        try {
            return ResponseEntity.ok(
                    HttpResponse.builder()
                            .timeStamp(now()).message("Personne supprimé")
                            .data(Map.of("personne",personneService.delete(cni)))
                            .status(OK).statusCode(OK.value()).build()
            );
        }catch (IllegalArgumentException e){
            throw new ResponseStatusException(NOT_FOUND, e.getMessage());
        }
    }


}

