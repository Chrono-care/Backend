import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { readFileSync } from 'fs';
import { sign } from 'jsonwebtoken';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class MailsService {
  constructor() {}
  transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 25,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  async sendValidationEmail(newAccount): Promise<void> {
    try {
      const template = readFileSync(
        'src/mails/views/validateEmail.html',
      ).toString();

      const payload = {
        userId: newAccount.id,
      };

      const options = {
        expiresIn: '1h',
      };

      const validationJWT = sign(payload, process.env.JWT_SECRET, options);
      await this.transporter.sendMail({
        from: '"Chrono-Care" <chrono.care.fr@gmail.com>',
        to: newAccount.email,
        subject: 'Validate your email',
        text: `Afin de Valider votre inscription, merci de cliquez sur (ce lien)[http://localhost:3000/email-validation/${validationJWT}]`,
        html: template.replace('{jwt_token}', validationJWT),
      });
    } catch (err) {
      throw new NotFoundException(err);
    }
  }
}
