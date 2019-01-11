'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _child_process = require('child_process');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _promisifyEvent = require('promisify-event');

var _promisifyEvent2 = _interopRequireDefault(_promisifyEvent);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _promisifiedFunctions = require('../../promisified-functions');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const WORKER_PATH = require.resolve('./worker');
const WORKER_STDIO_CONFIG = ['ignore', 'pipe', 'pipe', 'ipc'];

const DEBUG_LOGGER = (0, _debug2.default)('testcafe:utils:temp-directory:cleanup-process');

class CleanupProcess {
    constructor() {
        this.worker = null;
        this.initialized = false;
        this.initPromise = _pinkie2.default.resolve(void 0);
        this.errorPromise = null;

        this.messageCounter = 0;

        this.pendingResponses = {};
    }

    _sendMessage(id, msg) {
        return _pinkie2.default.race([(0, _promisifiedFunctions.sendMessageToChildProcess)(this.worker, (0, _extends3.default)({ id }, msg)), this._waitProcessError()]);
    }

    _onResponse(response) {
        const pendingResponse = this.pendingResponses[response.id];

        if (response.error) {
            if (pendingResponse) pendingResponse.control.reject(response.error);else this.pendingResponses[response.id] = _pinkie2.default.reject(response.error);
        } else if (pendingResponse) pendingResponse.control.resolve();else this.pendingResponses[response.id] = _pinkie2.default.resolve();
    }

    _waitResponse(id) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!_this.pendingResponses[id]) {
                const promiseControl = {};

                _this.pendingResponses[id] = new _pinkie2.default(function (resolve, reject) {
                    (0, _assign2.default)(promiseControl, { resolve, reject });
                });

                _this.pendingResponses[id].control = promiseControl;
            }

            try {
                yield _this.pendingResponses[id];
            } finally {
                delete _this.pendingResponses[id];
            }
        })();
    }

    _waitResponseForMessage(msg) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const currentId = _this2.messageCounter;

            _this2.messageCounter++;

            yield _this2._sendMessage(currentId, msg);
            yield _this2._waitResponse(currentId);
        })();
    }

    _waitProcessExit() {
        return (0, _promisifyEvent2.default)(this.worker, 'exit').then(exitCode => _pinkie2.default.reject(new Error(`Worker process terminated with code ${exitCode}`)));
    }

    _waitProcessError() {
        if (this.errorPromise) return this.errorPromise;

        this.errorPromise = (0, _promisifyEvent2.default)(this.worker, 'error');

        this.errorPromise.then(() => {
            this.errorPromise = null;
        });

        return this.errorPromise;
    }

    _setupWorkerEventHandlers() {
        this.worker.on('message', message => this._onResponse(message));

        this.worker.stdout.on('data', data => DEBUG_LOGGER('Worker process stdout:\n', String(data)));
        this.worker.stderr.on('data', data => DEBUG_LOGGER('Worker process stderr:\n', String(data)));
    }

    _unrefWorkerProcess() {
        this.worker.unref();
        this.worker.stdout.unref();
        this.worker.stderr.unref();

        const channel = this.worker.channel || this.worker._channel;

        channel.unref();
    }

    _handleProcessError(error) {
        this.initialized = false;

        DEBUG_LOGGER(error);
    }

    init() {
        var _this3 = this;

        this.initPromise = this.initPromise.then((() => {
            var _ref = (0, _asyncToGenerator3.default)(function* (initialized) {
                if (initialized !== void 0) return initialized;

                _this3.worker = (0, _child_process.spawn)(process.argv[0], [WORKER_PATH], { detached: true, stdio: WORKER_STDIO_CONFIG });

                _this3._setupWorkerEventHandlers();
                _this3._unrefWorkerProcess();

                const exitPromise = _this3._waitProcessExit();

                try {
                    yield _pinkie2.default.race([_this3._waitResponseForMessage({ command: _commands2.default.init }), _this3._waitProcessError(), exitPromise]);

                    _this3.initialized = true;

                    exitPromise.catch(function (error) {
                        return _this3._handleProcessError(error);
                    });

                    _this3.worker.on('error', function (error) {
                        return _this3._handleProcessError(error);
                    });
                } catch (e) {
                    DEBUG_LOGGER('Failed to start cleanup process');
                    DEBUG_LOGGER(e);

                    _this3.initialized = false;
                }

                return _this3.initialized;
            });

            return function (_x) {
                return _ref.apply(this, arguments);
            };
        })());

        return this.initPromise;
    }

    addDirectory(path) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!_this4.initialized) return;

            try {
                yield _this4._waitResponseForMessage({ command: _commands2.default.add, path });
            } catch (e) {
                DEBUG_LOGGER(`Failed to add the ${path} directory to cleanup process`);
                DEBUG_LOGGER(e);
            }
        })();
    }

    removeDirectory(path) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (!_this5.initialized) return;

            try {
                yield _this5._waitResponseForMessage({ command: _commands2.default.remove, path });
            } catch (e) {
                DEBUG_LOGGER(`Failed to remove the ${path} directory in cleanup process`);
                DEBUG_LOGGER(e);
            }
        })();
    }
}

