import { useState } from 'react'

const mockPaiements = [
  { id: 1, numeroRecu: 'REC-2024-001', etudiant: 'Jean Rakoto', classe: 'Terminale A', tranche: 1, montantDu: 75000, montantPaye: 75000, echeance: '2024-10-01', datePaiement: '2024-09-28', statut: 'PAYE', type: 'ESPECES' },
  { id: 2, numeroRecu: null,           etudiant: 'Marie Rabe',  classe: '3ème B',      tranche: 2, montantDu: 65000, montantPaye: 0,     echeance: '2025-01-15', datePaiement: null,          statut: 'EN_RETARD', type: null },
  { id: 3, numeroRecu: null,           etudiant: 'Paul Andry',  classe: '1ère S',      tranche: 1, montantDu: 70000, montantPaye: 35000, echeance: '2024-10-01', datePaiement: '2024-10-10', statut: 'PARTIEL', type: 'VIREMENT' },
  { id: 4, numeroRecu: 'REC-2024-004', etudiant: 'Lova Nirina', classe: '6ème C',      tranche: 1, montantDu: 60000, montantPaye: 60000, echeance: '2024-10-01', datePaiement: '2024-10-01', statut: 'PAYE', type: 'MOBILE_MONEY' },
  { id: 5, numeroRecu: null,           etudiant: 'Soa Hery',    classe: '4ème A',      tranche: 2, montantDu: 65000, montantPaye: 0,     echeance: '2025-01-10', datePaiement: null,          statut: 'NON_PAYE', type: null },
]

const statutConfig = {
  PAYE:      { label: 'Payé',      class: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  EN_RETARD: { label: 'En retard', class: 'bg-red-500/10 text-red-400 border-red-500/20' },
  NON_PAYE:  { label: 'Non payé',  class: 'bg-slate-700/50 text-slate-400 border-slate-600/30' },
  PARTIEL:   { label: 'Partiel',   class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
}

const typeLabel = { ESPECES: 'Espèces', VIREMENT: 'Virement', CHEQUE: 'Chèque', MOBILE_MONEY: 'Mobile Money', CARTE_BANCAIRE: 'Carte' }

export default function Paiements() {
  const [filterStatut, setFilterStatut] = useState('TOUS')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = mockPaiements.filter(p => {
    const matchStatut = filterStatut === 'TOUS' || p.statut === filterStatut
    const matchSearch = p.etudiant.toLowerCase().includes(search.toLowerCase())
    return matchStatut && matchSearch
  })

  const totalPaye = mockPaiements.reduce((s, p) => s + p.montantPaye, 0)
  const totalDu = mockPaiements.reduce((s, p) => s + p.montantDu, 0)
  const nbRetards = mockPaiements.filter(p => p.statut === 'EN_RETARD').length

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Paiements</h1>
          <p className="text-slate-500 text-sm mt-1">Suivi des frais de scolarité</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Enregistrer un paiement
        </button>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total encaissé', value: `${totalPaye.toLocaleString('fr-MG')} Ar`, color: 'border-teal-500/20 text-teal-400' },
          { label: 'Total attendu',  value: `${totalDu.toLocaleString('fr-MG')} Ar`,   color: 'border-slate-700 text-slate-400' },
          { label: 'En retard',      value: nbRetards,                                   color: 'border-red-500/20 text-red-400' },
        ].map(s => (
          <div key={s.label} className={`bg-slate-900 border rounded-xl p-4 ${s.color.split(' ')[0]}`}>
            <p className={`text-xl font-bold ${s.color.split(' ')[1]}`}>{s.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un étudiant…"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
        <select
          value={filterStatut} onChange={e => setFilterStatut(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-all"
        >
          <option value="TOUS">Tous</option>
          <option value="PAYE">Payé</option>
          <option value="EN_RETARD">En retard</option>
          <option value="NON_PAYE">Non payé</option>
          <option value="PARTIEL">Partiel</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              {['N° Reçu', 'Étudiant', 'Classe', 'Tranche', 'Dû', 'Payé', 'Échéance', 'Statut', 'Mode', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map(p => {
              const cfg = statutConfig[p.statut] ?? statutConfig.NON_PAYE
              return (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{p.numeroRecu ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-200 font-medium">{p.etudiant}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{p.classe}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{p.tranche}ère</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{p.montantDu.toLocaleString('fr-MG')} Ar</td>
                  <td className="px-4 py-3 text-teal-400 font-mono text-xs">{p.montantPaye.toLocaleString('fr-MG')} Ar</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{p.echeance}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex text-xs px-2 py-1 rounded-md border ${cfg.class}`}>{cfg.label}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{typeLabel[p.type] ?? '—'}</td>
                  <td className="px-4 py-3">
                    {p.statut === 'PAYE' && (
                      <button className="text-slate-500 hover:text-indigo-400 transition-colors p-1 rounded" title="Télécharger le reçu">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal enregistrer paiement */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-semibold text-white">Enregistrer un paiement</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Étudiant</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-all">
                  <option>Sélectionner un étudiant</option>
                  {mockPaiements.map(p => <option key={p.id}>{p.etudiant}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Montant payé (Ar)</label>
                  <input type="number" placeholder="75000" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Numéro de tranche</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-all">
                    <option>1ère tranche</option><option>2ème tranche</option><option>3ème tranche</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Mode de paiement</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-all">
                  <option value="ESPECES">Espèces</option>
                  <option value="VIREMENT">Virement</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="CHEQUE">Chèque</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Référence transaction</label>
                <input placeholder="N° virement, chèque…" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all" />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-800">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-slate-600 transition-all">Annuler</button>
              <button className="flex-1 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-all">Valider</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}