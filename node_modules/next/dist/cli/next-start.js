#!/usr/bin/env node
"use strict";exports.__esModule=true;exports.nextStart=void 0;var _path=require("path");var _index=_interopRequireDefault(require("next/dist/compiled/arg/index.js"));var _startServer=_interopRequireDefault(require("../server/lib/start-server"));var _utils=require("../server/lib/utils");var Log=_interopRequireWildcard(require("../build/output/log"));function _getRequireWildcardCache(){if(typeof WeakMap!=="function")return null;var cache=new WeakMap();_getRequireWildcardCache=function(){return cache;};return cache;}function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}if(obj===null||typeof obj!=="object"&&typeof obj!=="function"){return{default:obj};}var cache=_getRequireWildcardCache();if(cache&&cache.has(obj)){return cache.get(obj);}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc);}else{newObj[key]=obj[key];}}}newObj.default=obj;if(cache){cache.set(obj,newObj);}return newObj;}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const nextStart=argv=>{const validArgs={// Types
'--help':Boolean,'--port':Number,'--hostname':String,// Aliases
'-h':'--help','-p':'--port','-H':'--hostname'};let args;try{args=(0,_index.default)(validArgs,{argv});}catch(error){if(error.code==='ARG_UNKNOWN_OPTION'){return(0,_utils.printAndExit)(error.message,1);}throw error;}if(args['--help']){console.log(`
      Description
        Starts the application in production mode.
        The application should be compiled with \`next build\` first.

      Usage
        $ next start <dir> -p <port>

      <dir> represents the directory of the Next.js application.
      If no directory is provided, the current directory will be used.

      Options
        --port, -p      A port number on which to start the application
        --hostname, -H  Hostname on which to start the application (default: 0.0.0.0)
        --help, -h      Displays this message
    `);process.exit(0);}const dir=(0,_path.resolve)(args._[0]||'.');const port=args['--port']||3000;const host=args['--hostname']||'0.0.0.0';const appUrl=`http://${host==='0.0.0.0'?'localhost':host}:${port}`;(0,_startServer.default)({dir},port,host).then(async app=>{Log.ready(`started server on ${host}:${port}, url: ${appUrl}`);await app.prepare();}).catch(err=>{console.error(err);process.exit(1);});};exports.nextStart=nextStart;
//# sourceMappingURL=next-start.js.map