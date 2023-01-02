import axios from 'axios';



function getHeaders() {
  return {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': 'LumiLearn',
  };
}

export async function askAI(messages) {
  try {
    const response = await axios.post(API_URL, {
      model: 'mistralai/mistral-7b-instruct:free',
      messages,
      temperature: 0.7,
      max_tokens: 800,
    }, { headers: getHeaders() });

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from AI');
    return content;
  } catch (error) {
    const detail = error.response?.data?.error?.message || error.message;
    console.error('OpenRouter error:', detail, error.response?.data);
    return `Sorry, I had trouble responding. (${detail || 'Network error'}) — Please try again.`;
  }
}

export async function generateLesson(topic) {
  return askAI([
    {
      role: 'system',
      content: 'You are an expert tutor. Explain topics clearly with examples, bullet points, and analogies. Use markdown formatting.',
    },
    {
      role: 'user',
      content: `Teach me about "${topic}" in a clear, engaging way. Include key concepts, examples, and 2-3 quick tips. Keep it under 400 words.`,
    },
  ]);
}

export async function generateQuiz(topic, numQuestions = 5) {
  const prompt = `Generate ${numQuestions} multiple choice questions about "${topic}".
Return ONLY a valid JSON array — no markdown, no explanation, no code fences:
[{"question":"...","options":["A","B","C","D"],"correct":0}]
The "correct" field must be the index (0-3) of the right answer.`;

  const response = await askAI([
    {
      role: 'system',
      content: 'You are a quiz generator. Output ONLY a valid raw JSON array. No markdown fences. No explanation before or after.',
    },
    { role: 'user', content: prompt },
  ]);

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return fallbackQuiz(topic);
  } catch {
    return fallbackQuiz(topic);
  }
}

export async function explainWrongAnswer(question, userAnswer, correctAnswer) {
  return askAI([
    {
      role: 'system',
      content: 'You are a helpful tutor. Explain quiz answers briefly and clearly. 2-3 sentences max.',
    },
    {
      role: 'user',
      content: `Question: "${question}"\nStudent answered: "${userAnswer}"\nCorrect answer: "${correctAnswer}"\nExplain why the correct answer is right.`,
    },
  ]);
}

export async function generateFlashcardsFromTopic(topic) {
  const prompt = `Generate 5 flashcards for studying "${topic}".
Return ONLY a valid JSON array — no markdown, no explanation:
[{"front":"question or term","back":"answer or definition"}]`;

  const response = await askAI([
    {
      role: 'system',
      content: 'You are a flashcard generator. Output ONLY a valid raw JSON array. No markdown. No extra text.',
    },
    { role: 'user', content: prompt },
  ]);

  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return [];
  } catch {
    return [];
  }
}

function fallbackQuiz(topic) {
  return [
    {
      question: `What is the main concept behind "${topic}"?`,
      options: ['A fundamental principle', 'An advanced technique', 'A historical event', 'A mathematical formula'],
      correct: 0,
    },
  ];
}
