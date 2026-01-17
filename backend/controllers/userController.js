const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.register = async (req, res) => {
    try {
        const { nom, email, motDePasse } = req.body;

        // Vérifier si email existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        // Création utilisateur
        const user = new User({
            nom,
            email,
            motDePasse: hashedPassword,
            role: "user",
            active: true
        });

        await user.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        // Vérifier utilisateur
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect" });
        }

        // Vérifier si compte actif

        // Comparer mot de passe
        const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isMatch) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect" });
        }

        // Générer JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                nom: user.nom,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ================= ADMIN : GET USERS =================
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-motDePasse");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ================= ADMIN : ACTIVER / BLOQUER USER =================
exports.toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { active },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json({
            message: active ? "Utilisateur activé" : "Utilisateur bloqué",
            user
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
