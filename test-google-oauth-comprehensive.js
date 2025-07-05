#!/usr/bin/env node
/**
 * Comprehensive Google OAuth Testing Script
 * Tests the complete OAuth flow to identify specific issues
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'webapp', '.env') });

async function testGoogleOAuthFlow() {
    console.log('\n🔍 COMPREHENSIVE GOOGLE OAUTH TEST\n');
    console.log('==================================\n');
    
    // 1. Verify environment configuration
    console.log('1️⃣ ENVIRONMENT CONFIGURATION');
    console.log('─────────────────────────────');
    
    const config = {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        NEXTAUTH_DEBUG: process.env.NEXTAUTH_DEBUG
    };
    
    Object.entries(config).forEach(([key, value]) => {
        if (value) {
            const displayValue = key.includes('SECRET') ? '***configured***' : value;
            console.log(`✅ ${key}: ${displayValue}`);
        } else {
            console.log(`❌ ${key}: MISSING`);
        }
    });
    
    // 2. Test NextAuth endpoints
    console.log('\n2️⃣ NEXTAUTH ENDPOINTS');
    console.log('─────────────────────');
    
    const baseUrl = process.env.NEXTAUTH_URL;
    
    try {
        // Test providers endpoint
        console.log('📡 Testing /api/auth/providers...');
        const providersResponse = await fetch(`${baseUrl}/api/auth/providers`);
        const providers = await providersResponse.json();
        
        console.log(`   Status: ${providersResponse.status}`);
        console.log(`   Providers: ${JSON.stringify(providers, null, 2)}`);
        
        if (providers.google) {
            console.log('✅ Google provider configured');
        } else {
            console.log('❌ Google provider NOT found');
        }
        
    } catch (error) {
        console.log(`❌ Error testing providers: ${error.message}`);
    }
    
    // 3. Test Google OAuth URLs
    console.log('\n3️⃣ GOOGLE OAUTH URLS');
    console.log('────────────────────');
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${baseUrl}/api/auth/callback/google`;
    
    console.log(`📍 Client ID: ${clientId}`);
    console.log(`📍 Redirect URI: ${redirectUri}`);
    
    // Check if client ID looks valid
    if (clientId && clientId.includes('.apps.googleusercontent.com')) {
        console.log('✅ Client ID format looks valid');
    } else {
        console.log('❌ Client ID format appears invalid');
    }
    
    // 4. Test signin URL
    console.log('\n4️⃣ SIGNIN URL TEST');
    console.log('─────────────────');
    
    try {
        const signinUrl = `${baseUrl}/api/auth/signin/google`;
        console.log(`📡 Testing signin URL: ${signinUrl}`);
        
        const signinResponse = await fetch(signinUrl, {
            redirect: 'manual' // Don't follow redirects
        });
        
        console.log(`   Status: ${signinResponse.status}`);
        console.log(`   Location: ${signinResponse.headers.get('location') || 'None'}`);
        
        if (signinResponse.status === 302) {
            const location = signinResponse.headers.get('location');
            if (location && location.includes('accounts.google.com')) {
                console.log('✅ Redirect to Google OAuth looks correct');
            } else {
                console.log(`❌ Unexpected redirect: ${location}`);
            }
        }
        
    } catch (error) {
        console.log(`❌ Error testing signin: ${error.message}`);
    }
    
    // 5. Common issues check
    console.log('\n5️⃣ COMMON ISSUES CHECK');
    console.log('─────────────────────');
    
    const issues = [];
    
    // Check redirect URI configuration
    if (!redirectUri.includes('localhost:3000')) {
        issues.push('❌ Redirect URI might not match Google Console configuration');
    }
    
    // Check client ID format
    if (!clientId || !clientId.includes('apps.googleusercontent.com')) {
        issues.push('❌ Google Client ID appears to be a placeholder or invalid');
    }
    
    // Check secret presence
    if (!process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET.length < 20) {
        issues.push('❌ Google Client Secret appears to be missing or invalid');
    }
    
    if (issues.length === 0) {
        console.log('✅ No obvious configuration issues detected');
    } else {
        issues.forEach(issue => console.log(issue));
    }
    
    // 6. Recommendations
    console.log('\n6️⃣ RECOMMENDATIONS');
    console.log('─────────────────');
    
    console.log('\nTo fix Google OAuth issues:');
    console.log('1. 🔗 Go to https://console.cloud.google.com/');
    console.log('2. 📂 Select or create a project');
    console.log('3. 🔧 Go to APIs & Services > Credentials');
    console.log('4. ➕ Create OAuth 2.0 Client ID (Web application)');
    console.log('5. 📍 Add authorized redirect URI:');
    console.log(`   http://localhost:3000/api/auth/callback/google`);
    console.log('6. 📋 Copy Client ID and Client Secret to .env');
    console.log('7. 🔄 Restart the development server');
    
    console.log('\n✅ OAUTH TEST COMPLETED');
}

// Run if called directly
if (require.main === module) {
    testGoogleOAuthFlow().catch(console.error);
}

module.exports = { testGoogleOAuthFlow };
