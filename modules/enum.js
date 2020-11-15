class Enum {
  constructor(items) {
    Object.keys(items).forEach((k) => {
      this._items = items;
      Object.defineProperty(this, k, {
        get() {
          return items[k];
        },
        configurable: false,
        enumerable: true,
      });
    });

    this[Symbol.iterator] = Object.values(this._items)[Symbol.iterator];
  }

  toArray() {
    return Object.values(this._items);
  }

  toString() {
    return this.toArray().toString();
  }

  toObject() {
    return { ...this._items };
  }
}

module.exports = Enum;
