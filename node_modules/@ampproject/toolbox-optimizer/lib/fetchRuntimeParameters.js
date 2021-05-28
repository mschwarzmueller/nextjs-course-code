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
'mode strict';

const validatorRulesProvider = require('@ampproject/toolbox-validator-rules');
const {MaxAge} = require('@ampproject/toolbox-core');
const {
  AMP_CACHE_HOST,
  AMP_RUNTIME_CSS_PATH,
  AMP_VALIDATION_RULES_URL,
  appendRuntimeVersion,
} = require('./AmpConstants.js');

const KEY_VALIDATOR_RULES = 'validator-rules';
const AMP_RUNTIME_MAX_AGE = 10 * 60; // 10 min
const cache = require('./cache.js');

/**
 * Initializes the runtime parameters used by the transformers based on given config and parameter values.
 * If missing, the following parameters are fetched from cdn.ampproject.org:
 *
 * - validatorRules: the latest version of the AMP validator rules as served from https://cdn.ampproject.org/v0/validator.json
 * - ampRuntimeVersion: the latest AMP runtime version or the latest lts version if the lts flag is set
 * - ampRuntimeStyles: the latest AMP runtime CSS styles or the latest lts CSS styles if the lts flag is set
 *
 * @param {Object} config - the AMP Optimizer config
 * @param {Object} customRuntimeParameters - user defined runtime parameters
 * @returns {Promise<Object>} - the runtime parameters
 */
async function fetchRuntimeParameters(config, customRuntimeParameters = {}) {
  const runtimeParameters = Object.assign({}, customRuntimeParameters);
  // Configure the log level
  runtimeParameters.verbose = customRuntimeParameters.verbose || config.verbose || false;
  // Validation rules can be downloaded in parallel
  const validationRulePromise = initValidatorRules(
    runtimeParameters,
    customRuntimeParameters,
    config
  );
  await initRuntimeVersion(runtimeParameters, customRuntimeParameters, config);
  // Runtime Styles depend on the Runtime version
  await initRuntimeStyles(runtimeParameters, config);
  // Make sure validation rules are downloaded
  await validationRulePromise;
  return runtimeParameters;
}

/**
 * Fetches the AMP validator rules if they're not provided.
 *
 * @private
 */
async function initValidatorRules(runtimeParameters, customRuntimeParameters, config) {
  try {
    runtimeParameters.validatorRules =
      customRuntimeParameters.validatorRules ||
      config.validatorRules ||
      (await fetchValidatorRulesFromCache_(config));
  } catch (error) {
    config.log.error('Could not fetch validator rules', error);
  }
}

/**
 * @private
 */
async function fetchValidatorRulesFromCache_(config) {
  if (config.cache === false) {
    return fetchValidatorRules_(config);
  }
  let rawRules = await cache.get('validator-rules');
  let validatorRules;
  if (!rawRules) {
    validatorRules = await fetchValidatorRules_(config);
    config.log.debug('Downloaded AMP validation rules');
    // We save the raw rules to make the validation rules JSON serializable
    cache.set(KEY_VALIDATOR_RULES, validatorRules.raw);
  } else {
    validatorRules = await validatorRulesProvider.fetch({rules: rawRules});
  }
  return validatorRules;
}

async function fetchValidatorRules_(config) {
  const response = await config.fetch(AMP_VALIDATION_RULES_URL);
  if (!response.ok) {
    return null;
  }
  return validatorRulesProvider.fetch({rules: await response.json()});
}

/**
 * Fetch runtime styles based on the runtime version
 *
 * @private
 */
async function initRuntimeStyles(runtimeParameters, config) {
  try {
    runtimeParameters.ampRuntimeStyles =
      runtimeParameters.ampRuntimeStyles ||
      (await fetchAmpRuntimeStyles_(
        config,
        runtimeParameters.ampUrlPrefix,
        runtimeParameters.ampRuntimeVersion
      ));
  } catch (error) {
    config.log.error('Could not fetch AMP runtime CSS', error);
  }
}

/**
 * Use provided runtime version or fetch latest (lts) version.
 *
 * @private
 */
async function initRuntimeVersion(runtimeParameters, customRuntimeParameters, config) {
  // Copy lts and rtv runtime flag from custom parameters or the static config. Both are disabled by default.
  runtimeParameters.lts = customRuntimeParameters.lts || config.lts || false;
  runtimeParameters.rtv = customRuntimeParameters.rtv || config.rtv || false;
  let {ampUrlPrefix, ampRuntimeVersion, lts} = runtimeParameters;
  if (lts && ampRuntimeVersion) {
    config.log.warn(
      '`ampRuntimeVersion` and `lts` cannot be defined at the same time. Using LTS version.'
    );
    ampRuntimeVersion = '';
  }
  try {
    runtimeParameters.ampRuntimeVersion =
      ampRuntimeVersion || (await fetchAmpRuntimeVersion_({config, ampUrlPrefix, lts}));
  } catch (error) {
    config.log.error('Could not fetch latest AMP runtime version', error);
  }
}

