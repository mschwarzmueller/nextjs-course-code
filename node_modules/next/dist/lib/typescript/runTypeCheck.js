"use strict";exports.__esModule=true;exports.runTypeCheck=runTypeCheck;var _diagnosticFormatter=require("./diagnosticFormatter");var _getTypeScriptConfiguration=require("./getTypeScriptConfiguration");var _TypeScriptCompileError=require("./TypeScriptCompileError");var _writeConfigurationDefaults=require("./writeConfigurationDefaults");async function runTypeCheck(ts,baseDir,tsConfigPath){var _allDiagnostics$find;const effectiveConfiguration=await(0,_getTypeScriptConfiguration.getTypeScriptConfiguration)(ts,tsConfigPath);if(effectiveConfiguration.fileNames.length<1){return{hasWarnings:false};}const requiredConfig=(0,_writeConfigurationDefaults.getRequiredConfiguration)(ts);const program=ts.createProgram(effectiveConfiguration.fileNames,{...effectiveConfiguration.options,...requiredConfig,noEmit:true});const result=program.emit();// Intended to match:
// - pages/test.js
// - pages/apples.test.js
// - pages/__tests__/a.js
//
// But not:
// - pages/contest.js
// - pages/other.js
// - pages/test/a.js
//
const regexIgnoredFile=/[\\/]__(?:tests|mocks)__[\\/]|(?<=[\\/.])(?:spec|test)\.[^\\/]+$/;const allDiagnostics=ts.getPreEmitDiagnostics(program).concat(result.diagnostics).filter(d=>!(d.file&&regexIgnoredFile.test(d.file.fileName)));const firstError=(_allDiagnostics$find=allDiagnostics.find(d=>d.category===_diagnosticFormatter.DiagnosticCategory.Error&&Boolean(d.file)))!=null?_allDiagnostics$find:allDiagnostics.find(d=>d.category===_diagnosticFormatter.DiagnosticCategory.Error);if(firstError){throw new _TypeScriptCompileError.TypeScriptCompileError(await(0,_diagnosticFormatter.getFormattedDiagnostic)(ts,baseDir,firstError));}const warnings=await Promise.all(allDiagnostics.filter(d=>d.category===_diagnosticFormatter.DiagnosticCategory.Warning).map(d=>(0,_diagnosticFormatter.getFormattedDiagnostic)(ts,baseDir,d)));return{hasWarnings:true,warnings};}
//# sourceMappingURL=runTypeCheck.js.map