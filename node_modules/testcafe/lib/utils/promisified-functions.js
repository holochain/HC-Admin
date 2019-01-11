'use strict';

exports.__esModule = true;
exports.sendMessageToChildProcess = exports.exec = exports.deleteFile = exports.readFile = exports.writeFile = exports.stat = exports.readDir = undefined;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _gracefulFs = require('graceful-fs');

var _gracefulFs2 = _interopRequireDefault(_gracefulFs);

var _promisify = require('./promisify');

var _promisify2 = _interopRequireDefault(_promisify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readDir = exports.readDir = (0, _promisify2.default)(_gracefulFs2.default.readdir);
const stat = exports.stat = (0, _promisify2.default)(_gracefulFs2.default.stat);
const writeFile = exports.writeFile = (0, _promisify2.default)(_gracefulFs2.default.writeFile);
const readFile = exports.readFile = (0, _promisify2.default)(_gracefulFs2.default.readFile);
const deleteFile = exports.deleteFile = (0, _promisify2.default)(_gracefulFs2.default.unlink);

const exec = exports.exec = (0, _promisify2.default)(_child_process2.default.exec);

const sendMessageToChildProcess = exports.sendMessageToChildProcess = (0, _promisify2.default)((process, ...args) => process.send(...args));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9wcm9taXNpZmllZC1mdW5jdGlvbnMuanMiXSwibmFtZXMiOlsicmVhZERpciIsImZzIiwicmVhZGRpciIsInN0YXQiLCJ3cml0ZUZpbGUiLCJyZWFkRmlsZSIsImRlbGV0ZUZpbGUiLCJ1bmxpbmsiLCJleGVjIiwiY2hpbGRQcm9jZXNzIiwic2VuZE1lc3NhZ2VUb0NoaWxkUHJvY2VzcyIsInByb2Nlc3MiLCJhcmdzIiwic2VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdPLE1BQU1BLDRCQUFhLHlCQUFVQyxxQkFBR0MsT0FBYixDQUFuQjtBQUNBLE1BQU1DLHNCQUFhLHlCQUFVRixxQkFBR0UsSUFBYixDQUFuQjtBQUNBLE1BQU1DLGdDQUFhLHlCQUFVSCxxQkFBR0csU0FBYixDQUFuQjtBQUNBLE1BQU1DLDhCQUFhLHlCQUFVSixxQkFBR0ksUUFBYixDQUFuQjtBQUNBLE1BQU1DLGtDQUFhLHlCQUFVTCxxQkFBR00sTUFBYixDQUFuQjs7QUFFQSxNQUFNQyxzQkFBTyx5QkFBVUMsd0JBQWFELElBQXZCLENBQWI7O0FBRUEsTUFBTUUsZ0VBQTRCLHlCQUFVLENBQUNDLE9BQUQsRUFBVSxHQUFHQyxJQUFiLEtBQXNCRCxRQUFRRSxJQUFSLENBQWEsR0FBR0QsSUFBaEIsQ0FBaEMsQ0FBbEMiLCJmaWxlIjoidXRpbHMvcHJvbWlzaWZpZWQtZnVuY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoaWxkUHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBmcyBmcm9tICdncmFjZWZ1bC1mcyc7XG5pbXBvcnQgcHJvbWlzaWZ5IGZyb20gJy4vcHJvbWlzaWZ5JztcblxuXG5leHBvcnQgY29uc3QgcmVhZERpciAgICA9IHByb21pc2lmeShmcy5yZWFkZGlyKTtcbmV4cG9ydCBjb25zdCBzdGF0ICAgICAgID0gcHJvbWlzaWZ5KGZzLnN0YXQpO1xuZXhwb3J0IGNvbnN0IHdyaXRlRmlsZSAgPSBwcm9taXNpZnkoZnMud3JpdGVGaWxlKTtcbmV4cG9ydCBjb25zdCByZWFkRmlsZSAgID0gcHJvbWlzaWZ5KGZzLnJlYWRGaWxlKTtcbmV4cG9ydCBjb25zdCBkZWxldGVGaWxlID0gcHJvbWlzaWZ5KGZzLnVubGluayk7XG5cbmV4cG9ydCBjb25zdCBleGVjID0gcHJvbWlzaWZ5KGNoaWxkUHJvY2Vzcy5leGVjKTtcblxuZXhwb3J0IGNvbnN0IHNlbmRNZXNzYWdlVG9DaGlsZFByb2Nlc3MgPSBwcm9taXNpZnkoKHByb2Nlc3MsIC4uLmFyZ3MpID0+IHByb2Nlc3Muc2VuZCguLi5hcmdzKSk7XG4iXX0=
