import { useState, useEffect } from 'react';
import classeService from '../services/classeService';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentClasse, setCurrentClasse] = useState(null);

  const [form, setForm] = useState({
    nom: '',
    niveau: '',
    anneeScolaire: '',
  });

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await classeService.getAll();
      console.log("✅ Données reçues du backend :", response.data);   // Debug important

      setClasses(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("❌ Erreur chargement classes:", err);
      setError(err.response?.data?.message || "Impossible de charger les classes");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentClasse) {
        await classeService.update(currentClasse.id, form);
      } else {
        await classeService.create(form);
      }
      alert("Classe enregistrée avec succès !");
      setShowModal(false);
      setCurrentClasse(null);
      setForm({ nom: '', niveau: '', anneeScolaire: '' });
      fetchClasses();                    // Rafraîchit la liste
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (classe) => {
    setCurrentClasse(classe);
    setForm({
      nom: classe.nom || '',
      niveau: classe.niveau || '',
      anneeScolaire: classe.anneeScolaire || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette classe ?")) return;
    try {
      await classeService.delete(id);
      fetchClasses();
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) return <div className="p-10 text-white text-center">Chargement des classes...</div>;
  if (error) return <div className="p-10 text-red-400 text-center">{error}</div>;

  return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Gestion des Classes</h1>
            <p className="text-slate-400 mt-1">{classes.length} classes enregistrées</p>
          </div>
          <button
              onClick={() => {
                setCurrentClasse(null);
                setForm({ nom: '', niveau: '', anneeScolaire: '' });
                setShowModal(true);
              }}
              className="bg-violet-600 hover:bg-violet-500 px-6 py-3 rounded-2xl text-white font-medium flex items-center gap-2"
          >
            + Nouvelle classe
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-950">
            <tr>
              <th className="text-left px-8 py-5 text-xs font-semibold text-slate-400">NOM DE LA CLASSE</th>
              <th className="text-left px-8 py-5 text-xs font-semibold text-slate-400">NIVEAU</th>
              <th className="text-left px-8 py-5 text-xs font-semibold text-slate-400">ANNÉE SCOLAIRE</th>
              <th className="text-center px-8 py-5 text-xs font-semibold text-slate-400">ACTIONS</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
            {classes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-slate-500">
                    Aucune classe trouvée
                  </td>
                </tr>
            ) : (
                classes.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/70">
                      <td className="px-8 py-5 font-medium text-white">{c.nom}</td>
                      <td className="px-8 py-5 text-slate-300">{c.niveau}</td>
                      <td className="px-8 py-5 text-slate-400">{c.anneeScolaire}</td>
                      <td className="px-8 py-5 text-center space-x-4">
                        <button onClick={() => handleEdit(c)} className="text-amber-400 hover:text-amber-300">✏️</button>
                        <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300">🗑️</button>
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {currentClasse ? "Modifier la classe" : "Nouvelle classe"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-slate-400 mb-2">Nom de la classe</label>
                    <input
                        type="text"
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-2">Niveau</label>
                    <input
                        type="text"
                        value={form.niveau}
                        onChange={(e) => setForm({ ...form, niveau: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white"
                        required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-2">Année scolaire</label>
                    <input
                        type="text"
                        value={form.anneeScolaire}
                        onChange={(e) => setForm({ ...form, anneeScolaire: e.target.value })}
                        placeholder="2024-2025"
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-white"
                        required
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 py-4 border border-slate-700 rounded-2xl text-slate-400 hover:bg-slate-800"
                    >
                      Annuler
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-4 bg-violet-600 hover:bg-violet-500 rounded-2xl text-white font-medium"
                    >
                      {currentClasse ? "Modifier" : "Enregistrer"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
}