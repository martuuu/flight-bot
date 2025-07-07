import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Log available properties
console.log('Prisma client properties:');
const props = Object.getOwnPropertyNames(prisma);
console.log(props.filter(p => !p.startsWith('$') && !p.startsWith('_')));

// Try to access AerolineasAlert model
try {
  console.log('Trying aerolineasAlert...');
  // @ts-ignore
  console.log(typeof prisma.aerolineasAlert);
} catch (error) {
  console.log('aerolineasAlert not found');
}

// Check if it's under a different name
try {
  console.log('Trying AerolineasAlert...');
  // @ts-ignore
  console.log(typeof prisma.AerolineasAlert);
} catch (error) {
  console.log('AerolineasAlert not found');
}

try {
  console.log('Trying aerolíneasAlert...');
  // @ts-ignore
  console.log(typeof prisma.aerolíneasAlert);
} catch (error) {
  console.log('aerolíneasAlert not found');
}

process.exit(0);
