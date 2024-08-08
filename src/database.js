const path = require("path");
const mysql = require("mysql2/promise");
const loadConfig = require("./config-loader");

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    const { database } = loadConfig("config/migration.js");
    this.pool = null;
    this.poolConfig = {
      host: database.host,
      user: database.user,
      password: database.password,
      database: database.database,
      port: database.port,
      connectionLimit: 1,
    };

    this.connected = false;

    Database.instance = this;
  }

  connect = async () => {
    if (!this.pool) {
      try {
        this.pool = mysql.createPool(this.poolConfig);
        this.connected = true;
      } catch (err) {
        console.error("Error creating connection pool:", err);
        throw err;
      }
    }
  };

  getConnection = async () => {
    if (!this.connected) {
      await this.connect();
    }
    try {
      const connection = await this.pool.getConnection();
      return connection;
    } catch (err) {
      console.error("Error getting connection from pool:", err);
      throw err;
    }
  };

  close = async () => {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.connected = false;
    }
  };
}

module.exports = new Database();
