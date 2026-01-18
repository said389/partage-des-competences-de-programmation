import { useNavigate } from "react-router-dom";
import "./choixTemps.css";

export default function ChoixTemps() {
  const navigate = useNavigate();

  const handleChoice = (duration) => {
    // Stocker le choix de durée dans localStorage pour l'utiliser dans le formulaire
    localStorage.setItem("publicationDuration", duration);
    navigate("/add-competence");
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

      <div className="time-choice-container">
        <div className="time-choice-header">
          <h1>Combien de temps avez-vous pour publier ?</h1>
          <p className="subtitle">
            Choisissez selon votre disponibilité. Vous pourrez toujours compléter plus tard !
          </p>
        </div>

        <div className="time-options">
          <div className="time-card">
            <div className="time-icon">⚡</div>
            <h3>Moins de 5 minutes</h3>
            <p>Publication ultra-rapide avec les informations essentielles</p>
            <button 
              className="choose-btn quick"
              onClick={() => handleChoice("quick")}
            >
              Choisir
            </button>
          </div>

          <div className="time-card featured">
            <div className="popular-badge">Populaire</div>
            <div className="time-icon">🎯</div>
            <h3>10-20 minutes</h3>
            <p>Ajoutez quelques détails et exemples pour plus de clarté</p>
            <button 
              className="choose-btn medium"
              onClick={() => handleChoice("medium")}
            >
              Choisir
            </button>
          </div>

          <div className="time-card">
            <div className="time-icon">📝</div>
            <h3>Plus de 20 minutes</h3>
            <p>Publication complète avec description détaillée et exemples</p>
            <button 
              className="choose-btn detailed"
              onClick={() => handleChoice("detailed")}
            >
              Choisir
            </button>
          </div>
        </div>

        <div className="tip-box">
          <div className="tip-icon">💡</div>
          <p>
            <strong>Astuce :</strong> Même si vous choisissez "moins de 5 minutes", 
            votre compétence sera visible immédiatement. Vous pouvez la compléter 
            à tout moment depuis votre profil.
          </p>
        </div>
      </div>
    </>
  );
}
