import mjml2html from 'mjml';
import { readFileSync } from 'fs';
import { join } from 'path';

const emailTemplate = readFileSync(join(__dirname, './verificationCode.mjml'), {
  encoding: 'utf-8',
});

export const getVerificationEmailTemplate = (code: string) => {
  let template = emailTemplate.replace('{{ code }}', code);
  let result = mjml2html(template);
  return result.html;
};
