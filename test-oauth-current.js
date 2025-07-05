#!/usr/bin/env node
/**
 * Test actual OAuth flow to identify specific issues
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'webapp', '.env') });

async function testOAuthConfiguration() {
    console.log('\n🔍 TESTING CURRENT OAUTH CONFIGURATION\n');
    
    // Check environment variables
    const requiredVars = [
        'NEXTAUTH_URL',
        'NEXTAUTH_SECRET', 
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET'
    ];
    
    console.log('📋 Environment Variables:');
    requiredVars.forEach(varName => {
        const value = process.env[varName];
        if (value) {
            console.log(`✅ ${varName}: ${varName.includes('SECRET') ? '***hidden***' : value}`);
        } else {
            console.log(`❌ ${varName}: MISSING`);
        }
    });
    
    // Test OAuth endpoints
    console.log('\n🌐 Testing OAuth Endpoints:');
    
    const baseUrl = process.env.NEXTAUTH_URL;
    const endpoints = [
        '/api/auth/providers',
        '/api/auth/session',
        '/api/auth/signin'
    ];
    
    for (const endpoint of endpoints) {
        try {
            const url = `${baseUrl}${endpoint}`;
            console.log(`\n📡 Testing: ${url}`);
            
            const response = await fetch(url);
            const data = await response.text();
            
            console.log(`   Status: ${response.status}`);
            console.log(`   Response: ${data.substring(0, 100)}...`);
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }
    
    // Test Google OAuth URL construction
    console.log('\n🔗 Google OAuth URL Construction:');
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${baseUrl}/api/auth/callback/google`;
    
    console.log(`   Client ID: ${googleClientId}`);
    console.log(`   Redirect URI: ${redirectUri}`);
    
    const googleAuthUrl = `https://accounts.google.com/oauth/authorize?` +
        `client_id=${googleClientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent('openid email profile')}`;
    
    console.log(`   Full URL: ${googleAuthUrl.substring(0, 150)}...`);
    
    console.log('\n✅ Test completed - Check outputs above for issues');
}

// Only run if called directly
if (require.main === module) {
    testOAuthConfiguration().catch(console.error);
}

module.exports = { testOAuthConfiguration };
