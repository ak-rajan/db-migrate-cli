const BaseModel = require("./base");

class Migration extends BaseModel {
  constructor(id, migration, batch) {
    super();
    this._id = id;
    this._migration = migration;
    this._batch = batch;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get migration() {
    return this._migration;
  }

  set migration(value) {
    this._migration = value;
  }

  get batch() {
    return this._batch;
  }

  set batch(value) {
    this._batch = value;
  }
}

module.exports = Migration;
