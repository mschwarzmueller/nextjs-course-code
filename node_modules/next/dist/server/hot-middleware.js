"use strict";exports.__esModule=true;exports.WebpackHotMiddleware=void 0;// Based on https://github.com/webpack-contrib/webpack-hot-middleware/blob/9708d781ae0e46179cf8ea1a94719de4679aaf53/middleware.js
// Included License below
// Copyright JS Foundation and other contributors
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// 'Software'), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
class WebpackHotMiddleware{constructor(compiler){this.eventStream=void 0;this.latestStats=void 0;this.closed=void 0;this.onInvalid=()=>{if(this.closed)return;this.latestStats=null;this.eventStream.publish({action:'building'});};this.onDone=statsResult=>{if(this.closed)return;// Keep hold of latest stats so they can be propagated to new clients
this.latestStats=statsResult;this.publishStats('built',this.latestStats);};this.middleware=(req,res,next)=>{var _req$url;if(this.closed)return next();if(!((_req$url=req.url)!=null&&_req$url.startsWith('/_next/webpack-hmr')))return next();this.eventStream.handler(req,res);if(this.latestStats){// Explicitly not passing in `log` fn as we don't want to log again on
// the server
this.publishStats('sync',this.latestStats);}};this.publishStats=(action,statsResult)=>{const stats=statsResult.toJson({all:false,hash:true,warnings:true,errors:true});this.eventStream.publish({action:action,hash:stats.hash,warnings:stats.warnings||[],errors:stats.errors||[]});};this.publish=payload=>{if(this.closed)return;this.eventStream.publish(payload);};this.close=()=>{if(this.closed)return;// Can't remove compiler plugins, so we just set a flag and noop if closed
// https://github.com/webpack/tapable/issues/32#issuecomment-350644466
this.closed=true;this.eventStream.close();};this.eventStream=new EventStream();this.latestStats=null;this.closed=false;compiler.hooks.invalid.tap('webpack-hot-middleware',this.onInvalid);compiler.hooks.done.tap('webpack-hot-middleware',this.onDone);}}exports.WebpackHotMiddleware=WebpackHotMiddleware;class EventStream{constructor(){this.clients=void 0;this.interval=void 0;this.heartbeatTick=()=>{this.everyClient(client=>{client.write('data: \uD83D\uDC93\n\n');});};this.clients=new Set();this.interval=setInterval(this.heartbeatTick,2500).unref();}everyClient(fn){for(const client of this.clients){fn(client);}}close(){clearInterval(this.interval);this.everyClient(client=>{if(!client.finished)client.end();});this.clients.clear();}handler(req,res){const headers={'Access-Control-Allow-Origin':'*','Content-Type':'text/event-stream;charset=utf-8','Cache-Control':'no-cache, no-transform',// While behind nginx, event stream should not be buffered:
// http://nginx.org/docs/http/ngx_http_proxy_module.html#proxy_buffering
'X-Accel-Buffering':'no'};const isHttp1=!(parseInt(req.httpVersion)>=2);if(isHttp1){req.socket.setKeepAlive(true);Object.assign(headers,{Connection:'keep-alive'});}res.writeHead(200,headers);res.write('\n');this.clients.add(res);req.on('close',()=>{if(!res.finished)res.end();this.clients.delete(res);});}publish(payload){this.everyClient(client=>{client.write('data: '+JSON.stringify(payload)+'\n\n');});}}
//# sourceMappingURL=hot-middleware.js.map