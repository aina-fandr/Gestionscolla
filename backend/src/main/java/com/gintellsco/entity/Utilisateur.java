package com.gintellsco.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utilisateurs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String nomUtilisateur;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String motDePasse;

    @Column(nullable = false, length = 100)
    private String nomComplet;

    @Column(nullable = false, length = 20)
    private String role;

    @Builder.Default
    @Column(nullable = false)
    private Boolean estActif = true;
}