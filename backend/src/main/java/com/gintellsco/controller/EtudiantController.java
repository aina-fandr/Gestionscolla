package com.gintellsco.controller;

import com.gintellsco.entity.Etudiant;
import com.gintellsco.repository.EtudiantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/etudiants")
@CrossOrigin(origins = "*", allowedHeaders = "*")   // ← Important
@RequiredArgsConstructor
public class EtudiantController {

    private final EtudiantRepository etudiantRepository;

    @GetMapping
    public ResponseEntity<List<Etudiant>> getAllEtudiants() {
        return ResponseEntity.ok(etudiantRepository.findAll());
    }

    // ... autres méthodes
}