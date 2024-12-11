import base64 from "crypto-js/enc-base64.js";
import SHA256 from "crypto-js/sha256.js";
import { Router } from "express";
import jwt from "jsonwebtoken"; // Import du module jsonwebtoken
import uid2 from "uid2";
import { SequelizeService } from "../services/sequelizeService.js";

export class UserController {
  async createUser(req, res) {
    const { role, email, password } = req.body;
    const sequelizeService = await SequelizeService.get();
    const generatedToken = uid2(16);
    const generatedSalt = uid2(12);
    const generatedHash = SHA256(password + generatedSalt).toString(base64);

    try {
      if (email && password) {
        const userFoundByEmail =
          await sequelizeService.userService.findOne({
            email: email,
          });

        if (!userFoundByEmail) {
          const user = await sequelizeService.userService.createUser({
            role,
            email,
            token: generatedToken,
            hash: generatedHash,
            salt: generatedSalt,
          });

          res.status(201).json(user);
        }
      } else {
        res.status(400).json({ message: "Données manquantes" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating user" });
    }
  }

  async login(req, res) {
    const sequelizeService = await SequelizeService.get();
    try {
      const userFound = await sequelizeService.userService.findOne({
        email: req?.body?.email, // Correction : "email" au lieu de "username"
      });

      if (userFound) {
        const generatedHash = SHA256(
          req.body?.password + userFound.salt
        ).toString(base64);

        if (
          generatedHash === userFound.hash ||
          req.body?.token === userFound.token
        ) {
          // Génération du token JWT
          const token = jwt.sign(
            {
              name: `${userFound.firstname} ${userFound.lastname}`,
              role: userFound.role, // Inclure le rôle dans le token
              id: userFound.id.toString(),
            },
            process.env.JWT_SECRET, // Clé secrète (à définir dans vos variables d'environnement)
            { expiresIn: "30d" }
          );

          // Réponse avec le token et les détails de l'utilisateur
          res.status(200).json({
            _id: userFound.id,
            email: userFound.email,
            role: userFound.role,
            token: token, // Inclure le token généré
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
        .json({ message: "Erreur lors de la connexion, veuillez réessayer" });
    }
  }

  buildRouter() {
    const router = Router();

    router.post("/login", this.login.bind(this));
    router.post("/create", this.createUser.bind(this));
    return router;
  }
}
