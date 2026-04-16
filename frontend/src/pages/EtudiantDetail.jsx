import { useParams, Link } from 'react-router-dom'

const mockEtudiant = {
  id: 1, matricule: 'ETU-2024-001', nom: 'Rakoto', prenom: 'Jean',
  dateNaissance: '2007-03-15', genre: 'MASCULIN', email: 'jean@gmail.com',
  telephone: '+261 34 00 000 01', adresse: 'Antananarivo, Analamanga',
  classe: 'Terminale A', anneeScolaire: '2024-2025',
  nomParent: 'Rakoto Pierre', telephoneParent: '+261 34 00 000 02',
  paiements: [
    { id: 1, tranche: 1, montantDu: 75000, montantPaye: 75000, echeance: '2024-10-01', statut: 'PAYE', type: 'ESPECES' },
    { id: 2, tranche: 2, montantDu: 75000, montantPaye: 0,     echeance: '2025-01-15', statut: 'EN_RETARD', type: null },
    { id: 3, tranche: 3, montantDu: 70000, montantPaye: 0,     echeance: '2025-04-01', statut: 'NON_PAYE', type: null },
  ]
}

const statutConfig = {
  PAYE:      { label: 'Payé',      class: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  EN_RETARD: { label: 'En retard', class: 'bg-red-500/10 text-red-400 border-red-500/20' },
  NON_PAYE:  { label: 'Non payé',  class: 'bg-slate-700/50 text-slate-400 border-slate-600/30' },
  PARTIEL:   { label: 'Partiel',   class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm text-slate-200">{value || '—'}</span>
    </div>
  )
}

export default function EtudiantDetail() {
  const { id } = useParams()
  const e = mockEtudiant
  const totalDu = e.paiements.reduce((s, p) => s + p.montantDu, 0)
  const totalPaye = e.paiements.reduce((s, p) => s + p.montantPaye, 0)

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/etudiants" className="hover:text-indigo-400 transition-colors">Étudiants</Link>
        <span>/</span>
        <span className="text-slate-300">{e.prenom} {e.nom}</span>
      </div>

      {/* Header étudiant */}
      <div className="flex items-start gap-5 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <span className="text-indigo-400 text-2xl font-bold">{e.prenom.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{e.prenom} {e.nom}</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-slate-500 text-sm font-mono">{e.matricule}</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-400 text-sm">{e.classe}</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-500 text-sm">{e.anneeScolaire}</span>
          </div>
        </div>
        <button className="flex items-center gap-2 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 text-sm px-4 py-2 rounded-lg transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Modifier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Infos personnelles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Informations personnelles</h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Date de naissance" value={e.dateNaissance} />
              <InfoRow label="Genre" value={e.genre === 'MASCULIN' ? 'Masculin' : 'Féminin'} />
              <InfoRow label="Email" value={e.email} />
              <InfoRow label="Téléphone" value={e.telephone} />
              <InfoRow label="Adresse" value={e.adresse} />
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Contact parent / tuteur</h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Nom du parent" value={e.nomParent} />
              <InfoRow label="Téléphone" value={e.telephoneParent} />
            </div>
          </div>

          {/* Paiements */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Historique des paiements</h2>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                + Enregistrer un paiement
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Tranche', 'Dû', 'Payé', 'Échéance', 'Statut', 'Type'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {e.paiements.map(p => {
                  const cfg = statutConfig[p.statut] ?? statutConfig.NON_PAYE
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5 text-slate-300 font-medium">{p.tranche}ère</td>
                      <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{p.montantDu.toLocaleString('fr-MG')} Ar</td>
                      <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{p.montantPaye.toLocaleString('fr-MG')} Ar</td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">{p.echeance}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex text-xs px-2 py-1 rounded-md border ${cfg.class}`}>{cfg.label}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">{p.type ?? '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Résumé financier */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Résumé financier</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total dû</span>
                <span className="text-slate-200 font-mono text-xs">{totalDu.toLocaleString('fr-MG')} Ar</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total payé</span>
                <span className="text-teal-400 font-mono text-xs">{totalPaye.toLocaleString('fr-MG')} Ar</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Restant</span>
                <span className="text-red-400 font-mono text-xs font-bold">{(totalDu - totalPaye).toLocaleString('fr-MG')} Ar</span>
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{ width: `${(totalPaye / totalDu) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-2">{Math.round((totalPaye / totalDu) * 100)}% réglé</p>
          </div>
          <button className="w-full flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 hover:border-indigo-500/40 text-slate-400 hover:text-indigo-400 text-sm py-3 rounded-xl transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Générer un reçu PDF
          </button>
        </div>
      </div>
    </div>
  )
}