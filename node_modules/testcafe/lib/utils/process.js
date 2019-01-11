'use strict';

exports.__esModule = true;
exports.killBrowserProcess = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let findProcessUnix = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (browserId) {
        const output = yield getProcessOutputUnix();

        return findProcessIdUnix(browserId, output);
    });

    return function findProcessUnix(_x) {
        return _ref.apply(this, arguments);
    };
})();

let checkUnixProcessIsKilled = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (processId) {
        const output = yield getProcessOutputUnix();

        if (isProcessExistUnix(processId, output)) {
            yield (0, _delay2.default)(CHECK_KILLED_DELAY);

            yield checkUnixProcessIsKilled();
        }
    });

    return function checkUnixProcessIsKilled(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

let killProcessUnix = (() => {
    var _ref3 = (0, _asyncToGenerator3.default)(function* (processId) {
        let timeoutError = false;

        process.kill(processId);

        const killTimeoutTimer = (0, _delay2.default)(CHECK_PROCESS_IS_KILLED_TIMEOUT).then(function () {
            timeoutError = true;
        });

        return _pinkie2.default.race([killTimeoutTimer, checkUnixProcessIsKilled(processId)]).then(function () {
            if (timeoutError) throw new Error(killProcessTimeoutError);
        });
    });

    return function killProcessUnix(_x3) {
        return _ref3.apply(this, arguments);
    };
})();

let runWMIC = (() => {
    var _ref4 = (0, _asyncToGenerator3.default)(function* (args) {
        const wmicProcess = (0, _child_process.spawn)('wmic.exe', args, { detached: true });

        let wmicOutput = '';

        wmicProcess.stdout.on('data', function (data) {
            wmicOutput += data.toString();
        });

        try {
            yield _pinkie2.default.race([(0, _promisifyEvent2.default)(wmicProcess.stdout, 'end'), (0, _promisifyEvent2.default)(wmicProcess, 'error')]);

            return wmicOutput;
        } catch (e) {
            return '';
        }
    });

    return function runWMIC(_x4) {
        return _ref4.apply(this, arguments);
    };
})();

let findProcessWin = (() => {
    var _ref5 = (0, _asyncToGenerator3.default)(function* (browserId) {
        const wmicArgs = ['process', 'where', `commandline like '%${browserId}%' and name <> 'cmd.exe' and name <> 'wmic.exe'`, 'get', 'processid'];
        const wmicOutput = yield runWMIC(wmicArgs);
        let processList = wmicOutput.split(/\s*\n/);

        processList = processList
        // NOTE: remove list's header and empty last element, caused by trailing newline
        .slice(1, -1).map(function (pid) {
            return { pid: Number(pid) };
        });

        return processList[0] ? processList[0].pid : null;
    });

    return function findProcessWin(_x5) {
        return _ref5.apply(this, arguments);
    };
})();

let killBrowserProcess = exports.killBrowserProcess = (() => {
    var _ref6 = (0, _asyncToGenerator3.default)(function* (browserId) {
        const processId = _osFamily2.default.win ? yield findProcessWin(browserId) : yield findProcessUnix(browserId);

        if (!processId) return true;

        try {
            if (_osFamily2.default.win) process.kill(processId);else yield killProcessUnix(processId);

            return true;
        } catch (e) {
            return false;
        }
    });

    return function killBrowserProcess(_x6) {
        return _ref6.apply(this, arguments);
    };
})();

var _child_process = require('child_process');

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _osFamily = require('os-family');

var _osFamily2 = _interopRequireDefault(_osFamily);

var _promisifyEvent = require('promisify-event');

var _promisifyEvent2 = _interopRequireDefault(_promisifyEvent);

var _delay = require('../utils/delay');

var _delay2 = _interopRequireDefault(_delay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CHECK_PROCESS_IS_KILLED_TIMEOUT = 5000;
const CHECK_KILLED_DELAY = 1000;
const NEW_LINE_SEPERATOR_RE = /(\r\n)|(\n\r)|\n|\r/g;
const cantGetListOfProcessError = 'Can not get list of processes';
const killProcessTimeoutError = 'Kill process timeout';

function getProcessOutputUnix() {
    const error = new Error(cantGetListOfProcessError);

    return new _pinkie2.default((resolve, reject) => {
        const child = (0, _child_process.spawn)('ps', ['-eo', 'pid,command']);
        let stdout = '';
        let stderr = '';

        child.stdout.on('data', data => {
            stdout += data.toString();
        });

        child.stderr.on('data', data => {
            stderr += data.toString();
        });

        child.on('exit', () => {
            if (stderr) reject(error);else resolve(stdout);
        });

        child.on('error', () => {
            reject(error);
        });
    });
}

function findProcessIdUnix(browserId, psOutput) {
    const processIdRegex = new RegExp('^\\s*(\\d+)\\s+.*' + browserId);
    const lines = psOutput.split(NEW_LINE_SEPERATOR_RE);

    for (let i = 0; i < lines.length; i++) {
        const match = processIdRegex.exec(lines[i]);

        if (match) return parseInt(match[1], 10);
    }

    return null;
}

function isProcessExistUnix(processId, psOutput) {
    const processIdRegex = new RegExp('^\\s*' + processId + '\\s+.*');
    const lines = psOutput.split(NEW_LINE_SEPERATOR_RE);

    return lines.some(line => processIdRegex.test(line));
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9wcm9jZXNzLmpzIl0sIm5hbWVzIjpbImJyb3dzZXJJZCIsIm91dHB1dCIsImdldFByb2Nlc3NPdXRwdXRVbml4IiwiZmluZFByb2Nlc3NJZFVuaXgiLCJmaW5kUHJvY2Vzc1VuaXgiLCJwcm9jZXNzSWQiLCJpc1Byb2Nlc3NFeGlzdFVuaXgiLCJDSEVDS19LSUxMRURfREVMQVkiLCJjaGVja1VuaXhQcm9jZXNzSXNLaWxsZWQiLCJ0aW1lb3V0RXJyb3IiLCJwcm9jZXNzIiwia2lsbCIsImtpbGxUaW1lb3V0VGltZXIiLCJDSEVDS19QUk9DRVNTX0lTX0tJTExFRF9USU1FT1VUIiwidGhlbiIsIlByb21pc2UiLCJyYWNlIiwiRXJyb3IiLCJraWxsUHJvY2Vzc1RpbWVvdXRFcnJvciIsImtpbGxQcm9jZXNzVW5peCIsImFyZ3MiLCJ3bWljUHJvY2VzcyIsImRldGFjaGVkIiwid21pY091dHB1dCIsInN0ZG91dCIsIm9uIiwiZGF0YSIsInRvU3RyaW5nIiwiZSIsInJ1bldNSUMiLCJ3bWljQXJncyIsInByb2Nlc3NMaXN0Iiwic3BsaXQiLCJzbGljZSIsIm1hcCIsInBpZCIsIk51bWJlciIsImZpbmRQcm9jZXNzV2luIiwiT1MiLCJ3aW4iLCJraWxsQnJvd3NlclByb2Nlc3MiLCJORVdfTElORV9TRVBFUkFUT1JfUkUiLCJjYW50R2V0TGlzdE9mUHJvY2Vzc0Vycm9yIiwiZXJyb3IiLCJyZXNvbHZlIiwicmVqZWN0IiwiY2hpbGQiLCJzdGRlcnIiLCJwc091dHB1dCIsInByb2Nlc3NJZFJlZ2V4IiwiUmVnRXhwIiwibGluZXMiLCJpIiwibGVuZ3RoIiwibWF0Y2giLCJleGVjIiwicGFyc2VJbnQiLCJzb21lIiwibGluZSIsInRlc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7K0NBOERBLFdBQWdDQSxTQUFoQyxFQUEyQztBQUN2QyxjQUFNQyxTQUFTLE1BQU1DLHNCQUFyQjs7QUFFQSxlQUFPQyxrQkFBa0JILFNBQWxCLEVBQTZC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LFVBQU1tRCxRQUFtQkgsU0FBU2hCLEtBQVQsQ0FBZVMscUJBQWYsQ0FBekI7O0FBRUEsU0FBSyxJQUFJVyxJQUFJLENBQWIsRUFBZ0JBLElBQUlELE1BQU1FLE1BQTFCLEVBQWtDRCxHQUFsQyxFQUF1QztBQUNuQyxjQUFNRSxRQUFRTCxlQUFlTSxJQUFmLENBQW9CSixNQUFNQyxDQUFOLENBQXBCLENBQWQ7O0FBRUEsWUFBSUUsS0FBSixFQUNJLE9BQU9FLFNBQVNGLE1BQU0sQ0FBTixDQUFULEVBQW1CLEVBQW5CLENBQVA7QUFDUDs7QUFFRCxXQUFPLElBQVA7QUFDSDs7QUFFRCxTQUFTaEQsa0JBQVQsQ0FBNkJELFNBQTdCLEVBQXdDMkMsUUFBeEMsRUFBa0Q7QUFDOUMsVUFBTUMsaUJBQW1CLElBQUlDLE1BQUosQ0FBVyxVQUFVN0MsU0FBVixHQUFzQixRQUFqQyxDQUF6QjtBQUNBLFVBQU04QyxRQUFtQkgsU0FBU2hCLEtBQVQsQ0FBZVMscUJBQWYsQ0FBekI7O0FBRUEsV0FBT1UsTUFBTU0sSUFBTixDQUFXQyxRQUFRVCxlQUFlVSxJQUFmLENBQW9CRCxJQUFwQixDQUFuQixDQUFQO0FBQ0giLCJmaWxlIjoidXRpbHMvcHJvY2Vzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNwYXduIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdwaW5raWUnO1xuaW1wb3J0IE9TIGZyb20gJ29zLWZhbWlseSc7XG5pbXBvcnQgcHJvbWlzaWZ5RXZlbnQgZnJvbSAncHJvbWlzaWZ5LWV2ZW50JztcbmltcG9ydCBkZWxheSBmcm9tICcuLi91dGlscy9kZWxheSc7XG5cbmNvbnN0IENIRUNLX1BST0NFU1NfSVNfS0lMTEVEX1RJTUVPVVQgPSA1MDAwO1xuY29uc3QgQ0hFQ0tfS0lMTEVEX0RFTEFZICAgICAgICAgICAgICA9IDEwMDA7XG5jb25zdCBORVdfTElORV9TRVBFUkFUT1JfUkUgICAgICAgICAgID0gLyhcXHJcXG4pfChcXG5cXHIpfFxcbnxcXHIvZztcbmNvbnN0IGNhbnRHZXRMaXN0T2ZQcm9jZXNzRXJyb3IgICAgICAgPSAnQ2FuIG5vdCBnZXQgbGlzdCBvZiBwcm9jZXNzZXMnO1xuY29uc3Qga2lsbFByb2Nlc3NUaW1lb3V0RXJyb3IgICAgICAgICA9ICdLaWxsIHByb2Nlc3MgdGltZW91dCc7XG5cbmZ1bmN0aW9uIGdldFByb2Nlc3NPdXRwdXRVbml4ICgpIHtcbiAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihjYW50R2V0TGlzdE9mUHJvY2Vzc0Vycm9yKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGNoaWxkID0gc3Bhd24oJ3BzJywgWyctZW8nLCAncGlkLGNvbW1hbmQnXSk7XG4gICAgICAgIGxldCBzdGRvdXQgID0gJyc7XG4gICAgICAgIGxldCBzdGRlcnIgID0gJyc7XG5cbiAgICAgICAgY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgICAgICBzdGRvdXQgKz0gZGF0YS50b1N0cmluZygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjaGlsZC5zdGRlcnIub24oJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgICAgIHN0ZGVyciArPSBkYXRhLnRvU3RyaW5nKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNoaWxkLm9uKCdleGl0JywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHN0ZGVycilcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJlc29sdmUoc3Rkb3V0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY2hpbGQub24oJ2Vycm9yJywgKCkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGZpbmRQcm9jZXNzSWRVbml4IChicm93c2VySWQsIHBzT3V0cHV0KSB7XG4gICAgY29uc3QgcHJvY2Vzc0lkUmVnZXggICA9IG5ldyBSZWdFeHAoJ15cXFxccyooXFxcXGQrKVxcXFxzKy4qJyArIGJyb3dzZXJJZCk7XG4gICAgY29uc3QgbGluZXMgICAgICAgICAgICA9IHBzT3V0cHV0LnNwbGl0KE5FV19MSU5FX1NFUEVSQVRPUl9SRSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gcHJvY2Vzc0lkUmVnZXguZXhlYyhsaW5lc1tpXSk7XG5cbiAgICAgICAgaWYgKG1hdGNoKVxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG1hdGNoWzFdLCAxMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzUHJvY2Vzc0V4aXN0VW5peCAocHJvY2Vzc0lkLCBwc091dHB1dCkge1xuICAgIGNvbnN0IHByb2Nlc3NJZFJlZ2V4ICAgPSBuZXcgUmVnRXhwKCdeXFxcXHMqJyArIHByb2Nlc3NJZCArICdcXFxccysuKicpO1xuICAgIGNvbnN0IGxpbmVzICAgICAgICAgICAgPSBwc091dHB1dC5zcGxpdChORVdfTElORV9TRVBFUkFUT1JfUkUpO1xuXG4gICAgcmV0dXJuIGxpbmVzLnNvbWUobGluZSA9PiBwcm9jZXNzSWRSZWdleC50ZXN0KGxpbmUpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmluZFByb2Nlc3NVbml4IChicm93c2VySWQpIHtcbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCBnZXRQcm9jZXNzT3V0cHV0VW5peCgpO1xuXG4gICAgcmV0dXJuIGZpbmRQcm9jZXNzSWRVbml4KGJyb3dzZXJJZCwgb3V0cHV0KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY2hlY2tVbml4UHJvY2Vzc0lzS2lsbGVkIChwcm9jZXNzSWQpIHtcbiAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCBnZXRQcm9jZXNzT3V0cHV0VW5peCgpO1xuXG4gICAgaWYgKGlzUHJvY2Vzc0V4aXN0VW5peChwcm9jZXNzSWQsIG91dHB1dCkpIHtcbiAgICAgICAgYXdhaXQgZGVsYXkoQ0hFQ0tfS0lMTEVEX0RFTEFZKTtcblxuICAgICAgICBhd2FpdCBjaGVja1VuaXhQcm9jZXNzSXNLaWxsZWQoKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGtpbGxQcm9jZXNzVW5peCAocHJvY2Vzc0lkKSB7XG4gICAgbGV0IHRpbWVvdXRFcnJvciA9IGZhbHNlO1xuXG4gICAgcHJvY2Vzcy5raWxsKHByb2Nlc3NJZCk7XG5cbiAgICBjb25zdCBraWxsVGltZW91dFRpbWVyID0gZGVsYXkoQ0hFQ0tfUFJPQ0VTU19JU19LSUxMRURfVElNRU9VVClcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGltZW91dEVycm9yID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yYWNlKFtraWxsVGltZW91dFRpbWVyLCBjaGVja1VuaXhQcm9jZXNzSXNLaWxsZWQocHJvY2Vzc0lkKV0pLnRoZW4oKCkgPT4ge1xuICAgICAgICBpZiAodGltZW91dEVycm9yKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGtpbGxQcm9jZXNzVGltZW91dEVycm9yKTtcbiAgICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcnVuV01JQyAoYXJncykge1xuICAgIGNvbnN0IHdtaWNQcm9jZXNzID0gc3Bhd24oJ3dtaWMuZXhlJywgYXJncywgeyBkZXRhY2hlZDogdHJ1ZSB9KTtcblxuICAgIGxldCB3bWljT3V0cHV0ICA9ICcnO1xuXG4gICAgd21pY1Byb2Nlc3Muc3Rkb3V0Lm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgIHdtaWNPdXRwdXQgKz0gZGF0YS50b1N0cmluZygpO1xuICAgIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgICAgIHByb21pc2lmeUV2ZW50KHdtaWNQcm9jZXNzLnN0ZG91dCwgJ2VuZCcpLFxuICAgICAgICAgICAgcHJvbWlzaWZ5RXZlbnQod21pY1Byb2Nlc3MsICdlcnJvcicpXG4gICAgICAgIF0pO1xuXG4gICAgICAgIHJldHVybiB3bWljT3V0cHV0O1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBmaW5kUHJvY2Vzc1dpbiAoYnJvd3NlcklkKSB7XG4gICAgY29uc3Qgd21pY0FyZ3MgICAgPSBbJ3Byb2Nlc3MnLCAnd2hlcmUnLCBgY29tbWFuZGxpbmUgbGlrZSAnJSR7YnJvd3NlcklkfSUnIGFuZCBuYW1lIDw+ICdjbWQuZXhlJyBhbmQgbmFtZSA8PiAnd21pYy5leGUnYCwgJ2dldCcsICdwcm9jZXNzaWQnXTtcbiAgICBjb25zdCB3bWljT3V0cHV0ICA9IGF3YWl0IHJ1bldNSUMod21pY0FyZ3MpO1xuICAgIGxldCBwcm9jZXNzTGlzdCA9IHdtaWNPdXRwdXQuc3BsaXQoL1xccypcXG4vKTtcblxuICAgIHByb2Nlc3NMaXN0ID0gcHJvY2Vzc0xpc3RcbiAgICAvLyBOT1RFOiByZW1vdmUgbGlzdCdzIGhlYWRlciBhbmQgZW1wdHkgbGFzdCBlbGVtZW50LCBjYXVzZWQgYnkgdHJhaWxpbmcgbmV3bGluZVxuICAgICAgICAuc2xpY2UoMSwgLTEpXG4gICAgICAgIC5tYXAocGlkID0+ICh7IHBpZDogTnVtYmVyKHBpZCkgfSkpO1xuXG4gICAgcmV0dXJuIHByb2Nlc3NMaXN0WzBdID8gcHJvY2Vzc0xpc3RbMF0ucGlkIDogbnVsbDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGtpbGxCcm93c2VyUHJvY2VzcyAoYnJvd3NlcklkKSB7XG4gICAgY29uc3QgcHJvY2Vzc0lkID0gT1Mud2luID8gYXdhaXQgZmluZFByb2Nlc3NXaW4oYnJvd3NlcklkKSA6IGF3YWl0IGZpbmRQcm9jZXNzVW5peChicm93c2VySWQpO1xuXG4gICAgaWYgKCFwcm9jZXNzSWQpXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKE9TLndpbilcbiAgICAgICAgICAgIHByb2Nlc3Mua2lsbChwcm9jZXNzSWQpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBhd2FpdCBraWxsUHJvY2Vzc1VuaXgocHJvY2Vzc0lkKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbiJdfQ==
