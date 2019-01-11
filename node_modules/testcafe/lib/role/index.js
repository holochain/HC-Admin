'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.createRole = createRole;
exports.createAnonymousRole = createAnonymousRole;

var _events = require('events');

var _nanoid = require('nanoid');

var _nanoid2 = _interopRequireDefault(_nanoid);

var _phase = require('./phase');

var _phase2 = _interopRequireDefault(_phase);

var _typeAssertions = require('../errors/runtime/type-assertions');

var _wrapTestFunction = require('../api/wrap-test-function');

var _wrapTestFunction2 = _interopRequireDefault(_wrapTestFunction);

var _testPageUrl = require('../api/test-page-url');

var _actions = require('../test-run/commands/actions');

var _markerSymbol = require('./marker-symbol');

var _markerSymbol2 = _interopRequireDefault(_markerSymbol);

var _delay = require('../utils/delay');

var _delay2 = _interopRequireDefault(_delay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const COOKIE_SYNC_DELAY = 100;

class Role extends _events.EventEmitter {
    constructor(loginPage, initFn, options = {}) {
        super();

        this[_markerSymbol2.default] = true;

        this.id = (0, _nanoid2.default)(7);
        this.phase = loginPage ? _phase2.default.uninitialized : _phase2.default.initialized;

        this.loginPage = loginPage;
        this.initFn = initFn;
        this.opts = options;

        this.url = null;
        this.stateSnapshot = null;
        this.initErr = null;
    }

    _navigateToLoginPage(testRun) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const navigateCommand = new _actions.NavigateToCommand({ url: _this.loginPage });

            yield testRun.executeCommand(navigateCommand);
        })();
    }

    _storeStateSnapshot(testRun) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!_this2.initErr) {
                // NOTE: give Hammerhead time to sync cookies from client
                yield (0, _delay2.default)(COOKIE_SYNC_DELAY);
                _this2.stateSnapshot = yield testRun.getStateSnapshot();
            }
        })();
    }

    _executeInitFn(testRun) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            try {
                testRun.disableDebugBreakpoints = false;
                yield _this3.initFn(testRun);
            } catch (err) {
                _this3.initErr = err;
            } finally {
                testRun.disableDebugBreakpoints = true;
            }
        })();
    }

    initialize(testRun) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this4.phase = _phase2.default.pendingInitialization;

            yield testRun.switchToCleanRun();
            yield _this4._navigateToLoginPage(testRun);
            yield _this4._executeInitFn(testRun);
            yield _this4._storeStateSnapshot(testRun);

            if (_this4.opts.preserveUrl) _this4.url = yield testRun.getCurrentUrl();

            _this4.phase = _phase2.default.initialized;
            _this4.emit('initialized');
        })();
    }
}

function createRole(loginPage, initFn, options = {}) {
    (0, _typeAssertions.assertType)(_typeAssertions.is.string, 'Role', '"loginPage" argument', loginPage);
    (0, _typeAssertions.assertType)(_typeAssertions.is.function, 'Role', '"initFn" argument', initFn);
    (0, _typeAssertions.assertType)(_typeAssertions.is.nonNullObject, 'Role', '"options" argument', options);

    if (options.preserveUrl !== void 0) (0, _typeAssertions.assertType)(_typeAssertions.is.boolean, 'Role', '"preserveUrl" option', options.preserveUrl);

    loginPage = (0, _testPageUrl.resolvePageUrl)(loginPage);
    initFn = (0, _wrapTestFunction2.default)(initFn);

    return new Role(loginPage, initFn, options);
}