/**
 * @private
 */
async function fetchAmpRuntimeVersion_(context) {
  if (context.config.cache === false) {
    return (await fetchLatestRuntimeData_(context)).version;
  }
  const versionKey = context.ampUrlPrefix + '-' + context.lts;
  let ampRuntimeData = await cache.get(versionKey);
  if (!ampRuntimeData) {
    ampRuntimeData = await fetchLatestRuntimeData_(context, versionKey);
    context.config.log.debug('Downloaded AMP runtime v' + ampRuntimeData.version);
  } else if (MaxAge.fromObject(ampRuntimeData.maxAge).isExpired()) {
    // return the cached version, but update the cache in the background
    fetchLatestRuntimeData_(versionKey, context);
  }
  return ampRuntimeData.version;
}

/**
 * @private
 */
async function fetchLatestRuntimeData_({config, ampUrlPrefix, lts}, versionKey = null) {
  let ampRuntimeData;
  ampRuntimeData = {
    version: await config.runtimeVersion.currentVersion({ampUrlPrefix, lts}),
    maxAge: MaxAge.create(AMP_RUNTIME_MAX_AGE).toObject(),
  };
  if (!ampRuntimeData.version && ampUrlPrefix !== AMP_CACHE_HOST) {
    config.log.error(
      `Could not download runtime version from ${ampUrlPrefix}. Falling back to ${AMP_CACHE_HOST}`
    );
    ampRuntimeData = await fetchLatestRuntimeData_(
      {config, ampUrlPrefix: AMP_CACHE_HOST, lts},
      versionKey
    );
  } else if (ampRuntimeData.version && versionKey) {
    cache.set(versionKey, ampRuntimeData);
  }
  return ampRuntimeData;
}

/**
 * @private
 */
async function fetchAmpRuntimeStyles_(config, ampUrlPrefix, ampRuntimeVersion) {
  if (ampUrlPrefix && !isAbsoluteUrl_(ampUrlPrefix)) {
    config.log.warn(
      `AMP runtime styles cannot be fetched from relative ampUrlPrefix, please use the 'ampRuntimeStyles' parameter to provide the correct runtime style. Falling back to latest v0.css on ${AMP_CACHE_HOST}`
    );
    // Gracefully fallback to latest runtime version
    ampUrlPrefix = AMP_CACHE_HOST;
    ampRuntimeVersion = ampRuntimeVersion || (await config.runtimeVersion.currentVersion());
  }
  // Construct the AMP runtime CSS download URL, the default is: https://cdn.ampproject.org/rtv/${ampRuntimeVersion}/v0.css
  const runtimeCssUrl =
    appendRuntimeVersion(ampUrlPrefix || AMP_CACHE_HOST, ampRuntimeVersion) + AMP_RUNTIME_CSS_PATH;
  // Fetch runtime styles
  const styles = await downloadAmpRuntimeStyles_(config, runtimeCssUrl);
  if (!styles) {
    config.log.error(`Could not download ${runtimeCssUrl}. Falling back to latest v0.css.`);
    if (ampUrlPrefix || ampRuntimeVersion) {
      // Try to download latest from cdn.ampproject.org instead
      return fetchAmpRuntimeStyles_(
        config,
        AMP_CACHE_HOST,
        await config.runtimeVersion.currentVersion()
      );
    } else {
      return '';
    }
  }
  return styles;
}

/**
 * @private
 */
async function downloadAmpRuntimeStyles_(config, runtimeCssUrl) {
  let styles;
  if (config.cache !== false) {
    styles = await cache.get(runtimeCssUrl);
  }
  if (!styles) {
    const response = await config.fetch(runtimeCssUrl);
    if (!response.ok) {
      return null;
    }
    styles = await response.text();
    // HACK: patch v0.css to support transforming amp-img -> img
    // TODO remove once v0.css has been updated
    if (!styles.includes('i-amphtml-ssr')) {
      styles += `amp-img[i-amphtml-ssr]:not(.i-amphtml-element):not([layout=container])>*{display: block;}`;
    }
    config.log.debug(`Downloaded AMP runtime styles from ${runtimeCssUrl}`);
    if (config.cache !== false) {
      cache.set(runtimeCssUrl, styles);
    }
  }
  return styles;
}

/**
 * @private
 */
function isAbsoluteUrl_(url) {
  try {
    new URL(url);
    return true;
  } catch (ex) {
    return false;
  }
}

module.exports = fetchRuntimeParameters;
