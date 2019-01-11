'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fdescribe = exports.xdescribe = exports.xit = exports.fit = exports.afterEach = exports.after = exports.beforeEach = exports.before = exports.it = exports.describe = undefined;
exports.specs = specs;

var _addons = require('@storybook/addons');

var _addons2 = _interopRequireDefault(_addons);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentStory = "";
var results = {};
var beforeEachFunc = {};
var afterFunc = {};
var afterEachFunc = {};

function specs(specs) {
  var storyName = specs();
  var channel = _addons2.default.getChannel();
  channel.emit(_.EVENT_ID, { storyName: storyName, results: results[storyName] });
}

var describe = exports.describe = function describe(storyName, func) {
  currentStory = storyName;
  results[currentStory] = { goodResults: [], wrongResults: [] };
  func();
  if (afterFunc[currentStory]) afterFunc[currentStory]();
  return storyName;
};

var it = exports.it = function it(desc, func) {
  var storyName = currentStory;

  var pushGoodResult = function pushGoodResult() {
    results[storyName].goodResults.push(desc);
  };

  var pushWrongResult = function pushWrongResult(e) {
    console.error(storyName + ' - ' + desc + ' : ' + e);
    results[storyName].wrongResults.push({ spec: desc, message: e.message });
  };

  var emitAsyncResultsUpdate = function emitAsyncResultsUpdate() {
    var channel = _addons2.default.getChannel();
    channel.emit(_.EVENT_ID, { asyncResultsUpdate: true, storyName: storyName, results: results[storyName] });
  };

  var done = function done(e) {
    if (e) pushWrongResult(e);else pushGoodResult();
    emitAsyncResultsUpdate();
  };

  if (beforeEachFunc[storyName]) beforeEachFunc[storyName]();

  try {
    if (func.length) func(done);else {
      func();
      pushGoodResult();
    }
  } catch (e) {
    pushWrongResult(e);
  }

  if (afterEachFunc[storyName]) afterEachFunc[storyName]();
};

var before = exports.before = function before(func) {
  func();
};

var beforeEach = exports.beforeEach = function beforeEach(func) {
  beforeEachFunc[currentStory] = func;
};

var after = exports.after = function after(func) {
  afterFunc[currentStory] = func;
};

var afterEach = exports.afterEach = function afterEach(func) {
  afterEachFunc[currentStory] = func;
};

var fit = exports.fit = function fit(desc, func) {
  it(desc, func);
};

var xit = exports.xit = function xit(desc, func) {};

var xdescribe = exports.xdescribe = function xdescribe(storyName, func) {
  currentStory = storyName;
  results[currentStory] = {
    goodResults: [],
    wrongResults: []
  };
  return storyName;
};

describe.skip = function (storyName, func) {
  currentStory = storyName;
  results[currentStory] = {
    goodResults: [],
    wrongResults: []
  };
  return storyName;
};

it.only = function (desc, func) {
  it(desc, func);
};

it.skip = function (desc, func) {};

describe.only = function (storyName, func) {
  return describe(storyName, func);
};

var fdescribe = exports.fdescribe = function fdescribe(storyName, func) {
  return describe(storyName, func);
};