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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JlZW5zaG90cy9jYXB0dXJlci5qcyJdLCJuYW1lcyI6WyJDYXB0dXJlciIsImNvbnN0cnVjdG9yIiwiYmFzZVNjcmVlbnNob3RzUGF0aCIsInRlc3RFbnRyeSIsImNvbm5lY3Rpb24iLCJwYXRoUGF0dGVybiIsIndhcm5pbmdMb2ciLCJlbmFibGVkIiwicHJvdmlkZXIiLCJicm93c2VySWQiLCJpZCIsIl9nZXREaW1lbnNpb25XaXRob3V0U2Nyb2xsYmFyIiwiZnVsbERpbWVuc2lvbiIsImRvY3VtZW50RGltZW5zaW9uIiwiYm9keURpbWVuc2lvbiIsIk1hdGgiLCJtYXgiLCJfZ2V0Q3JvcERpbWVuc2lvbnMiLCJjcm9wRGltZW5zaW9ucyIsInBhZ2VEaW1lbnNpb25zIiwiZHByIiwidG9wIiwibGVmdCIsImJvdHRvbSIsInJpZ2h0Iiwicm91bmQiLCJfZ2V0Q2xpZW50QXJlYURpbWVuc2lvbnMiLCJpbm5lcldpZHRoIiwiZG9jdW1lbnRXaWR0aCIsImJvZHlXaWR0aCIsImlubmVySGVpZ2h0IiwiZG9jdW1lbnRIZWlnaHQiLCJib2R5SGVpZ2h0Iiwid2lkdGgiLCJmbG9vciIsImhlaWdodCIsIl9qb2luV2l0aEJhc2VTY3JlZW5zaG90UGF0aCIsInBhdGgiLCJfaW5jcmVtZW50RmlsZUluZGV4ZXMiLCJmb3JFcnJvciIsImRhdGEiLCJlcnJvckZpbGVJbmRleCIsImZpbGVJbmRleCIsIl9nZXRDdXN0b21TY3JlZW5zaG90UGF0aCIsImN1c3RvbVBhdGgiLCJjb3JyZWN0ZWRDdXN0b21QYXRoIiwiX2dldFNjcmVlbnNob3RQYXRoIiwiZ2V0UGF0aCIsIl9nZXRUaHVtYm5haWxQYXRoIiwic2NyZWVuc2hvdFBhdGgiLCJpbWFnZU5hbWUiLCJpbWFnZURpciIsIl90YWtlU2NyZWVuc2hvdCIsImZpbGVQYXRoIiwicGFnZVdpZHRoIiwicGFnZUhlaWdodCIsInRha2VTY3JlZW5zaG90IiwiX2NhcHR1cmUiLCJtYXJrU2VlZCIsInRodW1ibmFpbFBhdGgiLCJhZGRXYXJuaW5nIiwiV0FSTklOR19NRVNTQUdFIiwic2NyZWVuc2hvdFJld3JpdGluZ0Vycm9yIiwic2NyZWVuc2hvdCIsInVzZXJBZ2VudCIsInBhcnNlZFVzZXJBZ2VudCIsInF1YXJhbnRpbmVBdHRlbXB0IiwidGFrZW5PbkZhaWwiLCJzY3JlZW5zaG90cyIsInB1c2giLCJjYXB0dXJlQWN0aW9uIiwib3B0aW9ucyIsImNhcHR1cmVFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxRQUFOLENBQWU7QUFDMUJDLGdCQUFhQyxtQkFBYixFQUFrQ0MsU0FBbEMsRUFBNkNDLFVBQTdDLEVBQXlEQyxXQUF6RCxFQUFzRUMsVUFBdEUsRUFBa0Y7QUFDOUUsYUFBS0MsT0FBTCxHQUEyQixDQUFDLENBQUNMLG1CQUE3QjtBQUNBLGFBQUtBLG1CQUFMLEdBQTJCQSxtQkFBM0I7QUFDQSxhQUFLQyxTQUFMLEdBQTJCQSxTQUEzQjtBQUNBLGFBQUtLLFFBQUwsR0FBMkJKLFdBQVdJLFFBQXRDO0FBQ0EsYUFBS0MsU0FBTCxHQUEyQkwsV0FBV00sRUFBdEM7QUFDQSxhQUFLSixVQUFMLEdBQTJCQSxVQUEzQjtBQUNBLGFBQUtELFdBQUwsR0FBMkJBLFdBQTNCO0FBQ0g7O0FBRUQsV0FBT00sNkJBQVAsQ0FBc0NDLGFBQXRDLEVBQXFEQyxpQkFBckQsRUFBd0VDLGFBQXhFLEVBQXVGO0FBQ25GLFlBQUlBLGdCQUFnQkYsYUFBcEIsRUFDSSxPQUFPQyxpQkFBUDs7QUFFSixZQUFJQSxvQkFBb0JELGFBQXhCLEVBQ0ksT0FBT0UsYUFBUDs7QUFFSixlQUFPQyxLQUFLQyxHQUFMLENBQVNILGlCQUFULEVBQTRCQyxhQUE1QixDQUFQO0FBQ0g7O0FBRUQsV0FBT0csa0JBQVAsQ0FBMkJDLGNBQTNCLEVBQTJDQyxjQUEzQyxFQUEyRDtBQUN2RCxZQUFJLENBQUNELGNBQUQs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a0JBQU1JLGFBQWE7QUFDZmQsOEJBRGU7QUFFZlUsNkJBRmU7QUFHZkssMkJBQW1CLCtCQUFnQixPQUFLM0QsV0FBTCxDQUFpQm1DLElBQWpCLENBQXNCeUIsZUFBdEMsQ0FISjtBQUlmQyxtQ0FBbUIsT0FBSzdELFdBQUwsQ0FBaUJtQyxJQUFqQixDQUFzQjBCLGlCQUoxQjtBQUtmQyw2QkFBbUI1QjtBQUxKLGFBQW5COztBQVFBLG1CQUFLcEMsU0FBTCxDQUFlaUUsV0FBZixDQUEyQkMsSUFBM0IsQ0FBZ0NOLFVBQWhDOztBQUVBLG1CQUFPZCxjQUFQO0FBNUJxRjtBQTZCeEY7O0FBRUtxQixpQkFBTixDQUFxQkMsT0FBckIsRUFBOEI7QUFBQTs7QUFBQTtBQUMxQixtQkFBTyxNQUFNLE9BQUtkLFFBQUwsQ0FBYyxLQUFkLEVBQXFCYyxPQUFyQixDQUFiO0FBRDBCO0FBRTdCOztBQUVLQyxnQkFBTixDQUFvQkQsT0FBcEIsRUFBNkI7QUFBQTs7QUFBQTtBQUN6QixtQkFBTyxNQUFNLE9BQUtkLFFBQUwsQ0FBYyxJQUFkLEVBQW9CYyxPQUFwQixDQUFiO0FBRHlCO0FBRTVCO0FBM0h5QjtrQkFBVHZFLFEiLCJmaWxlIjoic2NyZWVuc2hvdHMvY2FwdHVyZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBqb2luIGFzIGpvaW5QYXRoLCBkaXJuYW1lLCBiYXNlbmFtZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZ2VuZXJhdGVUaHVtYm5haWwgfSBmcm9tICd0ZXN0Y2FmZS1icm93c2VyLXRvb2xzJztcbmltcG9ydCBjcm9wU2NyZWVuc2hvdCBmcm9tICcuL2Nyb3AnO1xuaW1wb3J0IG1ha2VEaXIgZnJvbSAnbWFrZS1kaXInO1xuaW1wb3J0IHsgaXNJblF1ZXVlLCBhZGRUb1F1ZXVlIH0gZnJvbSAnLi4vdXRpbHMvYXN5bmMtcXVldWUnO1xuaW1wb3J0IFdBUk5JTkdfTUVTU0FHRSBmcm9tICcuLi9ub3RpZmljYXRpb25zL3dhcm5pbmctbWVzc2FnZSc7XG5pbXBvcnQgZXNjYXBlVXNlckFnZW50IGZyb20gJy4uL3V0aWxzL2VzY2FwZS11c2VyLWFnZW50JztcbmltcG9ydCBjb3JyZWN0RmlsZVBhdGggZnJvbSAnLi4vdXRpbHMvY29ycmVjdC1maWxlLXBhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYXB0dXJlciB7XG4gICAgY29uc3RydWN0b3IgKGJhc2VTY3JlZW5zaG90c1BhdGgsIHRlc3RFbnRyeSwgY29ubmVjdGlvbiwgcGF0aFBhdHRlcm4sIHdhcm5pbmdMb2cpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkICAgICAgICAgICAgID0gISFiYXNlU2NyZWVuc2hvdHNQYXRoO1xuICAgICAgICB0aGlzLmJhc2VTY3JlZW5zaG90c1BhdGggPSBiYXNlU2NyZWVuc2hvdHNQYXRoO1xuICAgICAgICB0aGlzLnRlc3RFbnRyeSAgICAgICAgICAgPSB0ZXN0RW50cnk7XG4gICAgICAgIHRoaXMucHJvdmlkZXIgICAgICAgICAgICA9IGNvbm5lY3Rpb24ucHJvdmlkZXI7XG4gICAgICAgIHRoaXMuYnJvd3NlcklkICAgICAgICAgICA9IGNvbm5lY3Rpb24uaWQ7XG4gICAgICAgIHRoaXMud2FybmluZ0xvZyAgICAgICAgICA9IHdhcm5pbmdMb2c7XG4gICAgICAgIHRoaXMucGF0aFBhdHRlcm4gICAgICAgICA9IHBhdGhQYXR0ZXJuO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZ2V0RGltZW5zaW9uV2l0aG91dFNjcm9sbGJhciAoZnVsbERpbWVuc2lvbiwgZG9jdW1lbnREaW1lbnNpb24sIGJvZHlEaW1lbnNpb24pIHtcbiAgICAgICAgaWYgKGJvZHlEaW1lbnNpb24gPiBmdWxsRGltZW5zaW9uKVxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50RGltZW5zaW9uO1xuXG4gICAgICAgIGlmIChkb2N1bWVudERpbWVuc2lvbiA+IGZ1bGxEaW1lbnNpb24pXG4gICAgICAgICAgICByZXR1cm4gYm9keURpbWVuc2lvbjtcblxuICAgICAgICByZXR1cm4gTWF0aC5tYXgoZG9jdW1lbnREaW1lbnNpb24sIGJvZHlEaW1lbnNpb24pO1xuICAgIH1cblxuICAgIHN0YXRpYyBfZ2V0Q3JvcERpbWVuc2lvbnMgKGNyb3BEaW1lbnNpb25zLCBwYWdlRGltZW5zaW9ucykge1xuICAgICAgICBpZiAoIWNyb3BEaW1lbnNpb25zIHx8ICFwYWdlRGltZW5zaW9ucylcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHsgZHByIH0gICAgICAgICAgICAgICAgICAgICAgPSBwYWdlRGltZW5zaW9ucztcbiAgICAgICAgY29uc3QgeyB0b3AsIGxlZnQsIGJvdHRvbSwgcmlnaHQgfSA9IGNyb3BEaW1lbnNpb25zO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6ICAgIE1hdGgucm91bmQodG9wICogZHByKSxcbiAgICAgICAgICAgIGxlZnQ6ICAgTWF0aC5yb3VuZChsZWZ0ICogZHByKSxcbiAgICAgICAgICAgIGJvdHRvbTogTWF0aC5yb3VuZChib3R0b20gKiBkcHIpLFxuICAgICAgICAgICAgcmlnaHQ6ICBNYXRoLnJvdW5kKHJpZ2h0ICogZHByKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHN0YXRpYyBfZ2V0Q2xpZW50QXJlYURpbWVuc2lvbnMgKHBhZ2VEaW1lbnNpb25zKSB7XG4gICAgICAgIGlmICghcGFnZURpbWVuc2lvbnMpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICBjb25zdCB7IGlubmVyV2lkdGgsIGRvY3VtZW50V2lkdGgsIGJvZHlXaWR0aCwgaW5uZXJIZWlnaHQsIGRvY3VtZW50SGVpZ2h0LCBib2R5SGVpZ2h0LCBkcHIgfSA9IHBhZ2VEaW1lbnNpb25zO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogIE1hdGguZmxvb3IoQ2FwdHVyZXIuX2dldERpbWVuc2lvbldpdGhvdXRTY3JvbGxiYXIoaW5uZXJXaWR0aCwgZG9jdW1lbnRXaWR0aCwgYm9keVdpZHRoKSAqIGRwciksXG4gICAgICAgICAgICBoZWlnaHQ6IE1hdGguZmxvb3IoQ2FwdHVyZXIuX2dldERpbWVuc2lvbldpdGhvdXRTY3JvbGxiYXIoaW5uZXJIZWlnaHQsIGRvY3VtZW50SGVpZ2h0LCBib2R5SGVpZ2h0KSAqIGRwcilcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBfam9pbldpdGhCYXNlU2NyZWVuc2hvdFBhdGggKHBhdGgpIHtcbiAgICAgICAgcmV0dXJuIGpvaW5QYXRoKHRoaXMuYmFzZVNjcmVlbnNob3RzUGF0aCwgcGF0aCk7XG4gICAgfVxuXG4gICAgX2luY3JlbWVudEZpbGVJbmRleGVzIChmb3JFcnJvcikge1xuICAgICAgICBpZiAoZm9yRXJyb3IpXG4gICAgICAgICAgICB0aGlzLnBhdGhQYXR0ZXJuLmRhdGEuZXJyb3JGaWxlSW5kZXgrKztcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLnBhdGhQYXR0ZXJuLmRhdGEuZmlsZUluZGV4Kys7XG4gICAgfVxuXG4gICAgX2dldEN1c3RvbVNjcmVlbnNob3RQYXRoIChjdXN0b21QYXRoKSB7XG4gICAgICAgIGNvbnN0IGNvcnJlY3RlZEN1c3RvbVBhdGggPSBjb3JyZWN0RmlsZVBhdGgoY3VzdG9tUGF0aCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2pvaW5XaXRoQmFzZVNjcmVlbnNob3RQYXRoKGNvcnJlY3RlZEN1c3RvbVBhdGgpO1xuICAgIH1cblxuICAgIF9nZXRTY3JlZW5zaG90UGF0aCAoZm9yRXJyb3IpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMucGF0aFBhdHRlcm4uZ2V0UGF0aChmb3JFcnJvcik7XG5cbiAgICAgICAgdGhpcy5faW5jcmVtZW50RmlsZUluZGV4ZXMoZm9yRXJyb3IpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9qb2luV2l0aEJhc2VTY3JlZW5zaG90UGF0aChwYXRoKTtcbiAgICB9XG5cbiAgICBfZ2V0VGh1bWJuYWlsUGF0aCAoc2NyZWVuc2hvdFBhdGgpIHtcbiAgICAgICAgY29uc3QgaW1hZ2VOYW1lID0gYmFzZW5hbWUoc2NyZWVuc2hvdFBhdGgpO1xuICAgICAgICBjb25zdCBpbWFnZURpciAgPSBkaXJuYW1lKHNjcmVlbnNob3RQYXRoKTtcblxuICAgICAgICByZXR1cm4gam9pblBhdGgoaW1hZ2VEaXIsICd0aHVtYm5haWxzJywgaW1hZ2VOYW1lKTtcbiAgICB9XG5cbiAgICBhc3luYyBfdGFrZVNjcmVlbnNob3QgKGZpbGVQYXRoLCBwYWdlV2lkdGgsIHBhZ2VIZWlnaHQpIHtcbiAgICAgICAgYXdhaXQgbWFrZURpcihkaXJuYW1lKGZpbGVQYXRoKSk7XG4gICAgICAgIGF3YWl0IHRoaXMucHJvdmlkZXIudGFrZVNjcmVlbnNob3QodGhpcy5icm93c2VySWQsIGZpbGVQYXRoLCBwYWdlV2lkdGgsIHBhZ2VIZWlnaHQpO1xuICAgIH1cblxuICAgIGFzeW5jIF9jYXB0dXJlIChmb3JFcnJvciwgeyBwYWdlRGltZW5zaW9ucywgY3JvcERpbWVuc2lvbnMsIG1hcmtTZWVkLCBjdXN0b21QYXRoIH0gPSB7fSkge1xuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHNjcmVlbnNob3RQYXRoID0gY3VzdG9tUGF0aCA/IHRoaXMuX2dldEN1c3RvbVNjcmVlbnNob3RQYXRoKGN1c3RvbVBhdGgpIDogdGhpcy5fZ2V0U2NyZWVuc2hvdFBhdGgoZm9yRXJyb3IpO1xuICAgICAgICBjb25zdCB0aHVtYm5haWxQYXRoICA9IHRoaXMuX2dldFRodW1ibmFpbFBhdGgoc2NyZWVuc2hvdFBhdGgpO1xuXG4gICAgICAgIGlmIChpc0luUXVldWUoc2NyZWVuc2hvdFBhdGgpKVxuICAgICAgICAgICAgdGhpcy53YXJuaW5nTG9nLmFkZFdhcm5pbmcoV0FSTklOR19NRVNTQUdFLnNjcmVlbnNob3RSZXdyaXRpbmdFcnJvciwgc2NyZWVuc2hvdFBhdGgpO1xuXG4gICAgICAgIGF3YWl0IGFkZFRvUXVldWUoc2NyZWVuc2hvdFBhdGgsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3Rha2VTY3JlZW5zaG90KHNjcmVlbnNob3RQYXRoLCAuLi4gcGFnZURpbWVuc2lvbnMgPyBbcGFnZURpbWVuc2lvbnMuaW5uZXJXaWR0aCwgcGFnZURpbWVuc2lvbnMuaW5uZXJIZWlnaHRdIDogW10pO1xuXG4gICAgICAgICAgICBhd2FpdCBjcm9wU2NyZWVuc2hvdChzY3JlZW5zaG90UGF0aCwgbWFya1NlZWQsIENhcHR1cmVyLl9nZXRDbGllbnRBcmVhRGltZW5zaW9ucyhwYWdlRGltZW5zaW9ucyksIENhcHR1cmVyLl9nZXRDcm9wRGltZW5zaW9ucyhjcm9wRGltZW5zaW9ucywgcGFnZURpbWVuc2lvbnMpKTtcblxuICAgICAgICAgICAgYXdhaXQgZ2VuZXJhdGVUaHVtYm5haWwoc2NyZWVuc2hvdFBhdGgsIHRodW1ibmFpbFBhdGgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBzY3JlZW5zaG90ID0ge1xuICAgICAgICAgICAgc2NyZWVuc2hvdFBhdGgsXG4gICAgICAgICAgICB0aHVtYm5haWxQYXRoLFxuICAgICAgICAgICAgdXNlckFnZW50OiAgICAgICAgIGVzY2FwZVVzZXJBZ2VudCh0aGlzLnBhdGhQYXR0ZXJuLmRhdGEucGFyc2VkVXNlckFnZW50KSxcbiAgICAgICAgICAgIHF1YXJhbnRpbmVBdHRlbXB0OiB0aGlzLnBhdGhQYXR0ZXJuLmRhdGEucXVhcmFudGluZUF0dGVtcHQsXG4gICAgICAgICAgICB0YWtlbk9uRmFpbDogICAgICAgZm9yRXJyb3IsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy50ZXN0RW50cnkuc2NyZWVuc2hvdHMucHVzaChzY3JlZW5zaG90KTtcblxuICAgICAgICByZXR1cm4gc2NyZWVuc2hvdFBhdGg7XG4gICAgfVxuXG4gICAgYXN5bmMgY2FwdHVyZUFjdGlvbiAob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fY2FwdHVyZShmYWxzZSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgYXN5bmMgY2FwdHVyZUVycm9yIChvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLl9jYXB0dXJlKHRydWUsIG9wdGlvbnMpO1xuICAgIH1cbn1cblxuIl19
