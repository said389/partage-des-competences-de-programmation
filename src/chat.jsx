import { useEffect, useRef, useState } from "react";
import "./chat.css";

const API_BASE = "http://localhost:5000/api/messages";

export default function Chat() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const intervalRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token || !userId) {
      alert("Vous devez être connecté.");
      window.location.href = "/login";
      return;
    }
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadMessages();
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(loadMessages, 3000);
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadUsers() {
    try {
      const res = await fetch(`${API_BASE}/conversations/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log("Erreur loadUsers", err);
    }
  }

  async function loadMessages() {
    if (!selectedUser) return;
    try {
      const res = await fetch(`${API_BASE}/with/${selectedUser.email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.log("Erreur loadMessages", err);
    }
  }

  async function sendMessage() {
    if (!selectedUser || !messageContent.trim()) return;
    try {
      await fetch(`${API_BASE}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverEmail: selectedUser.email,
          content: messageContent
        })
      });
      setMessageContent("");
      loadMessages();
    } catch (err) {
      console.log("Erreur send", err);
    }
  }

  async function searchUser() {
    if (!searchEmail) return alert("Veuillez entrer un email.");
    try {
      const res = await fetch(`${API_BASE}/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: searchEmail })
      });

      if (res.status === 404) return alert("Utilisateur non trouvé.");

      const data = await res.json();
      const user = { email: searchEmail, nom: data.nom, _id: data.userId };

      setUsers(prev =>
        prev.some(u => u.email === user.email) ? prev : [user, ...prev]
      );
      setSelectedUser(user);
      setSearchEmail("");
    } catch (err) {
      console.log("Erreur searchUser", err);
    }
  }

  function logout() {
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <>
      {/* Navbar */}
      <nav>
        <div className="logo"><h2>💬 Chat</h2></div>
        <div className="menu">
          <a href="/">Accueil</a>
          <a href="/competences">Compétences</a>
          <a href="/choix-temps">Publier Compétences</a>
          <a href="/chat">Chat</a>
          <a href="#" onClick={logout}>Logout</a>
        </div>
      </nav>

      <div className="chat-app">
        {/* Sidebar */}
        <div className="sidebar">
          <h3>Conversations</h3>
          <input
            type="email"
            placeholder="Entrer email du destinataire"
            value={searchEmail}
            onChange={e => setSearchEmail(e.target.value)}
          />
          <button onClick={searchUser}>Chercher</button>

          <div id="usersList">
            {users.map(user => (
              <div
                key={user.email}
                className={
                  "user " +
                  (selectedUser?.email === user.email ? "active" : "")
                }
                onClick={() => setSelectedUser(user)}
              >
                {user.nom} ({user.email})
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          <h3>
            {selectedUser
              ? `Chat avec : ${selectedUser.nom}`
              : "Sélectionnez un utilisateur"}
          </h3>

          <div className="messages" id="messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  "message " +
                  (m.sender._id === userId ? "self" : "other")
                }
              >
                {m.sender.nom} : {m.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <textarea
            placeholder="Écrire un message..."
            value={messageContent}
            onChange={e => setMessageContent(e.target.value)}
          />
          <button onClick={sendMessage}>Envoyer</button>
        </div>
      </div>
    </>
  );
}
