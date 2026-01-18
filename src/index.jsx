import { useEffect, useState } from "react";
import "./index.css";

export default function Index() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || localStorage.getItem("userName");
    setUsername(storedUsername);
  }, []);

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
          {username && <button onClick={logout}>Logout</button>}
        </div>
        {username && <div className="welcome">Bonjour {username} !</div>}
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1>Bienvenue, {username || "Invité"}</h1>
            <h1>Partagez vos <span className="text-gradient">compétences</span> en programmation</h1>
            <p className="hero-subtitle">
              Rejoignez une communauté de développeurs passionnés.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-hero">Commencer maintenant</button>
              <a className="btn btn-hero-outline" href="/competences">Voir Compétences</a>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Skills */}
      <section className="section">
        <h2>Compétences populaires</h2>
        <div className="skills-grid">
          {["React", "Python", "TypeScript", "Node.js", "Docker"].map(skill => (
            <div className="skill-card" key={skill}>
              <h3>{skill}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 DevSkills. Tous droits réservés.</p>
      </footer>
    </>
  );
}
