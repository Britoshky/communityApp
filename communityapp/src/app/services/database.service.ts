import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

// Nombre de la base de datos
const DB_PUBLICATIONS = 'publications_db';

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible en toda la aplicación
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite); // Inicializa la conexión SQLite
  private db!: SQLiteDBConnection; // Almacena la conexión activa a la base de datos

  constructor() {}

  // Verifica si la base de datos está inicializada
  isInitialized(): boolean {
    return !!this.db;
  }

  // Inicializa el plugin SQLite y crea la base de datos si no existe
  async initializePlugin(): Promise<boolean> {
    try {
      const platform = Capacitor.getPlatform(); // Obtiene la plataforma actual (web, iOS, Android)

      // Configuración para plataformas web
      if (platform === 'web') {
        const jeepSqliteEl = document.querySelector('jeep-sqlite'); // Verifica si el elemento jeep-sqlite está presente
        if (!jeepSqliteEl) {
          console.error('El elemento <jeep-sqlite> no está presente en el DOM.');
          return false;
        }

        await customElements.whenDefined('jeep-sqlite'); // Espera a que el componente esté definido
        await CapacitorSQLite.initWebStore(); // Inicializa el almacenamiento en web
      }

      // Crea una conexión a la base de datos
      this.db = await this.sqlite.createConnection(
        DB_PUBLICATIONS, // Nombre de la base de datos
        false,           // No utiliza encriptación
        'no-encryption', // Indica que no hay encriptación
        1,               // Versión de la base de datos
        false            // Indica que no es en modo Shared
      );

      await this.db.open(); // Abre la base de datos
      const schema = `
        CREATE TABLE IF NOT EXISTS publications (
          id INTEGER PRIMARY KEY AUTOINCREMENT, -- Clave primaria auto incrementada
          title TEXT NOT NULL,                  -- Campo obligatorio para el título
          description TEXT NOT NULL,           -- Campo obligatorio para la descripción
          image TEXT,                           -- Campo opcional para la imagen
          date TEXT NOT NULL                    -- Campo obligatorio para la fecha
        );
      `;
      await this.db.execute(schema); // Ejecuta la creación de la tabla

      return true; // Indica que la base de datos se inicializó correctamente
    } catch (error) {
      console.error('Error initializing SQLite:', error); // Manejo de errores
      return false;
    }
  }

  // Obtiene la conexión activa a la base de datos
  private getDbConnection(): SQLiteDBConnection {
    if (!this.db) {
      throw new Error('Database connection has not been initialized.');
    }
    return this.db;
  }

  // Obtiene todas las publicaciones almacenadas en la base de datos
  async getAllPublications(): Promise<any[]> {
    try {
      const db = this.getDbConnection();
      const result = await db.query('SELECT * FROM publications ORDER BY id DESC'); // Consulta ordenada por ID descendente
      return result.values || []; // Devuelve los resultados o un arreglo vacío
    } catch (error) {
      console.error('Error retrieving publications:', error); // Manejo de errores
      return [];
    }
  }

  // Agrega una nueva publicación a la base de datos
  async addPublication(publication: {
    title: string;       // Título de la publicación
    description: string; // Descripción de la publicación
    image: string;       // URL de la imagen
    date: string;        // Fecha de la publicación
  }): Promise<void> {
    try {
      const db = this.getDbConnection();
      const statement = `
        INSERT INTO publications (title, description, image, date)
        VALUES (?, ?, ?, ?);
      `; // Sentencia SQL para insertar una nueva publicación
      await db.run(statement, [
        publication.title,
        publication.description,
        publication.image,
        publication.date,
      ]);

      // Guarda la base de datos en el almacenamiento web (solo para web)
      if (Capacitor.getPlatform() === 'web') {
        await CapacitorSQLite.saveToStore({ database: DB_PUBLICATIONS });
      }
    } catch (error) {
      console.error('Error adding publication:', error); // Manejo de errores
    }
  }

  // Elimina una publicación específica por ID
  async deletePublication(id: number): Promise<void> {
    try {
      const db = this.getDbConnection();
      const statement = 'DELETE FROM publications WHERE id = ?'; // Sentencia SQL para eliminar por ID
      await db.run(statement, [id]);

      // Guarda la base de datos en el almacenamiento web (solo para web)
      if (Capacitor.getPlatform() === 'web') {
        await CapacitorSQLite.saveToStore({ database: DB_PUBLICATIONS });
      }
    } catch (error) {
      console.error('Error deleting publication:', error); // Manejo de errores
    }
  }

  // Cierra la conexión activa a la base de datos
  async closeConnection(): Promise<void> {
    if (this.db) {
      await this.sqlite.closeConnection(DB_PUBLICATIONS, false); // Cierra la conexión de la base de datos
    }
  }
}
