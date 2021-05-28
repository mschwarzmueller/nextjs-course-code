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

const AbortController = require('abort-controller');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const log = require('@ampproject/toolbox-core').log.tag('AMP OPTIMIZER');
const AmpOptimizer = require('../');

const DOWNLOAD_TIMEOUT = 2000; // 2 seconds
const controller = new AbortController();

const fetchRuntimeParameters = require('./fetchRuntimeParameters');

const fetchWithTimout = (url, opts = {}) => {
  const timeout = setTimeout(() => {
    controller.abort();
  }, DOWNLOAD_TIMEOUT);
  opts.signal = controller.signal;
  const httpsProxy = process.env.https_proxy || process.env.HTTPS_PROXY;
  if (httpsProxy) {
    opts.agent = new HttpsProxyAgent(httpsProxy);
  }
  return fetch(url, opts).finally(() => {
    clearTimeout(timeout);
  });
};

async function warmupCaches() {
  let success = true;
  // Hack to avoid error messages in the console during postinstall
  log.error = () => {
    success = false;
  };
  try {
    // Re-use config from AMP Optimizer
    // TODO extract config into it's own class
    const config = AmpOptimizer.create({log, fetch: fetchWithTimout}).config;
    // Try to download all runtime data, this will fail if behind a proxy
    await fetchRuntimeParameters(config);
    if (success) {
      log.info('Downloaded latest AMP runtime data.');
    } else {
      log.info(
        'Failed downloading latest AMP runtime data. Proxies need to be configured manually, see https://github.com/ampproject/amp-toolbox/tree/main/packages/optimizer#fetch.'
      );
    }
  } catch (e) {
    // ignore - environment has not been setup yet
  }
}

warmupCaches();
