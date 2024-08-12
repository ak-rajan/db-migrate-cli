const BaseDAL = require("./base-dal");

class CoreDAL extends BaseDAL {
  constructor() {
    super();
  }

  executeQuery = async (sqlQuery) => {
    try {
      return await this.executeScript(sqlQuery);
    } catch (err) {
      return err.message;
    }
  };
}

module.exports = new CoreDAL();
