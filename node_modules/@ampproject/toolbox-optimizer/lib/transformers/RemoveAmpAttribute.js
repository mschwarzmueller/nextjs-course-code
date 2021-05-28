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

const {firstChildByTag} = require('../NodeUtils');
const {AMP_TAGS} = require('../AmpConstants.js');

class RemoveAmpAttribute {
  transform(tree) {
    const html = firstChildByTag(tree, 'html');
    if (!html) {
      return;
    }
    for (let i = 0, len = AMP_TAGS.length; i < len; i++) {
      delete html.attribs[AMP_TAGS[i]];
    }
  }
}

module.exports = RemoveAmpAttribute;
