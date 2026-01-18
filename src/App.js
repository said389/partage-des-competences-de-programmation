import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Index from './index.jsx';
import Competences from './compétence';
import ChoixTemps from './choixTemps';
import AddCompetence from './publiercompétence';
import Chat from './chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Index />} />
        <Route path="/competences" element={<Competences />} />
        <Route path="/choix-temps" element={<ChoixTemps />} />
        <Route path="/add-competence" element={<AddCompetence />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
