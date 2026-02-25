import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Mock tool for connecting WhatsApp (Step 7.5)
export const setupWhatsAppAutomation = tool(
  async ({ phoneNumber, messageTemplate }) => {
    // In a real app, this would call the Meta WhatsApp API or a service like Twilio
    return `Successfully configured WhatsApp automation for ${phoneNumber} with template: "${messageTemplate}"`;
  },
  {
    name: "setup_whatsapp_automation",
    description: "Configure automated WhatsApp notifications for bookings or inquiries.",
    schema: z.object({
      phoneNumber: z.string().describe("The business phone number"),
      messageTemplate: z.string().describe("The message template to use"),
    }),
  }
);

// Tool to generate email sequence
export const generateEmailSequence = tool(
  async ({ campaignName, steps }) => {
    return `Created email sequence "${campaignName}" with ${steps.length} steps. Ready for deployment to SendGrid/Mailchimp.`;
  },
  {
    name: "generate_email_marketing_sequence",
    description: "Generate a multi-step email marketing sequence for lead nurturing.",
    schema: z.object({
      campaignName: z.string(),
      steps: z.array(z.string()).describe("List of email subjects/content summaries"),
    }),
  }
);

export const marketingTools = [setupWhatsAppAutomation, generateEmailSequence];
