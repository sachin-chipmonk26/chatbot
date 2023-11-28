import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

console.log(process.env.OPENAI_API_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

let requestCounter = 0;
const maxRequestsPerMinute = 60; // Adjust according to your OpenAI plan

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from Codex",
  });
});

app.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    res.status(200).send({
      bot: response.data.choices[0].message.content,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});

app.listen(5000, () => console.log("listening on port http://localhost:5000"));