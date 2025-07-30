# Dictation Audio File Structure Guide

## Overview
This guide explains the exact requirements for generating and storing dictation audio files in the Language Gems system.

## Audio File Naming Convention

### Dictation Audio Files
The system generates **TWO audio files** for each dictation question:

1. **Normal Speed Audio**: `dictation_{language}_q{questionNumber}_{questionId}_normal.wav`
2. **Very Slow Speed Audio**: `dictation_{language}_q{questionNumber}_{questionId}_very_slow.wav`

### Example File Names
For Spanish question 1 with assessment ID `abc123_q1`:
- Normal: `dictation_es_q1_abc123_q1_normal.wav`
- Very Slow: `dictation_es_q1_abc123_q1_very_slow.wav`

For French question 3 with assessment ID `def456_q3`:
- Normal: `dictation_fr_q3_def456_q3_normal.wav`
- Very Slow: `dictation_fr_q3_def456_q3_very_slow.wav`

## Supabase Storage Structure

### Bucket Information
- **Bucket Name**: `audio`
- **Folder Structure**: Files are stored directly in the root of the `audio` bucket
- **Access**: Public read access for all audio files

### File Path in Bucket
```
audio/
├── dictation_es_q1_abc123_q1_normal.wav
├── dictation_es_q1_abc123_q1_very_slow.wav
├── dictation_fr_q2_def456_q2_normal.wav
├── dictation_fr_q2_def456_q2_very_slow.wav
└── ... (other audio files)
```

## Audio Generation Requirements

### Speed Settings
1. **Normal Speed**: 0.6x rate (slow but comprehensible)
2. **Very Slow Speed**: 0.4x rate (word-by-word dictation pace)

### Voice Configuration
- **Spanish**: Voice "Puck" 
- **French**: Voice "Puck"
- **German**: Voice "Puck"
- **Tone**: Neutral
- **Style**: Natural and clear

### Audio Format
- **Format**: WAV
- **Quality**: High quality for clear pronunciation
- **Encoding**: Standard WAV encoding compatible with web browsers

## Database Storage

### Table: `aqa_dictation_questions`
Each dictation question stores:
```sql
audio_url_normal TEXT,     -- URL to normal speed audio
audio_url_very_slow TEXT,  -- URL to very slow speed audio
```

### Example URLs
```
https://your-supabase-project.supabase.co/storage/v1/object/public/audio/dictation_es_q1_abc123_q1_normal.wav
https://your-supabase-project.supabase.co/storage/v1/object/public/audio/dictation_es_q1_abc123_q1_very_slow.wav
```

## Manual Audio Generation Process

If you need to generate audio files manually, follow these steps:

### 1. File Naming
Use the exact naming convention:
```
dictation_{language}_q{questionNumber}_{assessmentId}_q{questionNumber}_{speed}.wav
```

### 2. Audio Requirements
- **Text**: The exact sentence from the database
- **Language**: Target language (es/fr/de)
- **Speed**: 
  - Normal: 0.6x rate
  - Very Slow: 0.4x rate
- **Voice**: Use appropriate voice for language
- **Format**: WAV file

### 3. Upload to Supabase Storage
```javascript
// Upload to the 'audio' bucket
const { data, error } = await supabase.storage
  .from('audio')
  .upload(filename, audioFile, {
    contentType: 'audio/wav',
    upsert: true
  });
```

### 4. Update Database
```javascript
// Update the question record with audio URLs
const { error } = await supabase
  .from('aqa_dictation_questions')
  .update({
    audio_url_normal: normalAudioUrl,
    audio_url_very_slow: verySlowAudioUrl
  })
  .eq('id', questionId);
```

## Automated Generation

### Using the Script
The `generate-dictation-papers.ts` script automatically:
1. Creates new paper assessments (paper-2, paper-3, etc.)
2. Generates dual-speed audio for each sentence
3. Uploads files to Supabase Storage
4. Updates database with audio URLs

### Running the Script
```bash
cd scripts
npx tsx generate-dictation-papers.ts
```

## Audio Playback Logic

### Frontend Implementation
The dictation interface plays audio in this sequence:
1. **First Play**: Normal speed audio
2. **Section Play**: Very slow speed audio (word-by-word)
3. **Final Play**: Normal speed audio again

### Audio Controls
- Students can replay any speed at any time
- Audio controls are clearly labeled
- Progress indicators show which speed is playing

## Quality Assurance

### Audio Quality Checklist
- [ ] Clear pronunciation
- [ ] Appropriate speed (0.6x for normal, 0.4x for very slow)
- [ ] No background noise
- [ ] Consistent volume levels
- [ ] Proper file format (WAV)
- [ ] Correct file naming
- [ ] Successful upload to storage
- [ ] Database URLs updated correctly

### Testing
1. **File Access**: Verify URLs are publicly accessible
2. **Audio Quality**: Test playback in different browsers
3. **Speed Verification**: Confirm speed differences are noticeable
4. **Database Integrity**: Ensure all questions have both audio files

## Troubleshooting

### Common Issues
1. **File Not Found**: Check file naming convention
2. **Audio Not Playing**: Verify public access permissions
3. **Wrong Speed**: Check TTS configuration
4. **Database Errors**: Verify URL format and accessibility

### Error Recovery
If audio generation fails:
1. Check the error logs
2. Verify API credentials
3. Retry with proper rate limiting
4. Clean up incomplete records

## Cost Considerations

### TTS Usage
- Use Flash model for cost efficiency
- Implement rate limiting (2 seconds between requests)
- Monitor API usage and costs
- Consider caching for repeated content

### Storage Costs
- WAV files are larger than MP3 but provide better quality
- Monitor storage usage in Supabase
- Consider cleanup of old/unused files

## Security

### Access Control
- Audio files are publicly readable (required for web playback)
- Upload permissions restricted to service role
- Database access controlled by RLS policies

### File Validation
- Verify file types before upload
- Check file sizes for reasonable limits
- Validate audio content matches expected text
