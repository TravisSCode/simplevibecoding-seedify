import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Демо-режим по умолчанию (без API ключа)
const DEMO_MODE = !process.env.OPENAI_API_KEY;

const openai = DEMO_MODE ? null : new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    // Демо-режим: возвращаем случайные описания
    if (DEMO_MODE) {
      const demoDescriptions = [
        "✨ This mystical cat wears a hat woven from starlight, guardian of the cosmic library where stories are born from nebulas.",
        "🛡️ A warrior-penguin standing vigilant at the gates of the Arctic Kingdom, his armor forged from eternal ice and ancient magic.",
        "🌌 The traveler's tree grows bridges between dimensions, its leaves whispering secrets of parallel worlds to those who listen.",
        "⚡ In the digital realm, data-dragons weave lightning into tapestries of pure information, singing binary lullabies to sleeping servers.",
        "🔮 The crystal fox of forgotten dreams, keeper of memories that shimmer like dewdrops on a spider's web at dawn.",
        "🚀 A cosmic surfer riding waves of gravitational ripples, mapping the curvature of spacetime with every move.",
        "🎭 The theater mask that changes expressions with the viewer's emotions, revealing hidden truths about the observer.",
        "🌊 An ocean of liquid light where thoughts take shape as glowing fish that swim through the currents of consciousness.",
        "🏰 A castle built from stacked moments in time, each brick a memory, each tower a future possibility.",
        "🎵 The symphony of silence, where rests between notes create melodies more beautiful than any sound."
      ];
      
      await new Promise(resolve => setTimeout(resolve, 800)); // Имитация задержки
      
      return NextResponse.json({ 
        description: demoDescriptions[Math.floor(Math.random() * demoDescriptions.length)],
        demo: true 
      });
    }

    // Реальный режим с OpenAI API
    if (!openai) {
      throw new Error('OpenAI not configured');
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Create a magical, poetic description for this image. 2-3 sentences. Be creative, imaginative, and whimsical. Focus on fantasy, technology, or nature themes." 
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 150,
    });

    return NextResponse.json({ 
      description: response.choices[0]?.message?.content || "A magical creation waiting to be discovered...",
      demo: false
    });
  } catch (error) {
    console.error('Error generating description:', error);
    
    // Fallback на демо-режим при ошибке
    const fallbackDescriptions = [
      "🎨 The AI is currently dreaming... Your image inspired a story that's still being written in the stars.",
      "✨ Magic in progress! The creative spirits are weaving a tale for your image.",
      "🔮 The future of this story is being decided by digital fates. Try again in a moment!"
    ];
    
    return NextResponse.json({ 
      description: fallbackDescriptions[Math.floor(Math.random() * fallbackDescriptions.length)],
      demo: true,
      error: "Using fallback description"
    });
  }
}
