type QueryParams<T extends (...args: any) => any> = Record<keyof ReturnType<T>, string>;

export type { QueryParams };
