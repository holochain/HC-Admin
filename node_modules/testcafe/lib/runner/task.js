'use strict';

exports.__esModule = true;

var _events = require('events');

var _lodash = require('lodash');

var _browserJob = require('./browser-job');

var _browserJob2 = _interopRequireDefault(_browserJob);

var _screenshots = require('../screenshots');

var _screenshots2 = _interopRequireDefault(_screenshots);

var _warningLog = require('../notifications/warning-log');

var _warningLog2 = _interopRequireDefault(_warningLog);

var _fixtureHookController = require('./fixture-hook-controller');

var _fixtureHookController2 = _interopRequireDefault(_fixtureHookController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Task extends _events.EventEmitter {
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
        job.on('test-run-start', testRun => this.emit('test-run-start', testRun));
        job.on('test-run-done', testRun => {
            this.emit('test-run-done', testRun);

            if (this.opts.stopOnFirstFail && testRun.errs.length) {
                this.abort();
                this.emit('done');
            }
        });

        job.once('start', () => {
            if (!this.running) {
                this.running = true;
                this.emit('start');
            }
        });

        job.once('done', () => {
            (0, _lodash.pull)(this.pendingBrowserJobs, job);
            this.emit('browser-job-done', job);

            if (!this.pendingBrowserJobs.length) this.emit('done');
        });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW5uZXIvdGFzay5qcyJdLCJuYW1lcyI6WyJUYXNrIiwiRXZlbnRFbWl0dGVyIiwiY29uc3RydWN0b3IiLCJ0ZXN0cyIsImJyb3dzZXJDb25uZWN0aW9uR3JvdXBzIiwicHJveHkiLCJvcHRzIiwicnVubmluZyIsInNjcmVlbnNob3RzIiwiU2NyZWVuc2hvdHMiLCJzY3JlZW5zaG90UGF0aCIsInNjcmVlbnNob3RQYXRoUGF0dGVybiIsIndhcm5pbmdMb2ciLCJXYXJuaW5nTG9nIiwiZml4dHVyZUhvb2tDb250cm9sbGVyIiwiRml4dHVyZUhvb2tDb250cm9sbGVyIiwibGVuZ3RoIiwicGVuZGluZ0Jyb3dzZXJKb2JzIiwiX2NyZWF0ZUJyb3dzZXJKb2JzIiwiX2Fzc2lnbkJyb3dzZXJKb2JFdmVudEhhbmRsZXJzIiwiam9iIiwib24iLCJ0ZXN0UnVuIiwiZW1pdCIsInN0b3BPbkZpcnN0RmFpbCIsImVycnMiLCJhYm9ydCIsIm9uY2UiLCJtYXAiLCJicm93c2VyQ29ubmVjdGlvbkdyb3VwIiwiQnJvd3NlckpvYiIsImJjIiwiYWRkSm9iIiwiZm9yRWFjaCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxJQUFOLFNBQW1CQyxvQkFBbkIsQ0FBZ0M7QUFDM0NDLGdCQUFhQyxLQUFiLEVBQW9CQyx1QkFBcEIsRUFBNkNDLEtBQTdDLEVBQW9EQyxJQUFwRCxFQUEwRDtBQUN0RDs7QUFFQSxhQUFLQyxPQUFMLEdBQStCLEtBQS9CO0FBQ0EsYUFBS0gsdUJBQUwsR0FBK0JBLHVCQUEvQjtBQUNBLGFBQUtELEtBQUwsR0FBK0JBLEtBQS9CO0FBQ0EsYUFBS0csSUFBTCxHQUErQkEsSUFBL0I7QUFDQSxhQUFLRSxXQUFMLEdBQStCLElBQUlDLHFCQUFKLENBQWdCLEtBQUtILElBQUwsQ0FBVUksY0FBMUIsRUFBMEMsS0FBS0osSUFBTCxDQUFVSyxxQkFBcEQsQ0FBL0I7QUFDQSxhQUFLQyxVQUFMLEdBQStCLElBQUlDLG9CQUFKLEVBQS9COztBQUVBLGFBQUtDLHFCQUFMLEdBQTZCLElBQUlDLCtCQUFKLENBQTBCWixLQUExQixFQUFpQ0Msd0JBQXdCWSxNQUF6RCxDQUE3QjtBQUNBLGFBQUtDLGtCQUFMLEdBQTZCLEtBQUtDLGtCQUFMLENBQXdCYixLQUF4QixFQUErQixLQUFLQyxJQUFwQyxDQUE3QjtBQUNIOztBQUVEYSxtQ0FBZ0NDLEdBQWhDLEVBQXFDO0FBQ2pDQSxZQUFJQyxFQUFKLENBQU8sZ0JBQVAsRUFBeUJDLFdBQVcsS0FBS0MsSUFBTCxDQUFVLGdCQUFWLEVBQTRCRCxPQUE1QixDQUFwQztBQUNBRixZQUFJQyxFQUFKLENBQU8sZUFBUCxFQUF3QkMsV0FBVztBQUMvQixpQkFBS0MsSUFBTCxDQUFVLGVBQVYsRUFBMkJELE9BQTNCOztBQUVBLGdCQUFJLEtBQUtoQixJQUFMLENBQVVrQixlQUFWLElBQTZCRixRQUFRRyxJQUFSLENBQWFULE1BQTlDLEVBQXNEO0FBQ2xELHFCQUFLVSxLQUFMO0FBQ0EscUJBQUtILElBQUwsQ0FBVSxNQUFWO0FBQ0g7QUFDSixTQVBEOztBQVNBSCxZQUFJTyxJQUFKLENBQVMsT0FBVCxFQUFrQixNQUFNO0FBQ3BCLGdCQUFJLENBQUMsS0FBS3BCLE9BQVYsRUFBbUI7QUFDZixxQkFBS0EsT0FBTCxHQUFlLElBQWY7QUFDQSxxQkFBS2dCLElBQUwsQ0FBVSxPQUFWO0FBQ0g7QUFDSixTQUxEOztBQU9BSCxZQUFJTyxJQUFKLENBQVMsTUFBVCxFQUFpQixNQUFNO0FBQ25CLDhCQUFPLEtBQUtWLGtCQUFaLEVBQWdDRyxHQUFoQztBQUNBLGlCQUFLRyxJQUFMLENBQVUsa0JBQVYsRUFBOEJILEdBQTlCOztBQUVBLGdCQUFJLENBQUMsS0FBS0gsa0JBQUwsQ0FBd0JELE1BQTdCLEVBQ0ksS0FBS08sSUFBTCxDQUFVLE1BQVY7QUFDUCxTQU5EO0FBT0g7O0FBRURMLHVCQUFvQmIsS0FBcEIsRUFBMkJDLElBQTNCLEVBQWlDO0FBQzdCLGVBQU8sS0FBS0YsdUJBQUwsQ0FBNkJ3QixHQUE3QixDQUFpQ0MsMEJBQTBCO0FBQzlELGtCQUFNVCxNQUFNLElBQUlVLG9CQUFKLENBQWUsS0FBSzNCLEtBQXBCLEVBQTJCMEIsc0JBQTNCLEVBQW1EeEIsS0FBbkQsRUFBMEQsS0FBS0csV0FBL0QsRUFBNEUsS0FBS0ksVUFBakYsRUFBNkYsS0FBS0UscUJBQWxHLEVBQXlIUixJQUF6SCxDQUFaOztBQUVBLGlCQUFLYSw4QkFBTCxDQUFvQ0MsR0FBcEM7QUFDQVMsbUNBQXVCRCxHQUF2QixDQUEyQkcsTUFBTUEsR0FBR0MsTUFBSCxDQUFVWixHQUFWLENBQWpDOztBQUVBLG1CQUFPQSxHQUFQO0FBQ0gsU0FQTSxDQUFQO0FBUUg7O0FBRUQ7QUFDQU0sWUFBUztBQUNMLGFBQUtULGtCQUFMLENBQXdCZ0IsT0FBeEIsQ0FBZ0NiLE9BQU9BLElBQUlNLEtBQUosRUFBdkM7QUFDSDtBQXhEMEM7a0JBQTFCMUIsSSIsImZpbGUiOiJydW5uZXIvdGFzay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyBwdWxsIGFzIHJlbW92ZSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgQnJvd3NlckpvYiBmcm9tICcuL2Jyb3dzZXItam9iJztcbmltcG9ydCBTY3JlZW5zaG90cyBmcm9tICcuLi9zY3JlZW5zaG90cyc7XG5pbXBvcnQgV2FybmluZ0xvZyBmcm9tICcuLi9ub3RpZmljYXRpb25zL3dhcm5pbmctbG9nJztcbmltcG9ydCBGaXh0dXJlSG9va0NvbnRyb2xsZXIgZnJvbSAnLi9maXh0dXJlLWhvb2stY29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhc2sgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIGNvbnN0cnVjdG9yICh0ZXN0cywgYnJvd3NlckNvbm5lY3Rpb25Hcm91cHMsIHByb3h5LCBvcHRzKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5ydW5uaW5nICAgICAgICAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJyb3dzZXJDb25uZWN0aW9uR3JvdXBzID0gYnJvd3NlckNvbm5lY3Rpb25Hcm91cHM7XG4gICAgICAgIHRoaXMudGVzdHMgICAgICAgICAgICAgICAgICAgPSB0ZXN0cztcbiAgICAgICAgdGhpcy5vcHRzICAgICAgICAgICAgICAgICAgICA9IG9wdHM7XG4gICAgICAgIHRoaXMuc2NyZWVuc2hvdHMgICAgICAgICAgICAgPSBuZXcgU2NyZWVuc2hvdHModGhpcy5vcHRzLnNjcmVlbnNob3RQYXRoLCB0aGlzLm9wdHMuc2NyZWVuc2hvdFBhdGhQYXR0ZXJuKTtcbiAgICAgICAgdGhpcy53YXJuaW5nTG9nICAgICAgICAgICAgICA9IG5ldyBXYXJuaW5nTG9nKCk7XG5cbiAgICAgICAgdGhpcy5maXh0dXJlSG9va0NvbnRyb2xsZXIgPSBuZXcgRml4dHVyZUhvb2tDb250cm9sbGVyKHRlc3RzLCBicm93c2VyQ29ubmVjdGlvbkdyb3Vwcy5sZW5ndGgpO1xuICAgICAgICB0aGlzLnBlbmRpbmdCcm93c2VySm9icyAgICA9IHRoaXMuX2NyZWF0ZUJyb3dzZXJKb2JzKHByb3h5LCB0aGlzLm9wdHMpO1xuICAgIH1cblxuICAgIF9hc3NpZ25Ccm93c2VySm9iRXZlbnRIYW5kbGVycyAoam9iKSB7XG4gICAgICAgIGpvYi5vbigndGVzdC1ydW4tc3RhcnQnLCB0ZXN0UnVuID0+IHRoaXMuZW1pdCgndGVzdC1ydW4tc3RhcnQnLCB0ZXN0UnVuKSk7XG4gICAgICAgIGpvYi5vbigndGVzdC1ydW4tZG9uZScsIHRlc3RSdW4gPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCd0ZXN0LXJ1bi1kb25lJywgdGVzdFJ1bik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdHMuc3RvcE9uRmlyc3RGYWlsICYmIHRlc3RSdW4uZXJycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFib3J0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdkb25lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGpvYi5vbmNlKCdzdGFydCcsICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5ydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3N0YXJ0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGpvYi5vbmNlKCdkb25lJywgKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlKHRoaXMucGVuZGluZ0Jyb3dzZXJKb2JzLCBqb2IpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdicm93c2VyLWpvYi1kb25lJywgam9iKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLnBlbmRpbmdCcm93c2VySm9icy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdkb25lJyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9jcmVhdGVCcm93c2VySm9icyAocHJveHksIG9wdHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnJvd3NlckNvbm5lY3Rpb25Hcm91cHMubWFwKGJyb3dzZXJDb25uZWN0aW9uR3JvdXAgPT4ge1xuICAgICAgICAgICAgY29uc3Qgam9iID0gbmV3IEJyb3dzZXJKb2IodGhpcy50ZXN0cywgYnJvd3NlckNvbm5lY3Rpb25Hcm91cCwgcHJveHksIHRoaXMuc2NyZWVuc2hvdHMsIHRoaXMud2FybmluZ0xvZywgdGhpcy5maXh0dXJlSG9va0NvbnRyb2xsZXIsIG9wdHMpO1xuXG4gICAgICAgICAgICB0aGlzLl9hc3NpZ25Ccm93c2VySm9iRXZlbnRIYW5kbGVycyhqb2IpO1xuICAgICAgICAgICAgYnJvd3NlckNvbm5lY3Rpb25Hcm91cC5tYXAoYmMgPT4gYmMuYWRkSm9iKGpvYikpO1xuXG4gICAgICAgICAgICByZXR1cm4gam9iO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBUElcbiAgICBhYm9ydCAoKSB7XG4gICAgICAgIHRoaXMucGVuZGluZ0Jyb3dzZXJKb2JzLmZvckVhY2goam9iID0+IGpvYi5hYm9ydCgpKTtcbiAgICB9XG59XG4iXX0=
