import { NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
export async function POST(request) {
  try {
    const { message, documentId, context } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Use OpenRouter API (free tier)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`, // Free tier
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Collaborative Editor AI'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant for a collaborative document editor. 
                     Return responses in clean, well-formatted text with proper spacing and structure.Use **bold** for emphasis and headings, but avoid excessive markdown.Keep responses conversational yet professional.
                     Current context: ${context || 'general document assistance'}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    return NextResponse.json({
      response: aiResponse || 'I apologize, I could not generate a response.'
    });

  } catch (error) {
    console.error('Chat API error:', error);

    // Fallback responses
    const fallbackResponses = [
      "I'm having trouble connecting right now. Please try again in a moment.",
      "I apologize, but I'm currently unavailable. Please try your question again.",
      "I'm experiencing technical difficulties. Please try again shortly."
    ];

    return NextResponse.json({
      response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    });
  }
}