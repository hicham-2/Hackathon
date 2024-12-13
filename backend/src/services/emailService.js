import nodemailer from "nodemailer";

export class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", 
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER, // Adresse e-mail (depuis un fichier .env)
        pass: process.env.EMAIL_PASS, // Mot de passe (ou App Password pour Gmail)
      },
    });
  }

  /**
   * Envoie un e-mail
   * @param {string} to Adresse e-mail du destinataire
   * @param {string} subject Sujet de l'e-mail
   * @param {string} text Contenu textuel
   * @param {string} html Contenu HTML (optionnel)
   */
  async sendEmail({ to, subject, text, html }) {
    try {
      const mailOptions = {
        from: `"jackitombappek@gmail.com" <${process.env.EMAIL_USER}>`, // Expéditeur
        to: "jacksamdu12@outlook.fr",
        subject: "emplois du temps cours",
        text: "bonjour voila vous avez été assigné au cours suivant ",
        html: "<p>Ceci est un <strong>test</strong> d'envoi d'e-mail avec Nodemailer.</p>",
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email envoyé : ${info.messageId}`);
      return info;
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email : ", error);
      throw error;
    }
  }
}
