"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPageFromPath = getPageFromPath;
exports.createPagesMapping = createPagesMapping;
exports.getEdgeServerEntry = getEdgeServerEntry;
exports.getAppEntry = getAppEntry;
exports.getServerlessEntry = getServerlessEntry;
exports.getClientEntry = getClientEntry;
exports.createEntrypoints = createEntrypoints;
exports.runDependingOnPageType = runDependingOnPageType;
exports.finalizeEntrypoint = finalizeEntrypoint;
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _path = require("path");
var _querystring = require("querystring");
var _constants = require("../lib/constants");
var _constants1 = require("../shared/lib/constants");
var _utils = require("../server/utils");
var _log = require("./output/log");
var _utils1 = require("./utils");
var _getPageStaticInfo = require("./analysis/get-page-static-info");
var _normalizePathSep = require("../shared/lib/page-path/normalize-path-sep");
var _normalizePagePath = require("../shared/lib/page-path/normalize-page-path");
var _utils2 = require("./webpack/loaders/utils");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getPageFromPath(pagePath, pageExtensions) {
    let page = (0, _normalizePathSep).normalizePathSep(pagePath.replace(new RegExp(`\\.+(${pageExtensions.join("|")})$`), ""));
    page = page.replace(/\/index$/, "");
    return page === "" ? "/" : page;
}
function createPagesMapping({ hasServerComponents , isDev , pageExtensions , pagePaths , pagesType  }) {
    const previousPages = {};
    const pages = pagePaths.reduce((result, pagePath)=>{
        // Do not process .d.ts files inside the `pages` folder
        if (pagePath.endsWith(".d.ts") && pageExtensions.includes("ts")) {
            return result;
        }
        const pageKey = getPageFromPath(pagePath, pageExtensions);
        // Assume that if there's a Client Component, that there is
        // a matching Server Component that will map to the page.
        // so we will not process it
        if (hasServerComponents && /\.client$/.test(pageKey)) {
            return result;
        }
        if (pageKey in result) {
            (0, _log).warn(`Duplicate page detected. ${_chalk.default.cyan((0, _path).join("pages", previousPages[pageKey]))} and ${_chalk.default.cyan((0, _path).join("pages", pagePath))} both resolve to ${_chalk.default.cyan(pageKey)}.`);
        } else {
            previousPages[pageKey] = pagePath;
        }
        result[pageKey] = (0, _normalizePathSep).normalizePathSep((0, _path).join(pagesType === "pages" ? _constants.PAGES_DIR_ALIAS : pagesType === "app" ? _constants.APP_DIR_ALIAS : _constants.ROOT_DIR_ALIAS, pagePath));
        return result;
    }, {});
    if (pagesType !== "pages") {
        return pages;
    }
    if (isDev) {
        delete pages["/_app"];
        delete pages["/_error"];
        delete pages["/_document"];
    }
    // In development we always alias these to allow Webpack to fallback to
    // the correct source file so that HMR can work properly when a file is
    // added or removed.
    const root = isDev ? _constants.PAGES_DIR_ALIAS : "next/dist/pages";
    return {
        "/_app": `${root}/_app`,
        "/_error": `${root}/_error`,
        "/_document": `${root}/_document`,
        ...pages
    };
}
function getEdgeServerEntry(opts) {
    if ((0, _utils1).isMiddlewareFile(opts.page)) {
        var ref;
        const loaderParams = {
            absolutePagePath: opts.absolutePagePath,
            page: opts.page,
            // pathMatcher can have special characters that break the loader params
            // parsing so we base64 encode/decode the string
            matcherRegexp: Buffer.from(((ref = opts.middleware) == null ? void 0 : ref.pathMatcher) && opts.middleware.pathMatcher.source || "").toString("base64")
        };
        return `next-middleware-loader?${(0, _querystring).stringify(loaderParams)}!`;
    }
    if (opts.page.startsWith("/api/") || opts.page === "/api") {
        const loaderParams = {
            absolutePagePath: opts.absolutePagePath,
            page: opts.page
        };
        return `next-edge-function-loader?${(0, _querystring).stringify(loaderParams)}!`;
    }
    const loaderParams = {
        absolute500Path: opts.pages["/500"] || "",
        absoluteAppPath: opts.pages["/_app"],
        absoluteDocumentPath: opts.pages["/_document"],
        absoluteErrorPath: opts.pages["/_error"],
        absolutePagePath: opts.absolutePagePath,
        buildId: opts.buildId,
        dev: opts.isDev,
        isServerComponent: (0, _utils1).isServerComponentPage(opts.config, opts.absolutePagePath),
        page: opts.page,
        stringifiedConfig: JSON.stringify(opts.config)
    };
    return {
        import: `next-edge-ssr-loader?${(0, _querystring).stringify(loaderParams)}!`,
        layer: opts.isServerComponent ? "sc_server" : undefined
    };
}
function getAppEntry(opts) {
    return {
        import: `next-app-loader?${(0, _querystring).stringify(opts)}!`,
        layer: "sc_server"
    };
}
function getServerlessEntry(opts) {
    const loaderParams = {
        absolute404Path: opts.pages["/404"] || "",
        absoluteAppPath: opts.pages["/_app"],
        absoluteDocumentPath: opts.pages["/_document"],
        absoluteErrorPath: opts.pages["/_error"],
        absolutePagePath: opts.absolutePagePath,
        assetPrefix: opts.config.assetPrefix,
        basePath: opts.config.basePath,
        buildId: opts.buildId,
        canonicalBase: opts.config.amp.canonicalBase || "",
        distDir: _constants.DOT_NEXT_ALIAS,
        generateEtags: opts.config.generateEtags ? "true" : "",
        i18n: opts.config.i18n ? JSON.stringify(opts.config.i18n) : "",
        // base64 encode to make sure contents don't break webpack URL loading
        loadedEnvFiles: Buffer.from(JSON.stringify(opts.envFiles)).toString("base64"),
        page: opts.page,
        poweredByHeader: opts.config.poweredByHeader ? "true" : "",
        previewProps: JSON.stringify(opts.previewMode),
        runtimeConfig: Object.keys(opts.config.publicRuntimeConfig).length > 0 || Object.keys(opts.config.serverRuntimeConfig).length > 0 ? JSON.stringify({
            publicRuntimeConfig: opts.config.publicRuntimeConfig,
            serverRuntimeConfig: opts.config.serverRuntimeConfig
        }) : ""
    };
    return `next-serverless-loader?${(0, _querystring).stringify(loaderParams)}!`;
}
function getClientEntry(opts) {
    const loaderOptions = {
        absolutePagePath: opts.absolutePagePath,
        page: opts.page
    };
    const pageLoader = `next-client-pages-loader?${(0, _querystring).stringify(loaderOptions)}!`;
    // Make sure next/router is a dependency of _app or else chunk splitting
    // might cause the router to not be able to load causing hydration
    // to fail
    return opts.page === "/_app" ? [
        pageLoader,
        require.resolve("../client/router")
    ] : pageLoader;
}
async function createEntrypoints(params) {
    const { config , pages , pagesDir , isDev , rootDir , rootPaths , target , appDir , appPaths , pageExtensions ,  } = params;
    const edgeServer = {};
    const server = {};
    const client = {};
    const nestedMiddleware = [];
    let middlewareRegex = undefined;
    const getEntryHandler = (mappings, pagesType)=>{
        return async (page)=>{
            const bundleFile = (0, _normalizePagePath).normalizePagePath(page);
            const clientBundlePath = _path.posix.join(pagesType, bundleFile);
            const serverBundlePath = pagesType === "pages" ? _path.posix.join("pages", bundleFile) : pagesType === "app" ? _path.posix.join("app", bundleFile) : bundleFile.slice(1);
            const absolutePagePath = mappings[page];
            // Handle paths that have aliases
            const pageFilePath = (()=>{
                if (absolutePagePath.startsWith(_constants.PAGES_DIR_ALIAS)) {
                    return absolutePagePath.replace(_constants.PAGES_DIR_ALIAS, pagesDir);
                }
                if (absolutePagePath.startsWith(_constants.APP_DIR_ALIAS) && appDir) {
                    return absolutePagePath.replace(_constants.APP_DIR_ALIAS, appDir);
                }
                if (absolutePagePath.startsWith(_constants.ROOT_DIR_ALIAS)) {
                    return absolutePagePath.replace(_constants.ROOT_DIR_ALIAS, rootDir);
                }
                return require.resolve(absolutePagePath);
            })();
            /**
       * When we find a middleware file that is not in the ROOT_DIR we fail.
       * There is no need to check on `dev` as this should only happen when
       * building for production.
       */ if (!absolutePagePath.startsWith(_constants.ROOT_DIR_ALIAS) && /[\\\\/]_middleware$/.test(page)) {
                nestedMiddleware.push(page);
            }
            const isServerComponent = _utils2.serverComponentRegex.test(absolutePagePath);
            const isInsideAppDir = appDir && absolutePagePath.startsWith(appDir);
            const staticInfo = await (0, _getPageStaticInfo).getPageStaticInfo({
                nextConfig: config,
                pageFilePath,
                isDev,
                page
            });
            if ((0, _utils1).isMiddlewareFile(page)) {
                var ref, ref1;
                middlewareRegex = ((ref = staticInfo.middleware) == null ? void 0 : (ref1 = ref.pathMatcher) == null ? void 0 : ref1.source) || ".*";
                if (target === "serverless") {
                    throw new _utils1.MiddlewareInServerlessTargetError();
                }
            }
            runDependingOnPageType({
                page,
                pageRuntime: staticInfo.runtime,
                onClient: ()=>{
                    if (isServerComponent || isInsideAppDir) {
                    // We skip the initial entries for server component pages and let the
                    // server compiler inject them instead.
                    } else {
                        client[clientBundlePath] = getClientEntry({
                            absolutePagePath: mappings[page],
                            page
                        });
                    }
                },
                onServer: ()=>{
                    if (pagesType === "app" && appDir) {
                        server[serverBundlePath] = getAppEntry({
                            name: serverBundlePath,
                            pagePath: mappings[page],
                            appDir,
                            pageExtensions
                        });
                    } else if ((0, _utils).isTargetLikeServerless(target)) {
                        if (page !== "/_app" && page !== "/_document") {
                            server[serverBundlePath] = getServerlessEntry({
                                ...params,
                                absolutePagePath: mappings[page],
                                page
                            });
                        }
                    } else {
                        server[serverBundlePath] = isServerComponent ? {
                            import: mappings[page],
                            layer: "sc_server"
                        } : [
                            mappings[page]
                        ];
                    }
                },
                onEdgeServer: ()=>{
                    edgeServer[serverBundlePath] = getEdgeServerEntry({
                        ...params,
                        absolutePagePath: mappings[page],
                        bundlePath: clientBundlePath,
                        isDev: false,
                        isServerComponent,
                        page,
                        middleware: staticInfo == null ? void 0 : staticInfo.middleware
                    });
                }
            });
        };
    };
    if (appDir && appPaths) {
        const entryHandler = getEntryHandler(appPaths, "app");
        await Promise.all(Object.keys(appPaths).map(entryHandler));
    }
    if (rootPaths) {
        await Promise.all(Object.keys(rootPaths).map(getEntryHandler(rootPaths, "root")));
    }
    await Promise.all(Object.keys(pages).map(getEntryHandler(pages, "pages")));
    if (nestedMiddleware.length > 0) {
        throw new _utils1.NestedMiddlewareError(nestedMiddleware, rootDir, pagesDir);
    }
    return {
        client,
        server,
        edgeServer,
        middlewareRegex
    };
}
function runDependingOnPageType(params) {
    if ((0, _utils1).isMiddlewareFile(params.page)) {
        return {
            edgeServer: params.onEdgeServer()
        };
    } else if (params.page.match(_constants.API_ROUTE)) {
        return params.pageRuntime === _constants.SERVER_RUNTIME.edge ? {
            edgeServer: params.onEdgeServer()
        } : {
            server: params.onServer()
        };
    } else if (params.page === "/_document") {
        return {
            server: params.onServer()
        };
    } else if (params.page === "/_app" || params.page === "/_error" || params.page === "/404" || params.page === "/500") {
        return {
            client: params.onClient(),
            server: params.onServer()
        };
    } else {
        return params.pageRuntime === _constants.SERVER_RUNTIME.edge ? {
            client: params.onClient(),
            edgeServer: params.onEdgeServer()
        } : {
            client: params.onClient(),
            server: params.onServer()
        };
    }
}
function finalizeEntrypoint({ name , compilerType , value , isServerComponent , appDir  }) {
    const entry = typeof value !== "object" || Array.isArray(value) ? {
        import: value
    } : value;
    const isApi = name.startsWith("pages/api/");
    if (compilerType === "server") {
        return {
            publicPath: isApi ? "" : undefined,
            runtime: isApi ? "webpack-api-runtime" : "webpack-runtime",
            layer: isApi ? "api" : isServerComponent ? "sc_server" : undefined,
            ...entry
        };
    }
    if (compilerType === "edge-server") {
        return {
            layer: (0, _utils1).isMiddlewareFilename(name) || isApi ? "middleware" : undefined,
            library: {
                name: [
                    "_ENTRIES",
                    `middleware_[name]`
                ],
                type: "assign"
            },
            runtime: _constants1.EDGE_RUNTIME_WEBPACK,
            asyncChunks: false,
            ...entry
        };
    }
    if (// Client special cases
    name !== "polyfills" && name !== _constants1.CLIENT_STATIC_FILES_RUNTIME_MAIN && name !== _constants1.CLIENT_STATIC_FILES_RUNTIME_MAIN_ROOT && name !== _constants1.CLIENT_STATIC_FILES_RUNTIME_AMP && name !== _constants1.CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH) {
        // TODO-APP: this is a temporary fix. @shuding is going to change the handling of server components
        if (appDir && entry.import.includes("flight")) {
            return {
                dependOn: _constants1.CLIENT_STATIC_FILES_RUNTIME_MAIN_ROOT,
                ...entry
            };
        }
        return {
            dependOn: name.startsWith("pages/") && name !== "pages/_app" ? "pages/_app" : _constants1.CLIENT_STATIC_FILES_RUNTIME_MAIN,
            ...entry
        };
    }
    return entry;
}

//# sourceMappingURL=entries.js.map