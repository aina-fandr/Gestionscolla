package com.gintellsco.repository;

import com.gintellsco.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByNomUtilisateur(String nomUtilisateur);
    boolean existsByNomUtilisateur(String nomUtilisateur);
    boolean existsByEmail(String email);
}