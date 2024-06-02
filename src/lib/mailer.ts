import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface MailerProps {
  to: string;
  subject: string;
  html: string;
}

const mailer = async ({ to, subject, html }: MailerProps) => {
  try {
    await sgMail.send({
      from: 'amr.hedeiwy@gmail.com',
      to,
      subject,
      html
    });

    return true;
  } catch (error) {
    console.error('MAILER ERROR: \n' + error);
    return false;
  }
};

export default mailer;
