import { NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Define instructions for different operations
const operationInstructions = {
  improve: 'Improve this text for clarity, professionalism, and impact. Return only the improved text:',
  shorten: 'Make this text more concise and to the point. Return only the shortened text:',
  expand: 'Expand this text with more details and examples. Return only the expanded text:',
  simplify: 'Simplify this text for better understanding. Return only the simplified text:',
  formal: 'Make this text more formal and professional. Return only the formal text:',
  casual: 'Make this text more casual and conversational. Return only the casual text:'
};

// Mock responses for fallback
const mockResponses = {
  improve: (text) => `[Improved] ${text} - enhanced for clarity and impact`,
  shorten: (text) => `[Concise] ${text.split(' ').slice(0, 8).join(' ')}...`,
  expand: (text) => `[Expanded] ${text}. Additional context and details provided.`,
  simplify: (text) => `[Simplified] Easy-to-understand version: ${text}`,
  formal: (text) => `[Formal] We respectfully submit that ${text} constitutes an optimal approach.`,
  casual: (text) => `[Casual] Hey! So about ${text} - here's the deal...`
};

export async function POST(request) {
  try {
    const { message, operation  } = await request.json();
    console.log('AI Request received:', { message, operation });
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // If no API key, use mock response
    if (!OPENROUTER_API_KEY) {
      console.log('Using mock response (no API key)');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ 
        response: mockResponses[operation](message) 
      });
    }

    const instruction = operationInstructions[operation] || operationInstructions.improve;

    // Try OpenRouter API
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Collaborative Editor'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free', // Using your working model
          messages: [
            {
              role: "system",
              content: "You are a helpful writing assistant. Provide only the revised text without any additional commentary or explanation. Return ONLY the improved text, nothing else."
            },
            {
              role: "user", 
              content: `${instruction} "${message}"`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      console.log('OpenRouter response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('OpenRouter full response:', data);
      
      // Extract the AI response from the nested structure
      const aiResponse = data.choices?.[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response generated from AI');
      }

      return NextResponse.json({ 
        response: aiResponse 
      });

    } catch (apiError) {
      console.error('OpenRouter API failed, using mock:', apiError);
      // Fall back to mock response if API fails
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ 
        response: mockResponses[operation](message) 
      });
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    // Final fallback to mock response
    const { message, operation = 'improve' } = await request.json().catch(() => ({ message: 'No message' }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json({ 
      response: mockResponses[operation](message) 
    });
  }
}