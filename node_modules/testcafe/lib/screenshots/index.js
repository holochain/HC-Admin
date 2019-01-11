'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _capturer = require('./capturer');

var _capturer2 = _interopRequireDefault(_capturer);

var _pathPattern = require('./path-pattern');

var _pathPattern2 = _interopRequireDefault(_pathPattern);

var _getCommonPath = require('../utils/get-common-path');

var _getCommonPath2 = _interopRequireDefault(_getCommonPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Screenshots {
    constructor(path, pattern) {
        this.enabled = !!path;
        this.screenshotsPath = path;
        this.screenshotsPattern = pattern;
        this.testEntries = [];
        this.now = (0, _moment2.default)();
    }

    _addTestEntry(test) {
        const testEntry = {
            test: test,
            screenshots: []
        };

        this.testEntries.push(testEntry);

        return testEntry;
    }

    _getTestEntry(test) {
        return (0, _lodash.find)(this.testEntries, entry => entry.test === test);
    }

    _ensureTestEntry(test) {
        let testEntry = this._getTestEntry(test);

        if (!testEntry) testEntry = this._addTestEntry(test);

        return testEntry;
    }

    getScreenshotsInfo(test) {
        return this._getTestEntry(test).screenshots;
    }

    hasCapturedFor(test) {
        return this.getScreenshotsInfo(test).length > 0;
    }

    getPathFor(test) {
        const testEntry = this._getTestEntry(test);
        const screenshotPaths = testEntry.screenshots.map(screenshot => screenshot.screenshotPath);

        return (0, _getCommonPath2.default)(screenshotPaths);
    }

    createCapturerFor(test, testIndex, quarantine, connection, warningLog) {
        const testEntry = this._ensureTestEntry(test);
        const pathPattern = new _pathPattern2.default(this.screenshotsPattern, {
            testIndex,
            quarantineAttempt: quarantine ? quarantine.getNextAttemptNumber() : null,
            now: this.now,
            fixture: test.fixture.name,
            test: test.name,
            parsedUserAgent: connection.browserInfo.parsedUserAgent
        });

        return new _capturer2.default(this.screenshotsPath, testEntry, connection, pathPattern, warningLog);
    }
}
exports.default = Screenshots;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JlZW5zaG90cy9pbmRleC5qcyJdLCJuYW1lcyI6WyJTY3JlZW5zaG90cyIsImNvbnN0cnVjdG9yIiwicGF0aCIsInBhdHRlcm4iLCJlbmFibGVkIiwic2NyZWVuc2hvdHNQYXRoIiwic2NyZWVuc2hvdHNQYXR0ZXJuIiwidGVzdEVudHJpZXMiLCJub3ciLCJfYWRkVGVzdEVudHJ5IiwidGVzdCIsInRlc3RFbnRyeSIsInNjcmVlbnNob3RzIiwicHVzaCIsIl9nZXRUZXN0RW50cnkiLCJlbnRyeSIsIl9lbnN1cmVUZXN0RW50cnkiLCJnZXRTY3JlZW5zaG90c0luZm8iLCJoYXNDYXB0dXJlZEZvciIsImxlbmd0aCIsImdldFBhdGhGb3IiLCJzY3JlZW5zaG90UGF0aHMiLCJtYXAiLCJzY3JlZW5zaG90Iiwic2NyZWVuc2hvdFBhdGgiLCJjcmVhdGVDYXB0dXJlckZvciIsInRlc3RJbmRleCIsInF1YXJhbnRpbmUiLCJjb25uZWN0aW9uIiwid2FybmluZ0xvZyIsInBhdGhQYXR0ZXJuIiwiUGF0aFBhdHRlcm4iLCJxdWFyYW50aW5lQXR0ZW1wdCIsImdldE5leHRBdHRlbXB0TnVtYmVyIiwiZml4dHVyZSIsIm5hbWUiLCJwYXJzZWRVc2VyQWdlbnQiLCJicm93c2VySW5mbyIsIkNhcHR1cmVyIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLFdBQU4sQ0FBa0I7QUFDN0JDLGdCQUFhQyxJQUFiLEVBQW1CQyxPQUFuQixFQUE0QjtBQUN4QixhQUFLQyxPQUFMLEdBQTBCLENBQUMsQ0FBQ0YsSUFBNUI7QUFDQSxhQUFLRyxlQUFMLEdBQTBCSCxJQUExQjtBQUNBLGFBQUtJLGtCQUFMLEdBQTBCSCxPQUExQjtBQUNBLGFBQUtJLFdBQUwsR0FBMEIsRUFBMUI7QUFDQSxhQUFLQyxHQUFMLEdBQTBCLHVCQUExQjtBQUNIOztBQUVEQyxrQkFBZUMsSUFBZixFQUFxQjtBQUNqQixjQUFNQyxZQUFZO0FBQ2RELGtCQUFhQSxJQURDO0FBRWRFLHlCQUFhO0FBRkMsU0FBbEI7O0FBS0EsYUFBS0wsV0FBTCxDQUFpQk0sSUFBakIsQ0FBc0JGLFNBQXRCOztBQUVBLGVBQU9BLFNBQVA7QUFDSDs7QUFFREcsa0JBQWVKLElBQWYsRUFBcUI7QUFDakIsZUFBTyxrQkFBSyxLQUFLSCxXQUFWLEVBQXVCUSxTQUFTQSxNQUFNTCxJQUFOLEtBQWVBLElBQS9DLENBQVA7QUFDSDs7QUFFRE0scUJBQWtCTixJQUFsQixFQUF3QjtBQUNwQixZQUFJQyxZQUFZLEtBQUtHLGFBQUwsQ0FBbUJKLElBQW5CLENBQWhCOztBQUVBLFlBQUksQ0FBQ0MsU0FBTCxFQUNJQSxZQUFZLEtBQUtGLGFBQUwsQ0FBbUJDLElBQW5CLENBQVo7O0FBRUosZUFBT0MsU0FBUDtBQUNIOztBQUVETSx1QkFBb0JQLElBQXBCLEVBQTBCO0FBQ3RCLGVBQU8sS0FBS0ksYUFBTCxDQUFtQkosSUFBbkIsRUFBeUJFLFdBQWhDO0FBQ0g7O0FBRURNLG1CQUFnQlIsSUFBaEIsRUFBc0I7QUFDbEIsZUFBTyxLQUFLTyxrQkFBTCxDQUF3QlAsSUFBeEIsRUFBOEJTLE1BQTlCLEdBQXVDLENBQTlDO0FBQ0g7O0FBRURDLGVBQVlWLElBQVosRUFBa0I7QUFDZCxjQUFNQyxZQUFrQixLQUFLRyxhQUFMLENBQW1CSixJQUFuQixDQUF4QjtBQUNBLGNBQU1XLGtCQUFrQlYsVUFBVUMsV0FBVixDQUFzQlUsR0FBdEIsQ0FBMEJDLGNBQWNBLFdBQVdDLGNBQW5ELENBQXhCOztBQUVBLGVBQU8sNkJBQWNILGVBQWQsQ0FBUDtBQUNIOztBQUVESSxzQkFBbUJmLElBQW5CLEVBQXlCZ0IsU0FBekIsRUFBb0NDLFVBQXBDLEVBQWdEQyxVQUFoRCxFQUE0REMsVUFBNUQsRUFBd0U7QUFDcEUsY0FBTWxCLFlBQWMsS0FBS0ssZ0JBQUwsQ0FBc0JOLElBQXRCLENBQXBCO0FBQ0EsY0FBTW9CLGNBQWMsSUFBSUMscUJBQUosQ0FBZ0IsS0FBS3pCLGtCQUFyQixFQUF5QztBQUN6RG9CLHFCQUR5RDtBQUV6RE0sK0JBQW1CTCxhQUFhQSxXQUFXTSxvQkFBWCxFQUFiLEdBQWlELElBRlg7QUFHekR6QixpQkFBbUIsS0FBS0EsR0FIaUM7QUFJekQwQixxQkFBbUJ4QixLQUFLd0IsT0FBTCxDQUFhQyxJQUp5QjtBQUt6RHpCLGtCQUFtQkEsS0FBS3lCLElBTGlDO0FBTXpEQyw2QkFBbUJSLFdBQVdTLFdBQVgsQ0FBdUJEO0FBTmUsU0FBekMsQ0FBcEI7O0FBU0EsZUFBTyxJQUFJRSxrQkFBSixDQUFhLEtBQUtqQyxlQUFsQixFQUFtQ00sU0FBbkMsRUFBOENpQixVQUE5QyxFQUEwREUsV0FBMUQsRUFBdUVELFVBQXZFLENBQVA7QUFDSDtBQTVENEI7a0JBQVo3QixXIiwiZmlsZSI6InNjcmVlbnNob3RzL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmluZCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgQ2FwdHVyZXIgZnJvbSAnLi9jYXB0dXJlcic7XG5pbXBvcnQgUGF0aFBhdHRlcm4gZnJvbSAnLi9wYXRoLXBhdHRlcm4nO1xuaW1wb3J0IGdldENvbW1vblBhdGggZnJvbSAnLi4vdXRpbHMvZ2V0LWNvbW1vbi1wYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyZWVuc2hvdHMge1xuICAgIGNvbnN0cnVjdG9yIChwYXRoLCBwYXR0ZXJuKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlZCAgICAgICAgICAgID0gISFwYXRoO1xuICAgICAgICB0aGlzLnNjcmVlbnNob3RzUGF0aCAgICA9IHBhdGg7XG4gICAgICAgIHRoaXMuc2NyZWVuc2hvdHNQYXR0ZXJuID0gcGF0dGVybjtcbiAgICAgICAgdGhpcy50ZXN0RW50cmllcyAgICAgICAgPSBbXTtcbiAgICAgICAgdGhpcy5ub3cgICAgICAgICAgICAgICAgPSBtb21lbnQoKTtcbiAgICB9XG5cbiAgICBfYWRkVGVzdEVudHJ5ICh0ZXN0KSB7XG4gICAgICAgIGNvbnN0IHRlc3RFbnRyeSA9IHtcbiAgICAgICAgICAgIHRlc3Q6ICAgICAgICB0ZXN0LFxuICAgICAgICAgICAgc2NyZWVuc2hvdHM6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy50ZXN0RW50cmllcy5wdXNoKHRlc3RFbnRyeSk7XG5cbiAgICAgICAgcmV0dXJuIHRlc3RFbnRyeTtcbiAgICB9XG5cbiAgICBfZ2V0VGVzdEVudHJ5ICh0ZXN0KSB7XG4gICAgICAgIHJldHVybiBmaW5kKHRoaXMudGVzdEVudHJpZXMsIGVudHJ5ID0+IGVudHJ5LnRlc3QgPT09IHRlc3QpO1xuICAgIH1cblxuICAgIF9lbnN1cmVUZXN0RW50cnkgKHRlc3QpIHtcbiAgICAgICAgbGV0IHRlc3RFbnRyeSA9IHRoaXMuX2dldFRlc3RFbnRyeSh0ZXN0KTtcblxuICAgICAgICBpZiAoIXRlc3RFbnRyeSlcbiAgICAgICAgICAgIHRlc3RFbnRyeSA9IHRoaXMuX2FkZFRlc3RFbnRyeSh0ZXN0KTtcblxuICAgICAgICByZXR1cm4gdGVzdEVudHJ5O1xuICAgIH1cblxuICAgIGdldFNjcmVlbnNob3RzSW5mbyAodGVzdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0VGVzdEVudHJ5KHRlc3QpLnNjcmVlbnNob3RzO1xuICAgIH1cblxuICAgIGhhc0NhcHR1cmVkRm9yICh0ZXN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFNjcmVlbnNob3RzSW5mbyh0ZXN0KS5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIGdldFBhdGhGb3IgKHRlc3QpIHtcbiAgICAgICAgY29uc3QgdGVzdEVudHJ5ICAgICAgID0gdGhpcy5fZ2V0VGVzdEVudHJ5KHRlc3QpO1xuICAgICAgICBjb25zdCBzY3JlZW5zaG90UGF0aHMgPSB0ZXN0RW50cnkuc2NyZWVuc2hvdHMubWFwKHNjcmVlbnNob3QgPT4gc2NyZWVuc2hvdC5zY3JlZW5zaG90UGF0aCk7XG5cbiAgICAgICAgcmV0dXJuIGdldENvbW1vblBhdGgoc2NyZWVuc2hvdFBhdGhzKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDYXB0dXJlckZvciAodGVzdCwgdGVzdEluZGV4LCBxdWFyYW50aW5lLCBjb25uZWN0aW9uLCB3YXJuaW5nTG9nKSB7XG4gICAgICAgIGNvbnN0IHRlc3RFbnRyeSAgID0gdGhpcy5fZW5zdXJlVGVzdEVudHJ5KHRlc3QpO1xuICAgICAgICBjb25zdCBwYXRoUGF0dGVybiA9IG5ldyBQYXRoUGF0dGVybih0aGlzLnNjcmVlbnNob3RzUGF0dGVybiwge1xuICAgICAgICAgICAgdGVzdEluZGV4LFxuICAgICAgICAgICAgcXVhcmFudGluZUF0dGVtcHQ6IHF1YXJhbnRpbmUgPyBxdWFyYW50aW5lLmdldE5leHRBdHRlbXB0TnVtYmVyKCkgOiBudWxsLFxuICAgICAgICAgICAgbm93OiAgICAgICAgICAgICAgIHRoaXMubm93LFxuICAgICAgICAgICAgZml4dHVyZTogICAgICAgICAgIHRlc3QuZml4dHVyZS5uYW1lLFxuICAgICAgICAgICAgdGVzdDogICAgICAgICAgICAgIHRlc3QubmFtZSxcbiAgICAgICAgICAgIHBhcnNlZFVzZXJBZ2VudDogICBjb25uZWN0aW9uLmJyb3dzZXJJbmZvLnBhcnNlZFVzZXJBZ2VudCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBDYXB0dXJlcih0aGlzLnNjcmVlbnNob3RzUGF0aCwgdGVzdEVudHJ5LCBjb25uZWN0aW9uLCBwYXRoUGF0dGVybiwgd2FybmluZ0xvZyk7XG4gICAgfVxufVxuIl19
