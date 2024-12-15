import base64 from "crypto-js/enc-base64.js";
import SHA256 from "crypto-js/sha256.js";
import { Router } from "express";
import uid2 from "uid2";
import { authMiddleware } from "../middleware/is-auth.js";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";

export class UserController {
  
  async createUser(req, res) {
    const { firstName, lastName, email, role, password } = req.body;
    console.log(req.body);
  
    // Vérification des champs requis
    if (!email || !firstName || !lastName || !role ) {
      return res.status(400).json({ message: "Données manquantes" });
    }
  
    const generatedToken = uid2(16);
    const generatedSalt = uid2(12);
    const generatedHash = SHA256(password + generatedSalt).toString(base64);
  
    try {
      const sequelizeService = await SequelizeService.get();
  
      const userFoundByEmail = await sequelizeService.userService.findOneBy({ email });
  
      if (userFoundByEmail) {
        return res.status(409).json({ message: "Utilisateur déjà existant" });
      }
  
      const user = await sequelizeService.userService.createUser({
        firstName,
        lastName,
        email,
        role,
        token: generatedToken,
        hash: generatedHash,
        salt: generatedSalt,
      });
  
      // Retourner la réponse avec l'utilisateur créé
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
    }
  }
  


  async login(req, res) {
    const sequelizeService = await SequelizeService.get();

    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    try {
      const userFound = await sequelizeService.userService.findOneBy({
        email: req?.body?.email,
      });

      if (userFound) {
        const generatedHash = SHA256(
          req.body?.password + userFound.salt
        ).toString(base64);

        if (generatedHash === userFound.hash) {
          res.status(200).json({
            _id: userFound._id,
            email: userFound.email,
            token: userFound.token,
            role: userFound.role,
          });
        } else {
          res
            .status(401)
            .json({ message: "email et/ou mot de passe incorrect(s)!" });
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

  async getAllProfessors(req, res) {
    try {
      const sequelizeService = await SequelizeService.get();
      const professors = await sequelizeService.userService.findAll({
        where: { role: "professor" },  
      });
  
      if (professors.length > 0) {
        res.status(200).json(professors);
      } else {
        res.status(404).json({ message: "Aucun professeur trouvé" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la récupération des professeurs" });
    }
  }

  async getProfessors(req, res) {
    const sequelizeService = await SequelizeService.get();

    try {
      const professors = await sequelizeService.userService.findUsersByRole("professor");
      res.status(200).json(professors);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la récupération des professeurs" });
    }
  }

  async deleteProfessor(req, res) {
    const { id } = req.params;

    if (!id) {
      console.log("Aucun ID fourni dans la requête.");
      return res.status(400).json({ message: "L'identifiant de l'utilisateur est requis." });
    }

    const sequelizeService = await SequelizeService.get();

    try {
      console.log(`Recherche de l'utilisateur avec l'ID : ${id}`);
      const userFound = await sequelizeService.userService.findUserById(id);


      if (!userFound) {
        console.log("Utilisateur introuvable.");
        return res.status(404).json({ message: "L'utilisateur n'existe pas." });
      }

      console.log(`Utilisateur trouvé : ${JSON.stringify(userFound)}`);

      if (userFound.role === "professor") {
        const result = await sequelizeService.userService.deleteUser(id);

        if (result === 1) {
          console.log("Utilisateur supprimé avec succès.");
          res.status(200).json({ message: "L'utilisateur a été supprimé." });
        } else {
          console.log("Erreur inconnue lors de la suppression.");
          res.status(500).json({ message: "Erreur inconnue lors de la suppression." });
        }
      }
    }
    catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  }


async getProfessorById(req, res) {
  const { id } = req.params;

  if (!id) {
    console.log("Aucun ID fourni dans la requête.");
    return res.status(400).json({ message: "L'identifiant de l'utilisateur est requis." });
  }

  const sequelizeService = await SequelizeService.get();

  try {
    console.log(`Recherche de l'utilisateur avec l'ID : ${id}`);
    const userFound = await sequelizeService.userService.findUserById(id);

    if (!userFound) {
      console.log("Utilisateur introuvable.");
      return res.status(404).json({ message: "L'utilisateur n'existe pas." });
    }

    console.log(`Utilisateur trouvé : ${JSON.stringify(userFound)}`);
    res.status(200).json(userFound);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

async checkRole(req, res) {
  return res.status(200).json({ role: req.user.role });
}


  buildRouter() {
    const router = Router();
    

    router.post("/login", this.login.bind(this));
    router.post("/create", this.createUser.bind(this));
    router.get("/professors", this.getAllProfessors.bind(this));
    router.delete("/professors/:id", this.deleteProfessor.bind(this));
    router.get("/professors/:id", this.getProfessorById.bind(this));
    router.get("/checkRole", authMiddleware, this.checkRole.bind(this));
    router.get("/professors", this.getProfessors.bind(this));
    return router;
  }
}
