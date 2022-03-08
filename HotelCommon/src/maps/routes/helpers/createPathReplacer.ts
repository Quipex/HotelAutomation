const createPathReplacer = (pathChunk: string) => (fullPath: string, newPathChunk: string) => {
  return fullPath.replace(pathChunk, newPathChunk);
};

export { createPathReplacer };
