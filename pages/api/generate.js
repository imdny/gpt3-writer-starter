import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `
Explain what a good crossfit workout should be like, using the scoring below. Don't just list the points. Go deep into each one. Explain why.
Scoring:
`;

const generateAction = async (req, res) => {
  // Run first prompt

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.scoringInput}`,
    temperature: 0.7,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  // Build promt #2
  const secondPrompt = `
  Take the workout explanation below and generate a WOD written in the style of Dave Castro. Use the type of scoring and modality below. Include what weights to use. Include both RX and scaled alternatives.

  Scoring: ${req.body.scoringInput}
  Modality: ${req.body.modalityInput}

  Workout explanation: ${basePromptOutput.text}

  WOD:
  `;

  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.8,
    // I also increase max_tokens.
    max_tokens: 700,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;
