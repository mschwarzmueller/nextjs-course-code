"use strict";exports.__esModule=true;exports.recursiveReadDir=recursiveReadDir;var _fs=require("fs");var _path=require("path");/**
 * Recursively read directory
 * @param  {string} dir Directory to read
 * @param  {RegExp} filter Filter for the file name, only the name part is considered, not the full path
 * @param  {string[]=[]} arr This doesn't have to be provided, it's used for the recursion
 * @param  {string=dir`} rootDir Used to replace the initial path, only the relative path is left, it's faster than path.relative.
 * @returns Promise array holding all relative paths
 */async function recursiveReadDir(dir,filter,ignore,arr=[],rootDir=dir){const result=await _fs.promises.readdir(dir);await Promise.all(result.map(async part=>{const absolutePath=(0,_path.join)(dir,part);if(ignore&&ignore.test(part))return;const pathStat=await _fs.promises.stat(absolutePath);if(pathStat.isDirectory()){await recursiveReadDir(absolutePath,filter,ignore,arr,rootDir);return;}if(!filter.test(part)){return;}arr.push(absolutePath.replace(rootDir,''));}));return arr.sort();}
//# sourceMappingURL=recursive-readdir.js.map