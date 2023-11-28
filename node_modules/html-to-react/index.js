'use strict';

const parser = require('./lib/parser');
const processingInstructions = require('./lib/processing-instructions');
const isValidNodeDefinitions = require('./lib/is-valid-node-definitions');
const processNodeDefinitions = require('./lib/process-node-definitions');

module.exports = {
  Parser: parser,
  ProcessingInstructions: processingInstructions,
  IsValidNodeDefinitions: isValidNodeDefinitions,
  ProcessNodeDefinitions: processNodeDefinitions,
};
