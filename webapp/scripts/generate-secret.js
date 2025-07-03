#!/usr/bin/env node

/**
 * Este script genera un secreto seguro para usar con NextAuth.js
 * Ejecuta: node scripts/generate-secret.js
 */

const crypto = require('crypto');

// Genera un secreto aleatorio de 32 bytes y lo convierte a base64
const secret = crypto.randomBytes(32).toString('base64');

console.log('Tu secreto seguro para NEXTAUTH_SECRET:');
console.log(secret);
console.log('\nAgrega esto a tu archivo .env:');
console.log(`NEXTAUTH_SECRET=${secret}`);
