export const validateLoginData = (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe sont requis" });
    }
  
    // Vérification supplémentaire sur le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email invalide" });
    }
  
    next(); // Passe au prochain middleware ou au contrôleur
  };
  