import base64 from "crypto-js/enc-base64.js";
import SHA256 from "crypto-js/sha256.js";
import { Router } from "express";
import jwt from "jsonwebtoken"; // Import du module jsonwebtoken
import uid2 from "uid2";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";

export class UserController {
  async createUser(req, res) {
    const { role, email, password } = req.body;
    const generatedToken = uid2(16);
    const generatedSalt = uid2(12);
    const generatedHash = SHA256(password + generatedSalt).toString(base64);

    try {
    //  const data = await loadFixtures();


      const sequelizeService = await SequelizeService.get();

      if (email && password) {
        const userFoundByEmail = await sequelizeService.userService.findOne(
          email
        );
        
        if (!userFoundByEmail) {
          const user = await sequelizeService.userService.createUser({
            role,
            email,
            token: generatedToken,
            hash: generatedHash,
            salt: generatedSalt,
          });

          res.status(201).json(user);
        } else {
          res.status(409).json({ message: "Utilisateur déjà existant" });
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
  
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Données manquantes" });
    }
  
    try {
      const userFound = await sequelizeService.userService.findOne(
        req?.body?.email
      );

      if (userFound) {
        const generatedHash = SHA256(
          req.body?.password + userFound.salt
        ).toString(base64);
        console.log(userFound);
        
        console.log(generatedHash === userFound.hash);
        
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
      
      console.log('Salt:', userFound.salt); 
  
      const generatedHash = SHA256(req.body.password + userFound.salt).toString(base64);
  
      if (generatedHash !== userFound.hash) {
      
        return res.status(401).json({ message: "email et/ou mot de passe incorrect(s)" });
      }
  
      const token = jwt.sign(
        { id: userFound.id, role: userFound.role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
  
      res.status(200).json({
        _id: userFound.id,
        email: userFound.email,
        token: token,
        role: userFound.role,
      });
    } catch (error) {
      console.error("Erreur dans login:", error);
      console.log('Email:', req.body.email);
      console.log('Mot de passe:', req.body.password);
      console.log('Salt:', userFound.salt);
      console.log('Hash généré:', generatedHash);
      res.status(400).json({ message: "Erreur lors de la connexion, veuillez réessayer" });
    }
  }
  
  
    buildRouter() {
    const router = Router();

    router.post("/login", this.login.bind(this));
    router.post("/create", this.createUser.bind(this));
    return router;
  }
}
