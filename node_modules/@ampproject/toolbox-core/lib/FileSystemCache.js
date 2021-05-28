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
const fs = require('fs').promises;
const {existsSync, mkdirSync} = require('fs');
const crypto = require('crypto');
const log = require('./Log');
const LRUCache = require('lru-cache');

const path = require('path');

const DEFAULT_OPTS = {
  baseDir: path.join(__dirname, '.cache'),
  log,
  maxItems: 50,
};

class FileSystemCache {
  static create(opts = {}) {
    return new FileSystemCache(Object.assign(DEFAULT_OPTS, opts));
  }

  constructor(opts) {
    this.opts = opts;
    this.cache = new LRUCache(opts.maxItems);
  }

  async get(key, defaultValue = null) {
    let value = this.cache.get(key);
    if (value) {
      return value;
    }
    const cacheFile = this.createCacheFileName(key);
    try {
      const content = await fs.readFile(cacheFile, 'utf-8');
      value = JSON.parse(content);
      this.cache.set(key, value);
    } catch (error) {
      value = defaultValue;
    }
    return value;
  }

  async set(key, value) {
    try {
      this.cache.set(key, value);
      if (!existsSync(this.opts.baseDir)) {
        mkdirSync(this.opts.baseDir);
      }
      const cacheFile = this.createCacheFileName(key);
      return fs.writeFile(cacheFile, JSON.stringify(value, null, ''), 'utf-8');
    } catch (e) {
      this.opts.log.error('Could not write cache file', e);
    }
  }

  async clear() {
    const dir = this.opts.baseDir;
    if (!existsSync(dir)) {
      return;
    }
    let entries = await fs.readdir(dir, {withFileTypes: true});
    await Promise.all(
      entries.map((entry) => {
        let fullPath = path.join(dir, entry.name);
        return entry.isFile() && entry.name.endsWith('.json')
          ? fs.unlink(fullPath)
          : Promise.resolve();
      })
    );
  }

  createCacheFileName(key) {
    const keyHash = crypto.createHash('md5').update(key).digest('hex');
    return path.join(this.opts.baseDir, keyHash + '.json');
  }

  async deleteDir_(dir) {
    let entries = await fs.readdir(dir, {withFileTypes: true});
    await Promise.all(
      entries.map((entry) => {
        let fullPath = path.join(dir, entry.name);
        return entry.isDirectory() ? this.deleteDir_(fullPath) : fs.unlink(fullPath);
      })
    );
    await fs.rmdir(dir);
  }
}

module.exports = FileSystemCache;
