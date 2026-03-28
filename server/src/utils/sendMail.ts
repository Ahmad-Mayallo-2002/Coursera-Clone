import { createTransport } from 'nodemailer';
import { generate } from 'randomstring';
import { getVerificationEmailTemplate } from '../mjml/verificationCode';
import { config } from 'dotenv';

config({ quiet: true });

const { NODEMAILER_USER, NODEMAILER_PASS } = process.env;

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS,
  },
});

export const sendMail = async (to: string) => {
  const code = generate({ length: 4, charset: 'numeric' });
  const html = getVerificationEmailTemplate(code);
  transporter.sendMail({
    from: NODEMAILER_USER,
    to,
    subject: "This is your verification code don\'t share it with anyone",
    html,
  });
  return code;
};
