'use strict';
const ShouldProcessNodeDefinitions = require('./should-process-node-definitions');
const ProcessNodeDefinitions = require('./process-node-definitions');

function ProcessingInstructions() {
  const processNodeDefinitions = new ProcessNodeDefinitions();

  return {
    defaultProcessingInstructions: [{
      shouldProcessNode: ShouldProcessNodeDefinitions.shouldProcessEveryNode,
      processNode: processNodeDefinitions.processDefaultNode,
    },],
  };
};

module.exports = ProcessingInstructions;
