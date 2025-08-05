#!/usr/bin/env node

// Test script to verify the test student login credentials
const fetch = require('node-fetch');

async function testStudentLogin() {
  console.log('🔍 Testing student login credentials...\n');
  
  const testCredentials = {
    username: 'teststudent',
    schoolCode: 'TEST',
    password: 'testpass123'
  };
  
  try {
    console.log('Testing credentials:', testCredentials);
    
    const response = await fetch('http://localhost:3001/api/auth/student-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCredentials),
    });
    
    const data = await response.json();
    
    console.log('\n📊 Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ SUCCESS: Test student login working!');
      console.log('✅ User ID:', data.user?.id);
      console.log('✅ Username:', data.user?.username);
      console.log('✅ Email:', data.user?.email);
    } else {
      console.log('\n❌ FAILED: Test student login not working');
      console.log('❌ Error:', data.error);
    }
    
  } catch (error) {
    console.error('\n💥 ERROR: Exception during test', error);
  }
}

testStudentLogin();
