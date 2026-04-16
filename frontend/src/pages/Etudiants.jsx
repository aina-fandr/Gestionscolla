import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import etudiantService from '../services/etudiantService'
// Correct
import classeService from '../services/classeService';

const statutConfig = {
  PAYE:      { label: 'Payé',      class: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  EN_RETARD: { label: 'En retard', class: 'bg-red-500/10 text-red-400 border-red-500/20' },
  NON_PAYE:  { label: 'Non payé',  class: 'bg-slate-700/50 text-slate-400 border-slate-600/30' },
  PARTIEL:   { label: 'Partiel',   class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
}

function StatutBadge({ statut }) {
  const cfg = statutConfig[statut] ?? statutConfig.NON_PAYE
  return <span className={`inline-flex text-xs px-2 py-1 rounded-md border font-medium ${cfg.class}`}>{cfg.label}</span>
}

export default function Etudiants() {
  const [etudiants, setEtudiants] = useState([])
  const [classes, setClasses] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('TOUS')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', sexe: '', classeId: '' })

  useEffect(() => {
    fetchEtudiants()
    classeService.getAll().then(r => setClasses(r.data)).catch(console.error)
  }, [])

  const fetchEtudiants = async () => {
    try {
      setLoading(true)
      const res = await etudiantService.getAll()
      setEtudiants(res.data)
    } catch (err) {
      console.error('Erreur chargement étudiants', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.nom || !form.prenom) return
    setSaving(true)
    try {
      await etudiantService.create(form)
      await fetchEtudiants()
      setShowModal(false)
      setForm({ nom: '', prenom: '', email: '', telephone: '', sexe: '', classeId: '' })
    } catch (err) {
      console.error('Erreur création', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet étudiant ?')) return
    try {
      await etudiantService.delete(id)
      setEtudiants(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      console.error('Erreur suppression', err)
    }
  }

  const filtered = etudiants.filter(e => {
    const q = search.toLowerCase()
    const matchSearch = e.nom?.toLowerCase().includes(q) || e.prenom?.toLowerCase().includes(q) || e.matricule?.toLowerCase().includes(q)
    const statutEtudiant = e.paiements?.some(p => p.statut === filterStatut)
    const matchStatut = filterStatut === 'TOUS' || statutEtudiant
    return matchSearch && matchStatut
  })

  return (
      <div className="p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Étudiants</h1>
            <p className="text-slate-500 text-sm mt-1">{etudiants.length} étudiants inscrits</p>
          </div>
          <button onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-500/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvel étudiant
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
                   placeholder="Rechercher par nom, prénom, matricule…"
                   className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all" />
          </div>
          <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-all">
            <option value="TOUS">Tous les statuts</option>
            <option value="PAYE">Payé</option>
            <option value="EN_RETARD">En retard</option>
            <option value="NON_PAYE">Non payé</option>
            <option value="PARTIEL">Partiel</option>
          </select>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              </div>
          ) : (
              <table className="w-full text-sm">
                <thead>
                <tr className="border-b border-slate-800">
                  {['Matricule', 'Nom complet', 'Classe', 'Email', 'Statut', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-600 text-sm">Aucun étudiant trouvé</td></tr>
                ) : filtered.map(e => (
                    <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{e.matricule ?? '—'}</td>
                      <td className="px-5 py-3.5">
                        <Link to={`/etudiants/${e.id}`} className="text-slate-200 hover:text-indigo-400 font-medium transition-colors">
                          {e.prenom} {e.nom}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">{e.classe?.nom ?? '—'}</td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">{e.email ?? '—'}</td>
                      <td className="px-5 py-3.5">
                        {e.paiements?.length > 0
                            ? <StatutBadge statut={e.paiements[e.paiements.length - 1].statut} />
                            : <span className="text-slate-600 text-xs">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link to={`/etudiants/${e.id}`} className="text-slate-500 hover:text-indigo-400 transition-colors p-1 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <button onClick={() => handleDelete(e.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}
        </div>

        {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                  <h2 className="text-base font-semibold text-white">Nouvel étudiant</h2>
                  <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  {[['Nom *', 'nom'], ['Prénom *', 'prenom'], ['Email', 'email'], ['Téléphone', 'telephone']].map(([label, field]) => (
                      <div key={field}>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
                        <input value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                               placeholder={label.replace(' *', '')}
                               className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all" />
                      </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Sexe</label>
                    <select value={form.sexe} onChange={e => setForm(f => ({ ...f, sexe: e.target.value }))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-all">
                      <option value="">—</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Classe</label>
                    <select value={form.classeId} onChange={e => setForm(f => ({ ...f, classeId: e.target.value }))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-all">
                      <option value="">Sélectionner</option>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 px-6 py-4 border-t border-slate-800">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-400 text-sm hover:border-slate-600 transition-all">Annuler</button>
                  <button onClick={handleSubmit} disabled={saving}
                          className="flex-1 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white text-sm font-medium transition-all">
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}