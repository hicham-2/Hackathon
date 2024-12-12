import { EmailService } from './services/EmailService.js';

const emailService = new EmailService();

emailService
  .sendEmail(
    'jacksamdu12@outlook.fr', // Adresse e-mail du destinataire
    'Test : Salut depuis Nodemailer !', // Sujet
    'Bonjour ! C\'est un test d\'e-mail simple.', // Texte brut
    '<h1>Bonjour !</h1><p>Ceci est un test d\'e-mail avec <b>Nodemailer</b>.</p>' // Contenu HTML
  )
  .then((info) => console.log('E-mail envoyé avec succès :', info))
  .catch((err) => console.error('Erreur :', err));