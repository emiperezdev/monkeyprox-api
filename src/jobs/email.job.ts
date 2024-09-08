import cron from "node-cron";
import { EmailService } from "../services/EmailService";
import { generateCaseEmailTemplate } from "../templates/email.template";
import { CasesModel } from "../data/models/cases.model";
import { CaseDataSource } from "../domain/datasources/CaseDataSource";

export const emailJob = () => {
  const emailService = new EmailService();
  const caseDataSource = new CaseDataSource();

  cron.schedule("*/10 * * * * *", async () => {
    console.log("Every 10 seconds...");
    
    const cases = await CasesModel.find({ isEmailSent: false });
    if (!cases.length)
      return console.log("There are no cases to send.");

    console.log(`>>> PROCESSING ${cases.length} cases...`);

    await Promise.all(
      cases.map(async (c) => {
        const htmlBody = generateCaseEmailTemplate(
          c.age,
          c.genre,
          c.lat,
          c.lng
        );
        await emailService.sendEmail({
          to: "emiperez.dev@gmail.com",
          subject: `Case: {case._id}`,
          htmlBody: htmlBody,
        });
        const id = c._id;
        console.log(`Email sent to the case with id: ${id}`);
        await caseDataSource.updateCase(id.toString(), {
          ...c,
          isEmailSent: true,
        });
        console.log(`Case updated with id: ${id}`);
      })
    );
  });
};