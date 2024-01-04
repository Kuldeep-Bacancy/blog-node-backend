import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

const mailjetRequest = mailjet.post("send", { version: "v3.1" });

const sendMail = async (from, to, name, subject, text) => {
  try {
    const response = await mailjetRequest.request({
      Messages: [
        {
          From: {
            Email: from,
            Name: "Blog App",
          },
          To: [
            {
              Email: to,
              Name: name,
            },
          ],
          Subject: subject,
          TextPart: text,
        },
      ],
    });
    return response
  } catch (error) {
    return error
  }
}

export default sendMail