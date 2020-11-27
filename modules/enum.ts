export class Enum<T = Record<string | number, unknown>> implements T {
  #items: Record<string | number, unknown>;
  [Symbol.iterator]: () => IterableIterator<unknown>;

  constructor(items: Record<string, unknown>) {
    this.#items = {};

    Object.keys(items).forEach((k) => {
      this.#items = items;
      Object.defineProperty(this, k, {
        get() {
          return items[k];
        },
        configurable: false,
        enumerable: true,
      });
    });

    this[Symbol.iterator] = Object.values(this.#items)[Symbol.iterator];
  }

  toArray(): any[] {
    return Object.values(this.#items);
  }

  toString(): string {
    return this.toArray().toString();
  }

  toObject(): Record<string | number, unknown> {
    return { ...this.#items };
  }
}
