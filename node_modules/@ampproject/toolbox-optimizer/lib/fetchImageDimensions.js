/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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

const isDependencyInstalled = require('./isDependencyInstalled');

const MATCH_ABSOLUTE_URL = /^https?:\/\/|^\/\//i;

function fetchImageDimensions(pathOrUrl) {
  if (MATCH_ABSOLUTE_URL.test(pathOrUrl)) {
    return fetchImageDimensionsFromUrl(pathOrUrl);
  }
  return fetchImageDimensionsFromFile(pathOrUrl);
}

function fetchImageDimensionsFromUrl(url) {
  return probe(url);
}

async function fetchImageDimensionsFromFile(path) {
  // AMP Optimizer might run in a browser
  if (!isDependencyInstalled('fs')) {
    throw new Error('No access to the file system');
  }
  const fs = require('fs');
  if (!fs.existsSync(path)) {
    throw new Error('Could not resolve file: ' + path);
  }
  const stream = fs.createReadStream(path);
  return probe(stream);
}

function probe(input) {
  if (!isDependencyInstalled('probe-image-size')) {
    throw new Error('Missing optional dependency: probe-image-size');
  }
  return require('probe-image-size')(input);
}

module.exports = {
  fetchImageDimensions,
  fetchImageDimensionsFromFile,
  fetchImageDimensionsFromUrl,
};
