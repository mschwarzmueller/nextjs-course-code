"use strict";exports.__esModule=true;exports.default=void 0;var _devalue=_interopRequireDefault(require("next/dist/compiled/devalue"));var _escapeStringRegexp=_interopRequireDefault(require("next/dist/compiled/escape-string-regexp"));var _path=require("path");var _querystring=require("querystring");var _constants=require("../../../../lib/constants");var _utils=require("../../../../next-server/lib/router/utils");var _constants2=require("../../../../next-server/lib/constants");var _tracer=require("../../../tracer");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const nextServerlessLoader=function(){const span=_tracer.tracer.startSpan('next-serverless-loader');return(0,_tracer.traceFn)(span,()=>{const{distDir,absolutePagePath,page,buildId,canonicalBase,assetPrefix,absoluteAppPath,absoluteDocumentPath,absoluteErrorPath,absolute404Path,generateEtags,poweredByHeader,basePath,runtimeConfig,previewProps,loadedEnvFiles,i18n}=typeof this.query==='string'?(0,_querystring.parse)(this.query.substr(1)):this.query;const buildManifest=(0,_path.join)(distDir,_constants2.BUILD_MANIFEST).replace(/\\/g,'/');const reactLoadableManifest=(0,_path.join)(distDir,_constants2.REACT_LOADABLE_MANIFEST).replace(/\\/g,'/');const routesManifest=(0,_path.join)(distDir,_constants2.ROUTES_MANIFEST).replace(/\\/g,'/');const escapedBuildId=(0,_escapeStringRegexp.default)(buildId);const pageIsDynamicRoute=(0,_utils.isDynamicRoute)(page);const encodedPreviewProps=(0,_devalue.default)(JSON.parse(previewProps));const envLoading=`
      const { processEnv } = require('@next/env')
      processEnv(${Buffer.from(loadedEnvFiles,'base64').toString()})
    `;const runtimeConfigImports=runtimeConfig?`
        const { setConfig } = require('next/config')
      `:'';const runtimeConfigSetter=runtimeConfig?`
        const runtimeConfig = ${runtimeConfig}
        setConfig(runtimeConfig)
      `:'const runtimeConfig = {}';if(page.match(_constants.API_ROUTE)){return`
        ${envLoading}
        ${runtimeConfigImports}
        ${/*
            this needs to be called first so its available for any other imports
          */runtimeConfigSetter}
        import initServer from 'next-plugin-loader?middleware=on-init-server!'
        import onError from 'next-plugin-loader?middleware=on-error-server!'
        import 'next/dist/next-server/server/node-polyfill-fetch'
        import routesManifest from '${routesManifest}'
  
        import { getApiHandler } from 'next/dist/build/webpack/loaders/next-serverless-loader/api-handler'
  
        const apiHandler = getApiHandler({
          pageModule: require("${absolutePagePath}"),
          rewrites: routesManifest.rewrites,
          i18n: ${i18n||'undefined'},
          page: "${page}",
          basePath: "${basePath}",
          pageIsDynamic: ${pageIsDynamicRoute},
          encodedPreviewProps: ${encodedPreviewProps},
          experimental: {
            onError,
            initServer,
          }
        })
        export default apiHandler
      `;}else{return`
      import initServer from 'next-plugin-loader?middleware=on-init-server!'
      import onError from 'next-plugin-loader?middleware=on-error-server!'
      import 'next/dist/next-server/server/node-polyfill-fetch'
      import routesManifest from '${routesManifest}'
      import buildManifest from '${buildManifest}'
      import reactLoadableManifest from '${reactLoadableManifest}'
  
      ${envLoading}
      ${runtimeConfigImports}
      ${// this needs to be called first so its available for any other imports
runtimeConfigSetter}
      import { getPageHandler } from 'next/dist/build/webpack/loaders/next-serverless-loader/page-handler'
  
      const appMod = require('${absoluteAppPath}')
      let App = appMod.default || appMod.then && appMod.then(mod => mod.default);
  
      const compMod = require('${absolutePagePath}')
  
      const Component = compMod.default || compMod.then && compMod.then(mod => mod.default)
      export default Component
      export const getStaticProps = compMod['getStaticProp' + 's'] || compMod.then && compMod.then(mod => mod['getStaticProp' + 's'])
      export const getStaticPaths = compMod['getStaticPath' + 's'] || compMod.then && compMod.then(mod => mod['getStaticPath' + 's'])
      export const getServerSideProps = compMod['getServerSideProp' + 's'] || compMod.then && compMod.then(mod => mod['getServerSideProp' + 's'])
  
      // kept for detecting legacy exports
      export const unstable_getStaticParams = compMod['unstable_getStaticParam' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getStaticParam' + 's'])
      export const unstable_getStaticProps = compMod['unstable_getStaticProp' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getStaticProp' + 's'])
      export const unstable_getStaticPaths = compMod['unstable_getStaticPath' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getStaticPath' + 's'])
      export const unstable_getServerProps = compMod['unstable_getServerProp' + 's'] || compMod.then && compMod.then(mod => mod['unstable_getServerProp' + 's'])
  
      export let config = compMod['confi' + 'g'] || (compMod.then && compMod.then(mod => mod['confi' + 'g'])) || {}
      export const _app = App
  
      const { renderReqToHTML, render } = getPageHandler({
        pageModule: compMod,
        pageComponent: Component,
        pageConfig: config,
        appModule: App,
        documentModule: require("${absoluteDocumentPath}"),
        errorModule: require("${absoluteErrorPath}"),
        notFoundModule: ${absolute404Path?`require("${absolute404Path}")`:undefined},
        pageGetStaticProps: getStaticProps,
        pageGetStaticPaths: getStaticPaths,
        pageGetServerSideProps: getServerSideProps,
  
        assetPrefix: "${assetPrefix}",
        canonicalBase: "${canonicalBase}",
        generateEtags: ${generateEtags||'false'},
        poweredByHeader: ${poweredByHeader||'false'},
  
        runtimeConfig,
        buildManifest,
        reactLoadableManifest,
  
        rewrites: routesManifest.rewrites,
        i18n: ${i18n||'undefined'},
        page: "${page}",
        buildId: "${buildId}",
        escapedBuildId: "${escapedBuildId}",
        basePath: "${basePath}",
        pageIsDynamic: ${pageIsDynamicRoute},
        encodedPreviewProps: ${encodedPreviewProps},
        experimental: {
          onError,
          initServer,
        }
      })
      export { renderReqToHTML, render }
    `;}});};var _default=nextServerlessLoader;exports.default=_default;
//# sourceMappingURL=index.js.map