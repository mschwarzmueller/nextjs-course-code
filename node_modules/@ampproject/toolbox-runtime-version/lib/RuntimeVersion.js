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

const log = require('@ampproject/toolbox-core').log.tag('AMP Runtime Version');

const AMP_CACHE_HOST = 'https://cdn.ampproject.org';
const RUNTIME_METADATA_PATH = '/rtv/metadata';
const VERSION_TXT_PATH = '/version.txt';

/**
 * @typedef {number} ReleaseType
 */

/**
 * Release type "enumeration"
 *
 * @enum {ReleaseType}
 */
const ReleaseType = {
  canary: 0,
  prod: 1,
  lts: 2,
};

/**
 * Queries <host>/rtv/metadata for the latest AMP runtime version. If version is not available from
 * this endpoint, falls back to <host>/version.txt and manually prepends config code. Uses a
 * stale-while-revalidate caching strategy to avoid refreshing the version.
 *
 * /rtv/metadata endpoint details:
 *
 * <pre>
 * {
 *   "ampRuntimeVersion": "CURRENT_PROD",
 *   "ampCssUrl": "https://cdn.ampproject.org/rtv/CURRENT_PROD/v0.css",
 *   "canaryPercentage": "0.1",
 *   "diversions": [
 *     "CURRENT_OPTIN",
 *     "CURRENT_1%",
 *     "CURRENT_CONTROL"
 *   ],
 *   "ltsRuntimeVersion": "CURRENT_LTS",
 *   "ltsCssUrl": "https://cdn.ampproject.org/rtv/CURRENT_LTS/v0.css"
 * }
 * </pre>
 *
 * where:
 *
 * <ul>
 *   <li> CURRENT_OPTIN: is when you go to https://cdn.ampproject.org/experiments.html and toggle "dev-channel". It's the earliest possible time to get new code.</li>
 *   <li> CURRENT_1%: 1% is the same code as opt-in that we're now comfortable releasing to 1% of the population.</li>
 *   <li> CURRENT_CONTROL is the same thing as production, but with a different URL. This is to compare experiments against, since prod's immutable caching would affect metrics.</li>
 * </ul>
 */
class RuntimeVersion {
  constructor(fetch) {
    this.fetch_ = fetch;
  }

  /**
   * Returns the version of the current AMP runtime release. Pass
   * <code>{canary: true}</code> to get the latest canary version.
   *
   * @param {object} options - the options.
   * @param {boolean} options.canary - true if canary should be returned.
   * @param {boolean} options.lts - true if lts should be returned.
   * @param {string} options.ampUrlPrefix - the domain & path to an AMP runtime.
   * @returns {Promise<string>} a promise containing the current version.
   */
  async currentVersion(options = {}) {
    if (options.ampUrlPrefix && !this.isAbsoluteUrl_(options.ampUrlPrefix)) {
      throw new Error('host must be an absolute URL');
    }
    if (options.canary && options.lts) {
      throw new Error('lts flag is not compatible with canary flag');
    }

    let releaseType = ReleaseType.prod;
    if (options.canary) {
      releaseType = ReleaseType.canary;
    } else if (options.lts) {
      releaseType = ReleaseType.lts;
    }

    const host = options.ampUrlPrefix ? options.ampUrlPrefix.replace(/\/$/, '') : AMP_CACHE_HOST;

    let rtv = await this.getVersionFromRuntimeMetadata_(host, releaseType);
    if (!rtv && releaseType === ReleaseType.prod) {
      rtv = await this.getVersionFromVersionTxt_(host, releaseType);
    }

    return rtv;
  }

  /* PRIVATE */

  /**
   * Get runtime version from <host>/rtv/metadata
   *
   * @param {string} host - runtime host.
   * @param {ReleaseType} releaseType - release type.
   * @returns {Promise<string>} a promise containing the runtime version.
   */
  async getVersionFromRuntimeMetadata_(host, releaseType) {
    const runtimeMetaUrl = host + RUNTIME_METADATA_PATH;
    log.debug(`Fetching version from ${runtimeMetaUrl}`);

    let response;
    try {
      response = await this.fetch_(runtimeMetaUrl);
    } catch (ex) {
      // Avoid exception to give fallback mechanism getVersionFromVersionTxt_()
      // a chance to lookup version, and to gracefully return 'undefined' if no
      // version is ultimately found.
    }
    if (!response || !response.ok) {
      log.debug('RTV metadata endpoint did not respond with a successful status code');
      return;
    }

    let data;
    try {
      data = await response.json();
    } catch (ex) {
      log.debug('RTV metadata JSON malformed');
      return;
    }

    let rtv;
    if (releaseType === ReleaseType.canary) {
      if (
        Array.isArray(data.diversions) &&
        data.diversions[0] &&
        data.diversions[0].startsWith(this.getRtvConfigCode_(releaseType))
      ) {
        rtv = data.diversions[0];
      }
      if (!rtv) {
        log.debug('RTV metadata JSON malformed, canary version not in diversions array');
      }
    } else if (releaseType === ReleaseType.lts) {
      rtv = data.ltsRuntimeVersion;
      if (!rtv) {
        log.debug('RTV metadata JSON malformed, lts version not in ltsRuntimeVersion');
      }
    } else if (releaseType === ReleaseType.prod) {
      rtv = data.ampRuntimeVersion;
      if (!rtv) {
        log.debug('RTV metadata JSON malformed, production version not in ampRuntimeVersion');
      }
    }

    return rtv;
  }

  /**
   * Get runtime version from <host>/version.txt, manually prepending
   * production release code '01'. This method cannot be used to detect
   * canary or lts releases.
   *
   * @param {string} host - runtime host.
   * @param {ReleaseType} releaseType - release type.
   * @returns {Promise<string>} a promise containing the runtime version.
   */
  async getVersionFromVersionTxt_(host, releaseType) {
    if (releaseType !== ReleaseType.prod) {
      log.debug(`version.txt lookup only supported for prod releases`);
      return;
    }

    let versionTxtUrl = host + VERSION_TXT_PATH;
    log.debug(`Falling back to ${versionTxtUrl}`);

    let response;
    try {
      response = await this.fetch_(versionTxtUrl);
    } catch (ex) {
      // Prefer gracefully returning 'undefined' version to throwing.
    }
    if (!response || !response.ok) {
      log.debug('version.txt endpoint did not respond with a successful status code');
      return;
    }

    let version;
    try {
      version = (await response.text()).trim();
      if (version !== encodeURIComponent(version)) {
        throw new Error();
      }
    } catch (ex) {
      log.debug('Version string malformed, not URL compatible');
      return;
    }

    return this.getRtvConfigCode_(releaseType) + version;
  }

  /**
   * Get config code corresponding to release type
   *
   * @param {ReleaseType} releaseType - release type.
   * @returns {string}
   */
  getRtvConfigCode_(releaseType) {
    if (releaseType === ReleaseType.canary) {
      return '00';
    }
    return '01';
  }

  /**
   * Determine whether a URL is absolute.
   *
   * @param {string} url - URL to test.
   * @returns {boolean}
   */
  isAbsoluteUrl_(url) {
    try {
      new URL(url);
      return true;
    } catch (ex) {
      return false;
    }
  }
}

module.exports = RuntimeVersion;
