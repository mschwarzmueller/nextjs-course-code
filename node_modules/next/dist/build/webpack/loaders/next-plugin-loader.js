"use strict";exports.__esModule=true;exports.default=exports.pluginLoaderOptions=void 0;var _querystring=require("querystring");var _collectPlugins=require("../../plugins/collect-plugins");const pluginLoaderOptions={plugins:[]};exports.pluginLoaderOptions=pluginLoaderOptions;const nextPluginLoader=function(){const{middleware}=typeof this.query==='string'?(0,_querystring.parse)(this.query.substr(1)):this.query;const plugins=pluginLoaderOptions.plugins.filter(plugin=>{return plugin.middleware.includes(middleware);});const pluginIds=[];const pluginConfigs=[];return`
    ${plugins.map(plugin=>{const pluginId=(0,_collectPlugins.getPluginId)(plugin.pkgName);pluginIds.push(pluginId);pluginConfigs.push(plugin.config||{});return`import ${pluginId} from '${plugin.directory}/src/${middleware}'`;}).join('\n')}

    export default function (ctx) {
      return Promise.all([${pluginIds.map((id,idx)=>`${id}(ctx, ${JSON.stringify(pluginConfigs[idx])})`).join(',')}])
    }
  `;};var _default=nextPluginLoader;exports.default=_default;
//# sourceMappingURL=next-plugin-loader.js.map