exports.default = new CleanupProcess();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy90ZW1wLWRpcmVjdG9yeS9jbGVhbnVwLXByb2Nlc3MvaW5kZXguanMiXSwibmFtZXMiOlsiV09SS0VSX1BBVEgiLCJyZXF1aXJlIiwicmVzb2x2ZSIsIldPUktFUl9TVERJT19DT05GSUciLCJERUJVR19MT0dHRVIiLCJDbGVhbnVwUHJvY2VzcyIsImNvbnN0cnVjdG9yIiwid29ya2VyIiwiaW5pdGlhbGl6ZWQiLCJpbml0UHJvbWlzZSIsIlByb21pc2UiLCJlcnJvclByb21pc2UiLCJtZXNzYWdlQ291bnRlciIsInBlbmRpbmdSZXNwb25zZXMiLCJfc2VuZE1lc3NhZ2UiLCJpZCIsIm1zZyIsInJhY2UiLCJfd2FpdFByb2Nlc3NFcnJvciIsIl9vblJlc3BvbnNlIiwicmVzcG9uc2UiLCJwZW5kaW5nUmVzcG9uc2UiLCJlcnJvciIsImNvbnRyb2wiLCJyZWplY3QiLCJfd2FpdFJlc3BvbnNlIiwicHJvbWlzZUNvbnRyb2wiLCJfd2FpdFJlc3BvbnNlRm9yTWVzc2FnZSIsImN1cnJlbnRJZCIsIl93YWl0UHJvY2Vzc0V4aXQiLCJ0aGVuIiwiZXhpdENvZGUiLCJFcnJvciIsIl9zZXR1cFdvcmtlckV2ZW50SGFuZGxlcnMiLCJvbiIsIm1lc3NhZ2UiLCJzdGRvdXQiLCJkYXRhIiwiU3RyaW5nIiwic3RkZXJyIiwiX3VucmVmV29ya2VyUHJvY2VzcyIsInVucmVmIiwiY2hhbm5lbCIsIl9jaGFubmVsIiwiX2hhbmRsZVByb2Nlc3NFcnJvciIsImluaXQiLCJwcm9jZXNzIiwiYXJndiIsImRldGFjaGVkIiwic3RkaW8iLCJleGl0UHJvbWlzZSIsImNvbW1hbmQiLCJDT01NQU5EUyIsImNhdGNoIiwiZSIsImFkZERpcmVjdG9yeSIsInBhdGgiLCJhZGQiLCJyZW1vdmVEaXJlY3RvcnkiLCJyZW1vdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFD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QUMsT0FBS2hELFdBQVYsRUFDSTs7QUFFSixnQkFBSTtBQUNBLHNCQUFNLE9BQUttQix1QkFBTCxDQUE2QixFQUFFd0IsU0FBU0MsbUJBQVNLLEdBQXBCLEVBQXlCRCxJQUF6QixFQUE3QixDQUFOO0FBQ0gsYUFGRCxDQUdBLE9BQU9GLENBQVAsRUFBVTtBQUNObEQsNkJBQWMscUJBQW9Cb0QsSUFBSywrQkFBdkM7QUFDQXBELDZCQUFha0QsQ0FBYjtBQUNIO0FBVnFCO0FBV3pCOztBQUVLSSxtQkFBTixDQUF1QkYsSUFBdkIsRUFBNkI7QUFBQTs7QUFBQTtBQUN6QixnQkFBSSxDQUFDLE9BQUtoRCxXQUFWLEVBQ0k7O0FBRUosZ0JBQUk7QUFDQSxzQkFBTSxPQUFLbUIsdUJBQUwsQ0FBNkIsRUFBRXdCLFNBQVNDLG1CQUFTTyxNQUFwQixFQUE0QkgsSUFBNUIsRUFBN0IsQ0FBTjtBQUNILGFBRkQsQ0FHQSxPQUFPRixDQUFQLEVBQVU7QUFDTmxELDZCQUFjLHdCQUF1Qm9ELElBQUssK0JBQTFDO0FBQ0FwRCw2QkFBYWtELENBQWI7QUFDSDtBQVZ3QjtBQVc1QjtBQXRLZ0I7O2tCQXlLTixJQUFJakQsY0FBSixFIiwiZmlsZSI6InV0aWxzL3RlbXAtZGlyZWN0b3J5L2NsZWFudXAtcHJvY2Vzcy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNwYXduIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IHByb21pc2lmeUV2ZW50IGZyb20gJ3Byb21pc2lmeS1ldmVudCc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdwaW5raWUnO1xuaW1wb3J0IHsgc2VuZE1lc3NhZ2VUb0NoaWxkUHJvY2VzcyB9IGZyb20gJy4uLy4uL3Byb21pc2lmaWVkLWZ1bmN0aW9ucyc7XG5pbXBvcnQgQ09NTUFORFMgZnJvbSAnLi9jb21tYW5kcyc7XG5cblxuY29uc3QgV09SS0VSX1BBVEggICAgICAgICA9IHJlcXVpcmUucmVzb2x2ZSgnLi93b3JrZXInKTtcbmNvbnN0IFdPUktFUl9TVERJT19DT05GSUcgPSBbJ2lnbm9yZScsICdwaXBlJywgJ3BpcGUnLCAnaXBjJ107XG5cbmNvbnN0IERFQlVHX0xPR0dFUiA9IGRlYnVnKCd0ZXN0Y2FmZTp1dGlsczp0ZW1wLWRpcmVjdG9yeTpjbGVhbnVwLXByb2Nlc3MnKTtcblxuY2xhc3MgQ2xlYW51cFByb2Nlc3Mge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgdGhpcy53b3JrZXIgICAgICAgPSBudWxsO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkICA9IGZhbHNlO1xuICAgICAgICB0aGlzLmluaXRQcm9taXNlICA9IFByb21pc2UucmVzb2x2ZSh2b2lkIDApO1xuICAgICAgICB0aGlzLmVycm9yUHJvbWlzZSA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5tZXNzYWdlQ291bnRlciA9IDA7XG5cbiAgICAgICAgdGhpcy5wZW5kaW5nUmVzcG9uc2VzID0ge307XG4gICAgfVxuXG4gICAgX3NlbmRNZXNzYWdlIChpZCwgbXNnKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJhY2UoW1xuICAgICAgICAgICAgc2VuZE1lc3NhZ2VUb0NoaWxkUHJvY2Vzcyh0aGlzLndvcmtlciwgeyBpZCwgLi4ubXNnIH0pLFxuICAgICAgICAgICAgdGhpcy5fd2FpdFByb2Nlc3NFcnJvcigpXG4gICAgICAgIF0pO1xuICAgIH1cblxuICAgIF9vblJlc3BvbnNlIChyZXNwb25zZSkge1xuICAgICAgICBjb25zdCBwZW5kaW5nUmVzcG9uc2UgPSB0aGlzLnBlbmRpbmdSZXNwb25zZXNbcmVzcG9uc2UuaWRdO1xuXG4gICAgICAgIGlmIChyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgaWYgKHBlbmRpbmdSZXNwb25zZSlcbiAgICAgICAgICAgICAgICBwZW5kaW5nUmVzcG9uc2UuY29udHJvbC5yZWplY3QocmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ1Jlc3BvbnNlc1tyZXNwb25zZS5pZF0gPSBQcm9taXNlLnJlamVjdChyZXNwb25zZS5lcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGVuZGluZ1Jlc3BvbnNlKVxuICAgICAgICAgICAgcGVuZGluZ1Jlc3BvbnNlLmNvbnRyb2wucmVzb2x2ZSgpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdSZXNwb25zZXNbcmVzcG9uc2UuaWRdID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgYXN5bmMgX3dhaXRSZXNwb25zZSAoaWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnBlbmRpbmdSZXNwb25zZXNbaWRdKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9taXNlQ29udHJvbCA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdSZXNwb25zZXNbaWRdID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocHJvbWlzZUNvbnRyb2wsIHsgcmVzb2x2ZSwgcmVqZWN0IH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMucGVuZGluZ1Jlc3BvbnNlc1tpZF0uY29udHJvbCA9IHByb21pc2VDb250cm9sO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGVuZGluZ1Jlc3BvbnNlc1tpZF07XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5wZW5kaW5nUmVzcG9uc2VzW2lkXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIF93YWl0UmVzcG9uc2VGb3JNZXNzYWdlIChtc2cpIHtcbiAgICAgICAgY29uc3QgY3VycmVudElkID0gdGhpcy5tZXNzYWdlQ291bnRlcjtcblxuICAgICAgICB0aGlzLm1lc3NhZ2VDb3VudGVyKys7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5fc2VuZE1lc3NhZ2UoY3VycmVudElkLCBtc2cpO1xuICAgICAgICBhd2FpdCB0aGlzLl93YWl0UmVzcG9uc2UoY3VycmVudElkKTtcbiAgICB9XG5cbiAgICBfd2FpdFByb2Nlc3NFeGl0ICgpIHtcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeUV2ZW50KHRoaXMud29ya2VyLCAnZXhpdCcpXG4gICAgICAgICAgICAudGhlbihleGl0Q29kZSA9PiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoYFdvcmtlciBwcm9jZXNzIHRlcm1pbmF0ZWQgd2l0aCBjb2RlICR7ZXhpdENvZGV9YCkpKTtcbiAgICB9XG5cbiAgICBfd2FpdFByb2Nlc3NFcnJvciAoKSB7XG4gICAgICAgIGlmICh0aGlzLmVycm9yUHJvbWlzZSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVycm9yUHJvbWlzZTtcblxuICAgICAgICB0aGlzLmVycm9yUHJvbWlzZSA9IHByb21pc2lmeUV2ZW50KHRoaXMud29ya2VyLCAnZXJyb3InKTtcblxuICAgICAgICB0aGlzLmVycm9yUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JQcm9taXNlID0gbnVsbDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3JQcm9taXNlO1xuICAgIH1cblxuICAgIF9zZXR1cFdvcmtlckV2ZW50SGFuZGxlcnMgKCkge1xuICAgICAgICB0aGlzLndvcmtlci5vbignbWVzc2FnZScsIG1lc3NhZ2UgPT4gdGhpcy5fb25SZXNwb25zZShtZXNzYWdlKSk7XG5cbiAgICAgICAgdGhpcy53b3JrZXIuc3Rkb3V0Lm9uKCdkYXRhJywgZGF0YSA9PiBERUJVR19MT0dHRVIoJ1dvcmtlciBwcm9jZXNzIHN0ZG91dDpcXG4nLCBTdHJpbmcoZGF0YSkpKTtcbiAgICAgICAgdGhpcy53b3JrZXIuc3RkZXJyLm9uKCdkYXRhJywgZGF0YSA9PiBERUJVR19MT0dHRVIoJ1dvcmtlciBwcm9jZXNzIHN0ZGVycjpcXG4nLCBTdHJpbmcoZGF0YSkpKTtcbiAgICB9XG5cbiAgICBfdW5yZWZXb3JrZXJQcm9jZXNzICgpIHtcbiAgICAgICAgdGhpcy53b3JrZXIudW5yZWYoKTtcbiAgICAgICAgdGhpcy53b3JrZXIuc3Rkb3V0LnVucmVmKCk7XG4gICAgICAgIHRoaXMud29ya2VyLnN0ZGVyci51bnJlZigpO1xuXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLndvcmtlci5jaGFubmVsIHx8IHRoaXMud29ya2VyLl9jaGFubmVsO1xuXG4gICAgICAgIGNoYW5uZWwudW5yZWYoKTtcbiAgICB9XG5cbiAgICBfaGFuZGxlUHJvY2Vzc0Vycm9yIChlcnJvcikge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgICAgICAgREVCVUdfTE9HR0VSKGVycm9yKTtcbiAgICB9XG5cbiAgICBpbml0ICgpIHtcbiAgICAgICAgdGhpcy5pbml0UHJvbWlzZSA9IHRoaXMuaW5pdFByb21pc2VcbiAgICAgICAgICAgIC50aGVuKGFzeW5jIGluaXRpYWxpemVkID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbGl6ZWQgIT09IHZvaWQgMClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluaXRpYWxpemVkO1xuXG4gICAgICAgICAgICAgICAgdGhpcy53b3JrZXIgPSBzcGF3bihwcm9jZXNzLmFyZ3ZbMF0sIFtXT1JLRVJfUEFUSF0sIHsgZGV0YWNoZWQ6IHRydWUsIHN0ZGlvOiBXT1JLRVJfU1RESU9fQ09ORklHIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0dXBXb3JrZXJFdmVudEhhbmRsZXJzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdW5yZWZXb3JrZXJQcm9jZXNzKCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBleGl0UHJvbWlzZSA9IHRoaXMuX3dhaXRQcm9jZXNzRXhpdCgpO1xuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5yYWNlKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3dhaXRSZXNwb25zZUZvck1lc3NhZ2UoeyBjb21tYW5kOiBDT01NQU5EUy5pbml0IH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2FpdFByb2Nlc3NFcnJvcigpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhpdFByb21pc2VcbiAgICAgICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgZXhpdFByb21pc2UuY2F0Y2goZXJyb3IgPT4gdGhpcy5faGFuZGxlUHJvY2Vzc0Vycm9yKGVycm9yKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JrZXIub24oJ2Vycm9yJywgZXJyb3IgPT4gdGhpcy5faGFuZGxlUHJvY2Vzc0Vycm9yKGVycm9yKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIERFQlVHX0xPR0dFUignRmFpbGVkIHRvIHN0YXJ0IGNsZWFudXAgcHJvY2VzcycpO1xuICAgICAgICAgICAgICAgICAgICBERUJVR19MT0dHRVIoZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluaXRpYWxpemVkO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5pdFByb21pc2U7XG4gICAgfVxuXG4gICAgYXN5bmMgYWRkRGlyZWN0b3J5IChwYXRoKSB7XG4gICAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fd2FpdFJlc3BvbnNlRm9yTWVzc2FnZSh7IGNvbW1hbmQ6IENPTU1BTkRTLmFkZCwgcGF0aCB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgREVCVUdfTE9HR0VSKGBGYWlsZWQgdG8gYWRkIHRoZSAke3BhdGh9IGRpcmVjdG9yeSB0byBjbGVhbnVwIHByb2Nlc3NgKTtcbiAgICAgICAgICAgIERFQlVHX0xPR0dFUihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHJlbW92ZURpcmVjdG9yeSAocGF0aCkge1xuICAgICAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3dhaXRSZXNwb25zZUZvck1lc3NhZ2UoeyBjb21tYW5kOiBDT01NQU5EUy5yZW1vdmUsIHBhdGggfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIERFQlVHX0xPR0dFUihgRmFpbGVkIHRvIHJlbW92ZSB0aGUgJHtwYXRofSBkaXJlY3RvcnkgaW4gY2xlYW51cCBwcm9jZXNzYCk7XG4gICAgICAgICAgICBERUJVR19MT0dHRVIoZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDbGVhbnVwUHJvY2VzcygpO1xuIl19
