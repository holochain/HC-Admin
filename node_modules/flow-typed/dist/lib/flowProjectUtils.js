'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFlowRoot = findFlowRoot;

var _fileUtils = require('./fileUtils');

var _node = require('./node');

// Find the project root
function findFlowRoot(start) {
  var _this = this;

  return regeneratorRuntime.async(function findFlowRoot$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt('return', (0, _fileUtils.searchUpDirPath)(start, function _callee(dirPath) {
            var flowConfigPath;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    flowConfigPath = _node.path.join(dirPath, '.flowconfig');
                    _context.prev = 1;
                    return _context.abrupt('return', _node.fs.statSync(flowConfigPath).isFile());

                  case 5:
                    _context.prev = 5;
                    _context.t0 = _context['catch'](1);
                    return _context.abrupt('return', false);

                  case 8:
                  case 'end':
                    return _context.stop();
                }
              }
            }, null, _this, [[1, 5]]);
          }));

        case 1:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
}