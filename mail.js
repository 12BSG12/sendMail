import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const { EMAIL_HOST, EMAIL_HOST_PASSWORD, EMAIL_HOST_USER, EMAIL_PORT } = process.env

class Mail {
  #transporter = null

  constructor() {
    this.#transporter = this.#getTransporter()
  }

  #getTransporter() {
    return nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: true,
      auth: {
        user: EMAIL_HOST_USER,
        pass: EMAIL_HOST_PASSWORD
      }      
    })
  }

  async send(name, emailFrom, emailTo, message ) {
    try {
      const info = await this.#transporter.sendMail({
        from: `"ЧФ ПНИПУ | Сообщение с сайта" <${EMAIL_HOST_USER}>`, //от кого
        to: emailTo, //кому
        subject: 'Сообщение с сайта ЧФ ПНИПУ',
        text: message,
        html: `
          <div style="border: 1px solid black; padding: 10px; max-width: 500px;">
            <img src="https://www.pnipu.ru/images/CHF_PNIPU.png" style="width: 600px; margin-left: -12px; margin-bottom: 40px;"/>
            <div style="margin-bottom: 10px;">
              ФИО: <b>${name}</b>
            </div>
            <div style="margin-bottom: 10px;">
              Почта: <b>${emailFrom}</b>
            </div>
            <div style="margin-bottom: 10px;">
              Сообщение: <b>${message}</b>
            </div>
          </div>
        `,
      })
      return info.messageId
    } catch(e) {
      return e
    }
  }
}

export default new Mail()