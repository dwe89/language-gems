const OpenAI = require('openai');
const fs = require('fs');

// Function to load environment variables from .env.local
function loadEnvLocal() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          envVars[key] = valueParts.join('=').replace(/^["']|["']$/g, '');
        }
      }
    });

    return envVars;
  } catch (error) {
    console.log('⚠️  Could not read .env.local file');
    return {};
  }
}

async function testOpenAI() {
  console.log('🔍 Testing OpenAI connection...');

  // Load environment variables from .env.local
  const envVars = loadEnvLocal();

  // Try to get API key from environment or .env.local
  const apiKey = process.env.OPENAI_API_KEY ||
                 process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
                 envVars.OPENAI_API_KEY ||
                 envVars.NEXT_PUBLIC_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No OpenAI API key found in environment variables');
    console.log('💡 Please set your OpenAI API key:');
    console.log('   export OPENAI_API_KEY="your-api-key-here"');
    console.log('   or');
    console.log('   export NEXT_PUBLIC_OPENAI_API_KEY="your-api-key-here"');
    return;
  }
  
  try {
    const openai = new OpenAI({ apiKey });
    
    console.log('✅ OpenAI client initialized');
    console.log('🧪 Testing with a simple request...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano-2025-08-07",
      messages: [
        { role: "user", content: "Generate one simple Spanish adjective agreement exercise. Return only: 'La casa _____ (blanco) → blanca'" }
      ],
      max_completion_tokens: 50
    });
    
    console.log('🎉 OpenAI test successful!');
    console.log('📝 Response:', response.choices[0].message.content);
    console.log('💰 Tokens used:', response.usage.total_tokens);
    
  } catch (error) {
    console.error('❌ OpenAI test failed:', error.message);
    if (error.code === 'invalid_api_key') {
      console.log('💡 Please check your API key is correct and has sufficient credits');
    }
  }
}

testOpenAI();
