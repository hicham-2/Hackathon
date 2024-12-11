import { Router } from "express";
import { SequelizeService } from "../services/sequelizeService.js";
export class UserController {
  async createUser(req, res) {
    if (
      !req.body ||
      typeof req.body.name !== "string" ||
      typeof req.body.firstname !== "string" ||
      typeof req.body.role !== "string" ||
      typeof req.body.email !== "string" ||
      typeof req.body.password !== "string"
    ) {
      res.status(400).end();
      return;
    }
    const sequelizeService = await SequelizeService.get();

    try {
      const { name, firstname, role, email, password } = req.body;
      const user = await sequelizeService.userService.createUser({
        name,
        firstname,
        role,
        email,
        password,
      });
      res.status(201).json(user);
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

    return router;
  }
}
