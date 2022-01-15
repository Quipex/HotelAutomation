function encodeObjectAsUrl(object: object): string {
  return encodeURIComponent(JSON.stringify(object));
}

export { encodeObjectAsUrl };
