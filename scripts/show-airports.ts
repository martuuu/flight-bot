#!/usr/bin/env npx tsx

import { airports } from '../src/config';

/**
 * Script para mostrar todos los aeropuertos disponibles organizados por país
 */
function showAirports() {
  console.log('🌍 BASE DE DATOS COMPLETA DE AEROPUERTOS\n');
  
  // Agrupar aeropuertos por país
  const airportsByCountry: Record<string, typeof airports[keyof typeof airports][]> = {};
  
  Object.values(airports).forEach(airport => {
    if (!airportsByCountry[airport.country]) {
      airportsByCountry[airport.country] = [];
    }
    airportsByCountry[airport.country].push(airport);
  });
  
  // Mostrar aeropuertos ordenados por país
  Object.keys(airportsByCountry)
    .sort()
    .forEach(country => {
      console.log(`🌎 ${country.toUpperCase()}`);
      console.log('━'.repeat(40));
      
      airportsByCountry[country]
        .sort((a, b) => a.code.localeCompare(b.code))
        .forEach(airport => {
          console.log(`• ${airport.code} - ${airport.name}`);
          console.log(`  📍 ${airport.city}`);
          console.log('');
        });
      
      console.log('');
    });
  
  console.log(`📊 RESUMEN:`);
  console.log(`• Total de aeropuertos: ${Object.keys(airports).length}`);
  console.log(`• Países cubiertos: ${Object.keys(airportsByCountry).length}`);
  console.log(`• Regiones: América, Europa, Asia, Oceanía\n`);
  
  console.log('💡 EJEMPLOS DE USO:');
  console.log('• /monthlyalert EZE JFK 800');
  console.log('• /monthlyalert SCL MIA 600');
  console.log('• /monthlyalert BOG MAD 900');
  console.log('• /monthlyalert GRU LAX 1200\n');
}

showAirports();
