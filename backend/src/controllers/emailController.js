import { EmailService } from '../services/emailService.js';

export class EmailController {
  constructor() {
    this.emailService = new EmailService();
  }

  // Méthode pour envoyer un e-mail
  async sendEmail(req, res) {
    const { to, subject, text, html } = req.body; 

    try {
      const emailResponse = await this.emailService.sendEmail({ to, subject, text, html });
      res.status(200).send({ message: "E-mail envoyé avec succès", info: emailResponse });
    } catch (error) {
      res.status(500).send({ message: "Erreur lors de l'envoi de l'e-mail", error: error.message });
    }
  }
}
