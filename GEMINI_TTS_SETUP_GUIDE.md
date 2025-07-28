# Google Gemini 2.5 Pro Preview TTS Setup Guide

This guide will help you set up Google Gemini 2.5 Pro Preview TTS for your Language Gems exam and listening assessments.

## 🚀 Quick Start

### 1. Get Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. Click "Get API key" in the left sidebar
4. Create a new API key for your project
5. Copy the API key

### 2. Configure Environment Variables

Add your Google AI API key to your `.env.local` file:

```bash
# Google Gemini API Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

### 3. Verify Setup

Run the verification script to ensure everything is configured correctly:

```bash
npm run verify-gemini-setup
```

## 🎯 Features

### Available Models

- **Gemini 2.5 Flash Preview TTS** (Recommended for development)
  - More generous rate limits
  - Good quality audio generation
  - Faster processing

- **Gemini 2.5 Pro Preview TTS** (Best quality)
  - Highest quality audio
  - More restrictive rate limits
  - Best for production

### Voice Options

30 high-quality voices available:
- **Zephyr** (Bright)
- **Puck** (Upbeat) 
- **Charon** (Informative)
- **Kore** (Firm)
- **Fenrir** (Excitable)
- **Leda** (Youthful)
- And 24 more...

### Supported Languages

24 languages supported including:
- Spanish (es-ES)
- French (fr-FR) 
- German (de-DE)
- English (en-US)
- Italian (it-IT)
- Portuguese (pt-BR)
- And 18 more...

## 🔧 Usage

### Single Speaker Audio

```javascript
const response = await fetch('/api/admin/generate-gemini-audio', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Hello, this is a test of the exam audio system.',
    language: 'english',
    type: 'single',
    voiceName: 'Puck',
    options: {
      tone: 'neutral',
      pace: 'normal'
    }
  })
});
```

### Multi-Speaker Audio

```javascript
const response = await fetch('/api/admin/generate-gemini-audio', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: `Teacher: Good morning, class.
           Student: Good morning, teacher.`,
    language: 'english',
    type: 'multi',
    speakers: [
      { name: 'Teacher', voiceName: 'Kore' },
      { name: 'Student', voiceName: 'Puck' }
    ]
  })
});
```

### Exam-Specific Audio

```javascript
const response = await fetch('/api/admin/generate-gemini-audio', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Listen carefully to the following conversation.',
    language: 'spanish',
    questionId: 'exam_q1',
    type: 'exam',
    options: {
      includeInstructions: true,
      speakingSpeed: 'normal',
      tone: 'formal'
    }
  })
});
```

## 📊 Rate Limits & Pricing

### Free Tier Limits
- **Flash Model**: More generous limits for development
- **Pro Model**: More restrictive limits
- Daily and per-minute request limits apply
- Token-based pricing for paid tiers

### Best Practices
1. Use Flash model during development
2. Cache generated audio files
3. Implement retry logic with exponential backoff
4. Monitor usage to avoid hitting limits

## 🎓 Integration with Exams

### AQA Listening Assessment

The system integrates seamlessly with your existing AQA Listening Assessment component:

```typescript
const question: AQAListeningQuestion = {
  id: 'q1',
  type: 'multiple-choice',
  title: 'Restaurant Conversation',
  instructions: 'Listen and choose the correct answer.',
  audioText: 'Waiter: Good evening, what would you like to order?',
  ttsConfig: {
    voiceName: 'Kore',
    style: 'like a friendly waiter'
  },
  data: {
    question: 'What does the waiter ask?',
    options: ['About drinks', 'About food', 'About payment'],
    correctAnswer: 'About food'
  }
};
```

### Voice Recommendations by Question Type

- **Multiple Choice**: Puck, Kore, Charon
- **Dictation**: Aoede, Iapetus, Schedar (clear voices)
- **Open Response**: Rasalgethi, Laomedeia, Achernar
- **Conversations**: Kore + Puck (contrasting voices)

## 🔍 Testing

### Test the API Endpoint

```bash
# Test basic functionality
curl -X GET http://localhost:3001/api/admin/generate-gemini-audio

# Test audio generation
curl -X POST http://localhost:3001/api/admin/generate-gemini-audio \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a test",
    "language": "english",
    "type": "single",
    "voiceName": "Puck"
  }'
```

### Run Full Test Suite

```bash
npm run test-gemini-tts
```

## 🚨 Troubleshooting

### Common Issues

1. **Rate Limit Exceeded (429 Error)**
   - Wait before retrying (check retry delay in error)
   - Switch to Flash model for development
   - Consider upgrading to paid tier

2. **Authentication Failed (401/403)**
   - Check your API key is correct
   - Ensure API key has proper permissions
   - Verify environment variables are loaded

3. **Audio Not Playing**
   - Check Supabase storage permissions
   - Verify audio URL is accessible
   - Check browser audio policies

### Error Handling

The service includes comprehensive error handling:
- Rate limit detection and user-friendly messages
- Authentication error guidance
- Automatic retry suggestions
- Fallback to alternative models

## 📈 Production Considerations

1. **Upgrade to Paid Tier**
   - Higher rate limits
   - Better performance
   - Production SLA

2. **Audio Caching**
   - Store generated audio in Supabase
   - Implement cache invalidation
   - Use CDN for global distribution

3. **Monitoring**
   - Track API usage
   - Monitor error rates
   - Set up alerts for quota limits

## 🎉 Next Steps

1. ✅ Complete setup verification
2. 🧪 Test with sample exam questions
3. 🎨 Customize voices for different question types
4. 📝 Create your exam content with TTS
5. 🚀 Deploy to production with paid tier

## 📚 Resources

- [Google AI Studio](https://aistudio.google.com)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Rate Limits Guide](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Voice Samples](https://aistudio.google.com/generate-speech)

---

**Note**: This setup uses Google Gemini 2.5 TTS models which are currently in Preview. Features and pricing may change as the service evolves.
