'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _testcafeBrowserTools = require('testcafe-browser-tools');

var _crop = require('./crop');

var _crop2 = _interopRequireDefault(_crop);

var _makeDir = require('make-dir');

var _makeDir2 = _interopRequireDefault(_makeDir);

var _asyncQueue = require('../utils/async-queue');

var _warningMessage = require('../notifications/warning-message');

var _warningMessage2 = _interopRequireDefault(_warningMessage);

var _escapeUserAgent = require('../utils/escape-user-agent');

var _escapeUserAgent2 = _interopRequireDefault(_escapeUserAgent);

var _correctFilePath = require('../utils/correct-file-path');

var _correctFilePath2 = _interopRequireDefault(_correctFilePath);

var _promisifiedFunctions = require('../utils/promisified-functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Capturer {
    constructor(baseScreenshotsPath, testEntry, connection, pathPattern, warningLog) {
        this.enabled = !!baseScreenshotsPath;
        this.baseScreenshotsPath = baseScreenshotsPath;
        this.testEntry = testEntry;
        this.provider = connection.provider;
        this.browserId = connection.id;
        this.warningLog = warningLog;
        this.pathPattern = pathPattern;
    }

    static _getDimensionWithoutScrollbar(fullDimension, documentDimension, bodyDimension) {
        if (bodyDimension > fullDimension) return documentDimension;

        if (documentDimension > fullDimension) return bodyDimension;

        return Math.max(documentDimension, bodyDimension);
    }

    static _getCropDimensions(cropDimensions, pageDimensions) {
        if (!cropDimensions || !pageDimensions) return null;

        const dpr = pageDimensions.dpr;
        const top = cropDimensions.top,
              left = cropDimensions.left,
              bottom = cropDimensions.bottom,
              right = cropDimensions.right;


        return {
            top: Math.round(top * dpr),
            left: Math.round(left * dpr),
            bottom: Math.round(bottom * dpr),
            right: Math.round(right * dpr)
        };
    }

    static _getClientAreaDimensions(pageDimensions) {
        if (!pageDimensions) return null;

        const innerWidth = pageDimensions.innerWidth,
              documentWidth = pageDimensions.documentWidth,
              bodyWidth = pageDimensions.bodyWidth,
              innerHeight = pageDimensions.innerHeight,
              documentHeight = pageDimensions.documentHeight,
              bodyHeight = pageDimensions.bodyHeight,
              dpr = pageDimensions.dpr;


        return {
            width: Math.floor(Capturer._getDimensionWithoutScrollbar(innerWidth, documentWidth, bodyWidth) * dpr),
            height: Math.floor(Capturer._getDimensionWithoutScrollbar(innerHeight, documentHeight, bodyHeight) * dpr)
        };
    }

    static _isScreenshotCaptured(screenshotPath) {
        return (0, _asyncToGenerator3.default)(function* () {
            try {
                const stats = yield (0, _promisifiedFunctions.stat)(screenshotPath);

                return stats.isFile();
            } catch (e) {
                return false;
            }
        })();
    }

    _joinWithBaseScreenshotPath(path) {
        return (0, _path.join)(this.baseScreenshotsPath, path);
    }

    _incrementFileIndexes(forError) {
        if (forError) this.pathPattern.data.errorFileIndex++;else this.pathPattern.data.fileIndex++;
    }

    _getCustomScreenshotPath(customPath) {
        const correctedCustomPath = (0, _correctFilePath2.default)(customPath);

        return this._joinWithBaseScreenshotPath(correctedCustomPath);
    }

    _getScreenshotPath(forError) {
        const path = this.pathPattern.getPath(forError);

        this._incrementFileIndexes(forError);

        return this._joinWithBaseScreenshotPath(path);
    }

    _getThumbnailPath(screenshotPath) {
        const imageName = (0, _path.basename)(screenshotPath);
        const imageDir = (0, _path.dirname)(screenshotPath);

        return (0, _path.join)(imageDir, 'thumbnails', imageName);
    }

    _takeScreenshot(filePath, pageWidth, pageHeight) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            yield (0, _makeDir2.default)((0, _path.dirname)(filePath));
            yield _this.provider.takeScreenshot(_this.browserId, filePath, pageWidth, pageHeight);
        })();
    }

    _capture(forError, { pageDimensions, cropDimensions, markSeed, customPath } = {}) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!_this2.enabled) return null;

            const screenshotPath = customPath ? _this2._getCustomScreenshotPath(customPath) : _this2._getScreenshotPath(forError);
            const thumbnailPath = _this2._getThumbnailPath(screenshotPath);

            if ((0, _asyncQueue.isInQueue)(screenshotPath)) _this2.warningLog.addWarning(_warningMessage2.default.screenshotRewritingError, screenshotPath);

            yield (0, _asyncQueue.addToQueue)(screenshotPath, (0, _asyncToGenerator3.default)(function* () {
                yield _this2._takeScreenshot(screenshotPath, ...(pageDimensions ? [pageDimensions.innerWidth, pageDimensions.innerHeight] : []));

                if (!(yield Capturer._isScreenshotCaptured(screenshotPath))) return;

                yield (0, _crop2.default)(screenshotPath, markSeed, Capturer._getClientAreaDimensions(pageDimensions), Capturer._getCropDimensions(cropDimensions, pageDimensions));

                yield (0, _testcafeBrowserTools.generateThumbnail)(screenshotPath, thumbnailPath);
            }));

            const screenshot = {
                screenshotPath,
                thumbnailPath,
                userAgent: (0, _escapeUserAgent2.default)(_this2.pathPattern.data.parsedUserAgent),
                quarantineAttempt: _this2.pathPattern.data.quarantineAttempt,
                takenOnFail: forError
            };

            _this2.testEntry.screenshots.push(screenshot);

            return screenshotPath;
        })();
    }

    captureAction(options) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return yield _this3._capture(false, options);
        })();
    }

    captureError(options) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return yield _this4._capture(true, options);
        })();
    }
}
exports.default = Capturer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JlZW5zaG90cy9jYXB0dXJlci5qcyJdLCJuYW1lcyI6WyJDYXB0dXJlciIsImNvbnN0cnVjdG9yIiwiYmFzZVNjcmVlbnNob3RzUGF0aCIsInRlc3RFbnRyeSIsImNvbm5lY3Rpb24iLCJwYXRoUGF0dGVybiIsIndhcm5pbmdMb2ciLCJlbmFibGVkIiwicHJvdmlkZXIiLCJicm93c2VySWQiLCJpZCIsIl9nZXREaW1lbnNpb25XaXRob3V0U2Nyb2xsYmFyIiwiZnVsbERpbWVuc2lvbiIsImRvY3VtZW50RGltZW5zaW9uIiwiYm9keURpbWVuc2lvbiIsIk1hdGgiLCJtYXgiLCJfZ2V0Q3JvcERpbWVuc2lvbnMiLCJjcm9wRGltZW5zaW9ucyIsInBhZ2VEaW1lbnNpb25zIiwiZHByIiwidG9wIiwibGVmdCIsImJvdHRvbSIsInJpZ2h0Iiwicm91bmQiLCJfZ2V0Q2xpZW50QXJlYURpbWVuc2lvbnMiLCJpbm5lcldpZHRoIiwiZG9jdW1lbnRXaWR0aCIsImJvZHlXaWR0aCIsImlubmVySGVpZ2h0IiwiZG9jdW1lbnRIZWlnaHQiLCJib2R5SGVpZ2h0Iiwid2lkdGgiLCJmbG9vciIsImhlaWdodCIsIl9pc1NjcmVlbnNob3RDYXB0dXJlZCIsInNjcmVlbnNob3RQYXRoIiwic3RhdHMiLCJpc0ZpbGUiLCJlIiwiX2pvaW5XaXRoQmFzZVNjcmVlbnNob3RQYXRoIiwicGF0aCIsIl9pbmNyZW1lbnRGaWxlSW5kZXhlcyIsImZvckVycm9yIiwiZGF0YSIsImVycm9yRmlsZUluZGV4IiwiZmlsZUluZGV4IiwiX2dldEN1c3RvbVNjcmVlbnNob3RQYXRoIiwiY3VzdG9tUGF0aCIsImNvcnJlY3RlZEN1c3RvbVBhdGgiLCJfZ2V0U2NyZWVuc2hvdFBhdGgiLCJnZXRQYXRoIiwiX2dldFRodW1ibmFpbFBhdGgiLCJpbWFnZU5hbWUiLCJpbWFnZURpciIsIl90YWtlU2NyZWVuc2hvdCIsImZpbGVQYXRoIiwicGFnZVdpZHRoIiwicGFnZUhlaWdodCIsInRha2VTY3JlZW5zaG90IiwiX2NhcHR1cmUiLCJtYXJrU2VlZCIsInRodW1ibmFpbFBhdGgiLCJhZGRXYXJuaW5nIiwiV0FSTklOR19NRVNTQUdFIiwic2NyZWVuc2hvdFJld3JpdGluZ0Vycm9yIiwic2NyZWVuc2hvdCIsInVzZXJBZ2VudCIsInBhcnNlZFVzZXJBZ2VudCIsInF1YXJhbnRpbmVBdHRlbXB0IiwidGFrZW5PbkZhaWwiLCJzY3JlZW5zaG90cyIsInB1c2giLCJjYXB0dXJlQWN0aW9uIiwib3B0aW9ucyIsImNhcHR1cmVFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFZSxNQUFNQSxRQUFOLENBQWU7QUFDMUJDLGdCQUFhQyxtQkFBYixFQUFrQ0MsU0FBbEMsRUFBNkNDLFVBQTdDLEVBQXlEQyxXQUF6RCxFQUFzRUMsVUFBdEUsRUFBa0Y7QUFDOUUsYUFBS0MsT0FBTCxHQUEyQixDQUFDLENBQUNMLG1CQUE3QjtBQUNBLGFBQUtBLG1CQUFMLEdBQTJCQSxtQkFBM0I7QUFDQSxhQUFLQyxTQUFMLEdBQTJCQSxTQUEzQjtBQUNBLGFBQUtLLFFBQUwsR0FBMkJKLFdBQVdJLFFBQXRDO0FBQ0EsYUFBS0MsU0FBTCxHQUEyQkwsV0FBV00sRUFBdEM7QUFDQSxhQUFLSixVQUFMLEdBQTJCQSxVQUEzQjtBQUNBLGFBQUtELFdBQUwsR0FBMkJBLFdBQTNCO0FBQ0g7O0FBRUQsV0FBT00sNkJBQVAsQ0FBc0NDLGFBQXRDLEVBQXFEQyxpQkFBckQsRUFBd0VDLGFBQXhFLEVBQXVGO0FBQ25GLFlBQUlBLGdCQUFnQkYsYUFBcEIsRUFDSSxPQUFPQyxpQkFBUDs7QUFFSixZQUFJQSxvQkFBb0JELGFBQXhCLEVBQ0ksT0FBT0UsYUFBUDs7QUFFSixlQUFPQyxLQUFLQyxHQUFMLENBQVNILGlCQUFULEVBQTRCQyxhQUE1QixDQUFQO0FBQ0g7O0FBRUQsV0FBT0csa0JBQVAsQ0FB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QTRCUixlQUFlVyxXQUEzQyxDQUFqQixHQUEyRSxFQUEvRSxDQUFyQyxDQUFOOztBQUVBLG9CQUFJLEVBQUMsTUFBTTlCLFNBQVNvQyxxQkFBVCxDQUErQkMsY0FBL0IsQ0FBUCxDQUFKLEVBQ0k7O0FBRUosc0JBQU0sb0JBQWVBLGNBQWYsRUFBK0J5QixRQUEvQixFQUF5QzlELFNBQVMwQix3QkFBVCxDQUFrQ1AsY0FBbEMsQ0FBekMsRUFBNEZuQixTQUFTaUIsa0JBQVQsQ0FBNEJDLGNBQTVCLEVBQTRDQyxjQUE1QyxDQUE1RixDQUFOOztBQUVBLHNCQUFNLDZDQUFrQmtCLGNBQWxCLEVBQWtDMEIsYUFBbEMsQ0FBTjtBQUNILGFBVEssRUFBTjs7QUFXQSxrQkFBTUksYUFBYTtBQUNmOUIsOEJBRGU7QUFFZjBCLDZCQUZlO0FBR2ZLLDJCQUFtQiwrQkFBZ0IsT0FBSy9ELFdBQUwsQ0FBaUJ3QyxJQUFqQixDQUFzQndCLGVBQXRDLENBSEo7QUFJZkMsbUNBQW1CLE9BQUtqRSxXQUFMLENBQWlCd0MsSUFBakIsQ0FBc0J5QixpQkFKMUI7QUFLZkMsNkJBQW1CM0I7QUFMSixhQUFuQjs7QUFRQSxtQkFBS3pDLFNBQUwsQ0FBZXFFLFdBQWYsQ0FBMkJDLElBQTNCLENBQWdDTixVQUFoQzs7QUFFQSxtQkFBTzlCLGNBQVA7QUEvQnFGO0FBZ0N4Rjs7QUFFS3FDLGlCQUFOLENBQXFCQyxPQUFyQixFQUE4QjtBQUFBOztBQUFBO0FBQzFCLG1CQUFPLE1BQU0sT0FBS2QsUUFBTCxDQUFjLEtBQWQsRUFBcUJjLE9BQXJCLENBQWI7QUFEMEI7QUFFN0I7O0FBRUtDLGdCQUFOLENBQW9CRCxPQUFwQixFQUE2QjtBQUFBOztBQUFBO0FBQ3pCLG1CQUFPLE1BQU0sT0FBS2QsUUFBTCxDQUFjLElBQWQsRUFBb0JjLE9BQXBCLENBQWI7QUFEeUI7QUFFNUI7QUF6SXlCO2tCQUFUM0UsUSIsImZpbGUiOiJzY3JlZW5zaG90cy9jYXB0dXJlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4gYXMgam9pblBhdGgsIGRpcm5hbWUsIGJhc2VuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBnZW5lcmF0ZVRodW1ibmFpbCB9IGZyb20gJ3Rlc3RjYWZlLWJyb3dzZXItdG9vbHMnO1xuaW1wb3J0IGNyb3BTY3JlZW5zaG90IGZyb20gJy4vY3JvcCc7XG5pbXBvcnQgbWFrZURpciBmcm9tICdtYWtlLWRpcic7XG5pbXBvcnQgeyBpc0luUXVldWUsIGFkZFRvUXVldWUgfSBmcm9tICcuLi91dGlscy9hc3luYy1xdWV1ZSc7XG5pbXBvcnQgV0FSTklOR19NRVNTQUdFIGZyb20gJy4uL25vdGlmaWNhdGlvbnMvd2FybmluZy1tZXNzYWdlJztcbmltcG9ydCBlc2NhcGVVc2VyQWdlbnQgZnJvbSAnLi4vdXRpbHMvZXNjYXBlLXVzZXItYWdlbnQnO1xuaW1wb3J0IGNvcnJlY3RGaWxlUGF0aCBmcm9tICcuLi91dGlscy9jb3JyZWN0LWZpbGUtcGF0aCc7XG5pbXBvcnQgeyBzdGF0IH0gZnJvbSAnLi4vdXRpbHMvcHJvbWlzaWZpZWQtZnVuY3Rpb25zJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FwdHVyZXIge1xuICAgIGNvbnN0cnVjdG9yIChiYXNlU2NyZWVuc2hvdHNQYXRoLCB0ZXN0RW50cnksIGNvbm5lY3Rpb24sIHBhdGhQYXR0ZXJuLCB3YXJuaW5nTG9nKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlZCAgICAgICAgICAgICA9ICEhYmFzZVNjcmVlbnNob3RzUGF0aDtcbiAgICAgICAgdGhpcy5iYXNlU2NyZWVuc2hvdHNQYXRoID0gYmFzZVNjcmVlbnNob3RzUGF0aDtcbiAgICAgICAgdGhpcy50ZXN0RW50cnkgICAgICAgICAgID0gdGVzdEVudHJ5O1xuICAgICAgICB0aGlzLnByb3ZpZGVyICAgICAgICAgICAgPSBjb25uZWN0aW9uLnByb3ZpZGVyO1xuICAgICAgICB0aGlzLmJyb3dzZXJJZCAgICAgICAgICAgPSBjb25uZWN0aW9uLmlkO1xuICAgICAgICB0aGlzLndhcm5pbmdMb2cgICAgICAgICAgPSB3YXJuaW5nTG9nO1xuICAgICAgICB0aGlzLnBhdGhQYXR0ZXJuICAgICAgICAgPSBwYXRoUGF0dGVybjtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2dldERpbWVuc2lvbldpdGhvdXRTY3JvbGxiYXIgKGZ1bGxEaW1lbnNpb24sIGRvY3VtZW50RGltZW5zaW9uLCBib2R5RGltZW5zaW9uKSB7XG4gICAgICAgIGlmIChib2R5RGltZW5zaW9uID4gZnVsbERpbWVuc2lvbilcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudERpbWVuc2lvbjtcblxuICAgICAgICBpZiAoZG9jdW1lbnREaW1lbnNpb24gPiBmdWxsRGltZW5zaW9uKVxuICAgICAgICAgICAgcmV0dXJuIGJvZHlEaW1lbnNpb247XG5cbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KGRvY3VtZW50RGltZW5zaW9uLCBib2R5RGltZW5zaW9uKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2dldENyb3BEaW1lbnNpb25zIChjcm9wRGltZW5zaW9ucywgcGFnZURpbWVuc2lvbnMpIHtcbiAgICAgICAgaWYgKCFjcm9wRGltZW5zaW9ucyB8fCAhcGFnZURpbWVuc2lvbnMpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICBjb25zdCB7IGRwciB9ICAgICAgICAgICAgICAgICAgICAgID0gcGFnZURpbWVuc2lvbnM7XG4gICAgICAgIGNvbnN0IHsgdG9wLCBsZWZ0LCBib3R0b20sIHJpZ2h0IH0gPSBjcm9wRGltZW5zaW9ucztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiAgICBNYXRoLnJvdW5kKHRvcCAqIGRwciksXG4gICAgICAgICAgICBsZWZ0OiAgIE1hdGgucm91bmQobGVmdCAqIGRwciksXG4gICAgICAgICAgICBib3R0b206IE1hdGgucm91bmQoYm90dG9tICogZHByKSxcbiAgICAgICAgICAgIHJpZ2h0OiAgTWF0aC5yb3VuZChyaWdodCAqIGRwcilcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2dldENsaWVudEFyZWFEaW1lbnNpb25zIChwYWdlRGltZW5zaW9ucykge1xuICAgICAgICBpZiAoIXBhZ2VEaW1lbnNpb25zKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgeyBpbm5lcldpZHRoLCBkb2N1bWVudFdpZHRoLCBib2R5V2lkdGgsIGlubmVySGVpZ2h0LCBkb2N1bWVudEhlaWdodCwgYm9keUhlaWdodCwgZHByIH0gPSBwYWdlRGltZW5zaW9ucztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6ICBNYXRoLmZsb29yKENhcHR1cmVyLl9nZXREaW1lbnNpb25XaXRob3V0U2Nyb2xsYmFyKGlubmVyV2lkdGgsIGRvY3VtZW50V2lkdGgsIGJvZHlXaWR0aCkgKiBkcHIpLFxuICAgICAgICAgICAgaGVpZ2h0OiBNYXRoLmZsb29yKENhcHR1cmVyLl9nZXREaW1lbnNpb25XaXRob3V0U2Nyb2xsYmFyKGlubmVySGVpZ2h0LCBkb2N1bWVudEhlaWdodCwgYm9keUhlaWdodCkgKiBkcHIpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIF9pc1NjcmVlbnNob3RDYXB0dXJlZCAoc2NyZWVuc2hvdFBhdGgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRzID0gYXdhaXQgc3RhdChzY3JlZW5zaG90UGF0aCk7XG5cbiAgICAgICAgICAgIHJldHVybiBzdGF0cy5pc0ZpbGUoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2pvaW5XaXRoQmFzZVNjcmVlbnNob3RQYXRoIChwYXRoKSB7XG4gICAgICAgIHJldHVybiBqb2luUGF0aCh0aGlzLmJhc2VTY3JlZW5zaG90c1BhdGgsIHBhdGgpO1xuICAgIH1cblxuICAgIF9pbmNyZW1lbnRGaWxlSW5kZXhlcyAoZm9yRXJyb3IpIHtcbiAgICAgICAgaWYgKGZvckVycm9yKVxuICAgICAgICAgICAgdGhpcy5wYXRoUGF0dGVybi5kYXRhLmVycm9yRmlsZUluZGV4Kys7XG5cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5wYXRoUGF0dGVybi5kYXRhLmZpbGVJbmRleCsrO1xuICAgIH1cblxuICAgIF9nZXRDdXN0b21TY3JlZW5zaG90UGF0aCAoY3VzdG9tUGF0aCkge1xuICAgICAgICBjb25zdCBjb3JyZWN0ZWRDdXN0b21QYXRoID0gY29ycmVjdEZpbGVQYXRoKGN1c3RvbVBhdGgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9qb2luV2l0aEJhc2VTY3JlZW5zaG90UGF0aChjb3JyZWN0ZWRDdXN0b21QYXRoKTtcbiAgICB9XG5cbiAgICBfZ2V0U2NyZWVuc2hvdFBhdGggKGZvckVycm9yKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLnBhdGhQYXR0ZXJuLmdldFBhdGgoZm9yRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuX2luY3JlbWVudEZpbGVJbmRleGVzKGZvckVycm9yKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fam9pbldpdGhCYXNlU2NyZWVuc2hvdFBhdGgocGF0aCk7XG4gICAgfVxuXG4gICAgX2dldFRodW1ibmFpbFBhdGggKHNjcmVlbnNob3RQYXRoKSB7XG4gICAgICAgIGNvbnN0IGltYWdlTmFtZSA9IGJhc2VuYW1lKHNjcmVlbnNob3RQYXRoKTtcbiAgICAgICAgY29uc3QgaW1hZ2VEaXIgID0gZGlybmFtZShzY3JlZW5zaG90UGF0aCk7XG5cbiAgICAgICAgcmV0dXJuIGpvaW5QYXRoKGltYWdlRGlyLCAndGh1bWJuYWlscycsIGltYWdlTmFtZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgX3Rha2VTY3JlZW5zaG90IChmaWxlUGF0aCwgcGFnZVdpZHRoLCBwYWdlSGVpZ2h0KSB7XG4gICAgICAgIGF3YWl0IG1ha2VEaXIoZGlybmFtZShmaWxlUGF0aCkpO1xuICAgICAgICBhd2FpdCB0aGlzLnByb3ZpZGVyLnRha2VTY3JlZW5zaG90KHRoaXMuYnJvd3NlcklkLCBmaWxlUGF0aCwgcGFnZVdpZHRoLCBwYWdlSGVpZ2h0KTtcbiAgICB9XG5cbiAgICBhc3luYyBfY2FwdHVyZSAoZm9yRXJyb3IsIHsgcGFnZURpbWVuc2lvbnMsIGNyb3BEaW1lbnNpb25zLCBtYXJrU2VlZCwgY3VzdG9tUGF0aCB9ID0ge30pIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICBjb25zdCBzY3JlZW5zaG90UGF0aCA9IGN1c3RvbVBhdGggPyB0aGlzLl9nZXRDdXN0b21TY3JlZW5zaG90UGF0aChjdXN0b21QYXRoKSA6IHRoaXMuX2dldFNjcmVlbnNob3RQYXRoKGZvckVycm9yKTtcbiAgICAgICAgY29uc3QgdGh1bWJuYWlsUGF0aCAgPSB0aGlzLl9nZXRUaHVtYm5haWxQYXRoKHNjcmVlbnNob3RQYXRoKTtcblxuICAgICAgICBpZiAoaXNJblF1ZXVlKHNjcmVlbnNob3RQYXRoKSlcbiAgICAgICAgICAgIHRoaXMud2FybmluZ0xvZy5hZGRXYXJuaW5nKFdBUk5JTkdfTUVTU0FHRS5zY3JlZW5zaG90UmV3cml0aW5nRXJyb3IsIHNjcmVlbnNob3RQYXRoKTtcblxuICAgICAgICBhd2FpdCBhZGRUb1F1ZXVlKHNjcmVlbnNob3RQYXRoLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLl90YWtlU2NyZWVuc2hvdChzY3JlZW5zaG90UGF0aCwgLi4uIHBhZ2VEaW1lbnNpb25zID8gW3BhZ2VEaW1lbnNpb25zLmlubmVyV2lkdGgsIHBhZ2VEaW1lbnNpb25zLmlubmVySGVpZ2h0XSA6IFtdKTtcblxuICAgICAgICAgICAgaWYgKCFhd2FpdCBDYXB0dXJlci5faXNTY3JlZW5zaG90Q2FwdHVyZWQoc2NyZWVuc2hvdFBhdGgpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgYXdhaXQgY3JvcFNjcmVlbnNob3Qoc2NyZWVuc2hvdFBhdGgsIG1hcmtTZWVkLCBDYXB0dXJlci5fZ2V0Q2xpZW50QXJlYURpbWVuc2lvbnMocGFnZURpbWVuc2lvbnMpLCBDYXB0dXJlci5fZ2V0Q3JvcERpbWVuc2lvbnMoY3JvcERpbWVuc2lvbnMsIHBhZ2VEaW1lbnNpb25zKSk7XG5cbiAgICAgICAgICAgIGF3YWl0IGdlbmVyYXRlVGh1bWJuYWlsKHNjcmVlbnNob3RQYXRoLCB0aHVtYm5haWxQYXRoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgc2NyZWVuc2hvdCA9IHtcbiAgICAgICAgICAgIHNjcmVlbnNob3RQYXRoLFxuICAgICAgICAgICAgdGh1bWJuYWlsUGF0aCxcbiAgICAgICAgICAgIHVzZXJBZ2VudDogICAgICAgICBlc2NhcGVVc2VyQWdlbnQodGhpcy5wYXRoUGF0dGVybi5kYXRhLnBhcnNlZFVzZXJBZ2VudCksXG4gICAgICAgICAgICBxdWFyYW50aW5lQXR0ZW1wdDogdGhpcy5wYXRoUGF0dGVybi5kYXRhLnF1YXJhbnRpbmVBdHRlbXB0LFxuICAgICAgICAgICAgdGFrZW5PbkZhaWw6ICAgICAgIGZvckVycm9yLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudGVzdEVudHJ5LnNjcmVlbnNob3RzLnB1c2goc2NyZWVuc2hvdCk7XG5cbiAgICAgICAgcmV0dXJuIHNjcmVlbnNob3RQYXRoO1xuICAgIH1cblxuICAgIGFzeW5jIGNhcHR1cmVBY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX2NhcHR1cmUoZmFsc2UsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGFzeW5jIGNhcHR1cmVFcnJvciAob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fY2FwdHVyZSh0cnVlLCBvcHRpb25zKTtcbiAgICB9XG59XG5cbiJdfQ==
