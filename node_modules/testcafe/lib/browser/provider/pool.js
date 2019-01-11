'use strict';

exports.__esModule = true;

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _builtIn = require('./built-in');

var _builtIn2 = _interopRequireDefault(_builtIn);

var _pluginHost = require('./plugin-host');

var _pluginHost2 = _interopRequireDefault(_pluginHost);

var _parseProviderName = require('./parse-provider-name');

var _parseProviderName2 = _interopRequireDefault(_parseProviderName);

var _ = require('./');

var _2 = _interopRequireDefault(_);

var _connection = require('../connection');

var _connection2 = _interopRequireDefault(_connection);

var _runtime = require('../../errors/runtime');

var _message = require('../../errors/runtime/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BROWSER_PROVIDER_RE = /^([^:\s]+):?(.*)?$/;

exports.default = {
    providersCache: {},

    _handlePathAndCmd(alias) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const browserName = (0, _stringify2.default)(alias);
            const providerName = 'path';
            const provider = yield _this.getProvider(providerName);

            return { provider, providerName, browserName };
        })();
    },

    _parseAliasString(alias) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const providerRegExpMatch = BROWSER_PROVIDER_RE.exec(alias);

            if (!providerRegExpMatch) throw new _runtime.GeneralError(_message2.default.cantFindBrowser, alias);

            let providerName = providerRegExpMatch[1];
            let browserName = providerRegExpMatch[2] || '';

            let provider = yield _this2.getProvider(providerName);

            if (!provider && providerRegExpMatch[2]) provider = yield _this2.getProvider(providerName + ':');

            if (!provider) {
                providerName = 'locally-installed';
                provider = yield _this2.getProvider(providerName);
                browserName = providerRegExpMatch[1] || '';
            }

            return { provider, providerName, browserName };
        })();
    },

    _parseAlias(alias) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (alias && alias.path) return _this3._handlePathAndCmd(alias);

            if (typeof alias === 'string') return _this3._parseAliasString(alias);

            throw new _runtime.GeneralError(_message2.default.cantFindBrowser, alias);
        })();
    },

    _getInfoForAllBrowserNames(provider, providerName) {
        return (0, _asyncToGenerator3.default)(function* () {
            const allBrowserNames = provider.isMultiBrowser ? yield provider.getBrowserList() : [];

            if (!allBrowserNames.length) return { provider, providerName, browserName: '' };

            return allBrowserNames.map(function (browserName) {
                return { provider, providerName, browserName };
            });
        })();
    },

    _getProviderModule(providerName, moduleName) {
        try {
            const providerObject = require(moduleName);

            this.addProvider(providerName, providerObject);
            return this._getProviderFromCache(providerName);
        } catch (e) {
            return null;
        }
    },

    _getProviderFromCache(providerName) {
        return this.providersCache[providerName] || null;
    },

    _getBuiltinProvider(providerName) {
        const providerObject = _builtIn2.default[providerName];

        if (!providerObject) return null;

        this.addProvider(providerName, providerObject);

        return this._getProviderFromCache(providerName);
    },

    getBrowserInfo(alias) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            if (alias instanceof _connection2.default) return alias;

            const browserInfo = yield _this4._parseAlias(alias);

            const provider = browserInfo.provider,
                  providerName = browserInfo.providerName,
                  browserName = browserInfo.browserName;


            if (browserName === 'all') return yield _this4._getInfoForAllBrowserNames(provider, providerName);

            if (!(yield provider.isValidBrowserName(browserName))) throw new _runtime.GeneralError(_message2.default.cantFindBrowser, alias);

            return browserInfo;
        })();
    },

    addProvider(providerName, providerObject) {
        providerName = (0, _parseProviderName2.default)(providerName).providerName;

        this.providersCache[providerName] = new _2.default(new _pluginHost2.default(providerObject, providerName));
    },

    removeProvider(providerName) {
        providerName = (0, _parseProviderName2.default)(providerName).providerName;

        delete this.providersCache[providerName];
    },

    getProvider(providerName) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const parsedProviderName = (0, _parseProviderName2.default)(providerName);
            const moduleName = parsedProviderName.moduleName;

            providerName = parsedProviderName.providerName;

            const provider = _this5._getProviderFromCache(providerName) || _this5._getProviderModule(providerName, moduleName) || _this5._getBuiltinProvider(providerName);

            if (provider) yield _this5.providersCache[providerName].init();

            return provider;
        })();
    },

    dispose() {
        return _pinkie2.default.all((0, _values2.default)(this.providersCache).map(item => item.dispose()));
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9icm93c2VyL3Byb3ZpZGVyL3Bvb2wuanMiXSwibmFtZXMiOlsiQlJPV1NFUl9QUk9WSURFUl9SRSIsInByb3ZpZGVyc0NhY2hlIiwiX2hhbmRsZVBhdGhBbmRDbWQiLCJhbGlhcyIsImJyb3dzZXJOYW1lIiwicHJvdmlkZXJOYW1lIiwicHJvdmlkZXIiLCJnZXRQcm92aWRlciIsIl9wYXJzZUFsaWFzU3RyaW5nIiwicHJvdmlkZXJSZWdFeHBNYXRjaCIsImV4ZWMiLCJHZW5lcmFsRXJyb3IiLCJNRVNTQUdFIiwiY2FudEZpbmRCcm93c2VyIiwiX3BhcnNlQWxpYXMiLCJwYXRoIiwiX2dldEluZm9Gb3JBbGxCcm93c2VyTmFtZXMiLCJhbGxCcm93c2VyTmFtZXMiLCJpc011bHRpQnJvd3NlciIsImdldEJyb3dzZXJMaXN0IiwibGVuZ3RoIiwibWFwIiwiX2dldFByb3ZpZGVyTW9kdWxlIiwibW9kdWxlTmFtZSIsInByb3ZpZGVyT2JqZWN0IiwicmVxdWlyZSIsImFkZFByb3ZpZGVyIiwiX2dldFByb3ZpZGVyRnJvbUNhY2hlIiwiZSIsIl9nZXRCdWlsdGluUHJvdmlkZXIiLCJCVUlMVF9JTl9QUk9WSURFUlMiLCJnZXRCcm93c2VySW5mbyIsIkJyb3dzZXJDb25uZWN0aW9uIiwiYnJvd3NlckluZm8iLCJpc1ZhbGlkQnJvd3Nlck5hbWUiLCJCcm93c2VyUHJvdmlkZXIiLCJCcm93c2VyUHJvdmlkZXJQbHVnaW5Ib3N0IiwicmVtb3ZlUHJvdmlkZXIiLCJwYXJzZWRQcm92aWRlck5hbWUiLCJpbml0IiwiZGlzcG9zZSIsIlByb21pc2UiLCJhbGwiLCJpdGVtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLHNCQUFzQixvQkFBNUI7O2tCQUVlO0FBQ1hDLG9CQUFnQixFQURMOztBQUdMQyxxQkFBTixDQUF5QkMsS0FBekIsRUFBZ0M7QUFBQTs7QUFBQTtBQUM1QixrQkFBTUMsY0FBZSx5QkFBZUQsS0FBZixDQUFyQjtBQUNBLGtCQUFNRSxlQUFlLE1BQXJCO0FBQ0Esa0JBQU1DLFdBQWUsTUFBTSxNQUFLQyxXQUFMLENBQWlCRixZQUFqQixDQUEzQjs7QUFFQSxtQkFBTyxFQUFFQyxRQUFGLEVBQVlELFlBQVosRUFBMEJELFdBQTFCLEVBQVA7QUFMNEI7QUFNL0IsS0FUVTs7QUFXTEkscUJBQU4sQ0FBeUJMLEtBQXpCLEVBQWdDO0FBQUE7O0FBQUE7QUFDNUIsa0JBQU1NLHNCQUFzQlQsb0JBQW9CVSxJQUFwQixDQUF5QlAsS0FBekIsQ0FBNUI7O0FBRUEsZ0JBQUksQ0FBQ00sbUJBQUwsRUFDSSxNQUFNLElBQUlFLHFCQUFKLENBQWlCQyxrQkFBUUMsZUFBekIsRUFBMENWLEtBQTFDLENBQU47O0FBRUosZ0JBQUlFLGVBQWVJLG9CQUFvQixDQUFwQixDQUFuQjtBQUNBLGdCQUFJTCxjQUFlSyxvQkFBb0IsQ0FBcEIsS0FBMEIsRUFBN0M7O0FBRUEsZ0JBQUlILFdBQVcsTUFBTSxPQUFLQyxXQUFMLENBQWlCRixZQUFqQixDQUFyQjs7QUFFQSxnQkFBSSxDQUFDQyxRQUFELElBQWFHLG9CQUFvQixDQUFwQixDQUFqQixFQUNJSCxXQUFXLE1BQU0sT0FBS0MsV0FBTCxDQUFpQkYsZUFBZSxHQUFoQyxDQUFqQjs7QUFFSixnQkFBSSxDQUFDQyxRQUFMLEVBQWU7QUFDWEQsK0JBQWUsbUJBQWY7QUFDQUMsMkJBQWUsTUFBTSxPQUFLQyxXQUFMLENBQWlCRixZQUFqQixDQUFyQjtBQUNBRCw4QkFBZUssb0JBQW9CLENBQXBCLEtBQTBCLEVBQXpDO0FBQ0g7O0FBRUQsbUJBQU8sRUFBRUgsUUFBRixFQUFZRCxZQUFaLEVBQTBCRCxXQUExQixFQUFQO0FBcEI0QjtBQXFCL0IsS0FoQ1U7O0FBa0NMVSxlQUFOLENBQW1CWCxLQUFuQixFQUEwQjtBQUFBOztBQUFBO0FBQ3RCLGdCQUFJQSxTQUFTQSxNQUFNWSxJQUFuQixFQUNJLE9BQU8sT0FBS2IsaUJBQUwsQ0FBdUJDLEtBQXZCLENBQVA7O0FBRUosZ0JBQUksT0FBT0EsS0FBUCxLQUFpQixRQUFyQixFQUNJLE9BQU8sT0FBS0ssaUJBQUwsQ0FBdUJMLEtBQXZCLENBQVA7O0FBRUosa0JBQU0sSUFBSVEscUJBQUosQ0FBaUJDLGtCQUFRQyxlQUF6QixFQUEwQ1YsS0FBMUMsQ0FBTjtBQVBzQjtBQVF6QixLQTFDVTs7QUE0Q0xhLDhCQUFOLENBQWtDVixRQUFsQyxFQUE0Q0QsWUFBNUMsRUFBMEQ7QUFBQTtBQUN0RCxrQkFBTVksa0JBQWtCWCxTQUFTWSxjQUFULEdBQ3BCLE1BQU1aLFNBQVNhLGNBQVQsRUFEYyxHQUVwQixFQUZKOztBQUlBLGdCQUFJLENBQUNGLGdCQUFnQkcsTUFBckIsRUFDSSxPQUFPLEVBQUVkLFFBQUYsRUFBWUQsWUFBWixFQUEwQkQsYUFBYSxFQUF2QyxFQUFQOztBQUVKLG1CQUFPYSxnQkFDRkksR0FERSxDQUNFO0FBQUEsdUJBQWdCLEVBQUVmLFFBQUYsRUFBWUQsWUFBWixFQUEwQkQsV0FBMUIsRUFBaEI7QUFBQSxhQURGLENBQVA7QUFSc0Q7QUFVekQsS0F0RFU7O0FBd0RYa0IsdUJBQW9CakIsWUFBcEIsRUFBa0NrQixVQUFsQyxFQUE4QztBQUMxQyxZQUFJO0FBQ0Esa0JBQU1DLGlCQUFpQkMsUUFBUUYsVUFBUixDQUF2Qjs7QUFFQSxpQkFBS0csV0FBTCxDQUFpQnJCLFlBQWpCLEVBQStCbUIsY0FBL0I7QUFDQSxtQkFBTyxLQUFLRyxxQkFBTCxDQUEyQnRCLFlBQTNCLENBQVA7QUFDSCxTQUxELENBTUEsT0FBT3VCLENBQVAsRUFBVTtBQUNOLG1CQUFPLElBQVA7QUFDSDtBQUNKLEtBbEVVOztBQW9FWEQsMEJBQXVCdEIsWUFBdkIsRUFBcUM7QUFDakMsZUFBTyxLQUFLSixjQUFMLENBQW9CSSxZQUFwQixLQUFxQyxJQUE1QztBQUNILEtBdEVVOztBQXdFWHdCLHdCQUFxQnhCLFlBQXJCLEVBQW1DO0FBQy9CLGNBQU1tQixpQkFBaUJNLGtCQUFtQnpCLFlBQW5CLENBQXZCOztBQUVBLFlBQUksQ0FBQ21CLGNBQUwsRUFDSSxPQUFPLElBQVA7O0FBRUosYUFBS0UsV0FBTCxDQUFpQnJCLFlBQWpCLEVBQStCbUIsY0FBL0I7O0FBRUEsZUFBTyxLQUFLRyxxQkFBTCxDQUEyQnRCLFlBQTNCLENBQVA7QUFDSCxLQWpGVTs7QUFtRkwwQixrQkFBTixDQUFzQjVCLEtBQXRCLEVBQTZCO0FBQUE7O0FBQUE7QUFDekIsZ0JBQUlBLGlCQUFpQjZCLG9CQUFyQixFQUNJLE9BQU83QixLQUFQOztBQUVKLGtCQUFNOEIsY0FBYyxNQUFNLE9BQUtuQixXQUFMLENBQWlCWCxLQUFqQixDQUExQjs7QUFKeUIsa0JBTWpCRyxRQU5pQixHQU11QjJCLFdBTnZCLENBTWpCM0IsUUFOaUI7QUFBQSxrQkFNUEQsWUFOTyxHQU11QjRCLFdBTnZCLENBTVA1QixZQU5PO0FBQUEsa0JBTU9ELFdBTlAsR0FNdUI2QixXQU52QixDQU1PN0IsV0FOUDs7O0FBUXpCLGdCQUFJQSxnQkFBZ0IsS0FBcEIsRUFDSSxPQUFPLE1BQU0sT0FBS1ksMEJBQUwsQ0FBZ0NWLFFBQWhDLEVBQTBDRCxZQUExQyxDQUFiOztBQUVKLGdCQUFJLEVBQUMsTUFBTUMsU0FBUzRCLGtCQUFULENBQTRCOUIsV0FBNUIsQ0FBUCxDQUFKLEVBQ0ksTUFBTSxJQUFJTyxxQkFBSixDQUFpQkMsa0JBQVFDLGVBQXpCLEVBQTBDVixLQUExQyxDQUFOOztBQUVKLG1CQUFPOEIsV0FBUDtBQWR5QjtBQWU1QixLQWxHVTs7QUFvR1hQLGdCQUFhckIsWUFBYixFQUEyQm1CLGNBQTNCLEVBQTJDO0FBQ3ZDbkIsdUJBQWUsaUNBQWtCQSxZQUFsQixFQUFnQ0EsWUFBL0M7O0FBRUEsYUFBS0osY0FBTCxDQUFvQkksWUFBcEIsSUFBb0MsSUFBSThCLFVBQUosQ0FDaEMsSUFBSUMsb0JBQUosQ0FBOEJaLGNBQTlCLEVBQThDbkIsWUFBOUMsQ0FEZ0MsQ0FBcEM7QUFHSCxLQTFHVTs7QUE0R1hnQyxtQkFBZ0JoQyxZQUFoQixFQUE4QjtBQUMxQkEsdUJBQWUsaUNBQWtCQSxZQUFsQixFQUFnQ0EsWUFBL0M7O0FBRUEsZUFBTyxLQUFLSixjQUFMLENBQW9CSSxZQUFwQixDQUFQO0FBQ0gsS0FoSFU7O0FBa0hMRSxlQUFOLENBQW1CRixZQUFuQixFQUFpQztBQUFBOztBQUFBO0FBQzdCLGtCQUFNaUMscUJBQXFCLGlDQUFrQmpDLFlBQWxCLENBQTNCO0FBQ0Esa0JBQU1rQixhQUFxQmUsbUJBQW1CZixVQUE5Qzs7QUFFQWxCLDJCQUFlaUMsbUJBQW1CakMsWUFBbEM7O0FBRUEsa0JBQU1DLFdBQVcsT0FBS3FCLHFCQUFMLENBQTJCdEIsWUFBM0IsS0FDRixPQUFLaUIsa0JBQUwsQ0FBd0JqQixZQUF4QixFQUFzQ2tCLFVBQXRDLENBREUsSUFFRixPQUFLTSxtQkFBTCxDQUF5QnhCLFlBQXpCLENBRmY7O0FBSUEsZ0JBQUlDLFFBQUosRUFDSSxNQUFNLE9BQUtMLGNBQUwsQ0FBb0JJLFlBQXBCLEVBQWtDa0MsSUFBbEMsRUFBTjs7QUFFSixtQkFBT2pDLFFBQVA7QUFiNkI7QUFjaEMsS0FoSVU7O0FBa0lYa0MsY0FBVztBQUNQLGVBQU9DLGlCQUFRQyxHQUFSLENBQVksc0JBQWMsS0FBS3pDLGNBQW5CLEVBQW1Db0IsR0FBbkMsQ0FBdUNzQixRQUFRQSxLQUFLSCxPQUFMLEVBQS9DLENBQVosQ0FBUDtBQUNIO0FBcElVLEMiLCJmaWxlIjoiYnJvd3Nlci9wcm92aWRlci9wb29sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb21pc2UgZnJvbSAncGlua2llJztcbmltcG9ydCBCVUlMVF9JTl9QUk9WSURFUlMgZnJvbSAnLi9idWlsdC1pbic7XG5pbXBvcnQgQnJvd3NlclByb3ZpZGVyUGx1Z2luSG9zdCBmcm9tICcuL3BsdWdpbi1ob3N0JztcbmltcG9ydCBwYXJzZVByb3ZpZGVyTmFtZSBmcm9tICcuL3BhcnNlLXByb3ZpZGVyLW5hbWUnO1xuaW1wb3J0IEJyb3dzZXJQcm92aWRlciBmcm9tICcuLyc7XG5pbXBvcnQgQnJvd3NlckNvbm5lY3Rpb24gZnJvbSAnLi4vY29ubmVjdGlvbic7XG5pbXBvcnQgeyBHZW5lcmFsRXJyb3IgfSBmcm9tICcuLi8uLi9lcnJvcnMvcnVudGltZSc7XG5pbXBvcnQgTUVTU0FHRSBmcm9tICcuLi8uLi9lcnJvcnMvcnVudGltZS9tZXNzYWdlJztcblxuY29uc3QgQlJPV1NFUl9QUk9WSURFUl9SRSA9IC9eKFteOlxcc10rKTo/KC4qKT8kLztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHByb3ZpZGVyc0NhY2hlOiB7fSxcblxuICAgIGFzeW5jIF9oYW5kbGVQYXRoQW5kQ21kIChhbGlhcykge1xuICAgICAgICBjb25zdCBicm93c2VyTmFtZSAgPSBKU09OLnN0cmluZ2lmeShhbGlhcyk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyTmFtZSA9ICdwYXRoJztcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgICAgID0gYXdhaXQgdGhpcy5nZXRQcm92aWRlcihwcm92aWRlck5hbWUpO1xuXG4gICAgICAgIHJldHVybiB7IHByb3ZpZGVyLCBwcm92aWRlck5hbWUsIGJyb3dzZXJOYW1lIH07XG4gICAgfSxcblxuICAgIGFzeW5jIF9wYXJzZUFsaWFzU3RyaW5nIChhbGlhcykge1xuICAgICAgICBjb25zdCBwcm92aWRlclJlZ0V4cE1hdGNoID0gQlJPV1NFUl9QUk9WSURFUl9SRS5leGVjKGFsaWFzKTtcblxuICAgICAgICBpZiAoIXByb3ZpZGVyUmVnRXhwTWF0Y2gpXG4gICAgICAgICAgICB0aHJvdyBuZXcgR2VuZXJhbEVycm9yKE1FU1NBR0UuY2FudEZpbmRCcm93c2VyLCBhbGlhcyk7XG5cbiAgICAgICAgbGV0IHByb3ZpZGVyTmFtZSA9IHByb3ZpZGVyUmVnRXhwTWF0Y2hbMV07XG4gICAgICAgIGxldCBicm93c2VyTmFtZSAgPSBwcm92aWRlclJlZ0V4cE1hdGNoWzJdIHx8ICcnO1xuXG4gICAgICAgIGxldCBwcm92aWRlciA9IGF3YWl0IHRoaXMuZ2V0UHJvdmlkZXIocHJvdmlkZXJOYW1lKTtcblxuICAgICAgICBpZiAoIXByb3ZpZGVyICYmIHByb3ZpZGVyUmVnRXhwTWF0Y2hbMl0pXG4gICAgICAgICAgICBwcm92aWRlciA9IGF3YWl0IHRoaXMuZ2V0UHJvdmlkZXIocHJvdmlkZXJOYW1lICsgJzonKTtcblxuICAgICAgICBpZiAoIXByb3ZpZGVyKSB7XG4gICAgICAgICAgICBwcm92aWRlck5hbWUgPSAnbG9jYWxseS1pbnN0YWxsZWQnO1xuICAgICAgICAgICAgcHJvdmlkZXIgICAgID0gYXdhaXQgdGhpcy5nZXRQcm92aWRlcihwcm92aWRlck5hbWUpO1xuICAgICAgICAgICAgYnJvd3Nlck5hbWUgID0gcHJvdmlkZXJSZWdFeHBNYXRjaFsxXSB8fCAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IHByb3ZpZGVyLCBwcm92aWRlck5hbWUsIGJyb3dzZXJOYW1lIH07XG4gICAgfSxcblxuICAgIGFzeW5jIF9wYXJzZUFsaWFzIChhbGlhcykge1xuICAgICAgICBpZiAoYWxpYXMgJiYgYWxpYXMucGF0aClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oYW5kbGVQYXRoQW5kQ21kKGFsaWFzKTtcblxuICAgICAgICBpZiAodHlwZW9mIGFsaWFzID09PSAnc3RyaW5nJylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJzZUFsaWFzU3RyaW5nKGFsaWFzKTtcblxuICAgICAgICB0aHJvdyBuZXcgR2VuZXJhbEVycm9yKE1FU1NBR0UuY2FudEZpbmRCcm93c2VyLCBhbGlhcyk7XG4gICAgfSxcblxuICAgIGFzeW5jIF9nZXRJbmZvRm9yQWxsQnJvd3Nlck5hbWVzIChwcm92aWRlciwgcHJvdmlkZXJOYW1lKSB7XG4gICAgICAgIGNvbnN0IGFsbEJyb3dzZXJOYW1lcyA9IHByb3ZpZGVyLmlzTXVsdGlCcm93c2VyID9cbiAgICAgICAgICAgIGF3YWl0IHByb3ZpZGVyLmdldEJyb3dzZXJMaXN0KCkgOlxuICAgICAgICAgICAgW107XG5cbiAgICAgICAgaWYgKCFhbGxCcm93c2VyTmFtZXMubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIHsgcHJvdmlkZXIsIHByb3ZpZGVyTmFtZSwgYnJvd3Nlck5hbWU6ICcnIH07XG5cbiAgICAgICAgcmV0dXJuIGFsbEJyb3dzZXJOYW1lc1xuICAgICAgICAgICAgLm1hcChicm93c2VyTmFtZSA9PiAoeyBwcm92aWRlciwgcHJvdmlkZXJOYW1lLCBicm93c2VyTmFtZSB9KSk7XG4gICAgfSxcblxuICAgIF9nZXRQcm92aWRlck1vZHVsZSAocHJvdmlkZXJOYW1lLCBtb2R1bGVOYW1lKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwcm92aWRlck9iamVjdCA9IHJlcXVpcmUobW9kdWxlTmFtZSk7XG5cbiAgICAgICAgICAgIHRoaXMuYWRkUHJvdmlkZXIocHJvdmlkZXJOYW1lLCBwcm92aWRlck9iamVjdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0UHJvdmlkZXJGcm9tQ2FjaGUocHJvdmlkZXJOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2dldFByb3ZpZGVyRnJvbUNhY2hlIChwcm92aWRlck5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzQ2FjaGVbcHJvdmlkZXJOYW1lXSB8fCBudWxsO1xuICAgIH0sXG5cbiAgICBfZ2V0QnVpbHRpblByb3ZpZGVyIChwcm92aWRlck5hbWUpIHtcbiAgICAgICAgY29uc3QgcHJvdmlkZXJPYmplY3QgPSBCVUlMVF9JTl9QUk9WSURFUlNbcHJvdmlkZXJOYW1lXTtcblxuICAgICAgICBpZiAoIXByb3ZpZGVyT2JqZWN0KVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgdGhpcy5hZGRQcm92aWRlcihwcm92aWRlck5hbWUsIHByb3ZpZGVyT2JqZWN0KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0UHJvdmlkZXJGcm9tQ2FjaGUocHJvdmlkZXJOYW1lKTtcbiAgICB9LFxuXG4gICAgYXN5bmMgZ2V0QnJvd3NlckluZm8gKGFsaWFzKSB7XG4gICAgICAgIGlmIChhbGlhcyBpbnN0YW5jZW9mIEJyb3dzZXJDb25uZWN0aW9uKVxuICAgICAgICAgICAgcmV0dXJuIGFsaWFzO1xuXG4gICAgICAgIGNvbnN0IGJyb3dzZXJJbmZvID0gYXdhaXQgdGhpcy5fcGFyc2VBbGlhcyhhbGlhcyk7XG5cbiAgICAgICAgY29uc3QgeyBwcm92aWRlciwgcHJvdmlkZXJOYW1lLCBicm93c2VyTmFtZSB9ID0gYnJvd3NlckluZm87XG5cbiAgICAgICAgaWYgKGJyb3dzZXJOYW1lID09PSAnYWxsJylcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLl9nZXRJbmZvRm9yQWxsQnJvd3Nlck5hbWVzKHByb3ZpZGVyLCBwcm92aWRlck5hbWUpO1xuXG4gICAgICAgIGlmICghYXdhaXQgcHJvdmlkZXIuaXNWYWxpZEJyb3dzZXJOYW1lKGJyb3dzZXJOYW1lKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBHZW5lcmFsRXJyb3IoTUVTU0FHRS5jYW50RmluZEJyb3dzZXIsIGFsaWFzKTtcblxuICAgICAgICByZXR1cm4gYnJvd3NlckluZm87XG4gICAgfSxcblxuICAgIGFkZFByb3ZpZGVyIChwcm92aWRlck5hbWUsIHByb3ZpZGVyT2JqZWN0KSB7XG4gICAgICAgIHByb3ZpZGVyTmFtZSA9IHBhcnNlUHJvdmlkZXJOYW1lKHByb3ZpZGVyTmFtZSkucHJvdmlkZXJOYW1lO1xuXG4gICAgICAgIHRoaXMucHJvdmlkZXJzQ2FjaGVbcHJvdmlkZXJOYW1lXSA9IG5ldyBCcm93c2VyUHJvdmlkZXIoXG4gICAgICAgICAgICBuZXcgQnJvd3NlclByb3ZpZGVyUGx1Z2luSG9zdChwcm92aWRlck9iamVjdCwgcHJvdmlkZXJOYW1lKVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICByZW1vdmVQcm92aWRlciAocHJvdmlkZXJOYW1lKSB7XG4gICAgICAgIHByb3ZpZGVyTmFtZSA9IHBhcnNlUHJvdmlkZXJOYW1lKHByb3ZpZGVyTmFtZSkucHJvdmlkZXJOYW1lO1xuXG4gICAgICAgIGRlbGV0ZSB0aGlzLnByb3ZpZGVyc0NhY2hlW3Byb3ZpZGVyTmFtZV07XG4gICAgfSxcblxuICAgIGFzeW5jIGdldFByb3ZpZGVyIChwcm92aWRlck5hbWUpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkUHJvdmlkZXJOYW1lID0gcGFyc2VQcm92aWRlck5hbWUocHJvdmlkZXJOYW1lKTtcbiAgICAgICAgY29uc3QgbW9kdWxlTmFtZSAgICAgICAgID0gcGFyc2VkUHJvdmlkZXJOYW1lLm1vZHVsZU5hbWU7XG5cbiAgICAgICAgcHJvdmlkZXJOYW1lID0gcGFyc2VkUHJvdmlkZXJOYW1lLnByb3ZpZGVyTmFtZTtcblxuICAgICAgICBjb25zdCBwcm92aWRlciA9IHRoaXMuX2dldFByb3ZpZGVyRnJvbUNhY2hlKHByb3ZpZGVyTmFtZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0UHJvdmlkZXJNb2R1bGUocHJvdmlkZXJOYW1lLCBtb2R1bGVOYW1lKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRCdWlsdGluUHJvdmlkZXIocHJvdmlkZXJOYW1lKTtcblxuICAgICAgICBpZiAocHJvdmlkZXIpXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnByb3ZpZGVyc0NhY2hlW3Byb3ZpZGVyTmFtZV0uaW5pdCgpO1xuXG4gICAgICAgIHJldHVybiBwcm92aWRlcjtcbiAgICB9LFxuXG4gICAgZGlzcG9zZSAoKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChPYmplY3QudmFsdWVzKHRoaXMucHJvdmlkZXJzQ2FjaGUpLm1hcChpdGVtID0+IGl0ZW0uZGlzcG9zZSgpKSk7XG4gICAgfVxufTtcbiJdfQ==
