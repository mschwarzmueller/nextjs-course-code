"use strict";exports.__esModule=true;exports.isNodeCreatingScriptElement=isNodeCreatingScriptElement;exports.reducePropsToObject=reducePropsToObject;// eslint-disable-next-line import/no-extraneous-dependencies
function isNodeCreatingScriptElement(node){const callee=node.callee;if(callee.type!=='Identifier'){return false;}const componentNode=node.arguments[0];if(componentNode.type!=='Literal'){return false;}// Next has pragma: __jsx.
return callee.name==='__jsx'&&componentNode.value==='script';}function reducePropsToObject(propsNode){return propsNode.properties.reduce((originalProps,prop)=>{// @ts-ignore
originalProps[prop.key.name]=prop.value.value;return originalProps;},{});}
//# sourceMappingURL=ast-utils.js.map