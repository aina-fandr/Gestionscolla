// src/main/java/com/gintellsco/entity/Paiement.java
package com.gintellsco.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "paiement")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montantDu;

    @Column(precision = 10, scale = 2)
    private BigDecimal montantPaye;

    @Column(name = "date_echeance")
    private LocalDate dateEcheance;

    @Column(name = "date_paiement")
    private LocalDateTime datePaiement;

    @Column(length = 20)
    private String numeroTranche;

    @Column(length = 50)
    private String typePaiement;

    @Column(length = 20)
    private String statut;           // PAYE, EN_RETARD, NON_PAYE, PARTIEL

    @Column(length = 100)
    private String numeroRecu;
}