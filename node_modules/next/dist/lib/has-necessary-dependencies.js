"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasNecessaryDependencies = hasNecessaryDependencies;
var _fs = require("fs");
var _path = require("path");
async function hasNecessaryDependencies(baseDir, requiredPackages) {
    let resolutions = new Map();
    const missingPackages = requiredPackages.filter((p)=>{
        try {
            if (p.exportsRestrict) {
                const pkgPath = require.resolve(`${p.pkg}/package.json`, {
                    paths: [
                        baseDir
                    ]
                });
                const fileNameToVerify = (0, _path).relative(p.pkg, p.file);
                if (fileNameToVerify) {
                    const fileToVerify = (0, _path).join(pkgPath, "..", fileNameToVerify);
                    if ((0, _fs).existsSync(fileToVerify)) {
                        resolutions.set(p.pkg, (0, _path).join(pkgPath, ".."));
                    } else {
                        return true;
                    }
                } else {
                    resolutions.set(p.pkg, pkgPath);
                }
            } else {
                resolutions.set(p.pkg, require.resolve(p.file, {
                    paths: [
                        baseDir
                    ]
                }));
            }
            return false;
        } catch (_) {
            return true;
        }
    });
    return {
        resolved: resolutions,
        missing: missingPackages
    };
}

//# sourceMappingURL=has-necessary-dependencies.js.map