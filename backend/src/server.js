import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./services/sequelizeSingleton.js";
import { DataTypes } from "sequelize";
// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/*
app.get("/user/login", async (req, res) => {
  try {
    const userFound = await User.findOne({ username: req?.body?.email });

    if (userFound) {
      const generatedHash = SHA256(
        req.body?.password + userFound.salt
      ).toString(base64);

      if (
        generatedHash === userFound.hash ||
        req.body?.token === userFound.token
      ) {
        res.status(200).json({
          _id: userFound._id,
          email: userFound.email,
          token: userFound.token,
        });
      } else {
        res
          .status(401)
          .json({ message: "email et/ou mot de passe incorrect(s)" });
      }
    } else {
      res
        .status(401)
        .json({ message: "email et/ou mot de passe incorrect(s)" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "error lors de la connexion veuillez réessayer" });
  }
});
*/


app.listen(PORT,  () => {
  console.log(`Server is running on port ${PORT}`);
});
