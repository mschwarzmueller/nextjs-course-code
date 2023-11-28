"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _lruCache = _interopRequireDefault(require("next/dist/compiled/lru-cache"));
var _path = _interopRequireDefault(require("../../../shared/lib/isomorphic/path"));
class FileSystemCache {
    constructor(ctx){
        this.fs = ctx.fs;
        this.flushToDisk = ctx.flushToDisk;
        this.serverDistDir = ctx.serverDistDir;
        if (ctx.maxMemoryCacheSize) {
            this.memoryCache = new _lruCache.default({
                max: ctx.maxMemoryCacheSize,
                length ({ value  }) {
                    if (!value) {
                        return 25;
                    } else if (value.kind === "REDIRECT") {
                        return JSON.stringify(value.props).length;
                    } else if (value.kind === "IMAGE") {
                        throw new Error("invariant image should not be incremental-cache");
                    }
                    // rough estimate of size of cache value
                    return value.html.length + JSON.stringify(value.pageData).length;
                }
            });
        }
    }
    async get(key) {
        var ref;
        let data = (ref = this.memoryCache) == null ? void 0 : ref.get(key);
        // let's check the disk for seed data
        if (!data) {
            try {
                var ref1;
                const htmlPath = this.getFsPath(`${key}.html`);
                const html = await this.fs.readFile(htmlPath);
                const pageData = JSON.parse(await this.fs.readFile(this.getFsPath(`${key}.json`)));
                const { mtime  } = await this.fs.stat(htmlPath);
                data = {
                    lastModified: mtime.getTime(),
                    value: {
                        kind: "PAGE",
                        html,
                        pageData
                    }
                };
                (ref1 = this.memoryCache) == null ? void 0 : ref1.set(key, data);
            } catch (_) {
            // unable to get data from disk
            }
        }
        return data || null;
    }
    async set(key, data) {
        var ref;
        if (!this.flushToDisk) return;
        (ref = this.memoryCache) == null ? void 0 : ref.set(key, {
            value: data,
            lastModified: Date.now()
        });
        if ((data == null ? void 0 : data.kind) === "PAGE") {
            const htmlPath = this.getFsPath(`${key}.html`);
            await this.fs.mkdir(_path.default.dirname(htmlPath));
            await this.fs.writeFile(htmlPath, data.html);
            await this.fs.writeFile(this.getFsPath(`${key}.json`), JSON.stringify(data.pageData));
        }
    }
    getFsPath(pathname) {
        return _path.default.join(this.serverDistDir, "pages", pathname);
    }
}
exports.default = FileSystemCache;
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

//# sourceMappingURL=file-system-cache.js.map