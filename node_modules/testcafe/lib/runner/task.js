'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _asyncEventEmitter = require('../utils/async-event-emitter');

var _asyncEventEmitter2 = _interopRequireDefault(_asyncEventEmitter);

var _browserJob = require('./browser-job');

var _browserJob2 = _interopRequireDefault(_browserJob);

var _screenshots = require('../screenshots');

var _screenshots2 = _interopRequireDefault(_screenshots);

var _warningLog = require('../notifications/warning-log');

var _warningLog2 = _interopRequireDefault(_warningLog);

var _fixtureHookController = require('./fixture-hook-controller');

var _fixtureHookController2 = _interopRequireDefault(_fixtureHookController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Task extends _asyncEventEmitter2.default {
    constructor(tests, browserConnectionGroups, proxy, opts) {
        super();

        this.running = false;
        this.browserConnectionGroups = browserConnectionGroups;
        this.tests = tests;
        this.opts = opts;
        this.screenshots = new _screenshots2.default(this.opts.screenshotPath, this.opts.screenshotPathPattern);
        this.warningLog = new _warningLog2.default();

        this.fixtureHookController = new _fixtureHookController2.default(tests, browserConnectionGroups.length);
        this.pendingBrowserJobs = this._createBrowserJobs(proxy, this.opts);
    }

    _assignBrowserJobEventHandlers(job) {
        var _this = this;

        job.on('test-run-start', testRun => this.emit('test-run-start', testRun));

        job.on('test-run-done', (() => {
            var _ref = (0, _asyncToGenerator3.default)(function* (testRun) {
                yield _this.emit('test-run-done', testRun);

                if (_this.opts.stopOnFirstFail && testRun.errs.length) {
                    _this.abort();
                    yield _this.emit('done');
                }
            });

            return function (_x) {
                return _ref.apply(this, arguments);
            };
        })());

        job.once('start', (0, _asyncToGenerator3.default)(function* () {
            if (!_this.running) {
                _this.running = true;
                yield _this.emit('start');
            }
        }));

        job.once('done', (0, _asyncToGenerator3.default)(function* () {
            yield _this.emit('browser-job-done', job);

            (0, _lodash.pull)(_this.pendingBrowserJobs, job);

            if (!_this.pendingBrowserJobs.length) yield _this.emit('done');
        }));
    }

    _createBrowserJobs(proxy, opts) {
        return this.browserConnectionGroups.map(browserConnectionGroup => {
            const job = new _browserJob2.default(this.tests, browserConnectionGroup, proxy, this.screenshots, this.warningLog, this.fixtureHookController, opts);

            this._assignBrowserJobEventHandlers(job);
            browserConnectionGroup.map(bc => bc.addJob(job));

            return job;
        });
    }

    // API
    abort() {
        this.pendingBrowserJobs.forEach(job => job.abort());
    }
}
exports.default = Task;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvdGFzay5qcyJdLCJuYW1lcyI6WyJUYXNrIiwiQXN5bmNFdmVudEVtaXR0ZXIiLCJjb25zdHJ1Y3RvciIsInRlc3RzIiwiYnJvd3NlckNvbm5lY3Rpb25Hcm91cHMiLCJwcm94eSIsIm9wdHMiLCJydW5uaW5nIiwic2NyZWVuc2hvdHMiLCJTY3JlZW5zaG90cyIsInNjcmVlbnNob3RQYXRoIiwic2NyZWVuc2hvdFBhdGhQYXR0ZXJuIiwid2FybmluZ0xvZyIsIldhcm5pbmdMb2ciLCJmaXh0dXJlSG9va0NvbnRyb2xsZXIiLCJGaXh0dXJlSG9va0NvbnRyb2xsZXIiLCJsZW5ndGgiLCJwZW5kaW5nQnJvd3NlckpvYnMiLCJfY3JlYXRlQnJvd3NlckpvYnMiLCJfYXNzaWduQnJvd3NlckpvYkV2ZW50SGFuZGxlcnMiLCJqb2IiLCJvbiIsInRlc3RSdW4iLCJlbWl0Iiwic3RvcE9uRmlyc3RGYWlsIiwiZXJycyIsImFib3J0Iiwib25jZSIsIm1hcCIsImJyb3dzZXJDb25uZWN0aW9uR3JvdXAiLCJCcm93c2VySm9iIiwiYmMiLCJhZGRKb2IiLCJmb3JFYWNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLElBQU4sU0FBbUJDLDJCQUFuQixDQUFxQztBQUNoREMsZ0JBQWFDLEtBQWIsRUFBb0JDLHVCQUFwQixFQUE2Q0MsS0FBN0MsRUFBb0RDLElBQXBELEVBQTBEO0FBQ3REOztBQUVBLGFBQUtDLE9BQUwsR0FBK0IsS0FBL0I7QUFDQSxhQUFLSCx1QkFBTCxHQUErQkEsdUJBQS9CO0FBQ0EsYUFBS0QsS0FBTCxHQUErQkEsS0FBL0I7QUFDQSxhQUFLRyxJQUFMLEdBQStCQSxJQUEvQjtBQUNBLGFBQUtFLFdBQUwsR0FBK0IsSUFBSUMscUJBQUosQ0FBZ0IsS0FBS0gsSUFBTCxDQUFVSSxjQUExQixFQUEwQyxLQUFLSixJQUFMLENBQVVLLHFCQUFwRCxDQUEvQjtBQUNBLGFBQUtDLFVBQUwsR0FBK0IsSUFBSUMsb0JBQUosRUFBL0I7O0FBRUEsYUFBS0MscUJBQUwsR0FBNkIsSUFBSUMsK0JBQUosQ0FBMEJaLEtBQTFCLEVBQWlDQyx3QkFBd0JZLE1BQXpELENBQTdCO0FBQ0EsYUFBS0Msa0JBQUwsR0FBNkIsS0FBS0Msa0JBQUwsQ0FBd0JiLEtBQXhCLEVBQStCLEtBQUtDLElBQXBDLENBQTdCO0FBQ0g7O0FBRURhLG1DQUFnQ0MsR0FBaEMsRUFBcUM7QUFBQTs7QUFDakNBLFlBQUlDLEVBQUosQ0FBTyxnQkFBUCxFQUF5QkMsV0FBVyxLQUFLQyxJQUFMLENBQVUsZ0JBQVYsRUFBNEJELE9BQTVCLENBQXBDOztBQUVBRixZQUFJQyxFQUFKLENBQU8sZUFBUDtBQUFBLHVEQUF3QixXQUFNQyxPQUFOLEVBQWlCO0FBQ3JDLHNCQUFNLE1BQUtDLElBQUwsQ0FBVSxlQUFWLEVBQTJCRCxPQUEzQixDQUFOOztBQUVBLG9CQUFJLE1BQUtoQixJQUFMLENBQVVrQixlQUFWLElBQTZCRixRQUFRRyxJQUFSLENBQWFULE1BQTlDLEVBQXNEO0FBQ2xELDBCQUFLVSxLQUFMO0FBQ0EsMEJBQU0sTUFBS0gsSUFBTCxDQUFVLE1BQVYsQ0FBTjtBQUNIO0FBQ0osYUFQRDs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFTQUgsWUFBSU8sSUFBSixDQUFTLE9BQVQsa0NBQWtCLGFBQVk7QUFDMUIsZ0JBQUksQ0FBQyxNQUFLcEIsT0FBVixFQUFtQjtBQUNmLHNCQUFLQSxPQUFMLEdBQWUsSUFBZjtBQUNBLHNCQUFNLE1BQUtnQixJQUFMLENBQVUsT0FBVixDQUFOO0FBQ0g7QUFDSixTQUxEOztBQU9BSCxZQUFJTyxJQUFKLENBQVMsTUFBVCxrQ0FBaUIsYUFBWTtBQUN6QixrQkFBTSxNQUFLSixJQUFMLENBQVUsa0JBQVYsRUFBOEJILEdBQTlCLENBQU47O0FBRUEsOEJBQU8sTUFBS0gsa0JBQVosRUFBZ0NHLEdBQWhDOztBQUVBLGdCQUFJLENBQUMsTUFBS0gsa0JBQUwsQ0FBd0JELE1BQTdCLEVBQ0ksTUFBTSxNQUFLTyxJQUFMLENBQVUsTUFBVixDQUFOO0FBQ1AsU0FQRDtBQVFIOztBQUVETCx1QkFBb0JiLEtBQXBCLEVBQTJCQyxJQUEzQixFQUFpQztBQUM3QixlQUFPLEtBQUtGLHVCQUFMLENBQTZCd0IsR0FBN0IsQ0FBaUNDLDBCQUEwQjtBQUM5RCxrQkFBTVQsTUFBTSxJQUFJVSxvQkFBSixDQUFlLEtBQUszQixLQUFwQixFQUEyQjBCLHNCQUEzQixFQUFtRHhCLEtBQW5ELEVBQTBELEtBQUtHLFdBQS9ELEVBQTRFLEtBQUtJLFVBQWpGLEVBQTZGLEtBQUtFLHFCQUFsRyxFQUF5SFIsSUFBekgsQ0FBWjs7QUFFQSxpQkFBS2EsOEJBQUwsQ0FBb0NDLEdBQXBDO0FBQ0FTLG1DQUF1QkQsR0FBdkIsQ0FBMkJHLE1BQU1BLEdBQUdDLE1BQUgsQ0FBVVosR0FBVixDQUFqQzs7QUFFQSxtQkFBT0EsR0FBUDtBQUNILFNBUE0sQ0FBUDtBQVFIOztBQUVEO0FBQ0FNLFlBQVM7QUFDTCxhQUFLVCxrQkFBTCxDQUF3QmdCLE9BQXhCLENBQWdDYixPQUFPQSxJQUFJTSxLQUFKLEVBQXZDO0FBQ0g7QUExRCtDO2tCQUEvQjFCLEkiLCJmaWxlIjoicnVubmVyL3Rhc2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwdWxsIGFzIHJlbW92ZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgQXN5bmNFdmVudEVtaXR0ZXIgZnJvbSAnLi4vdXRpbHMvYXN5bmMtZXZlbnQtZW1pdHRlcic7XG5pbXBvcnQgQnJvd3NlckpvYiBmcm9tICcuL2Jyb3dzZXItam9iJztcbmltcG9ydCBTY3JlZW5zaG90cyBmcm9tICcuLi9zY3JlZW5zaG90cyc7XG5pbXBvcnQgV2FybmluZ0xvZyBmcm9tICcuLi9ub3RpZmljYXRpb25zL3dhcm5pbmctbG9nJztcbmltcG9ydCBGaXh0dXJlSG9va0NvbnRyb2xsZXIgZnJvbSAnLi9maXh0dXJlLWhvb2stY29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhc2sgZXh0ZW5kcyBBc3luY0V2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IgKHRlc3RzLCBicm93c2VyQ29ubmVjdGlvbkdyb3VwcywgcHJveHksIG9wdHMpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLnJ1bm5pbmcgICAgICAgICAgICAgICAgID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYnJvd3NlckNvbm5lY3Rpb25Hcm91cHMgPSBicm93c2VyQ29ubmVjdGlvbkdyb3VwcztcbiAgICAgICAgdGhpcy50ZXN0cyAgICAgICAgICAgICAgICAgICA9IHRlc3RzO1xuICAgICAgICB0aGlzLm9wdHMgICAgICAgICAgICAgICAgICAgID0gb3B0cztcbiAgICAgICAgdGhpcy5zY3JlZW5zaG90cyAgICAgICAgICAgICA9IG5ldyBTY3JlZW5zaG90cyh0aGlzLm9wdHMuc2NyZWVuc2hvdFBhdGgsIHRoaXMub3B0cy5zY3JlZW5zaG90UGF0aFBhdHRlcm4pO1xuICAgICAgICB0aGlzLndhcm5pbmdMb2cgICAgICAgICAgICAgID0gbmV3IFdhcm5pbmdMb2coKTtcblxuICAgICAgICB0aGlzLmZpeHR1cmVIb29rQ29udHJvbGxlciA9IG5ldyBGaXh0dXJlSG9va0NvbnRyb2xsZXIodGVzdHMsIGJyb3dzZXJDb25uZWN0aW9uR3JvdXBzLmxlbmd0aCk7XG4gICAgICAgIHRoaXMucGVuZGluZ0Jyb3dzZXJKb2JzICAgID0gdGhpcy5fY3JlYXRlQnJvd3NlckpvYnMocHJveHksIHRoaXMub3B0cyk7XG4gICAgfVxuXG4gICAgX2Fzc2lnbkJyb3dzZXJKb2JFdmVudEhhbmRsZXJzIChqb2IpIHtcbiAgICAgICAgam9iLm9uKCd0ZXN0LXJ1bi1zdGFydCcsIHRlc3RSdW4gPT4gdGhpcy5lbWl0KCd0ZXN0LXJ1bi1zdGFydCcsIHRlc3RSdW4pKTtcblxuICAgICAgICBqb2Iub24oJ3Rlc3QtcnVuLWRvbmUnLCBhc3luYyB0ZXN0UnVuID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZW1pdCgndGVzdC1ydW4tZG9uZScsIHRlc3RSdW4pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRzLnN0b3BPbkZpcnN0RmFpbCAmJiB0ZXN0UnVuLmVycnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hYm9ydCgpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZW1pdCgnZG9uZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBqb2Iub25jZSgnc3RhcnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucnVubmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCdzdGFydCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBqb2Iub25jZSgnZG9uZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZW1pdCgnYnJvd3Nlci1qb2ItZG9uZScsIGpvYik7XG5cbiAgICAgICAgICAgIHJlbW92ZSh0aGlzLnBlbmRpbmdCcm93c2VySm9icywgam9iKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLnBlbmRpbmdCcm93c2VySm9icy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5lbWl0KCdkb25lJyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9jcmVhdGVCcm93c2VySm9icyAocHJveHksIG9wdHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnJvd3NlckNvbm5lY3Rpb25Hcm91cHMubWFwKGJyb3dzZXJDb25uZWN0aW9uR3JvdXAgPT4ge1xuICAgICAgICAgICAgY29uc3Qgam9iID0gbmV3IEJyb3dzZXJKb2IodGhpcy50ZXN0cywgYnJvd3NlckNvbm5lY3Rpb25Hcm91cCwgcHJveHksIHRoaXMuc2NyZWVuc2hvdHMsIHRoaXMud2FybmluZ0xvZywgdGhpcy5maXh0dXJlSG9va0NvbnRyb2xsZXIsIG9wdHMpO1xuXG4gICAgICAgICAgICB0aGlzLl9hc3NpZ25Ccm93c2VySm9iRXZlbnRIYW5kbGVycyhqb2IpO1xuICAgICAgICAgICAgYnJvd3NlckNvbm5lY3Rpb25Hcm91cC5tYXAoYmMgPT4gYmMuYWRkSm9iKGpvYikpO1xuXG4gICAgICAgICAgICByZXR1cm4gam9iO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBUElcbiAgICBhYm9ydCAoKSB7XG4gICAgICAgIHRoaXMucGVuZGluZ0Jyb3dzZXJKb2JzLmZvckVhY2goam9iID0+IGpvYi5hYm9ydCgpKTtcbiAgICB9XG59XG4iXX0=
