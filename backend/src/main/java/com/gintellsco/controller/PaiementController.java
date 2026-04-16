package com.gintellsco.controller;

import com.gintellsco.entity.Etudiant;
import com.gintellsco.entity.Paiement;
import com.gintellsco.repository.EtudiantRepository;
import com.gintellsco.repository.PaiementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/paiements")
@RequiredArgsConstructor
public class PaiementController {

    private final PaiementRepository paiementRepository;
    private final EtudiantRepository etudiantRepository;

    @GetMapping
    public List<Paiement> getAll() {
        return paiementRepository.findAll();
    }

    @GetMapping("/etudiant/{etudiantId}")
    public List<Paiement> getByEtudiant(@PathVariable Long etudiantId) {
        return paiementRepository.findByEtudiantId(etudiantId);
    }

    @GetMapping("/retards")
    public List<Paiement> getRetards() {
        return paiementRepository.findPaiementsEnRetard(LocalDate.now());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long total    = paiementRepository.count();
        long payes    = paiementRepository.countByStatut("PAYE");
        long enRetard = paiementRepository.countByStatut("EN_RETARD");
        long nonPayes = paiementRepository.countByStatut("NON_PAYE");
        return ResponseEntity.ok(Map.of(
                "total", total,
                "payes", payes,
                "enRetard", enRetard,
                "nonPayes", nonPayes
        ));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        Long etudiantId = Long.valueOf(body.get("etudiantId").toString());
        Etudiant etudiant = etudiantRepository.findById(etudiantId)
                .orElseThrow(() -> new RuntimeException("Étudiant introuvable"));

        Paiement p = new Paiement();
        p.setEtudiant(etudiant);
        p.setMontantDu(new BigDecimal(body.get("montantDu").toString()));
        p.setMontantPaye(new BigDecimal(body.getOrDefault("montantPaye", "0").toString()));
        p.setDateEcheance(LocalDate.parse((String) body.get("dateEcheance")));
        // ── CORRECTION : conversion explicite en Integer ──
        p.setNumeroTranche(body.get("numeroTranche").toString());
        p.setTypePaiement((String) body.get("typePaiement"));

        BigDecimal du   = p.getMontantDu();
        BigDecimal paye = p.getMontantPaye();
        if (paye.compareTo(BigDecimal.ZERO) == 0)  p.setStatut("NON_PAYE");
        else if (paye.compareTo(du) >= 0)           p.setStatut("PAYE");
        else                                         p.setStatut("PARTIEL");

        if ("PAYE".equals(p.getStatut())) {
            p.setDatePaiement(LocalDateTime.now());
            long count = paiementRepository.count() + 1;
            p.setNumeroRecu(String.format("REC-%d-%06d", LocalDate.now().getYear(), count));
        }

        return ResponseEntity.ok(paiementRepository.save(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return paiementRepository.findById(id).map(p -> {
            if (body.get("montantPaye") != null) {
                BigDecimal paye = new BigDecimal(body.get("montantPaye").toString());
                p.setMontantPaye(paye);
                if (paye.compareTo(BigDecimal.ZERO) == 0)       p.setStatut("NON_PAYE");
                else if (paye.compareTo(p.getMontantDu()) >= 0) p.setStatut("PAYE");
                else                                             p.setStatut("PARTIEL");

                if ("PAYE".equals(p.getStatut()) && p.getDatePaiement() == null) {
                    p.setDatePaiement(LocalDateTime.now());
                    long count = paiementRepository.count() + 1;
                    p.setNumeroRecu(String.format("REC-%d-%06d", LocalDate.now().getYear(), count));
                }
            }
            if (body.get("typePaiement") != null)
                p.setTypePaiement((String) body.get("typePaiement"));
            return ResponseEntity.ok(paiementRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!paiementRepository.existsById(id)) return ResponseEntity.notFound().build();
        paiementRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Paiement supprimé"));
    }
}