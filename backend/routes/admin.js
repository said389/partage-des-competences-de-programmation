const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const publicationController = require("../controllers/publicationController");
const userController = require("../controllers/userController");

// --- Publications ---
router.get("/competences", auth, admin, publicationController.getPending);          // Pending
router.get("/competences/accepted", auth, admin, publicationController.listApproved); // Accepted
router.get("/competences/:id", auth, admin, publicationController.getOne);          // Single
router.put("/competences/:id/accepter", auth, admin, publicationController.accept);
router.put("/competences/:id/refuser", auth, admin, publicationController.refuse);
router.delete("/competences/:id", auth, admin, publicationController.deleteCompetence);

// --- Users ---
router.get("/users", auth, admin, userController.getUsers);
router.put("/users/:id", auth, admin, userController.toggleUserStatus);

module.exports = router;