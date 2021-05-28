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

const fetch = require('cross-fetch');

const VALIDATOR_RULES_URL = 'https://cdn.ampproject.org/v0/validator.json';

async function loadRemote(url) {
  const req = await fetch(url);
  return req.json();
}

async function loadRules({url}) {
  url = url || VALIDATOR_RULES_URL;
  return loadRemote(url);
}

module.exports = loadRules;
