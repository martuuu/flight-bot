#!/usr/bin/env node
/**
 * Simple manual test of OAuth flow
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'webapp', '.env') });

async function manualOAuthTest() {
    console.log('\n🔍 MANUAL OAUTH TEST\n');
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;
    
    console.log('📋 Current Configuration:');
    console.log(`   Client ID: ${clientId}`);
    console.log(`   Redirect URI: ${redirectUri}`);
    
    console.log('\n🔗 Test OAuth URL:');
    const testUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent('openid email profile')}&` +
        `state=test`;
    
    console.log(testUrl);
    
    console.log('\n📝 To test manually:');
    console.log('1. Copy the URL above');
    console.log('2. Open it in a browser');
    console.log('3. If you see Google OAuth page = credentials are valid');
    console.log('4. If you see an error = credentials need to be updated');
    
    console.log('\n🚨 Current Issue Analysis:');
    console.log('The "error=google" suggests that either:');
    console.log('• The Google Client ID is invalid/placeholder');
    console.log('• The Google Client Secret is invalid/placeholder');
    console.log('• The redirect URI is not configured in Google Console');
    console.log('• The Google project is not properly configured');
    
    console.log('\n✅ RECOMMENDATION:');
    console.log('Create NEW Google OAuth credentials:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Create a NEW project (or use existing)');
    console.log('3. Enable Google+ API');
    console.log('4. Create OAuth 2.0 Client ID');
    console.log('5. Add redirect URI: http://localhost:3000/api/auth/callback/google');
    console.log('6. Update .env with the NEW credentials');
}

manualOAuthTest().catch(console.error);
