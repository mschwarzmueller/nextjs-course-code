"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _classStaticPrivateFieldSpecSet;
var _classCheckPrivateStaticAccessMjs = _interopRequireDefault(require("./_class_check_private_static_access.js"));
var _classApplyDescriptorSetMjs = _interopRequireDefault(require("./_class_apply_descriptor_set.js"));
function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    (0, _classCheckPrivateStaticAccessMjs).default(receiver, classConstructor);
    (0, _classCheckPrivateStaticAccessMjs).default(descriptor, "set");
    (0, _classApplyDescriptorSetMjs).default(receiver, descriptor, value);
    return value;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
