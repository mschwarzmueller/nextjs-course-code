"use strict";
exports.__esModule = true;
var previousBodyPaddingRight;
var previousBodyOverflowSetting;
var activeLocks = 0;
function lock() {
    setTimeout(function () {
        if (activeLocks++ > 0) {
            return;
        }
        var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;
        if (scrollBarGap > 0) {
            previousBodyPaddingRight = document.body.style.paddingRight;
            document.body.style.paddingRight = scrollBarGap + "px";
        }
        previousBodyOverflowSetting = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    });
}
exports.lock = lock;
function unlock() {
    setTimeout(function () {
        if (activeLocks === 0 || --activeLocks !== 0) {
            return;
        }
        if (previousBodyPaddingRight !== undefined) {
            document.body.style.paddingRight = previousBodyPaddingRight;
            previousBodyPaddingRight = undefined;
        }
        if (previousBodyOverflowSetting !== undefined) {
            document.body.style.overflow = previousBodyOverflowSetting;
            previousBodyOverflowSetting = undefined;
        }
    });
}
exports.unlock = unlock;
//# sourceMappingURL=body-locker.js.map