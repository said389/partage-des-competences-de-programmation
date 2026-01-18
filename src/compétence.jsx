import { useEffect, useState } from "react";
import "./competences.css";

export default function Competences() {
  const [competences, setCompetences] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tech, setTech] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Veuillez vous connecter.");
      window.location.href = "/login";
      return;
    }

    fetchCompetences();
  }, []);

  useEffect(() => {
    if (tech === "") {
      setFiltered(competences);
    } else {
      setFiltered(competences.filter(c => c.technologie === tech));
    }
  }, [tech, competences]);

  const fetchCompetences = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/publications", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setCompetences(data);
      setFiltered(data);
    } catch (err) {
      alert("Erreur lors du chargement des compétences.");
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
        <div className="logo">Plateforme Compétences</div>
        <div className="menu">
          <a href="/">Accueil</a>
          <a href="/competences">Compétences</a>
          <a href="/choix-temps">Publier Compétences</a>
          <a href="/chat">Chat</a>
          <button id="logoutBtn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <h2>Compétences Publiées</h2>

      {/* Filter */}
      <div style={{ marginBottom: "15px" }}>
        <label>Filtrer par technologie :</label>
        <select value={tech} onChange={(e) => setTech(e.target.value)}>
          <option value="">Toutes</option>
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="React">React</option>
          <option value="Python">Python</option>
          <option value="TypeScript">TypeScript</option>
          <option value="Node.js">Node.js</option>
          <option value="Docker">Docker</option>
          <option value="GraphQL">GraphQL</option>
        </select>
      </div>

      <div className="competences-container">
        {filtered.length === 0 ? (
          <p>Aucune compétence trouvée.</p>
        ) : (
          filtered.map(pub => (
            <div className="competence-card" key={pub._id}>
              <h3>{pub.titre}</h3>
              <p><strong>Description:</strong> {pub.description}</p>
              <p><strong>Technologie:</strong> {pub.technologie}</p>
              <p><strong>Niveau:</strong> {pub.niveau}</p>
              <p><strong>Utilisateur:</strong> {pub.user?.nom}</p>
              <p><strong>Email:</strong> {pub.user?.email}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
