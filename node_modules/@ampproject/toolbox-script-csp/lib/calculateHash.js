/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This solution is temporary and will be replaced when
// https://github.com/ampproject/amp-toolbox/issues/378 is resolved.

const crypto = require('crypto');

const SUPPORTED_ALGORITHMS = new Set(['sha384']);

const DEFAULT_ALGORITHM = 'sha384';

/**
 * Calculates the hash of the given input and returns a valid CSP string for use
 * with amp-script.
 *
 * @param {string|DataView} src - Input script
 * @param {Object} [options] - The options object
 * @param {string} [options.algorithm] - Algorithm to use, defaults to sha384
 * @returns {string} The hash prefixed with the algorithm used
 */
function calculateHash(src, {algorithm = DEFAULT_ALGORITHM} = {}) {
  const algo = algorithm.toLowerCase();
  if (!SUPPORTED_ALGORITHMS.has(algo)) {
    throw new Error(`Unsupported algorithm for CSP: ${algo}`);
  }

  if (typeof src === 'string') {
    src = Buffer.from(src, 'utf8');
  }

  const hash = crypto.createHash(algo);
  const data = hash.update(src);
  const base64 = base64URLFormat(data.digest('base64'));
  return `${algo}-${base64}`;
}

function base64URLFormat(base64) {
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

module.exports = {calculateHash};
