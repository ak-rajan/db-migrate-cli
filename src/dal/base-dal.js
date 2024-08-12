const database = require("../database");

class BaseDAL {
  constructor() {}

  withConnection = async (callback) => {
    let connection;
    try {
      connection = await database.getConnection();
      return await callback(connection);
    } catch (error) {
      console.error("Error executing database operation:", error);
      throw error;
    } finally {
      database.close();
    }
  };

  executeScript = async (script) => {
    try {
      return await this.withConnection(async (connection) => {
        await connection.beginTransaction();
        await connection.query(script);
        await connection.commit();

        return "Success";
      });
    } catch (err) {
      throw err;
    }
  };

  executeStoredProcedure = async (procedureName, params = []) => {
    try {
      return await this.withConnection(async (connection) => {
        const [rows, fields] = await connection.execute(
          `CALL ${procedureName}(${params.map(() => "?").join(", ")})`,
          params
        );
        return rows;
      });
    } catch (err) {
      throw err;
    }
  };

  executeStoredProcedureWithOutParams = async (
    procedureName,
    params = [],
    outParams = []
  ) => {
    try {
      return await this.withConnection(async (connection) => {
        const paramPlaceholders =
          params.length > 0 ? params.map(() => "?").join(", ") : "";
        const callQuery = `CALL ${procedureName}(${paramPlaceholders}${
          paramPlaceholders ? ", " : ""
        }${outParams.map((name) => `@${name}`).join(", ")});`;
        await connection.execute(callQuery, params);

        const outputQueries = outParams
          .map((name) => `SELECT @${name} AS ${name};`)
          .join(" ");
        const [outputResults] = await connection.query(outputQueries);

        const outputParams = {};
        outputResults.forEach((result) => {
          for (const outParam of outParams) {
            if (result[outParam] === undefined) {
              throw new Error(
                `Expected out param ${outParam} is not available.`
              );
            }
            outputParams[outParam] = result[outParam];
          }
        });

        return outputParams;
      });
    } catch (err) {
      throw err;
    }
  };

  hasResponse = (result) => {
    return (
      result &&
      result.length > 0 &&
      Array.isArray(result[0]) &&
      result[0].length > 0
    );
  };
}

module.exports = BaseDAL;
