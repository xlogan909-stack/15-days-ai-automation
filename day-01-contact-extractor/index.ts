import { z } from "zod";
import * as dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const contactSchema = z.object({
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  intent: z.enum(["sales", "support", "other"]),
});

async function extractContact(message: string) {
  const response = await client.chat.completions.create({
    model: process.env.AI_MODEL!,
    messages: [
      {
        role: "user",
        content: `Extract contact information from this message and return ONLY a JSON object.
No explanation, no markdown, just raw JSON.

Message: "${message}"

Return this exact format:
{
  "name": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "intent": "sales" or "support" or "other"
}`,
      },
    ],
  });

  const text = response.choices[0].message.content ?? "";
  const cleaned = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  return contactSchema.parse(parsed);
}

const messages = [
  "Hi main Sara hoon, mujhe support chahiye. sara@gmail.com",
  "9988776655 pe call karo, billing issue hai",
  "Khareedna hai tumhara product - amit@company.com",
  "Koi details nahi deni, bas price batao",
  "Ravi here, ravi@test.com, 8877665544, interested in purchase",
];


Promise.all(messages.map(extractContact))
  .then(results => results.forEach(r => console.log(r)))
  .catch(console.error);

