import { Injectable } from '@nestjs/common';
import * as mailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { ConfigService } from '../../common/modules/config/config.service';

@Injectable()
export class MailService {
  transporter: Mail;
  constructor(private readonly configService: ConfigService) {
    this.transporter = mailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.MAIL_ADDRESS,
        pass: this.configService.MAIL_PASS,
      },
    });
  }
  async sendMail(mailTo: string, code: string): Promise<any> {
    const mailOptions = {
      from: this.configService.MAIL_ADDRESS,
      to: mailTo,
      subject: 'Your Coffee-Now! order',
      text: `Your order ${code} has been accepted and is now being prepared. \nThank you for ordering!`,
    };
    return await this.transporter.sendMail(mailOptions);
  }
}
