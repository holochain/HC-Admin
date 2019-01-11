"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shallowSnapshot = shallowSnapshot;
exports.snapshot = exports.renderOnly = exports.renderWithOptions = exports.multiSnapshotWithOptions = exports.snapshotWithOptions = void 0;

require("jest-specific-snapshot");

const isFunction = obj => !!(obj && obj.constructor && obj.call && obj.apply);

const optionsOrCallOptions = (opts, story) => isFunction(opts) ? opts(story) : opts;

const snapshotWithOptions = (options = {}) => ({
  story,
  context,
  renderTree,
  snapshotFileName
}) => {
  const result = renderTree(story, context, optionsOrCallOptions(options, story));

  function match(tree) {
    if (snapshotFileName) {
      expect(tree).toMatchSpecificSnapshot(snapshotFileName);
    } else {
      expect(tree).toMatchSnapshot();
    }

    if (typeof tree.unmount === 'function') {
      tree.unmount();
    }
  }

  if (typeof result.then === 'function') {
    return result.then(match);
  }

  return match(result);
};

exports.snapshotWithOptions = snapshotWithOptions;

const multiSnapshotWithOptions = (options = {}) => ({
  story,
  context,
  renderTree,
  stories2snapsConverter
}) => snapshotWithOptions(options)({
  story,
  context,
  renderTree,
  snapshotFileName: stories2snapsConverter.getSnapshotFileName(context)
});

exports.multiSnapshotWithOptions = multiSnapshotWithOptions;

function shallowSnapshot({
  story,
  context,
  renderShallowTree,
  options = {}
}) {
  const result = renderShallowTree(story, context, options);
  expect(result).toMatchSnapshot();
}

const renderWithOptions = (options = {}) => ({
  story,
  context,
  renderTree
}) => {
  const result = renderTree(story, context, options);

  if (typeof result.then === 'function') {
    return result;
  }

  return undefined;
};

exports.renderWithOptions = renderWithOptions;
const renderOnly = renderWithOptions();
exports.renderOnly = renderOnly;
const snapshot = snapshotWithOptions();
exports.snapshot = snapshot;