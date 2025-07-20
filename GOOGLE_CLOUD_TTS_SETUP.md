# Google Cloud Text-to-Speech Setup Guide

This guide will help you set up Google Cloud TTS for the Detective Listening Game audio generation.

## Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account with billing enabled
2. **Node.js**: Version 16 or higher
3. **Project Setup**: The LanguageGems project should be running locally

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID (you'll need this later)

## Step 2: Enable Text-to-Speech API

1. In the Google Cloud Console, go to **APIs & Services > Library**
2. Search for "Cloud Text-to-Speech API"
3. Click on it and press **Enable**

## Step 3: Create Service Account

1. Go to **IAM & Admin > Service Accounts**
2. Click **Create Service Account**
3. Fill in the details:
   - **Name**: `languagegems-tts`
   - **Description**: `Service account for LanguageGems TTS audio generation`
4. Click **Create and Continue**
5. Add the role: **Cloud Text-to-Speech Client**
6. Click **Continue** and then **Done**

## Step 4: Generate Service Account Key

1. Find your newly created service account in the list
2. Click on it to open details
3. Go to the **Keys** tab
4. Click **Add Key > Create New Key**
5. Choose **JSON** format
6. Click **Create** - this will download a JSON file

## Step 5: Configure Environment

1. **Move the JSON file** to a secure location in your project:
   ```bash
   mkdir -p credentials
   mv ~/Downloads/languagegems-tts-*.json credentials/google-tts-key.json
   ```

2. **Set environment variable** in your `.env.local` file:
   ```bash
   # Add this to your .env.local file
   GOOGLE_APPLICATION_CREDENTIALS=./credentials/google-tts-key.json
   ```

3. **Alternative**: Set the environment variable in your shell:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="./credentials/google-tts-key.json"
   ```

## Step 6: Test the Setup

Run the test command to verify everything is working:

```bash
npm run generate-audio:test
```

You should see:
```
🧪 Testing Google Cloud TTS service...
Generating audio for "Hello, this is a test." in spanish...
✅ Audio saved: public/audio/detective-listening/test-audio.mp3
✅ Test completed successfully!
🚀 You can now run the full audio generation.
```

## Step 7: Generate Audio Files

### Option 1: Generate All Audio Files
```bash
npm run generate-audio
```

### Option 2: Generate for Specific Language
```bash
npm run generate-audio -- --language spanish
```

### Option 3: Generate for Specific Case
```bash
npm run generate-audio -- --case animals
```

### Option 4: Dry Run (See What Would Be Generated)
```bash
npm run generate-audio:dry-run
```

## Audio Generation Commands

| Command | Description |
|---------|-------------|
| `npm run generate-audio:test` | Test Google Cloud TTS setup |
| `npm run generate-audio:dry-run` | Show what would be generated |
| `npm run generate-audio` | Generate all missing audio files |
| `npm run generate-audio -- --language spanish` | Generate only Spanish audio |
| `npm run generate-audio -- --case animals` | Generate only Animals case audio |
| `npm run generate-audio -- --force` | Regenerate existing files |
| `npm run manage-audio status` | Show audio files status |
| `npm run manage-audio cleanup` | Remove invalid audio files |

## Expected Costs

- **Total vocabulary**: ~450 words
- **Average characters per word**: ~8 characters
- **Total characters**: ~3,600 characters
- **Google Cloud TTS pricing**: $4.00 per 1 million characters
- **Expected cost**: **Less than $0.02** for all audio files

## Troubleshooting

### Error: "Could not load the default credentials"

**Solution**: Make sure the `GOOGLE_APPLICATION_CREDENTIALS` environment variable is set correctly:

```bash
# Check if the file exists
ls -la ./credentials/google-tts-key.json

# Verify environment variable
echo $GOOGLE_APPLICATION_CREDENTIALS
```

### Error: "Permission denied"

**Solution**: Ensure your service account has the correct permissions:
1. Go to **IAM & Admin > IAM** in Google Cloud Console
2. Find your service account
3. Make sure it has the **Cloud Text-to-Speech Client** role

### Error: "API not enabled"

**Solution**: Enable the Text-to-Speech API:
1. Go to **APIs & Services > Library**
2. Search for "Cloud Text-to-Speech API"
3. Click **Enable**

### Error: "Billing account required"

**Solution**: Enable billing for your Google Cloud project:
1. Go to **Billing** in Google Cloud Console
2. Link a billing account to your project

## Voice Configuration

The system uses these voices by default:

- **Spanish**: `es-ES-Standard-A` (Female)
- **French**: `fr-FR-Standard-A` (Female)
- **German**: `de-DE-Standard-A` (Female)

You can customize voices by editing `src/services/googleTTS.ts`.

## File Organization

Generated audio files are saved to:
```
public/audio/detective-listening/
├── es_animals_perro.mp3
├── es_animals_gato.mp3
├── fr_animals_chien.mp3
├── fr_animals_chat.mp3
├── de_animals_hund.mp3
├── de_animals_katze.mp3
└── ...
```

## Security Notes

1. **Never commit** the service account JSON file to version control
2. **Add to .gitignore**:
   ```
   credentials/
   *.json
   ```
3. **Use environment variables** for production deployment
4. **Rotate keys regularly** for security

## Production Deployment

For production, use one of these methods:

### Option 1: Environment Variable
Set the entire JSON content as an environment variable:
```bash
GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account",...}'
```

### Option 2: Google Cloud Run/App Engine
If deploying on Google Cloud, use the default service account or Workload Identity.

### Option 3: Secret Management
Use your platform's secret management (Vercel, Netlify, etc.) to store the credentials securely.

## Next Steps

1. ✅ Complete the setup above
2. ✅ Test with `npm run generate-audio:test`
3. ✅ Generate audio files with `npm run generate-audio`
4. ✅ Check status with `npm run manage-audio status`
5. ✅ Play the Detective Listening Game!

## Support

If you encounter issues:

1. Check the [Google Cloud TTS documentation](https://cloud.google.com/text-to-speech/docs)
2. Verify your setup with the test command
3. Check the console logs for detailed error messages
4. Ensure billing is enabled on your Google Cloud project
