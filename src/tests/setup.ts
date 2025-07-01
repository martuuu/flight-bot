/**
 * Configuración de Jest para tests
 */

// Configurar variables de entorno para tests
process.env['NODE_ENV'] = 'test';
process.env['DATABASE_PATH'] = ':memory:';
process.env['TELEGRAM_BOT_TOKEN'] = 'test_token';
process.env['LOG_LEVEL'] = 'error';

// Mock console para reducir ruido en tests
global.console = {
  ...console,
  // Mantener error y warn para debugging
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
};
