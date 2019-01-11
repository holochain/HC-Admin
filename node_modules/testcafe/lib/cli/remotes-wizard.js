'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _qrcodeTerminal = require('qrcode-terminal');

var _qrcodeTerminal2 = _interopRequireDefault(_qrcodeTerminal);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _log = require('./log');

var _log2 = _interopRequireDefault(_log);

var _promisifyEvent = require('promisify-event');

var _promisifyEvent2 = _interopRequireDefault(_promisifyEvent);

var _dedent = require('dedent');

var _dedent2 = _interopRequireDefault(_dedent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (testCafe, remoteCount, showQRCode) {
        const connectionPromises = [];

        if (remoteCount) {
            _log2.default.hideSpinner();

            const description = (0, _dedent2.default)(`
            Connecting ${remoteCount} remote browser(s)...
            Navigate to the following URL from each remote browser.
        `);

            _log2.default.write(description);

            if (showQRCode) _log2.default.write('You can either enter the URL or scan the QR-code.');

            const connectionUrl = testCafe.browserConnectionGateway.connectUrl;

            _log2.default.write(`Connect URL: ${_chalk2.default.underline.blue(connectionUrl)}`);

            if (showQRCode) _qrcodeTerminal2.default.generate(connectionUrl);

            for (let i = 0; i < remoteCount; i++) {
                connectionPromises.push(testCafe.createBrowserConnection().then(function (bc) {
                    return (0, _promisifyEvent2.default)(bc, 'ready').then(function () {
                        return bc;
                    });
                }).then(function (bc) {
                    _log2.default.hideSpinner();
                    _log2.default.write(`${_chalk2.default.green('CONNECTED')} ${bc.userAgent}`);
                    _log2.default.showSpinner();
                    return bc;
                }));
            }

            _log2.default.showSpinner();
        }

        return yield _pinkie2.default.all(connectionPromises);
    });

    return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
})();

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvcmVtb3Rlcy13aXphcmQuanMiXSwibmFtZXMiOlsidGVzdENhZmUiLCJyZW1vdGVDb3VudCIsInNob3dRUkNvZGUiLCJjb25uZWN0aW9uUHJvbWlzZXMiLCJsb2ciLCJoaWRlU3Bpbm5lciIsImRlc2NyaXB0aW9uIiwid3JpdGUiLCJjb25uZWN0aW9uVXJsIiwiYnJvd3NlckNvbm5lY3Rpb25HYXRld2F5IiwiY29ubmVjdFVybCIsImNoYWxrIiwidW5kZXJsaW5lIiwiYmx1ZSIsInFyY29kZSIsImdlbmVyYXRlIiwiaSIsInB1c2giLCJjcmVhdGVCcm93c2VyQ29ubmVjdGlvbiIsInRoZW4iLCJiYyIsImdyZWVuIiwidXNlckFnZW50Iiwic2hvd1NwaW5uZXIiLCJQcm9taXNlIiwiYWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7OzsrQ0FHZSxXQUFnQkEsUUFBaEIsRUFBMEJDLFdBQTFCLEVBQXVDQyxVQUF2QyxFQUFtRDtBQUM5RCxjQUFNQyxxQkFBcUIsRUFBM0I7O0FBRUEsWUFBSUYsV0FBSixFQUFpQjtBQUNiRywwQkFBSUMsV0FBSjs7QUFFQSxrQkFBTUMsY0FBYyxzQkFBUTt5QkFDWEwsV0FBWTs7U0FEVCxDQUFwQjs7QUFLQUcsMEJBQUlHLEtBQUosQ0FBVUQsV0FBVjs7QUFFQSxnQkFBSUosVUFBSixFQUNJRSxjQUFJRyxLQUFKLENBQVUsbURBQVY7O0FBRUosa0JBQU1DLGdCQUFnQlIsU0FBU1Msd0JBQVQsQ0FBa0NDLFVBQXhEOztBQUVBTiwwQkFBSUcsS0FBSixDQUFXLGdCQUFlSSxnQkFBTUMsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJMLGFBQXJCLENBQW9DLEVBQTlEOztBQUVBLGdCQUFJTixVQUFKLEVBQ0lZLHlCQUFPQyxRQUFQLENBQWdCUCxhQUFoQjs7QUFFSixpQkFBSyxJQUFJUSxJQUFJLENBQWIsRUFBZ0JBLElBQUlmLFdBQXBCLEVBQWlDZSxHQUFqQyxFQUFzQztBQUNsQ2IsbUNBQW1CYyxJQUFuQixDQUF3QmpCLFNBQ25Ca0IsdUJBRG1CLEdBRW5CQyxJQUZtQixDQUVkO0FBQUEsMkJBQU0sOEJBQWVDLEVBQWYsRUFBbUIsT0FBbkIsRUFBNEJELElBQTVCLENBQWlDO0FBQUEsK0JBQU1DLEVBQU47QUFBQSxxQkFBakMsQ0FBTjtBQUFBLGlCQUZjLEVBR25CRCxJQUhtQixDQUdkLGNBQU07QUFDUmYsa0NBQUlDLFdBQUo7QUFDQUQsa0NBQUlHLEtBQUosQ0FBVyxHQUFFSSxnQkFBTVUsS0FBTixDQUFZLFdBQVosQ0FBeUIsSUFBR0QsR0FBR0UsU0FBVSxFQUF0RDtBQUNBbEIsa0NBQUltQixXQUFKO0FBQ0EsMkJBQU9ILEVBQVA7QUFDSCxpQkFSbUIsQ0FBeEI7QUFVSDs7QUFFRGhCLDBCQUFJbUIsV0FBSjtBQUNIOztBQUVELGVBQU8sTUFBTUMsaUJBQVFDLEdBQVIsQ0FBWXRCLGtCQUFaLENBQWI7QUFDSCxLIiwiZmlsZSI6ImNsaS9yZW1vdGVzLXdpemFyZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9taXNlIGZyb20gJ3BpbmtpZSc7XG5pbXBvcnQgcXJjb2RlIGZyb20gJ3FyY29kZS10ZXJtaW5hbCc7XG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuaW1wb3J0IGxvZyBmcm9tICcuL2xvZyc7XG5pbXBvcnQgcHJvbWlzaWZ5RXZlbnQgZnJvbSAncHJvbWlzaWZ5LWV2ZW50JztcbmltcG9ydCBkZWRlbnQgZnJvbSAnZGVkZW50JztcblxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAodGVzdENhZmUsIHJlbW90ZUNvdW50LCBzaG93UVJDb2RlKSB7XG4gICAgY29uc3QgY29ubmVjdGlvblByb21pc2VzID0gW107XG5cbiAgICBpZiAocmVtb3RlQ291bnQpIHtcbiAgICAgICAgbG9nLmhpZGVTcGlubmVyKCk7XG5cbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBkZWRlbnQoYFxuICAgICAgICAgICAgQ29ubmVjdGluZyAke3JlbW90ZUNvdW50fSByZW1vdGUgYnJvd3NlcihzKS4uLlxuICAgICAgICAgICAgTmF2aWdhdGUgdG8gdGhlIGZvbGxvd2luZyBVUkwgZnJvbSBlYWNoIHJlbW90ZSBicm93c2VyLlxuICAgICAgICBgKTtcblxuICAgICAgICBsb2cud3JpdGUoZGVzY3JpcHRpb24pO1xuXG4gICAgICAgIGlmIChzaG93UVJDb2RlKVxuICAgICAgICAgICAgbG9nLndyaXRlKCdZb3UgY2FuIGVpdGhlciBlbnRlciB0aGUgVVJMIG9yIHNjYW4gdGhlIFFSLWNvZGUuJyk7XG5cbiAgICAgICAgY29uc3QgY29ubmVjdGlvblVybCA9IHRlc3RDYWZlLmJyb3dzZXJDb25uZWN0aW9uR2F0ZXdheS5jb25uZWN0VXJsO1xuXG4gICAgICAgIGxvZy53cml0ZShgQ29ubmVjdCBVUkw6ICR7Y2hhbGsudW5kZXJsaW5lLmJsdWUoY29ubmVjdGlvblVybCl9YCk7XG5cbiAgICAgICAgaWYgKHNob3dRUkNvZGUpXG4gICAgICAgICAgICBxcmNvZGUuZ2VuZXJhdGUoY29ubmVjdGlvblVybCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW1vdGVDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBjb25uZWN0aW9uUHJvbWlzZXMucHVzaCh0ZXN0Q2FmZVxuICAgICAgICAgICAgICAgIC5jcmVhdGVCcm93c2VyQ29ubmVjdGlvbigpXG4gICAgICAgICAgICAgICAgLnRoZW4oYmMgPT4gcHJvbWlzaWZ5RXZlbnQoYmMsICdyZWFkeScpLnRoZW4oKCkgPT4gYmMpKVxuICAgICAgICAgICAgICAgIC50aGVuKGJjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9nLmhpZGVTcGlubmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIGxvZy53cml0ZShgJHtjaGFsay5ncmVlbignQ09OTkVDVEVEJyl9ICR7YmMudXNlckFnZW50fWApO1xuICAgICAgICAgICAgICAgICAgICBsb2cuc2hvd1NwaW5uZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJjO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9nLnNob3dTcGlubmVyKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKGNvbm5lY3Rpb25Qcm9taXNlcyk7XG59XG4iXX0=
