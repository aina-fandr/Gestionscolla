package com.gintellsco.controller;

import com.gintellsco.entity.Utilisateur;
import com.gintellsco.repository.UtilisateurRepository;
import com.gintellsco.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UtilisateurRepository utilisateurRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    // ── POST /api/auth/login ──────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String nomUtilisateur = body.get("nomUtilisateur");
        String motDePasse     = body.get("motDePasse");

        var utilisateur = utilisateurRepository.findByNomUtilisateur(nomUtilisateur)
                .orElse(null);

        if (utilisateur == null || !passwordEncoder.matches(motDePasse, utilisateur.getMotDePasse())) {
            return ResponseEntity.status(401).body(Map.of("message", "Identifiants incorrects"));
        }

        if (!utilisateur.getEstActif()) {
            return ResponseEntity.status(403).body(Map.of("message", "Compte désactivé"));
        }

        String token = jwtUtil.generateToken(utilisateur.getNomUtilisateur(), utilisateur.getRole());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                        "id",          utilisateur.getId(),
                        "nomComplet",  utilisateur.getNomComplet(),
                        "email",       utilisateur.getEmail(),
                        "role",        utilisateur.getRole()
                )
        ));
    }

    // ── POST /api/auth/register ───────────────────────────────────────────
    // (à sécuriser en prod — admin seulement)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String nomUtilisateur = body.get("nomUtilisateur");

        if (utilisateurRepository.existsByNomUtilisateur(nomUtilisateur)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Nom d'utilisateur déjà pris"));
        }

        var utilisateur = Utilisateur.builder()
                .nomUtilisateur(nomUtilisateur)
                .email(body.get("email"))
                .motDePasse(passwordEncoder.encode(body.get("motDePasse")))
                .nomComplet(body.get("nomComplet"))
                .role(body.getOrDefault("role", "ROLE_PERSONNEL"))
                .build();

        utilisateurRepository.save(utilisateur);

        return ResponseEntity.ok(Map.of("message", "Compte créé avec succès"));
    }

    // ── GET /api/auth/me ─────────────────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        var utilisateur = utilisateurRepository.findByNomUtilisateur(username)
                .orElseThrow();
        return ResponseEntity.ok(Map.of(
                "id",         utilisateur.getId(),
                "nomComplet", utilisateur.getNomComplet(),
                "email",      utilisateur.getEmail(),
                "role",       utilisateur.getRole()
        ));
    }
}