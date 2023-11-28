"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _renderResult = _interopRequireDefault(require("./render-result"));
class ResponseCache {
    constructor(incrementalCache, minimalMode){
        this.incrementalCache = incrementalCache;
        this.pendingResponses = new Map();
        this.minimalMode = minimalMode;
    }
    get(key, responseGenerator, context) {
        var ref2;
        // ensure manual revalidate doesn't block normal requests
        const pendingResponseKey = key ? `${key}-${context.isManualRevalidate ? "1" : "0"}` : null;
        const pendingResponse = pendingResponseKey ? this.pendingResponses.get(pendingResponseKey) : null;
        if (pendingResponse) {
            return pendingResponse;
        }
        let resolver = ()=>{};
        let rejecter = ()=>{};
        const promise = new Promise((resolve, reject)=>{
            resolver = resolve;
            rejecter = reject;
        });
        if (pendingResponseKey) {
            this.pendingResponses.set(pendingResponseKey, promise);
        }
        let resolved = false;
        const resolve1 = (cacheEntry)=>{
            if (pendingResponseKey) {
                // Ensure all reads from the cache get the latest value.
                this.pendingResponses.set(pendingResponseKey, Promise.resolve(cacheEntry));
            }
            if (!resolved) {
                resolved = true;
                resolver(cacheEntry);
            }
        };
        // we keep the previous cache entry around to leverage
        // when the incremental cache is disabled in minimal mode
        if (pendingResponseKey && this.minimalMode && ((ref2 = this.previousCacheItem) == null ? void 0 : ref2.key) === pendingResponseKey && this.previousCacheItem.expiresAt > Date.now()) {
            resolve1(this.previousCacheItem.entry);
            this.pendingResponses.delete(pendingResponseKey);
            return promise;
        }
        (async ()=>{
            let cachedResponse = null;
            try {
                cachedResponse = key && !this.minimalMode ? await this.incrementalCache.get(key) : null;
                if (cachedResponse && !context.isManualRevalidate) {
                    var ref;
                    resolve1({
                        isStale: cachedResponse.isStale,
                        revalidate: cachedResponse.curRevalidate,
                        value: ((ref = cachedResponse.value) == null ? void 0 : ref.kind) === "PAGE" ? {
                            kind: "PAGE",
                            html: _renderResult.default.fromStatic(cachedResponse.value.html),
                            pageData: cachedResponse.value.pageData
                        } : cachedResponse.value
                    });
                    if (!cachedResponse.isStale || context.isPrefetch) {
                        // The cached value is still valid, so we don't need
                        // to update it yet.
                        return;
                    }
                }
                const cacheEntry = await responseGenerator(resolved, !!cachedResponse);
                const resolveValue = cacheEntry === null ? null : {
                    ...cacheEntry,
                    isMiss: !cachedResponse
                };
                // for manual revalidate wait to resolve until cache is set
                if (!context.isManualRevalidate) {
                    resolve1(resolveValue);
                }
                if (key && cacheEntry && typeof cacheEntry.revalidate !== "undefined") {
                    if (this.minimalMode) {
                        this.previousCacheItem = {
                            key: pendingResponseKey || key,
                            entry: cacheEntry,
                            expiresAt: Date.now() + 1000
                        };
                    } else {
                        var ref1;
                        await this.incrementalCache.set(key, ((ref1 = cacheEntry.value) == null ? void 0 : ref1.kind) === "PAGE" ? {
                            kind: "PAGE",
                            html: cacheEntry.value.html.toUnchunkedString(),
                            pageData: cacheEntry.value.pageData
                        } : cacheEntry.value, cacheEntry.revalidate);
                    }
                } else {
                    this.previousCacheItem = undefined;
                }
                if (context.isManualRevalidate) {
                    resolve1(resolveValue);
                }
            } catch (err) {
                // when a getStaticProps path is erroring we automatically re-set the
                // existing cache under a new expiration to prevent non-stop retrying
                if (cachedResponse && key) {
                    await this.incrementalCache.set(key, cachedResponse.value, Math.min(Math.max(cachedResponse.revalidate || 3, 3), 30));
                }
                // while revalidating in the background we can't reject as
                // we already resolved the cache entry so log the error here
                if (resolved) {
                    console.error(err);
                } else {
                    rejecter(err);
                }
            } finally{
                if (pendingResponseKey) {
                    this.pendingResponses.delete(pendingResponseKey);
                }
            }
        })();
        return promise;
    }
}
exports.default = ResponseCache;
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

//# sourceMappingURL=response-cache.js.map