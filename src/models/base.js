const util = require("util");

class BaseModel {
  constructor() {}
  attributes = () => {
    const attributes = {};
    for (const key of Object.keys(this)) {
      if (key.startsWith("_")) {
        const getterKey = key.substring(1);
        const descriptor = Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(this),
          getterKey
        );
        const getter = descriptor ? descriptor.get : undefined;
        if (getter) {
          attributes[getterKey] = this[getterKey];
        } else {
          attributes[getterKey] = this[key];
        }
      }
    }
    return attributes;
  };

  toJSON = () => {
    return this.attributes();
  };

  [util.inspect.custom] = (depth, options) => {
    return this.attributes();
  };
}

module.exports = BaseModel;
