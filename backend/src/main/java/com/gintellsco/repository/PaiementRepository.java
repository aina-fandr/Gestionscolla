// ── PaiementRepository.java ──────────────────────────────────────────────────
package com.gintellsco.repository;

import com.gintellsco.entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    List<Paiement> findByEtudiantId(Long etudiantId);
    List<Paiement> findByStatut(String statut);

    @Query("SELECT p FROM Paiement p WHERE p.statut != 'PAYE' AND p.dateEcheance < :today")
    List<Paiement> findPaiementsEnRetard(LocalDate today);

    long countByStatut(String statut);
}