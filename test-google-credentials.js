#!/usr/bin/env node
/**
 * Test Google OAuth credentials by making actual requests
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'webapp', '.env') });

async function testGoogleCredentials() {
    console.log('\n🔍 TESTING GOOGLE OAUTH CREDENTIALS\n');
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;
    
    console.log('📋 Configuration:');
    console.log(`   Client ID: ${clientId}`);
    console.log(`   Redirect URI: ${redirectUri}`);
    console.log(`   Client Secret: ${clientSecret ? '***configured***' : 'MISSING'}`);
    
    // Test 1: Check if we can reach Google's OAuth discovery endpoint
    console.log('\n1️⃣ Testing Google OAuth Discovery...');
    try {
        const discoveryResponse = await fetch('https://accounts.google.com/.well-known/openid_configuration');
        const discovery = await discoveryResponse.json();
        console.log(`✅ Google OAuth discovery successful`);
        console.log(`   Authorization endpoint: ${discovery.authorization_endpoint}`);
        console.log(`   Token endpoint: ${discovery.token_endpoint}`);
    } catch (error) {
        console.log(`❌ Google OAuth discovery failed: ${error.message}`);
        return;
    }
    
    // Test 2: Test if we can validate the client ID format
    console.log('\n2️⃣ Validating Client ID...');
    if (clientId && clientId.includes('apps.googleusercontent.com')) {
        console.log('✅ Client ID format looks valid');
        
        // Extract project number
        const projectNumber = clientId.split('-')[0];
        console.log(`   Project number: ${projectNumber}`);
    } else {
        console.log('❌ Client ID format appears invalid');
        console.log('   Expected format: [project-number]-[hash].apps.googleusercontent.com');
    }
    
    // Test 3: Construct and validate OAuth URL
    console.log('\n3️⃣ OAuth URL Construction...');
    const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    oauthUrl.searchParams.set('client_id', clientId);
    oauthUrl.searchParams.set('redirect_uri', redirectUri);
    oauthUrl.searchParams.set('response_type', 'code');
    oauthUrl.searchParams.set('scope', 'openid email profile');
    oauthUrl.searchParams.set('state', 'test-state');
    
    console.log(`✅ OAuth URL: ${oauthUrl.toString()}`);
    
    // Test 4: Check redirect URI accessibility
    console.log('\n4️⃣ Testing Redirect URI Accessibility...');
    try {
        const response = await fetch(redirectUri);
        console.log(`📡 Redirect URI status: ${response.status}`);
        
        if (response.status === 404) {
            console.log('⚠️  This is expected - NextAuth will handle this route');
        }
    } catch (error) {
        console.log(`❌ Cannot reach redirect URI: ${error.message}`);
    }
    
    // Test 5: Check for common credential issues
    console.log('\n5️⃣ Common Issues Check...');
    const issues = [];
    
    if (!clientSecret || clientSecret.length < 20) {
        issues.push('❌ Client secret appears to be invalid or too short');
    }
    
    if (clientId && clientId.includes('example') || clientId.includes('your-client-id')) {
        issues.push('❌ Client ID appears to be a placeholder');
    }
    
    if (redirectUri.includes('localhost') && !redirectUri.includes('3000')) {
        issues.push('❌ Redirect URI port mismatch - Google Console might expect port 3000');
    }
    
    if (issues.length === 0) {
        console.log('✅ No obvious credential issues detected');
    } else {
        issues.forEach(issue => console.log(issue));
    }
    
    console.log('\n6️⃣ Next Steps...');
    console.log('To create valid Google OAuth credentials:');
    console.log('1. Visit https://console.cloud.google.com/');
    console.log('2. Create a new project or select existing one');
    console.log('3. Enable Google+ API or People API');
    console.log('4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID');
    console.log('5. Select "Web application"');
    console.log('6. Add Authorized redirect URIs:');
    console.log(`   ${redirectUri}`);
    console.log('7. Copy the generated Client ID and Client Secret');
    console.log('8. Update your .env file with the real credentials');
    
    console.log('\n✅ CREDENTIAL TEST COMPLETED');
}

// Run if called directly
if (require.main === module) {
    testGoogleCredentials().catch(console.error);
}

module.exports = { testGoogleCredentials };
