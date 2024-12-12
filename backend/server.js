const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
import { canAccessDashboard } from "./middleware/is-admin.js";
import { authMiddleware } from "./middleware/is-auth.js";



// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get(
  "/admin/dashboard",
  authMiddleware, // Vérifie que le token est valide
  canAccessDashboard, // Vérifie que l'utilisateur est admin
  (req, res) => {
    res.status(200).json({ message: "Bienvenue sur le tableau de bord admin !" });
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});