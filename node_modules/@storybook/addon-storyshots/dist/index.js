"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Stories2SnapsConverter", {
  enumerable: true,
  get: function () {
    return _Stories2SnapsConverter.default;
  }
});
Object.defineProperty(exports, "snapshotWithOptions", {
  enumerable: true,
  get: function () {
    return _testBodies.snapshotWithOptions;
  }
});
Object.defineProperty(exports, "multiSnapshotWithOptions", {
  enumerable: true,
  get: function () {
    return _testBodies.multiSnapshotWithOptions;
  }
});
Object.defineProperty(exports, "renderOnly", {
  enumerable: true,
  get: function () {
    return _testBodies.renderOnly;
  }
});
Object.defineProperty(exports, "renderWithOptions", {
  enumerable: true,
  get: function () {
    return _testBodies.renderWithOptions;
  }
});
Object.defineProperty(exports, "shallowSnapshot", {
  enumerable: true,
  get: function () {
    return _testBodies.shallowSnapshot;
  }
});
Object.defineProperty(exports, "snapshot", {
  enumerable: true,
  get: function () {
    return _testBodies.snapshot;
  }
});
exports.default = void 0;

var _Stories2SnapsConverter = _interopRequireDefault(require("./Stories2SnapsConverter"));

var _api = _interopRequireDefault(require("./api"));

var _testBodies = require("./test-bodies");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _api.default;
exports.default = _default;