/**
 * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
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
'use strict';

let fetch = require('cross-fetch');
const MaxAge = require('./MaxAge.js');

const cache = new Map();

/**
 * Implements fetch with a one-behind-caching strategy.
 *
 * @param {String|Request} input - path or Request instance
 * @param {Object} init - fetch options
 * @return Promise<Response>
 */
async function oneBehindFetch(input, init) {
  let cachedResponse = cache.get(input);
  if (!cachedResponse) {
    cachedResponse = {
      maxAge: Promise.resolve(MaxAge.zero()),
    };
    cache.set(input, cachedResponse);
  }
  const maxAge = await cachedResponse.maxAge;
  if (!maxAge.isExpired()) {
    // we have to clone the response to enable multiple reads
    const response = await cachedResponse.responsePromise;
    return response.clone();
  }
  const staleResponsePromise = cachedResponse.responsePromise;
  const newResponsePromise = fetch(input, init);
  cachedResponse = {
    responsePromise: newResponsePromise,
    maxAge: newResponsePromise.then((response) =>
      MaxAge.parse(response.headers.get('cache-control'))
    ),
  };
  cache.set(input, cachedResponse);
  const result = staleResponsePromise || newResponsePromise;
  // we have to clone the response to enable multiple reads
  const response = await result;
  return response.clone();
}

oneBehindFetch.clearCache = () => cache.clear();
oneBehindFetch.setDelegate = (delegate) => (fetch = delegate);

module.exports = oneBehindFetch;
