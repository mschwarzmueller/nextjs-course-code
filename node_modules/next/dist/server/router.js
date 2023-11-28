"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _requestMeta = require("./request-meta");
var _pathMatch = require("../shared/lib/router/utils/path-match");
var _removeTrailingSlash = require("../shared/lib/router/utils/remove-trailing-slash");
var _normalizeLocalePath = require("../shared/lib/i18n/normalize-locale-path");
var _prepareDestination = require("../shared/lib/router/utils/prepare-destination");
var _removePathPrefix = require("../shared/lib/router/utils/remove-path-prefix");
var _formatNextPathnameInfo = require("../shared/lib/router/utils/format-next-pathname-info");
var _getNextPathnameInfo = require("../shared/lib/router/utils/get-next-pathname-info");
class Router {
    constructor({ headers =[] , fsRoutes =[] , rewrites ={
        beforeFiles: [],
        afterFiles: [],
        fallback: []
    } , redirects =[] , catchAllRoute , catchAllMiddleware =[] , dynamicRoutes =[] , pageChecker , useFileSystemPublicRoutes , nextConfig  }){
        this.nextConfig = nextConfig;
        this.headers = headers;
        this.fsRoutes = fsRoutes;
        this.rewrites = rewrites;
        this.redirects = redirects;
        this.pageChecker = pageChecker;
        this.catchAllRoute = catchAllRoute;
        this.catchAllMiddleware = catchAllMiddleware;
        this.dynamicRoutes = dynamicRoutes;
        this.useFileSystemPublicRoutes = useFileSystemPublicRoutes;
        this.seenRequests = new Set();
    }
    get locales() {
        var ref;
        return ((ref = this.nextConfig.i18n) == null ? void 0 : ref.locales) || [];
    }
    get basePath() {
        return this.nextConfig.basePath || "";
    }
    setDynamicRoutes(routes = []) {
        this.dynamicRoutes = routes;
    }
    setCatchallMiddleware(route) {
        this.catchAllMiddleware = route || [];
    }
    addFsRoute(fsRoute) {
        this.fsRoutes.unshift(fsRoute);
    }
    async execute(req, res, parsedUrl) {
        if (this.seenRequests.has(req)) {
            throw new Error(`Invariant: request has already been processed: ${req.url}, this is an internal error please open an issue.`);
        }
        this.seenRequests.add(req);
        try {
            // memoize page check calls so we don't duplicate checks for pages
            const pageChecks = {};
            const memoizedPageChecker = async (p)=>{
                p = (0, _normalizeLocalePath).normalizeLocalePath(p, this.locales).pathname;
                if (pageChecks[p] !== undefined) {
                    return pageChecks[p];
                }
                const result = this.pageChecker(p);
                pageChecks[p] = result;
                return result;
            };
            let parsedUrlUpdated = parsedUrl;
            const applyCheckTrue = async (checkParsedUrl)=>{
                const originalFsPathname = checkParsedUrl.pathname;
                const fsPathname = (0, _removePathPrefix).removePathPrefix(originalFsPathname, this.basePath);
                for (const fsRoute of this.fsRoutes){
                    const fsParams = fsRoute.match(fsPathname);
                    if (fsParams) {
                        checkParsedUrl.pathname = fsPathname;
                        const fsResult = await fsRoute.fn(req, res, fsParams, checkParsedUrl);
                        if (fsResult.finished) {
                            return true;
                        }
                        checkParsedUrl.pathname = originalFsPathname;
                    }
                }
                let matchedPage = await memoizedPageChecker(fsPathname);
                // If we didn't match a page check dynamic routes
                if (!matchedPage) {
                    const normalizedFsPathname = (0, _normalizeLocalePath).normalizeLocalePath(fsPathname, this.locales).pathname;
                    for (const dynamicRoute of this.dynamicRoutes){
                        if (dynamicRoute.match(normalizedFsPathname)) {
                            matchedPage = true;
                        }
                    }
                }
                // Matched a page or dynamic route so render it using catchAllRoute
                if (matchedPage) {
                    const pageParams = this.catchAllRoute.match(checkParsedUrl.pathname);
                    checkParsedUrl.pathname = fsPathname;
                    checkParsedUrl.query._nextBubbleNoFallback = "1";
                    const result = await this.catchAllRoute.fn(req, res, pageParams, checkParsedUrl);
                    return result.finished;
                }
            };
            /*
        Desired routes order
        - headers
        - redirects
        - Check filesystem (including pages), if nothing found continue
        - User rewrites (checking filesystem and pages each match)
      */ const [middlewareCatchAllRoute, edgeSSRCatchAllRoute] = this.catchAllMiddleware;
            const allRoutes = [
                ...middlewareCatchAllRoute ? this.fsRoutes.filter((r)=>r.name === "_next/data catchall") : [],
                ...this.headers,
                ...this.redirects,
                ...this.useFileSystemPublicRoutes && middlewareCatchAllRoute ? [
                    middlewareCatchAllRoute
                ] : [],
                ...this.rewrites.beforeFiles,
                ...this.fsRoutes,
                // We only check the catch-all route if public page routes hasn't been
                // disabled
                ...this.useFileSystemPublicRoutes ? [
                    ...edgeSSRCatchAllRoute ? [
                        edgeSSRCatchAllRoute
                    ] : [],
                    {
                        type: "route",
                        name: "page checker",
                        match: (0, _pathMatch).getPathMatch("/:path*"),
                        fn: async (checkerReq, checkerRes, params, parsedCheckerUrl)=>{
                            let { pathname  } = parsedCheckerUrl;
                            pathname = (0, _removeTrailingSlash).removeTrailingSlash(pathname || "/");
                            if (!pathname) {
                                return {
                                    finished: false
                                };
                            }
                            if (await memoizedPageChecker(pathname)) {
                                return this.catchAllRoute.fn(checkerReq, checkerRes, params, parsedCheckerUrl);
                            }
                            return {
                                finished: false
                            };
                        }
                    }, 
                ] : [],
                ...this.rewrites.afterFiles,
                ...this.rewrites.fallback.length ? [
                    {
                        type: "route",
                        name: "dynamic route/page check",
                        match: (0, _pathMatch).getPathMatch("/:path*"),
                        fn: async (_checkerReq, _checkerRes, _params, parsedCheckerUrl)=>{
                            return {
                                finished: await applyCheckTrue(parsedCheckerUrl)
                            };
                        }
                    },
                    ...this.rewrites.fallback, 
                ] : [],
                // We only check the catch-all route if public page routes hasn't been
                // disabled
                ...this.useFileSystemPublicRoutes ? [
                    ...edgeSSRCatchAllRoute ? [
                        edgeSSRCatchAllRoute
                    ] : [],
                    this.catchAllRoute, 
                ] : [], 
            ];
            for (const testRoute of allRoutes){
                var ref;
                const originalPathname = parsedUrlUpdated.pathname;
                const pathnameInfo = (0, _getNextPathnameInfo).getNextPathnameInfo(originalPathname, {
                    nextConfig: this.nextConfig,
                    parseData: false
                });
                if (pathnameInfo.locale && !testRoute.matchesLocaleAPIRoutes && pathnameInfo.pathname.match(/^\/api(?:\/|$)/)) {
                    continue;
                }
                if ((0, _requestMeta).getRequestMeta(req, "_nextHadBasePath")) {
                    pathnameInfo.basePath = this.basePath;
                }
                const basePath = pathnameInfo.basePath;
                if (!testRoute.matchesBasePath) {
                    pathnameInfo.basePath = "";
                }
                if (testRoute.matchesLocale && parsedUrl.query.__nextLocale && !pathnameInfo.locale) {
                    pathnameInfo.locale = parsedUrl.query.__nextLocale;
                }
                if (!testRoute.matchesLocale && pathnameInfo.locale === ((ref = this.nextConfig.i18n) == null ? void 0 : ref.defaultLocale) && pathnameInfo.locale) {
                    pathnameInfo.locale = undefined;
                }
                if (testRoute.matchesTrailingSlash && (0, _requestMeta).getRequestMeta(req, "__nextHadTrailingSlash")) {
                    pathnameInfo.trailingSlash = true;
                }
                const matchPathname = (0, _formatNextPathnameInfo).formatNextPathnameInfo({
                    ignorePrefix: true,
                    ...pathnameInfo
                });
                let newParams = testRoute.match(matchPathname);
                if (testRoute.has && newParams) {
                    const hasParams = (0, _prepareDestination).matchHas(req, testRoute.has, parsedUrlUpdated.query);
                    if (hasParams) {
                        Object.assign(newParams, hasParams);
                    } else {
                        newParams = false;
                    }
                }
                /**
         * If it is a matcher that doesn't match the basePath (like the public
         * directory) but Next.js is configured to use a basePath that was
         * never there, we consider this an invalid match and keep routing.
         */ if (newParams && this.basePath && !testRoute.matchesBasePath && !(0, _requestMeta).getRequestMeta(req, "_nextDidRewrite") && !basePath) {
                    continue;
                }
                if (newParams) {
                    parsedUrlUpdated.pathname = matchPathname;
                    const result = await testRoute.fn(req, res, newParams, parsedUrlUpdated);
                    if (result.finished) {
                        return true;
                    }
                    // since the fs route didn't finish routing we need to re-add the
                    // basePath to continue checking with the basePath present
                    parsedUrlUpdated.pathname = originalPathname;
                    if (result.pathname) {
                        parsedUrlUpdated.pathname = result.pathname;
                    }
                    if (result.query) {
                        parsedUrlUpdated.query = {
                            ...(0, _requestMeta).getNextInternalQuery(parsedUrlUpdated.query),
                            ...result.query
                        };
                    }
                    // check filesystem
                    if (testRoute.check === true) {
                        if (await applyCheckTrue(parsedUrlUpdated)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        } finally{
            this.seenRequests.delete(req);
        }
    }
}
exports.default = Router;

//# sourceMappingURL=router.js.map