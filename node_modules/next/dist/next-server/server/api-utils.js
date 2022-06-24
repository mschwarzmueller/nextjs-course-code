"use strict";exports.__esModule=true;exports.apiResolver=apiResolver;exports.parseBody=parseBody;exports.getCookieParser=getCookieParser;exports.sendStatusCode=sendStatusCode;exports.redirect=redirect;exports.sendData=sendData;exports.sendJson=sendJson;exports.tryGetPreviewData=tryGetPreviewData;exports.sendError=sendError;exports.setLazyProp=setLazyProp;exports.ApiError=exports.SYMBOL_PREVIEW_DATA=void 0;var _contentType=require("next/dist/compiled/content-type");var _rawBody=_interopRequireDefault(require("raw-body"));var _stream=require("stream");var _utils=require("../lib/utils");var _cryptoUtils=require("./crypto-utils");var _loadComponents=require("./load-components");var _sendPayload=require("./send-payload");var _etag=_interopRequireDefault(require("etag"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}async function apiResolver(req,res,query,resolverModule,apiContext,propagateError,onError){const apiReq=req;const apiRes=res;try{var _config$api,_config$api2;if(!resolverModule){res.statusCode=404;res.end('Not Found');return;}const config=resolverModule.config||{};const bodyParser=((_config$api=config.api)==null?void 0:_config$api.bodyParser)!==false;const externalResolver=((_config$api2=config.api)==null?void 0:_config$api2.externalResolver)||false;// Parsing of cookies
setLazyProp({req:apiReq},'cookies',getCookieParser(req));// Parsing query string
apiReq.query=query;// Parsing preview data
setLazyProp({req:apiReq},'previewData',()=>tryGetPreviewData(req,res,apiContext));// Checking if preview mode is enabled
setLazyProp({req:apiReq},'preview',()=>apiReq.previewData!==false?true:undefined);// Parsing of body
if(bodyParser&&!apiReq.body){apiReq.body=await parseBody(apiReq,config.api&&config.api.bodyParser&&config.api.bodyParser.sizeLimit?config.api.bodyParser.sizeLimit:'1mb');}apiRes.status=statusCode=>sendStatusCode(apiRes,statusCode);apiRes.send=data=>sendData(apiReq,apiRes,data);apiRes.json=data=>sendJson(apiRes,data);apiRes.redirect=(statusOrUrl,url)=>redirect(apiRes,statusOrUrl,url);apiRes.setPreviewData=(data,options={})=>setPreviewData(apiRes,data,Object.assign({},apiContext,options));apiRes.clearPreviewData=()=>clearPreviewData(apiRes);const resolver=(0,_loadComponents.interopDefault)(resolverModule);let wasPiped=false;if(process.env.NODE_ENV!=='production'){// listen for pipe event and don't show resolve warning
res.once('pipe',()=>wasPiped=true);}// Call API route method
await resolver(req,res);if(process.env.NODE_ENV!=='production'&&!externalResolver&&!(0,_utils.isResSent)(res)&&!wasPiped){console.warn(`API resolved without sending a response for ${req.url}, this may result in stalled requests.`);}}catch(err){if(err instanceof ApiError){sendError(apiRes,err.statusCode,err.message);}else{console.error(err);if(onError)await onError({err});if(propagateError){throw err;}sendError(apiRes,500,'Internal Server Error');}}}/**
 * Parse incoming message like `json` or `urlencoded`
 * @param req request object
 */async function parseBody(req,limit){const contentType=(0,_contentType.parse)(req.headers['content-type']||'text/plain');const{type,parameters}=contentType;const encoding=parameters.charset||'utf-8';let buffer;try{buffer=await(0,_rawBody.default)(req,{encoding,limit});}catch(e){if(e.type==='entity.too.large'){throw new ApiError(413,`Body exceeded ${limit} limit`);}else{throw new ApiError(400,'Invalid body');}}const body=buffer.toString();if(type==='application/json'||type==='application/ld+json'){return parseJson(body);}else if(type==='application/x-www-form-urlencoded'){const qs=require('querystring');return qs.decode(body);}else{return body;}}/**
 * Parse `JSON` and handles invalid `JSON` strings
 * @param str `JSON` string
 */function parseJson(str){if(str.length===0){// special-case empty json body, as it's a common client-side mistake
return{};}try{return JSON.parse(str);}catch(e){throw new ApiError(400,'Invalid JSON');}}/**
 * Parse cookies from `req` header
 * @param req request object
 */function getCookieParser(req){return function parseCookie(){const header=req.headers.cookie;if(!header){return{};}const{parse:parseCookieFn}=require('next/dist/compiled/cookie');return parseCookieFn(Array.isArray(header)?header.join(';'):header);};}/**
 *
 * @param res response object
 * @param statusCode `HTTP` status code of response
 */function sendStatusCode(res,statusCode){res.statusCode=statusCode;return res;}/**
 *
 * @param res response object
 * @param [statusOrUrl] `HTTP` status code of redirect
 * @param url URL of redirect
 */function redirect(res,statusOrUrl,url){if(typeof statusOrUrl==='string'){url=statusOrUrl;statusOrUrl=307;}if(typeof statusOrUrl!=='number'||typeof url!=='string'){throw new Error(`Invalid redirect arguments. Please use a single argument URL, e.g. res.redirect('/destination') or use a status code and URL, e.g. res.redirect(307, '/destination').`);}res.writeHead(statusOrUrl,{Location:url});res.write('');res.end();return res;}/**
 * Send `any` body to response
 * @param req request object
 * @param res response object
 * @param body of response
 */function sendData(req,res,body){if(body===null||body===undefined){res.end();return;}const contentType=res.getHeader('Content-Type');if(body instanceof _stream.Stream){if(!contentType){res.setHeader('Content-Type','application/octet-stream');}body.pipe(res);return;}const isJSONLike=['object','number','boolean'].includes(typeof body);const stringifiedBody=isJSONLike?JSON.stringify(body):body;const etag=(0,_etag.default)(stringifiedBody);if((0,_sendPayload.sendEtagResponse)(req,res,etag)){return;}if(Buffer.isBuffer(body)){if(!contentType){res.setHeader('Content-Type','application/octet-stream');}res.setHeader('Content-Length',body.length);res.end(body);return;}if(isJSONLike){res.setHeader('Content-Type','application/json; charset=utf-8');}res.setHeader('Content-Length',Buffer.byteLength(stringifiedBody));res.end(stringifiedBody);}/**
 * Send `JSON` object
 * @param res response object
 * @param jsonBody of data
 */function sendJson(res,jsonBody){// Set header to application/json
res.setHeader('Content-Type','application/json; charset=utf-8');// Use send to handle request
res.send(jsonBody);}const COOKIE_NAME_PRERENDER_BYPASS=`__prerender_bypass`;const COOKIE_NAME_PRERENDER_DATA=`__next_preview_data`;const SYMBOL_PREVIEW_DATA=Symbol(COOKIE_NAME_PRERENDER_DATA);exports.SYMBOL_PREVIEW_DATA=SYMBOL_PREVIEW_DATA;const SYMBOL_CLEARED_COOKIES=Symbol(COOKIE_NAME_PRERENDER_BYPASS);function tryGetPreviewData(req,res,options){// Read cached preview data if present
if(SYMBOL_PREVIEW_DATA in req){return req[SYMBOL_PREVIEW_DATA];}const getCookies=getCookieParser(req);let cookies;try{cookies=getCookies();}catch(_unused){// TODO: warn
return false;}const hasBypass=(COOKIE_NAME_PRERENDER_BYPASS in cookies);const hasData=(COOKIE_NAME_PRERENDER_DATA in cookies);// Case: neither cookie is set.
if(!(hasBypass||hasData)){return false;}// Case: one cookie is set, but not the other.
if(hasBypass!==hasData){clearPreviewData(res);return false;}// Case: preview session is for an old build.
if(cookies[COOKIE_NAME_PRERENDER_BYPASS]!==options.previewModeId){clearPreviewData(res);return false;}const tokenPreviewData=cookies[COOKIE_NAME_PRERENDER_DATA];const jsonwebtoken=require('next/dist/compiled/jsonwebtoken');let encryptedPreviewData;try{encryptedPreviewData=jsonwebtoken.verify(tokenPreviewData,options.previewModeSigningKey);}catch(_unused2){// TODO: warn
clearPreviewData(res);return false;}const decryptedPreviewData=(0,_cryptoUtils.decryptWithSecret)(Buffer.from(options.previewModeEncryptionKey),encryptedPreviewData.data);try{// TODO: strict runtime type checking
const data=JSON.parse(decryptedPreviewData);// Cache lookup
Object.defineProperty(req,SYMBOL_PREVIEW_DATA,{value:data,enumerable:false});return data;}catch(_unused3){return false;}}function isNotValidData(str){return typeof str!=='string'||str.length<16;}function setPreviewData(res,data,// TODO: strict runtime type checking
options){if(isNotValidData(options.previewModeId)){throw new Error('invariant: invalid previewModeId');}if(isNotValidData(options.previewModeEncryptionKey)){throw new Error('invariant: invalid previewModeEncryptionKey');}if(isNotValidData(options.previewModeSigningKey)){throw new Error('invariant: invalid previewModeSigningKey');}const jsonwebtoken=require('next/dist/compiled/jsonwebtoken');const payload=jsonwebtoken.sign({data:(0,_cryptoUtils.encryptWithSecret)(Buffer.from(options.previewModeEncryptionKey),JSON.stringify(data))},options.previewModeSigningKey,{algorithm:'HS256',...(options.maxAge!==undefined?{expiresIn:options.maxAge}:undefined)});// limit preview mode cookie to 2KB since we shouldn't store too much
// data here and browsers drop cookies over 4KB
if(payload.length>2048){throw new Error(`Preview data is limited to 2KB currently, reduce how much data you are storing as preview data to continue`);}const{serialize}=require('next/dist/compiled/cookie');const previous=res.getHeader('Set-Cookie');res.setHeader(`Set-Cookie`,[...(typeof previous==='string'?[previous]:Array.isArray(previous)?previous:[]),serialize(COOKIE_NAME_PRERENDER_BYPASS,options.previewModeId,{httpOnly:true,sameSite:process.env.NODE_ENV!=='development'?'none':'lax',secure:process.env.NODE_ENV!=='development',path:'/',...(options.maxAge!==undefined?{maxAge:options.maxAge}:undefined)}),serialize(COOKIE_NAME_PRERENDER_DATA,payload,{httpOnly:true,sameSite:process.env.NODE_ENV!=='development'?'none':'lax',secure:process.env.NODE_ENV!=='development',path:'/',...(options.maxAge!==undefined?{maxAge:options.maxAge}:undefined)})]);return res;}function clearPreviewData(res){if(SYMBOL_CLEARED_COOKIES in res){return res;}const{serialize}=require('next/dist/compiled/cookie');const previous=res.getHeader('Set-Cookie');res.setHeader(`Set-Cookie`,[...(typeof previous==='string'?[previous]:Array.isArray(previous)?previous:[]),serialize(COOKIE_NAME_PRERENDER_BYPASS,'',{// To delete a cookie, set `expires` to a date in the past:
// https://tools.ietf.org/html/rfc6265#section-4.1.1
// `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
expires:new Date(0),httpOnly:true,sameSite:process.env.NODE_ENV!=='development'?'none':'lax',secure:process.env.NODE_ENV!=='development',path:'/'}),serialize(COOKIE_NAME_PRERENDER_DATA,'',{// To delete a cookie, set `expires` to a date in the past:
// https://tools.ietf.org/html/rfc6265#section-4.1.1
// `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
expires:new Date(0),httpOnly:true,sameSite:process.env.NODE_ENV!=='development'?'none':'lax',secure:process.env.NODE_ENV!=='development',path:'/'})]);Object.defineProperty(res,SYMBOL_CLEARED_COOKIES,{value:true,enumerable:false});return res;}/**
 * Custom error class
 */class ApiError extends Error{constructor(statusCode,message){super(message);this.statusCode=void 0;this.statusCode=statusCode;}}/**
 * Sends error in `response`
 * @param res response object
 * @param statusCode of response
 * @param message of response
 */exports.ApiError=ApiError;function sendError(res,statusCode,message){res.statusCode=statusCode;res.statusMessage=message;res.end(message);}/**
 * Execute getter function only if its needed
 * @param LazyProps `req` and `params` for lazyProp
 * @param prop name of property
 * @param getter function to get data
 */function setLazyProp({req,params},prop,getter){const opts={configurable:true,enumerable:true};const optsReset={...opts,writable:true};Object.defineProperty(req,prop,{...opts,get:()=>{let value=getter();if(params&&typeof params!=='boolean'){value={...value,...params};}// we set the property on the object to avoid recalculating it
Object.defineProperty(req,prop,{...optsReset,value});return value;},set:value=>{Object.defineProperty(req,prop,{...optsReset,value});}});}
//# sourceMappingURL=api-utils.js.map