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

const MAX_AGE_ZERO = {
  value: 0,
  isExpired: () => true,
};

/* A max age wrapper. */
class MaxAge {
  /**
   * Returns new MaxAge with value 0.
   *
   * @returns {MaxAge}
   */
  static zero() {
    return MAX_AGE_ZERO;
  }

  /**
   * Parses a max-age header string and returns a new MaxAge instance.
   *
   * @param {string} str a max-age header string
   * @returns {MaxAge}
   */
  static parse(string) {
    if (!string) {
      return MaxAge.zero();
    }
    const match = string.match(/max-age=([0-9]+)[^0-9]?/i);
    if (!match) {
      return MaxAge.zero();
    }
    return MaxAge.create(match[1]);
  }

  /**
   * Creates a new MaxAge instance from a number or string.
   *
   * @param {Number|String} maxAge the max age in seconds
   * @returns {MaxAge}
   */
  static create(maxAge) {
    if (!Number.isInteger(maxAge)) {
      maxAge = parseInt(maxAge, 10);
    }
    return new MaxAge(Date.now(), maxAge);
  }

  /**
   * @param {Number} timestampInMs time when max-age value was received
   * @param {Number} value max-age value in seconds
   **/
  static fromObject(timestampInMs, value) {
    return new MaxAge(timestampInMs, value);
  }

  /**
   * @param {Number} timestampInMs time when max-age value was received
   * @param {Number} value max-age value in seconds
   **/
  constructor(timestampInMs, value) {
    this.timestampInMs_ = timestampInMs;
    this.value = value;
  }

  /**
   * Returns true if the max-age value has expired. Uses the current time by
   * default.
   *
   * @param {Number} [currentTimeInMs] optional current time.
   * @returns {Boolean} true if expired
   **/
  isExpired(currentTimeInMs = Date.now()) {
    const maxAgeInMs = this.value * 1000;
    return this.timestampInMs_ + maxAgeInMs < currentTimeInMs;
  }

  /**
   * Returns a JSON compatible representation.
   * @returns {Object} the MaxAge data
   */
  toObject() {
    return {
      timestampInMs: this.timestampInMs_,
      maxAge: this.maxAge,
    };
  }
}

module.exports = MaxAge;
