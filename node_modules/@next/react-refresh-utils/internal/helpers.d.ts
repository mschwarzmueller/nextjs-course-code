/**
 * MIT License
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
declare function registerExportsForReactRefresh(moduleExports: unknown, moduleID: string): void;
declare function isReactRefreshBoundary(moduleExports: unknown): boolean;
declare function shouldInvalidateReactRefreshBoundary(prevExports: unknown, nextExports: unknown): boolean;
declare function getRefreshBoundarySignature(moduleExports: unknown): Array<unknown>;
declare function scheduleUpdate(): void;
declare const _default: {
    registerExportsForReactRefresh: typeof registerExportsForReactRefresh;
    isReactRefreshBoundary: typeof isReactRefreshBoundary;
    shouldInvalidateReactRefreshBoundary: typeof shouldInvalidateReactRefreshBoundary;
    getRefreshBoundarySignature: typeof getRefreshBoundarySignature;
    scheduleUpdate: typeof scheduleUpdate;
};
export default _default;
