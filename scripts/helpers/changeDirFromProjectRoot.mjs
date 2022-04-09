import getProjectRoot from "./getProjectRoot.mjs";

const changeDirFromProjectRoot = moduleDir => cd(path.resolve(getProjectRoot(), moduleDir));

export { changeDirFromProjectRoot }
