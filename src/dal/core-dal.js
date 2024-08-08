const BaseDAL = require("./base-dal");

class CoreDAL extends BaseDAL {
  constructor() {
    super();
  }

  executeQuery = async (sqlQuery) => {
    try {
      const result = await this.executeStoredProcedureWithOutParams(
        "executeQuery",
        [sqlQuery],
        ["status"]
      );

      const { status } = result;
      return status;
    } catch (err) {
      console.log(err);
    }

    return "Failure";
  };
}

module.exports = new CoreDAL();
