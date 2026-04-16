package com.gintellsco.repository;

import com.gintellsco.entity.NiveauScolaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NiveauScolaireRepository extends JpaRepository<NiveauScolaire, Long> {
    Optional<NiveauScolaire> findByNom(String nom);
    boolean existsByNom(String nom);
}