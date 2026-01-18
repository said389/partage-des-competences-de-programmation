import { useEffect, useState } from "react";
import "./addCompetence.css";

export default function AddCompetence() {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [technologie, setTechnologie] = useState("");
  const [niveau, setNiveau] = useState("débutant");
  const [exemples, setExemples] = useState("");
  const [objectifs, setObjectifs] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [duration, setDuration] = useState("medium");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Récupérer la durée choisie
    const savedDuration = localStorage.getItem("publicationDuration");
    if (savedDuration) {
      setDuration(savedDuration);
    }
    
    // Authentification désactivée pour les tests
    // if (!token || role !== "user") {
    //   alert("Vous devez être connecté en tant qu'utilisateur.");
    //   window.location.href = "/login";
    // }
  }, []);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    try {
      const publicationData = { 
        titre, 
        description, 
        technologie, 
        niveau
      };

      // Ajouter les champs optionnels selon la durée
      if (duration !== "quick") {
        publicationData.exemples = exemples;
      }
      if (duration === "detailed") {
        publicationData.objectifs = objectifs;
      }

      const response = await fetch("http://localhost:5000/api/publications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(publicationData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Compétence ajoutée avec succès !");
        setTitre("");
        setDescription("");
        setTechnologie("");
        setNiveau("débutant");
        setExemples("");
        setObjectifs("");
      } else {
        setError(data.message || "Erreur lors de l'ajout");
      }
    } catch (err) {
      setError("Erreur serveur");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Navbar */}
      <nav>
        <div className="logo"><h2>PlateformeCompétences</h2></div>
        <div className="menu">
          <a href="/">Accueil</a>
          <a href="/competences">Compétences</a>
          <a href="/choix-temps">Publier Compétences</a>
          <a href="/chat">Chat</a>
          <a href="#" onClick={logout}>Logout</a>
        </div>
      </nav>

      <div className="container">
        <div className="form-header">
          <h2>Ajouter une Compétence</h2>
          <span className="duration-badge">
            {duration === "quick" && "⚡ Mode Rapide"}
            {duration === "medium" && "🎯 Mode Standard"}
            {duration === "detailed" && "📝 Mode Détaillé"}
          </span>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <input
          type="text"
          placeholder="Titre de la compétence"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <input
          type="text"
          placeholder="Technologie"
          value={technologie}
          onChange={(e) => setTechnologie(e.target.value)}
          required
        />

        <select value={niveau} onChange={(e) => setNiveau(e.target.value)}>
          <option value="débutant">Débutant</option>
          <option value="intermédiaire">Intermédiaire</option>
          <option value="avancé">Avancé</option>
        </select>

        {/* Champs supplémentaires pour mode medium et detailed */}
        {(duration === "medium" || duration === "detailed") && (
          <textarea
            placeholder="Exemples d'utilisation (optionnel)"
            rows="3"
            value={exemples}
            onChange={(e) => setExemples(e.target.value)}
          ></textarea>
        )}

        {duration === "detailed" && (
          <textarea
            placeholder="Objectifs d'apprentissage (optionnel)"
            rows="3"
            value={objectifs}
            onChange={(e) => setObjectifs(e.target.value)}
          ></textarea>
        )}

        <button onClick={handleSubmit}>Ajouter Compétence</button>
        
        <button 
          onClick={() => window.location.href = "/choix-temps"} 
          className="btn-secondary"
          style={{ marginTop: "1rem" }}
        >
          ← Changer de mode
        </button>
      </div>
    </>
  );
}
