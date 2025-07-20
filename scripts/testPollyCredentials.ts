#!/usr/bin/env tsx

/**
 * Simple test script to verify Amazon Polly credentials
 */

import dotenv from 'dotenv';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testCredentials() {
  console.log('🔍 Testing Amazon Polly credentials...\n');
  
  // Check environment variables
  console.log('Environment variables:');
  console.log(`AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID.substring(0, 8) + '...' : 'NOT SET'}`);
  console.log(`AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? '***' + process.env.AWS_SECRET_ACCESS_KEY.substring(process.env.AWS_SECRET_ACCESS_KEY.length - 4) : 'NOT SET'}`);
  console.log(`AWS_REGION: ${process.env.AWS_REGION || 'NOT SET (will use us-east-1)'}\n`);
  
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ AWS credentials not found in environment variables');
    console.log('Make sure you have AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env.local file');
    process.exit(1);
  }
  
  try {
    // Initialize Polly client
    const client = new PollyClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    
    console.log('✅ Polly client initialized successfully');
    
    // Test with a simple synthesis request
    const command = new SynthesizeSpeechCommand({
      Text: 'Hello, this is a test.',
      VoiceId: 'Joanna',
      OutputFormat: 'mp3',
      Engine: 'standard',
    });
    
    console.log('🎵 Testing speech synthesis...');
    
    const response = await client.send(command);
    
    if (response.AudioStream) {
      console.log('✅ Speech synthesis successful!');
      console.log(`Audio stream received: ${response.AudioStream}`);
      console.log(`Content type: ${response.ContentType}`);
      console.log(`Request characters: ${response.RequestCharacters}`);
      
      // Convert stream to buffer to check size
      const chunks: Uint8Array[] = [];
      for await (const chunk of response.AudioStream) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);
      console.log(`Audio buffer size: ${audioBuffer.length} bytes`);
      
      console.log('\n🎉 Amazon Polly is working correctly!');
      console.log('You can now run: npm run generate-audio');
      
    } else {
      console.error('❌ No audio stream received');
    }
    
  } catch (error) {
    console.error('❌ Error testing Amazon Polly:', error);
    
    if (error.name === 'UnrecognizedClientException') {
      console.log('\n💡 This error usually means:');
      console.log('   - Invalid AWS Access Key ID');
      console.log('   - Check your AWS_ACCESS_KEY_ID in .env.local');
    } else if (error.name === 'SignatureDoesNotMatchException') {
      console.log('\n💡 This error usually means:');
      console.log('   - Invalid AWS Secret Access Key');
      console.log('   - Check your AWS_SECRET_ACCESS_KEY in .env.local');
    } else if (error.name === 'AccessDeniedException') {
      console.log('\n💡 This error usually means:');
      console.log('   - Your AWS user doesn\'t have Polly permissions');
      console.log('   - Add the AmazonPollyFullAccess policy to your user');
    }
    
    process.exit(1);
  }
}

testCredentials().catch(console.error);