function createAnonymousRole() {
    return new Role(null, null);
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb2xlL2luZGV4LmpzIl0sIm5hbWVzIjpbImNyZWF0ZVJvbGUiLCJjcmVhdGVBbm9ueW1vdXNSb2xlIiwiQ09PS0lFX1NZTkNfREVMQVkiLCJSb2xlIiwiRXZlbnRFbWl0dGVyIiwiY29uc3RydWN0b3IiLCJsb2dpblBhZ2UiLCJpbml0Rm4iLCJvcHRpb25zIiwicm9sZU1hcmtlciIsImlkIiwicGhhc2UiLCJQSEFTRSIsInVuaW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplZCIsIm9wdHMiLCJ1cmwiLCJzdGF0ZVNuYXBzaG90IiwiaW5pdEVyciIsIl9uYXZpZ2F0ZVRvTG9naW5QYWdlIiwidGVzdFJ1biIsIm5hdmlnYXRlQ29tbWFuZCIsIk5hdmlnYXRlVG9Db21tYW5kIiwiZXhlY3V0ZUNvbW1hbmQiLCJfc3RvcmVTdGF0ZVNuYXBzaG90IiwiZ2V0U3RhdGVTbmFwc2hvdCIsIl9leGVjdXRlSW5pdEZuIiwiZGlzYWJsZURlYnVnQnJlYWtwb2ludHMiLCJlcnIiLCJpbml0aWFsaXplIiwicGVuZGluZ0luaXRpYWxpemF0aW9uIiwic3dpdGNoVG9DbGVhblJ1biIsInByZXNlcnZlVXJsIiwiZ2V0Q3VycmVudFVybCIsImVtaXQiLCJpcyIsInN0cmluZyIsImZ1bmN0aW9uIiwibm9uTnVsbE9iamVjdCIsImJvb2xlYW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBeUVnQkEsVSxHQUFBQSxVO1FBY0FDLG1CLEdBQUFBLG1COztBQXZGaEI7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTUMsb0JBQW9CLEdBQTFCOztBQUVBLE1BQU1DLElBQU4sU0FBbUJDLG9CQUFuQixDQUFnQztBQUM1QkMsZ0JBQWFDLFNBQWIsRUFBd0JDLE1BQXhCLEVBQWdDQyxVQUFVLEVBQTFDLEVBQThDO0FBQzFDOztBQUVBLGFBQUtDLHNCQUFMLElBQW1CLElBQW5COztBQUVBLGFBQUtDLEVB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QUosQ0FBUyxJQUFULEVBQWUsSUFBZixDQUFQO0FBQ0giLCJmaWxlIjoicm9sZS9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgbmFub2lkIGZyb20gJ25hbm9pZCc7XG5pbXBvcnQgUEhBU0UgZnJvbSAnLi9waGFzZSc7XG5pbXBvcnQgeyBhc3NlcnRUeXBlLCBpcyB9IGZyb20gJy4uL2Vycm9ycy9ydW50aW1lL3R5cGUtYXNzZXJ0aW9ucyc7XG5pbXBvcnQgd3JhcFRlc3RGdW5jdGlvbiBmcm9tICcuLi9hcGkvd3JhcC10ZXN0LWZ1bmN0aW9uJztcbmltcG9ydCB7IHJlc29sdmVQYWdlVXJsIH0gZnJvbSAnLi4vYXBpL3Rlc3QtcGFnZS11cmwnO1xuaW1wb3J0IHsgTmF2aWdhdGVUb0NvbW1hbmQgfSBmcm9tICcuLi90ZXN0LXJ1bi9jb21tYW5kcy9hY3Rpb25zJztcbmltcG9ydCByb2xlTWFya2VyIGZyb20gJy4vbWFya2VyLXN5bWJvbCc7XG5pbXBvcnQgZGVsYXkgZnJvbSAnLi4vdXRpbHMvZGVsYXknO1xuXG5jb25zdCBDT09LSUVfU1lOQ19ERUxBWSA9IDEwMDtcblxuY2xhc3MgUm9sZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IgKGxvZ2luUGFnZSwgaW5pdEZuLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzW3JvbGVNYXJrZXJdID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmlkICAgID0gbmFub2lkKDcpO1xuICAgICAgICB0aGlzLnBoYXNlID0gbG9naW5QYWdlID8gUEhBU0UudW5pbml0aWFsaXplZCA6IFBIQVNFLmluaXRpYWxpemVkO1xuXG4gICAgICAgIHRoaXMubG9naW5QYWdlID0gbG9naW5QYWdlO1xuICAgICAgICB0aGlzLmluaXRGbiAgICA9IGluaXRGbjtcbiAgICAgICAgdGhpcy5vcHRzICAgICAgPSBvcHRpb25zO1xuXG4gICAgICAgIHRoaXMudXJsICAgICAgICAgICA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RhdGVTbmFwc2hvdCA9IG51bGw7XG4gICAgICAgIHRoaXMuaW5pdEVyciAgICAgICA9IG51bGw7XG4gICAgfVxuXG4gICAgYXN5bmMgX25hdmlnYXRlVG9Mb2dpblBhZ2UgKHRlc3RSdW4pIHtcbiAgICAgICAgY29uc3QgbmF2aWdhdGVDb21tYW5kID0gbmV3IE5hdmlnYXRlVG9Db21tYW5kKHsgdXJsOiB0aGlzLmxvZ2luUGFnZSB9KTtcblxuICAgICAgICBhd2FpdCB0ZXN0UnVuLmV4ZWN1dGVDb21tYW5kKG5hdmlnYXRlQ29tbWFuZCk7XG4gICAgfVxuXG4gICAgYXN5bmMgX3N0b3JlU3RhdGVTbmFwc2hvdCAodGVzdFJ1bikge1xuICAgICAgICBpZiAoIXRoaXMuaW5pdEVycikge1xuICAgICAgICAgICAgLy8gTk9URTogZ2l2ZSBIYW1tZXJoZWFkIHRpbWUgdG8gc3luYyBjb29raWVzIGZyb20gY2xpZW50XG4gICAgICAgICAgICBhd2FpdCBkZWxheShDT09LSUVfU1lOQ19ERUxBWSk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlU25hcHNob3QgPSBhd2FpdCB0ZXN0UnVuLmdldFN0YXRlU25hcHNob3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIF9leGVjdXRlSW5pdEZuICh0ZXN0UnVuKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0ZXN0UnVuLmRpc2FibGVEZWJ1Z0JyZWFrcG9pbnRzID0gZmFsc2U7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRGbih0ZXN0UnVuKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRFcnIgPSBlcnI7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0ZXN0UnVuLmRpc2FibGVEZWJ1Z0JyZWFrcG9pbnRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGluaXRpYWxpemUgKHRlc3RSdW4pIHtcbiAgICAgICAgdGhpcy5waGFzZSA9IFBIQVNFLnBlbmRpbmdJbml0aWFsaXphdGlvbjtcblxuICAgICAgICBhd2FpdCB0ZXN0UnVuLnN3aXRjaFRvQ2xlYW5SdW4oKTtcbiAgICAgICAgYXdhaXQgdGhpcy5fbmF2aWdhdGVUb0xvZ2luUGFnZSh0ZXN0UnVuKTtcbiAgICAgICAgYXdhaXQgdGhpcy5fZXhlY3V0ZUluaXRGbih0ZXN0UnVuKTtcbiAgICAgICAgYXdhaXQgdGhpcy5fc3RvcmVTdGF0ZVNuYXBzaG90KHRlc3RSdW4pO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdHMucHJlc2VydmVVcmwpXG4gICAgICAgICAgICB0aGlzLnVybCA9IGF3YWl0IHRlc3RSdW4uZ2V0Q3VycmVudFVybCgpO1xuXG4gICAgICAgIHRoaXMucGhhc2UgPSBQSEFTRS5pbml0aWFsaXplZDtcbiAgICAgICAgdGhpcy5lbWl0KCdpbml0aWFsaXplZCcpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJvbGUgKGxvZ2luUGFnZSwgaW5pdEZuLCBvcHRpb25zID0ge30pIHtcbiAgICBhc3NlcnRUeXBlKGlzLnN0cmluZywgJ1JvbGUnLCAnXCJsb2dpblBhZ2VcIiBhcmd1bWVudCcsIGxvZ2luUGFnZSk7XG4gICAgYXNzZXJ0VHlwZShpcy5mdW5jdGlvbiwgJ1JvbGUnLCAnXCJpbml0Rm5cIiBhcmd1bWVudCcsIGluaXRGbik7XG4gICAgYXNzZXJ0VHlwZShpcy5ub25OdWxsT2JqZWN0LCAnUm9sZScsICdcIm9wdGlvbnNcIiBhcmd1bWVudCcsIG9wdGlvbnMpO1xuXG4gICAgaWYgKG9wdGlvbnMucHJlc2VydmVVcmwgIT09IHZvaWQgMClcbiAgICAgICAgYXNzZXJ0VHlwZShpcy5ib29sZWFuLCAnUm9sZScsICdcInByZXNlcnZlVXJsXCIgb3B0aW9uJywgb3B0aW9ucy5wcmVzZXJ2ZVVybCk7XG5cbiAgICBsb2dpblBhZ2UgPSByZXNvbHZlUGFnZVVybChsb2dpblBhZ2UpO1xuICAgIGluaXRGbiAgICA9IHdyYXBUZXN0RnVuY3Rpb24oaW5pdEZuKTtcblxuICAgIHJldHVybiBuZXcgUm9sZShsb2dpblBhZ2UsIGluaXRGbiwgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBbm9ueW1vdXNSb2xlICgpIHtcbiAgICByZXR1cm4gbmV3IFJvbGUobnVsbCwgbnVsbCk7XG59XG4iXX0=
