-- Schema de base de datos para el bot de monitoreo de vuelos
-- SQLite Database Schema

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER UNIQUE NOT NULL,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de alertas de precios
CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    max_price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'COP',
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_checked DATETIME,
    notification_count INTEGER DEFAULT 0,
    departure_date DATE,
    return_date DATE,
    passengers INTEGER DEFAULT 1,
    cabin_class TEXT DEFAULT 'economy',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de historial de precios
CREATE TABLE IF NOT EXISTS price_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'COP',
    departure_date DATE NOT NULL,
    return_date DATE,
    airline TEXT NOT NULL,
    flight_number TEXT,
    scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    available_seats INTEGER,
    booking_url TEXT,
    cabin_class TEXT DEFAULT 'economy',
    duration_minutes INTEGER,
    stops INTEGER DEFAULT 0
);

-- Tabla de detalles completos de vuelos
CREATE TABLE IF NOT EXISTS flight_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT NOT NULL,
    airline TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_date DATE NOT NULL,
    arrival_date DATE NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration TEXT NOT NULL,
    aircraft TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    cabin_class TEXT DEFAULT 'economy',
    available_seats INTEGER,
    
    -- Información adicional en JSON
    taxes TEXT, -- JSON con impuestos (security, service, government, total)
    fees TEXT, -- JSON con tasas (booking, processing, total)  
    restrictions TEXT, -- JSON con restricciones (refundable, changeable, notes)
    baggage TEXT, -- JSON con información de equipaje
    amenities TEXT, -- JSON array con amenidades
    
    -- Servicios incluidos
    meal TEXT,
    wifi BOOLEAN DEFAULT 0,
    entertainment BOOLEAN DEFAULT 0,
    
    -- Información de conexiones
    stops INTEGER DEFAULT 0,
    layovers TEXT, -- JSON array con escalas
    
    -- Metadatos
    booking_class TEXT,
    fare_type TEXT,
    validating_carrier TEXT,
    
    -- Historial y datos
    price_history TEXT, -- JSON array con historial de precios
    raw_api_data TEXT, -- JSON con datos completos de la API
    search_timestamp TEXT NOT NULL,
    last_updated TEXT NOT NULL,
    
    -- Índices únicos
    UNIQUE(flight_number, departure_date, origin, destination)
);

-- Tabla de notificaciones enviadas
CREATE TABLE IF NOT EXISTS notifications_sent (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_id INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'COP',
    flight_date DATE NOT NULL,
    airline TEXT NOT NULL,
    flight_number TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    telegram_message_id INTEGER,
    FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE CASCADE
);

-- Tabla de configuración del sistema
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de logs de errores
CREATE TABLE IF NOT EXISTS error_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    context TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT 0
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_active ON alerts(user_id, active);
CREATE INDEX IF NOT EXISTS idx_alerts_origin_dest ON alerts(origin, destination);
CREATE INDEX IF NOT EXISTS idx_price_history_route_date ON price_history(origin, destination, departure_date);
CREATE INDEX IF NOT EXISTS idx_price_history_scraped ON price_history(scraped_at);
CREATE INDEX IF NOT EXISTS idx_notifications_alert ON notifications_sent(alert_id);
CREATE INDEX IF NOT EXISTS idx_notifications_sent_date ON notifications_sent(sent_at);

-- Índices para flight_details
CREATE INDEX IF NOT EXISTS idx_flight_details_route ON flight_details(origin, destination);
CREATE INDEX IF NOT EXISTS idx_flight_details_date ON flight_details(departure_date);
CREATE INDEX IF NOT EXISTS idx_flight_details_flight ON flight_details(flight_number, departure_date);
CREATE INDEX IF NOT EXISTS idx_flight_details_updated ON flight_details(last_updated);
CREATE INDEX IF NOT EXISTS idx_flight_details_price ON flight_details(price, currency);

-- Insertar configuración inicial del sistema
INSERT OR IGNORE INTO system_config (key, value, description) VALUES
('bot_version', '1.0.0', 'Versión actual del bot'),
('last_scraping_run', '', 'Última ejecución del scraping'),
('scraping_enabled', '1', 'Scraping habilitado/deshabilitado'),
('maintenance_mode', '0', 'Modo mantenimiento'),
('max_alerts_per_user', '10', 'Máximo número de alertas por usuario'),
('alert_cooldown_minutes', '60', 'Tiempo entre alertas para la misma ruta');

-- Triggers para mantener consistencia
CREATE TRIGGER IF NOT EXISTS update_user_activity
    AFTER INSERT ON alerts
    BEGIN
        UPDATE users SET last_activity = CURRENT_TIMESTAMP WHERE id = NEW.user_id;
    END;

CREATE TRIGGER IF NOT EXISTS update_alert_check_time
    AFTER INSERT ON notifications_sent
    BEGIN
        UPDATE alerts SET 
            last_checked = CURRENT_TIMESTAMP,
            notification_count = notification_count + 1
        WHERE id = NEW.alert_id;
    END;
