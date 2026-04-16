// ── EtudiantRepository.java ──────────────────────────────────────────────────
package com.gintellsco.repository;

import com.gintellsco.entity.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    Optional<Etudiant> findByMatricule(String matricule);
    boolean existsByMatricule(String matricule);
    List<Etudiant> findByClasseId(Long classeId);
    List<Etudiant> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);

    @Query("SELECT e FROM Etudiant e JOIN e.paiements p WHERE p.statut = 'EN_RETARD'")
    List<Etudiant> findEtudiantsEnRetard();
}