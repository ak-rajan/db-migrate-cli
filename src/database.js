const mysql = require("mysql2/promise");
const loadConfig = require("./config-loader");

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    const { database } = loadConfig("config/migration.js");
    this.connection = null;
    this.connectionConfig = {
      host: database.host,
      user: database.user,
      password: database.password,
      database: database.database,
      port: database.port,
      multipleStatements: true,
    };

    Database.instance = this;
  }

  connect = async () => {
    if (!this.connection) {
      try {
        this.connection = await mysql.createConnection(this.connectionConfig);
      } catch (err) {
        console.error("Error creating connection:", err);
        throw err;
      }
    }
  };

  getConnection = async () => {
    if (!this.connection) {
      await this.connect();
    }

    return this.connection;
  };

  close = async () => {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  };
}

module.exports = new Database();
