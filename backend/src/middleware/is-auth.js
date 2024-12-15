import { SequelizeService } from "../services/sequelize/sequelizeService.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Accès non autorisé : token manquant" });
  }

  const cleanedToken = token.replace(/['"]+/g, '');

  try {
    const sequelizeService = await SequelizeService.get();

    const userFound = await sequelizeService.userService.findOneById({
      token: cleanedToken,
    });

    if (!userFound) {
      return res
        .status(404)
        .json({ message: "Utilisateur non trouvé avec ce token" });
    }

    req.user = userFound;

    next();
  } catch (error) {
    console.error("Erreur lors de la vérification du token :", error);
    return res.status(403).json({ message: "Token invalide ou expiré" });
  }
};
