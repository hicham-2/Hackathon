export const canAccessDashboard = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Passe au contrôleur si l'utilisateur est admin
  } else {
    return res
      .status(403)
      .json({ message: "Accès refusé : privilèges insuffisants" });
  }
};
