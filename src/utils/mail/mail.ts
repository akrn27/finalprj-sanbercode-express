import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { EMAIL_PASSWORD, EMAIL_USER } from "../env";

const transporter = nodemailer.createTransport({
  service: "Zoho",
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
  requireTLS: true,
});

const send = async ({
  to,
  subject,
  content,
}: {
  to: string | string[];
  subject: string;
  content: string;
}) => {
    const result = await transporter.sendMail({
        from: "akurnia755@zohomail.com",
        to,
        subject,
        html: content
    })

    console.log("Send Email to ", to)

    return result;
};

const render = async (template: string, data: any) => {
    const content = await ejs.renderFile(
        path.join(__dirname, `templates/${template}`),
        data
    )

    return content as string;
}

export default {
    send,
    render
}