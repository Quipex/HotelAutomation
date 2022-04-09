#!/usr/bin/env zx
import 'zx/globals';
import { quiet } from "zx";
import { EOL_REGEX } from "./constants/textFileRegex.mjs";
import { MODULE_DIRECTORIES } from "./constants/moduleDirectoryNames.mjs";
import { changeDirFromProjectRoot } from "./helpers/changeDirFromProjectRoot.mjs";
import groupBy from "./helpers/array/groupBy.mjs";

const filePathsOutput = await quiet($`git diff --diff-filter=d --cached --name-only | grep -E '\\.(ts|tsx|js|jsx)$' || [[ $? == 1 ]]`);

const filePaths = filePathsOutput.stdout.split(EOL_REGEX).filter(p => p);

const getDirName = fp => MODULE_DIRECTORIES.find(dirname => fp.startsWith(dirname)) ?? ''
const filePathsByDirNames = groupBy(filePaths, getDirName);

let currentDir = '';
changeDirFromProjectRoot(currentDir);

const moduleDirs = Object.keys(filePathsByDirNames);

for (let moduleDir of moduleDirs) {
  let filePaths = filePathsByDirNames[moduleDir];
  if (moduleDir !== currentDir) {
    changeDirFromProjectRoot(moduleDir);
    currentDir = moduleDir;
  }
  if (moduleDir.length) {
    filePaths = filePaths.map(fp => fp.substring(moduleDir.length + 1));
  }
  await $`npx eslint --fix ${filePaths}`
}
