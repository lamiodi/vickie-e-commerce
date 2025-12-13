import sgMail from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { env } from '../config/env.js';
sgMail.setApiKey(env.sendgridKey || '');
const resolveTemplate = (name) =>
  fs.readFileSync(
    path.join(process.cwd(), 'backend', 'emails', 'templates', `${name}.hbs`),
    'utf8'
  );
const compile = (name, data) => Handlebars.compile(resolveTemplate(name))(data);
export const sendEmail = async ({ to, subject, template, data }) => {
  const html = compile(template, data);
  const msg = { to, from: env.emailFrom, subject, html };
  if (!env.sendgridKey) return { skipped: true };
  const resp = await sgMail.send(msg);
  return resp;
};
