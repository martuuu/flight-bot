import Database from 'better-sqlite3';
import { AerolineasAlert, AerolineasSearchType, AerolineasCabinClass, AerolineasFlightType } from '../types/aerolineas-api';

export class AerolineasAlertModel {
  private db: Database.Database;
  private tableName = 'aerolineas_alerts';

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.createTable();
  }

  private createTable(): void {
    // Crear tabla aerolineas_alerts
    const sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        departure_date TEXT,
        return_date TEXT,
        adults INTEGER NOT NULL DEFAULT 1,
        children INTEGER DEFAULT 0,
        infants INTEGER DEFAULT 0,
        cabin_class TEXT DEFAULT 'Economy',
        flight_type TEXT NOT NULL DEFAULT 'ONE_WAY',
        search_type TEXT NOT NULL DEFAULT 'PROMO',
        max_miles INTEGER,
        max_price INTEGER,
        min_available_seats INTEGER DEFAULT 1,
        preferred_times TEXT, -- JSON array
        exclude_stops INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        last_checked TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;

    this.db.exec(sql);

    // Crear índices
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_aerolineas_alerts_user_id ON ${this.tableName}(user_id)`);
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_aerolineas_alerts_active ON ${this.tableName}(is_active)`);
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_aerolineas_alerts_route ON ${this.tableName}(origin, destination)`);
  }

  /**
   * Crear nueva alerta
   */
  create(alert: Omit<AerolineasAlert, 'id' | 'createdAt' | 'updatedAt'>): AerolineasAlert {
    const id = `ar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO ${this.tableName} (
        id, user_id, origin, destination, departure_date, return_date,
        adults, children, infants, cabin_class, flight_type, search_type,
        max_miles, max_price, min_available_seats, preferred_times,
        exclude_stops, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const stmt = this.db.prepare(sql);
    stmt.run(
      id,
      alert.userId,
      alert.origin,
      alert.destination,
      alert.departureDate,
      alert.returnDate,
      alert.adults,
      alert.children || 0,
      alert.infants || 0,
      alert.cabinClass || 'Economy',
      alert.flightType,
      alert.searchType,
      alert.maxMiles,
      alert.maxPrice,
      alert.minAvailableSeats || 1,
      alert.preferredTimes ? JSON.stringify(alert.preferredTimes) : null,
      alert.excludeStops ? 1 : 0,
      alert.isActive ? 1 : 0,
      now,
      now
    );

    return this.findById(id)!;
  }

  /**
   * Buscar alerta por ID
   */
  findById(id: string): AerolineasAlert | null {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const stmt = this.db.prepare(sql);
    const row = stmt.get(id) as any;

    return row ? this.mapRowToAlert(row) : null;
  }

  /**
   * Buscar alertas por usuario
   */
  findByUserId(userId: number): AerolineasAlert[] {
    const sql = `SELECT * FROM ${this.tableName} WHERE user_id = ? ORDER BY created_at DESC`;
    const stmt = this.db.prepare(sql);
    const rows = stmt.all(userId) as any[];

    return rows.map(row => this.mapRowToAlert(row));
  }

  /**
   * Buscar alertas activas
   */
  findActive(): AerolineasAlert[] {
    const sql = `SELECT * FROM ${this.tableName} WHERE is_active = 1 ORDER BY created_at DESC`;
    const stmt = this.db.prepare(sql);
    const rows = stmt.all() as any[];

    return rows.map(row => this.mapRowToAlert(row));
  }

  /**
   * Buscar alertas por ruta
   */
  findByRoute(origin: string, destination: string): AerolineasAlert[] {
    const sql = `SELECT * FROM ${this.tableName} WHERE origin = ? AND destination = ? AND is_active = 1`;
    const stmt = this.db.prepare(sql);
    const rows = stmt.all(origin, destination) as any[];

    return rows.map(row => this.mapRowToAlert(row));
  }

  /**
   * Actualizar alerta
   */
  update(id: string, updates: Partial<AerolineasAlert>): boolean {
    const fields = [];
    const values = [];

    if (updates.departureDate !== undefined) {
      fields.push('departure_date = ?');
      values.push(updates.departureDate);
    }
    if (updates.returnDate !== undefined) {
      fields.push('return_date = ?');
      values.push(updates.returnDate);
    }
    if (updates.adults !== undefined) {
      fields.push('adults = ?');
      values.push(updates.adults);
    }
    if (updates.children !== undefined) {
      fields.push('children = ?');
      values.push(updates.children);
    }
    if (updates.infants !== undefined) {
      fields.push('infants = ?');
      values.push(updates.infants);
    }
    if (updates.cabinClass !== undefined) {
      fields.push('cabin_class = ?');
      values.push(updates.cabinClass);
    }
    if (updates.flightType !== undefined) {
      fields.push('flight_type = ?');
      values.push(updates.flightType);
    }
    if (updates.searchType !== undefined) {
      fields.push('search_type = ?');
      values.push(updates.searchType);
    }
    if (updates.maxMiles !== undefined) {
      fields.push('max_miles = ?');
      values.push(updates.maxMiles);
    }
    if (updates.maxPrice !== undefined) {
      fields.push('max_price = ?');
      values.push(updates.maxPrice);
    }
    if (updates.minAvailableSeats !== undefined) {
      fields.push('min_available_seats = ?');
      values.push(updates.minAvailableSeats);
    }
    if (updates.preferredTimes !== undefined) {
      fields.push('preferred_times = ?');
      values.push(updates.preferredTimes ? JSON.stringify(updates.preferredTimes) : null);
    }
    if (updates.excludeStops !== undefined) {
      fields.push('exclude_stops = ?');
      values.push(updates.excludeStops ? 1 : 0);
    }
    if (updates.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(updates.isActive ? 1 : 0);
    }
    if (updates.lastChecked !== undefined) {
      fields.push('last_checked = ?');
      values.push(updates.lastChecked.toISOString());
    }

    if (fields.length === 0) {
      return false;
    }

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());

    const sql = `UPDATE ${this.tableName} SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const stmt = this.db.prepare(sql);
    const result = stmt.run(...values);

    return result.changes > 0;
  }

  /**
   * Eliminar alerta
   */
  delete(id: string): boolean {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const stmt = this.db.prepare(sql);
    const result = stmt.run(id);

    return result.changes > 0;
  }

  /**
   * Eliminar todas las alertas de un usuario
   */
  deleteByUserId(userId: number): number {
    const sql = `DELETE FROM ${this.tableName} WHERE user_id = ?`;
    const stmt = this.db.prepare(sql);
    const result = stmt.run(userId);

    return result.changes;
  }

  /**
   * Pausar/reanudar alerta
   */
  toggleActive(id: string): boolean {
    const sql = `UPDATE ${this.tableName} SET is_active = 1 - is_active, updated_at = ? WHERE id = ?`;
    const stmt = this.db.prepare(sql);
    const result = stmt.run(new Date().toISOString(), id);

    return result.changes > 0;
  }

  /**
   * Actualizar última verificación
   */
  updateLastChecked(id: string): boolean {
    const sql = `UPDATE ${this.tableName} SET last_checked = ? WHERE id = ?`;
    const stmt = this.db.prepare(sql);
    const result = stmt.run(new Date().toISOString(), id);

    return result.changes > 0;
  }

  /**
   * Obtener estadísticas
   */
  getStats(): {
    total: number;
    active: number;
    inactive: number;
    bySearchType: Record<string, number>;
    byRoute: Record<string, number>;
    byUser: Record<string, number>;
  } {
    const totalStmt = this.db.prepare(`SELECT COUNT(*) as count FROM ${this.tableName}`);
    const activeStmt = this.db.prepare(`SELECT COUNT(*) as count FROM ${this.tableName} WHERE is_active = 1`);
    const inactiveStmt = this.db.prepare(`SELECT COUNT(*) as count FROM ${this.tableName} WHERE is_active = 0`);
    
    const bySearchTypeStmt = this.db.prepare(`
      SELECT search_type, COUNT(*) as count 
      FROM ${this.tableName} 
      GROUP BY search_type
    `);
    
    const byRouteStmt = this.db.prepare(`
      SELECT origin || '-' || destination as route, COUNT(*) as count 
      FROM ${this.tableName} 
      GROUP BY origin, destination 
      ORDER BY count DESC 
      LIMIT 10
    `);
    
    const byUserStmt = this.db.prepare(`
      SELECT user_id, COUNT(*) as count 
      FROM ${this.tableName} 
      GROUP BY user_id 
      ORDER BY count DESC 
      LIMIT 10
    `);

    const total = (totalStmt.get() as any).count;
    const active = (activeStmt.get() as any).count;
    const inactive = (inactiveStmt.get() as any).count;

    const bySearchType = (bySearchTypeStmt.all() as any[]).reduce((acc, row) => {
      acc[row.search_type] = row.count;
      return acc;
    }, {});

    const byRoute = (byRouteStmt.all() as any[]).reduce((acc, row) => {
      acc[row.route] = row.count;
      return acc;
    }, {});

    const byUser = (byUserStmt.all() as any[]).reduce((acc, row) => {
      acc[row.user_id] = row.count;
      return acc;
    }, {});

    return {
      total,
      active,
      inactive,
      bySearchType,
      byRoute,
      byUser
    };
  }

  /**
   * Mapear fila de DB a objeto AerolineasAlert
   */
  private mapRowToAlert(row: any): AerolineasAlert {
    return {
      id: row.id,
      userId: row.user_id,
      origin: row.origin,
      destination: row.destination,
      departureDate: row.departure_date || undefined,
      returnDate: row.return_date || undefined,
      adults: row.adults,
      children: row.children || 0,
      infants: row.infants || 0,
      cabinClass: row.cabin_class as AerolineasCabinClass,
      flightType: row.flight_type as AerolineasFlightType,
      searchType: row.search_type as AerolineasSearchType,
      maxMiles: row.max_miles || undefined,
      maxPrice: row.max_price || undefined,
      minAvailableSeats: row.min_available_seats || undefined,
      preferredTimes: row.preferred_times ? JSON.parse(row.preferred_times) : undefined,
      excludeStops: row.exclude_stops === 1,
      isActive: row.is_active === 1,
      lastChecked: row.last_checked ? new Date(row.last_checked) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  /**
   * Cerrar conexión a la base de datos
   */
  close(): void {
    this.db.close();
  }
}
