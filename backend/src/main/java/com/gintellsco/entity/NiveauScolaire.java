package com.gintellsco.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "niveau_scolaire")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NiveauScolaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String nom;

    @Column(name = "frais_annuel", nullable = false, precision = 12, scale = 2)
    private BigDecimal fraisAnnuel;

    @OneToMany(mappedBy = "niveau", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Classe> classes = new ArrayList<>();
}