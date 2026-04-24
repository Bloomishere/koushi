// Netlify serverless function to handle Anthropic API calls securely
// Place this file in: netlify/functions/api.js

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Parse request body
  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  const { action, data } = requestBody;

  try {
    let response;

    if (action === 'generateQuestion') {
      response = await generateQuestion(data.grade, data.type);
    } else if (action === 'evaluateAnswer') {
      response = await evaluateAnswer(data);
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid action' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

async function generateQuestion(grade, type) {
  const prompt = type === 'reading' 
    ? getReadingPrompt(grade)
    : getPicturePrompt(grade);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  });

  const data = await response.json();
  return JSON.parse(data.content[0].text);
}

async function evaluateAnswer(data) {
  const { type, grade, question, transcript, duration } = data;
  
  const prompt = type === 'reading'
    ? getReadingEvaluationPrompt(grade, question, transcript, duration)
    : getPictureEvaluationPrompt(grade, question, transcript, duration);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  });

  const result = await response.json();
  return JSON.parse(result.content[0].text);
}

function getReadingPrompt(grade) {
  return `Generate a Chinese reading passage for ${grade} students based on Singapore MOE curriculum standards. The passage should be age-appropriate and test pronunciation, intonation, and fluency.

Return ONLY a JSON object (no markdown, no backticks) with this structure:
{
    "passage": "The Chinese text passage here (150-300 characters depending on grade level)"
}

For ${grade}:
- P3: 100-150 characters, simple vocabulary
- P4: 150-200 characters, moderate vocabulary
- P5: 200-250 characters, varied sentence structures
- P6: 250-300 characters, complex vocabulary and idioms

Make the passage engaging and educational.`;
}

function getPicturePrompt(grade) {
  return `Generate a picture description scenario for ${grade} Chinese oral exam based on Singapore MOE curriculum.

Return ONLY a JSON object (no markdown, no backticks) with this structure:
{
    "imageUrl": "https://source.unsplash.com/800x600/?singapore,school,children,family,park,classroom,playground,library",
    "hints": "Chinese hints about what to describe (e.g., 人物、地点、活动、感受)"
}

The imageUrl should be from Unsplash with relevant keywords for a school-appropriate scene that ${grade} students can describe in Chinese.`;
}

function getReadingEvaluationPrompt(grade, question, transcript, duration) {
  return `Evaluate this Chinese oral reading performance based on Singapore MOE PSLE standards for ${grade}.

Original passage:
${question.passage}

Student's transcribed speech:
${transcript || '(No speech detected - please evaluate based on typical performance)'}

Recording duration: ${duration} seconds

Provide evaluation in JSON format (no markdown, no backticks):
{
    "overallScore": 85,
    "pronunciation": {
        "score": 80,
        "feedback": "Detailed Chinese feedback on pronunciation accuracy"
    },
    "intonation": {
        "score": 85,
        "feedback": "Detailed Chinese feedback on intonation and expression"
    },
    "fluency": {
        "score": 90,
        "feedback": "Detailed Chinese feedback on reading fluency"
    },
    "accuracy": {
        "score": 85,
        "feedback": "Detailed Chinese feedback on text accuracy"
    },
    "overallFeedback": "Overall Chinese feedback and encouragement",
    "areasForImprovement": "Specific areas to work on in Chinese"
}

Base scoring on MOE rubrics. Be constructive and encouraging.`;
}

function getPictureEvaluationPrompt(grade, question, transcript, duration) {
  return `Evaluate this Chinese picture description performance based on Singapore MOE PSLE standards for ${grade}.

Picture description task with hints: ${question.hints}

Student's transcribed speech:
${transcript || '(No speech detected - please evaluate based on typical performance)'}

Speaking duration: ${duration} seconds

Provide evaluation in JSON format (no markdown, no backticks):
{
    "overallScore": 85,
    "content": {
        "score": 80,
        "feedback": "Detailed Chinese feedback on content quality and completeness"
    },
    "vocabulary": {
        "score": 85,
        "feedback": "Detailed Chinese feedback on vocabulary usage"
    },
    "pronunciation": {
        "score": 88,
        "feedback": "Detailed Chinese feedback on pronunciation"
    },
    "expression": {
        "score": 82,
        "feedback": "Detailed Chinese feedback on language expression and sentence structures"
    },
    "overallFeedback": "Overall Chinese feedback and encouragement",
    "areasForImprovement": "Specific areas to work on in Chinese"
}

Base scoring on MOE rubrics. Be constructive and encouraging.`;
}
