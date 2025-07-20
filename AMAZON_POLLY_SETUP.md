# Amazon Polly Text-to-Speech Setup Guide

This guide will help you set up Amazon Polly for the Detective Listening Game audio generation.

## Prerequisites

1. **AWS Account**: You need an AWS account with billing enabled
2. **Node.js**: Version 16 or higher
3. **Project Setup**: The LanguageGems project should be running locally

## Step 1: Create AWS Account & IAM User

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Create a new AWS account or sign in to existing one
3. Go to **IAM > Users**
4. Click **Create User**
5. Enter username: `languagegems-polly`
6. Select **Programmatic access**

## Step 2: Set Permissions

1. **Attach Policy**: Select **Attach existing policies directly**
2. Search for and select: **AmazonPollyFullAccess**
3. Click **Next** and **Create User**
4. **Important**: Copy the **Access Key ID** and **Secret Access Key**

## Step 3: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Amazon Polly Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
```

**Note**: Replace `your_access_key_here` and `your_secret_key_here` with your actual credentials.

## Step 4: Test the Setup

Run the test command to verify everything is working:

```bash
npm run test-polly-credentials
```

You should see:
```
🔍 Testing Amazon Polly credentials...
✅ Polly client initialized successfully
🎵 Testing speech synthesis...
✅ Speech synthesis successful!
🎉 Amazon Polly is working correctly!
```

## Step 5: Test Audio Generation

```bash
npm run generate-audio:test
```

You should see:
```
🧪 Testing Amazon Polly service...
Generating audio for "Hola, esto es una prueba." in spanish using voice Lucia...
✅ Audio saved: public/audio/detective-listening/test-audio.mp3
✅ Test completed successfully!
🚀 You can now run the full audio generation.
```

## Step 6: Generate Audio Files

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
| `npm run test-polly-credentials` | Test AWS credentials and Polly access |
| `npm run generate-audio:test` | Test audio generation system |
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
- **Amazon Polly pricing**: $4.00 per 1 million characters
- **Expected cost**: **Less than $0.02** for all audio files
- **AWS Free Tier**: 5 million characters per month for first 12 months

## Voice Configuration

The system uses these high-quality neural voices:

- **Spanish**: `Lucia` (Female, Spain Spanish)
- **French**: `Lea` (Female, Metropolitan French)
- **German**: `Vicki` (Female, Standard German)

Alternative voices available:
- **Spanish**: `Enrique` (Male), `Lupe` (US Spanish)
- **French**: `Mathieu` (Male), `Chantal` (Canadian French)
- **German**: `Daniel` (Male), `Marlene` (Alternative Female)

## Troubleshooting

### Error: "Resolved credential object is not valid"

**Solution**: Check your AWS credentials in `.env.local`:

```bash
# Verify your credentials are set correctly
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
```

### Error: "UnrecognizedClientException"

**Solution**: Invalid Access Key ID
1. Check your `AWS_ACCESS_KEY_ID` in `.env.local`
2. Make sure there are no extra spaces or characters
3. Regenerate credentials in AWS IAM if needed

### Error: "SignatureDoesNotMatchException"

**Solution**: Invalid Secret Access Key
1. Check your `AWS_SECRET_ACCESS_KEY` in `.env.local`
2. Make sure the key is complete and correct
3. Regenerate credentials in AWS IAM if needed

### Error: "AccessDeniedException"

**Solution**: Insufficient permissions
1. Go to **IAM > Users** in AWS Console
2. Find your user and check attached policies
3. Ensure **AmazonPollyFullAccess** is attached

### Error: "Region not supported"

**Solution**: Change your AWS region
1. Update `AWS_REGION` in `.env.local`
2. Use regions like: `us-east-1`, `us-west-2`, `eu-west-1`

## File Organization

Generated audio files are saved to:
```
public/audio/detective-listening/
├── es_animals_perro.mp3      # Spanish: dog
├── es_animals_gato.mp3       # Spanish: cat
├── fr_animals_chien.mp3      # French: dog
├── fr_animals_chat.mp3       # French: cat
├── de_animals_hund.mp3       # German: dog
├── de_animals_katze.mp3      # German: cat
└── ...
```

## Security Notes

1. **Never commit** AWS credentials to version control
2. **Add to .gitignore**:
   ```
   .env.local
   .env
   ```
3. **Use IAM roles** for production deployment
4. **Rotate keys regularly** for security
5. **Use least privilege** - only grant necessary permissions

## Production Deployment

For production, use one of these methods:

### Option 1: Environment Variables
Set the credentials as environment variables in your deployment platform:
```bash
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
```

### Option 2: IAM Roles (Recommended for AWS)
If deploying on AWS (EC2, Lambda, ECS), use IAM roles instead of access keys.

### Option 3: Secret Management
Use your platform's secret management:
- **Vercel**: Environment Variables in dashboard
- **Netlify**: Site settings > Environment variables
- **Heroku**: Config Vars in dashboard

## AWS Free Tier Benefits

- **5 million characters per month** for first 12 months
- **Standard and Neural voices** included
- **All regions** supported
- **No upfront costs**

Your vocabulary (~3,600 characters) will use less than 0.1% of the free tier!

## Next Steps

1. ✅ Complete the AWS setup above
2. ✅ Test with `npm run test-polly-credentials`
3. ✅ Test audio generation with `npm run generate-audio:test`
4. ✅ Generate all audio files with `npm run generate-audio`
5. ✅ Check status with `npm run manage-audio status`
6. ✅ Play the Detective Listening Game!

## Support

If you encounter issues:

1. Check the [Amazon Polly documentation](https://docs.aws.amazon.com/polly/)
2. Verify your setup with the test commands
3. Check the console logs for detailed error messages
4. Ensure your AWS account has billing enabled
5. Try the credential test script: `npm run test-polly-credentials`

## Advantages of Amazon Polly

- ✅ **Excellent voice quality** with neural voices
- ✅ **Very affordable** pricing
- ✅ **Reliable AWS infrastructure**
- ✅ **Great language support**
- ✅ **Easy integration** with existing AWS services
- ✅ **Free tier** covers your entire vocabulary
