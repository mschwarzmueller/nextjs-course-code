"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadDefaultErrorComponents = loadDefaultErrorComponents;
exports.loadComponents = loadComponents;
var _constants = require("../shared/lib/constants");
var _path = require("path");
var _require = require("./require");
var _interopDefault = require("../lib/interop-default");
var _normalizePagePath = require("../shared/lib/page-path/normalize-page-path");
async function loadDefaultErrorComponents(distDir) {
    const Document = (0, _interopDefault).interopDefault(require("next/dist/pages/_document"));
    const AppMod = require("next/dist/pages/_app");
    const App = (0, _interopDefault).interopDefault(AppMod);
    const ComponentMod = require("next/dist/pages/_error");
    const Component = (0, _interopDefault).interopDefault(ComponentMod);
    return {
        App,
        Document,
        Component,
        pageConfig: {},
        buildManifest: require((0, _path).join(distDir, `fallback-${_constants.BUILD_MANIFEST}`)),
        reactLoadableManifest: {},
        ComponentMod
    };
}
async function loadComponents(distDir, pathname, serverless, hasServerComponents, appDirEnabled) {
    if (serverless) {
        const ComponentMod = await (0, _require).requirePage(pathname, distDir, serverless);
        if (typeof ComponentMod === "string") {
            return {
                Component: ComponentMod,
                pageConfig: {},
                ComponentMod
            };
        }
        let { default: Component , getStaticProps , getStaticPaths , getServerSideProps ,  } = ComponentMod;
        Component = await Component;
        getStaticProps = await getStaticProps;
        getStaticPaths = await getStaticPaths;
        getServerSideProps = await getServerSideProps;
        const pageConfig = await ComponentMod.config || {};
        return {
            Component,
            pageConfig,
            getStaticProps,
            getStaticPaths,
            getServerSideProps,
            ComponentMod
        };
    }
    const [DocumentMod, AppMod, ComponentMod] = await Promise.all([
        Promise.resolve().then(()=>(0, _require).requirePage("/_document", distDir, serverless, appDirEnabled)),
        Promise.resolve().then(()=>(0, _require).requirePage("/_app", distDir, serverless, appDirEnabled)),
        Promise.resolve().then(()=>(0, _require).requirePage(pathname, distDir, serverless, appDirEnabled)), 
    ]);
    const [buildManifest, reactLoadableManifest, serverComponentManifest] = await Promise.all([
        require((0, _path).join(distDir, _constants.BUILD_MANIFEST)),
        require((0, _path).join(distDir, _constants.REACT_LOADABLE_MANIFEST)),
        hasServerComponents ? require((0, _path).join(distDir, "server", _constants.FLIGHT_MANIFEST + ".json")) : null, 
    ]);
    if (hasServerComponents) {
        try {
            // Make sure to also load the client entry in cache.
            const __client__ = await (0, _require).requirePage((0, _normalizePagePath).normalizePagePath(pathname) + _constants.NEXT_CLIENT_SSR_ENTRY_SUFFIX, distDir, serverless, appDirEnabled);
            ComponentMod.__client__ = __client__;
        } catch (_) {
        // This page might not be a server component page, so there is no
        // client entry to load.
        }
    }
    const Component = (0, _interopDefault).interopDefault(ComponentMod);
    const Document = (0, _interopDefault).interopDefault(DocumentMod);
    const App = (0, _interopDefault).interopDefault(AppMod);
    const { getServerSideProps , getStaticProps , getStaticPaths  } = ComponentMod;
    let isAppPath = false;
    if (appDirEnabled) {
        const pagePath = (0, _require).getPagePath(pathname, distDir, serverless, false, undefined, appDirEnabled);
        isAppPath = !!(pagePath == null ? void 0 : pagePath.match(/server[/\\]app[/\\]/));
    }
    return {
        App,
        Document,
        Component,
        buildManifest,
        reactLoadableManifest,
        pageConfig: ComponentMod.config || {},
        ComponentMod,
        getServerSideProps,
        getStaticProps,
        getStaticPaths,
        serverComponentManifest,
        isAppPath
    };
}

//# sourceMappingURL=load-components.js.map