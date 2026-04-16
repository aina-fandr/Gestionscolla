import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Imports corrects (export default)
import etudiantService from '../services/etudiantService';
import classeService from '../services/classeService';
import paiementService from '../services/paiementService';   // ← On va créer ce fichier

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    totalClasses: 0,
    paiementsEnRetard: 0,
    tauxRecouvrement: 0
  });
  const [retards, setRetards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [etudiantsRes, classesRes, paiementStatsRes, retardsRes] = await Promise.all([
          etudiantService.getAll(),
          classeService.getAll(),
          paiementService.getStats(),
          etudiantService.getRetards ? etudiantService.getRetards() : Promise.resolve({ data: [] })
        ]);

        const s = paiementStatsRes.data || {};
        const taux = s.total > 0 ? Math.round((s.payes / s.total) * 100) : 0;

        setStats({
          totalEtudiants: etudiantsRes.data.length || 0,
          totalClasses: classesRes.data.length || 0,
          paiementsEnRetard: s.enRetard || 0,
          tauxRecouvrement: taux,
        });

        setRetards((retardsRes.data || []).slice(0, 5));
      } catch (err) {
        console.error('Erreur chargement dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );
  }

  const statCards = [
    {
      label: 'Total étudiants',
      value: stats.totalEtudiants,
      sub: 'Inscrits cette année',
      color: 'border-indigo-500/20',
      icon: <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    },
    {
      label: 'Classes actives',
      value: stats.totalClasses,
      sub: 'Année en cours',
      color: 'border-teal-500/20',
      icon: <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    },
    {
      label: 'Paiements en retard',
      value: stats.paiementsEnRetard,
      sub: 'Nécessitent une action',
      color: 'border-red-500/20',
      icon: <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      label: 'Taux de recouvrement',
      value: `${stats.tauxRecouvrement}%`,
      sub: 'Sur frais attendus',
      color: 'border-amber-500/20',
      icon: <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
  ];

  return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Bonjour, {user?.nomComplet?.split(' ')[0] ?? 'Admin'} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Aperçu de la situation scolaire aujourd'hui</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {statCards.map((c, index) => (
              <div key={index} className={`rounded-xl border p-5 bg-slate-900 ${c.color}`}>
                <div className="mb-4">{c.icon}</div>
                <p className="text-2xl font-bold text-white mb-0.5">{c.value}</p>
                <p className="text-slate-400 text-sm">{c.label}</p>
                <p className="text-xs mt-2 text-slate-600">{c.sub}</p>
              </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-300">Progression du recouvrement</p>
            <span className="text-sm font-bold text-amber-400">{stats.tauxRecouvrement}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${stats.tauxRecouvrement}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div>
              <p className="text-sm font-semibold text-white">Étudiants en retard de paiement</p>
              <p className="text-xs text-slate-500 mt-0.5">{retards.length} étudiants affichés</p>
            </div>
            <Link to="/paiements" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Voir tous →</Link>
          </div>

          {retards.length === 0 ? (
              <div className="px-5 py-12 text-center text-slate-600 text-sm">
                Aucun retard de paiement détecté
              </div>
          ) : (
              <table className="w-full text-sm">
                <thead>
                <tr className="border-b border-slate-800">
                  {['Étudiant', 'Classe', 'Matricule'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                {retards.map(e => (
                    <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <Link to={`/etudiants/${e.id}`} className="text-slate-200 hover:text-indigo-400 font-medium transition-colors">
                          {e.prenom} {e.nom}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">{e.classe?.nom ?? '—'}</td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{e.matricule}</td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}
        </div>
      </div>
  );
}