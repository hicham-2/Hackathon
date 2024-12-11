import { Router } from "express";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";
import uid2 from "uid2";
import SHA256 from "crypto-js/sha256.js";
import base64 from "crypto-js/enc-base64.js";

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
        res.status(400).json({ message: "Données manquante" });
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
        username: req?.body?.email,
      });

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
  }

  buildRouter() {
    const router = Router();

    router.post("/login", this.login.bind(this));
    router.post("/create", this.createUser.bind(this));
    return router;
  }
}
