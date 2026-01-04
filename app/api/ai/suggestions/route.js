import { NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY_temp;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Simple in-memory rate limiting (for development)
let lastRequestTime = 0;
const MIN_TIME_BETWEEN_REQUESTS = 2000; // 2 seconds between requests

export async function POST(request) {
  try {
    const { text, cursorPosition, documentId, context } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Rate limiting check
    const now = Date.now();
    if (now - lastRequestTime < MIN_TIME_BETWEEN_REQUESTS) {
      console.log('Rate limited: Too many requests');
      await new Promise(resolve => setTimeout(resolve, MIN_TIME_BETWEEN_REQUESTS));
    }
    lastRequestTime = now;

    // If no API key, use mock response
    if (!OPENROUTER_API_KEY) {
      console.log('Using mock suggestions (no API key)');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockSuggestions = [
        `${text} more effectively`,
        `Consider rephrasing: "${text}" to be more concise`,
        `Alternative: ${text.replace(/\b\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1))}`
      ];
      
      return NextResponse.json({ 
        suggestions: mockSuggestions.slice(0, 3),
        context: text
      });
    }

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXTAUTH_URL,
          'X-Title': 'Collaborative Editor'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: "system",
              content: `You are a helpful writing assistant. Provide 3 concise suggestions to improve the following text. 
              Return ONLY a JSON object with: {"suggestions": ["suggestion1", "suggestion2", "suggestion3"]}`
            },
            {
              role: "user", 
              content: `Provide writing suggestions for: "${text}"`
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      // Handle rate limit errors specifically
      if (response.status === 429) {
        console.log('OpenRouter rate limit hit - using mock response');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockSuggestions = [
          `Consider: ${text} in a different context`,
          `Alternative phrasing: ${text}`,
          `More concise: ${text.split(' ').slice(0, 5).join(' ')}...`
        ];
        
        return NextResponse.json({ 
          suggestions: mockSuggestions,
          context: text
        });
      }

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;
      
      // Try to parse the response as JSON
      try {
        console.log('aiResponse');
        console.log(aiResponse);
        
        const result = JSON.parse(aiResponse);
        return NextResponse.json({ 
          suggestions: Array.isArray(result.suggestions) ? result.suggestions.slice(0, 3) : [],
          context: result.context || text
        });
      } catch (parseError) {
        console.log('Failed to parse AI response as JSON, using fallback parsing');
        // If not JSON, it might be an error message from OpenRouter
        if (aiResponse.includes('rate limit') || aiResponse.includes('429')) {
          console.log('OpenRouter rate limit detected in response');
          // Return mock responses instead
          const mockSuggestions = [
            `Consider: ${text} in a different context`,
            `Alternative phrasing: ${text}`,
            `More concise: ${text.split(' ').slice(0, 5).join(' ')}...`
          ];
          
          return NextResponse.json({ 
            suggestions: mockSuggestions,
            context: text
          });
        }
        
        // Try to extract suggestions from non-JSON response
        const suggestions = aiResponse.split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
          .slice(0, 3);
        
        return NextResponse.json({ 
          suggestions,
          context: text 
        });
      }

    } catch (apiError) {
      console.error('OpenRouter API failed:', apiError.message);
      
      // Fall back to mock response if API fails
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockSuggestions = [
        `Consider: ${text} in a different context`,
        `Alternative phrasing: ${text}`,
        `More concise: ${text.split(' ').slice(0, 5).join(' ')}...`
      ];
      
      return NextResponse.json({ 
        suggestions: mockSuggestions,
        context: text
      });
    }

  } catch (error) {
    console.error('Unexpected error in suggestions API:', error);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({ 
      suggestions: ['Try rephrasing for clarity', 'Consider adding more details'],
      context: '' 
    });
  }
}