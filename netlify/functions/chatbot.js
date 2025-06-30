const axios = require("axios");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  const { message } = JSON.parse(event.body);

  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No message provided." }),
    };
  }

  try {
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
You are a helpful and friendly assistant for a small hair styling studio in Sweden called Braids and Roots, run by a stylist named Harriet.

Always answer as if you are part of the studio and represent Harriet. Be warm, clear, and professional in your tone.

Here are the important details to use:

- Availability: Open Monday to Saturday. Closed on Sundays.
- Pricing:
  - Simple cornrows (men or women) start at 400 SEK. More complex styles cost more.
  - Jumbo knotless braids: from 1500 SEK
  - Small-medium knotless braids: from 2000 SEK
  - Small knotless braids: from 3000 SEK
- Styles: Cornrows, knotless braids, twists, protective styles, and wig cornrows. Ask for a photo of the desired style to give a better quote.
- Location: Based in Stockholm, Sweden. She does home service at the moment. She does not have a physical salon.
- Preparation: Clients are encouraged to send a photo of the style they want before booking.
- Booking: Clients can book through Instagram, Facebook, TikTok DMs, or email.
- Harriet styles men and children as well. Prices for children starts at 450 sek minimum and depending on the style it can be more.
- Encourage potential clients to reach out with their preferred style and hair type for accurate consultation.

Only give answers based on this information. If something is not listed, gently direct the client to reach out to Harriet via social media or email for specific inquiries.
`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = openaiResponse.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get response from AI." }),
    };
  }
};
