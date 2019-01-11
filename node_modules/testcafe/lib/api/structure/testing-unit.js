'use strict';

exports.__esModule = true;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _testPageUrl = require('../test-page-url');

var _handleTagArgs = require('../../utils/handle-tag-args');

var _handleTagArgs2 = _interopRequireDefault(_handleTagArgs);

var _delegatedApi = require('../../utils/delegated-api');

var _typeAssertions = require('../../errors/runtime/type-assertions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TestingUnit {
    constructor(testFile, unitTypeName) {
        this.testFile = testFile;
        this.unitTypeName = unitTypeName;

        this.name = null;
        this.pageUrl = null;
        this.authCredentials = null;
        this.meta = {};
        this.only = false;
        this.skip = false;

        this.disablePageReloads = void 0;

        const unit = this;

        this.apiOrigin = function apiOrigin(...args) {
            return unit._add(...args);
        };

        (0, _delegatedApi.delegateAPI)(this.apiOrigin, this.constructor.API_LIST, { handler: this });
    }

    _add() {
        throw new Error('Not implemented');
    }

    _only$getter() {
        this.only = true;

        return this.apiOrigin;
    }

    _skip$getter() {
        this.skip = true;

        return this.apiOrigin;
    }

    _disablePageReloads$getter() {
        this.disablePageReloads = true;

        return this.apiOrigin;
    }

    _enablePageReloads$getter() {
        this.disablePageReloads = false;

        return this.apiOrigin;
    }

    _page$(url, ...rest) {
        this.pageUrl = (0, _handleTagArgs2.default)(url, rest);

        (0, _typeAssertions.assertType)(_typeAssertions.is.string, 'page', 'The page URL', this.pageUrl);

        (0, _testPageUrl.assertUrl)(this.pageUrl, 'page');

        this.pageUrl = (0, _testPageUrl.resolvePageUrl)(this.pageUrl, this.testFile.filename);

        return this.apiOrigin;
    }

    _httpAuth$(credentials) {
        (0, _typeAssertions.assertType)(_typeAssertions.is.nonNullObject, 'httpAuth', 'credentials', credentials);
        (0, _typeAssertions.assertType)(_typeAssertions.is.string, 'httpAuth', 'credentials.username', credentials.username);
        (0, _typeAssertions.assertType)(_typeAssertions.is.string, 'httpAuth', 'credentials.password', credentials.password);

        if (credentials.domain) (0, _typeAssertions.assertType)(_typeAssertions.is.string, 'httpAuth', 'credentials.domain', credentials.domain);
        if (credentials.workstation) (0, _typeAssertions.assertType)(_typeAssertions.is.string, 'httpAuth', 'credentials.workstation', credentials.workstation);

        this.authCredentials = credentials;

        return this.apiOrigin;
    }

    _meta$(...args) {
        (0, _typeAssertions.assertType)([_typeAssertions.is.string, _typeAssertions.is.nonNullObject], 'meta', `${this.unitTypeName}.meta`, args[0]);

        const data = typeof args[0] === 'string' ? { [args[0]]: args[1] } : args[0];

        (0, _keys2.default)(data).forEach(key => {
            this.meta[key] = data[key];
        });

        return this.apiOrigin;
    }

    static _makeAPIListForChildClass(ChildClass) {
        ChildClass.API_LIST = TestingUnit.API_LIST.concat((0, _delegatedApi.getDelegatedAPIList)(ChildClass.prototype));
    }
}

exports.default = TestingUnit;
TestingUnit.API_LIST = (0, _delegatedApi.getDelegatedAPIList)(TestingUnit.prototype);
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvc3RydWN0dXJlL3Rlc3RpbmctdW5pdC5qcyJdLCJuYW1lcyI6WyJUZXN0aW5nVW5pdCIsImNvbnN0cnVjdG9yIiwidGVzdEZpbGUiLCJ1bml0VHlwZU5hbWUiLCJuYW1lIiwicGFnZVVybCIsImF1dGhDcmVkZW50aWFscyIsIm1ldGEiLCJvbmx5Iiwic2tpcCIsImRpc2FibGVQYWdlUmVsb2FkcyIsInVuaXQiLCJhcGlPcmlnaW4iLCJhcmdzIiwiX2FkZCIsIkFQSV9MSVNUIiwiaGFuZGxlciIsIkVycm9yIiwiX29ubHkkZ2V0dGVyIiwiX3NraXAkZ2V0dGVyIiwiX2Rpc2FibGVQYWdlUmVsb2FkcyRnZXR0ZXIiLCJfZW5hYmxlUGFnZVJlbG9hZHMkZ2V0dGVyIiwiX3BhZ2UkIiwidXJsIiwicmVzdCIsImlzIiwic3RyaW5nIiwiZmlsZW5hbWUiLCJfaHR0cEF1dGgkIiwiY3JlZGVudGlhbHMiLCJub25OdWxsT2JqZWN0IiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImRvbWFpbiIsIndvcmtzdGF0aW9uIiwiX21ldGEkIiwiZGF0YSIsImZvckVhY2giLCJrZXkiLCJfbWFrZUFQSUxpc3RGb3JDaGlsZENsYXNzIiwiQ2hpbGRDbGFzcyIsImNvbmNhdCIsInByb3RvdHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBR2UsTUFBTUEsV0FBTixDQUFrQjtBQUM3QkMsZ0JBQWFDLFFBQWIsRUFBdUJDLFlBQXZCLEVBQXFDO0FBQ2pDLGFBQUtELFFBQUwsR0FBb0JBLFFBQXBCO0FBQ0EsYUFBS0MsWUFBTCxHQUFvQkEsWUFBcEI7O0FBRUEsYUFBS0MsSUFBTCxHQUF1QixJQUF2QjtBQUNBLGFBQUtDLE9BQUwsR0FBdUIsSUFBdkI7QUFDQSxhQUFLQyxlQUFMLEdBQXVCLElBQXZCO0FBQ0EsYUFBS0MsSUFBTCxHQUF1QixFQUF2QjtBQUNBLGFBQUtDLElBQUwsR0FBdUIsS0FBdkI7QUFD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RCxXQUFPMkIseUJBQVAsQ0FBa0NDLFVBQWxDLEVBQThDO0FBQzFDQSxtQkFBV3pCLFFBQVgsR0FBc0JmLFlBQVllLFFBQVosQ0FBcUIwQixNQUFyQixDQUE0Qix1Q0FBb0JELFdBQVdFLFNBQS9CLENBQTVCLENBQXRCO0FBQ0g7QUE1RjRCOztrQkFBWjFDLFc7QUErRnJCQSxZQUFZZSxRQUFaLEdBQXVCLHVDQUFvQmYsWUFBWTBDLFNBQWhDLENBQXZCIiwiZmlsZSI6ImFwaS9zdHJ1Y3R1cmUvdGVzdGluZy11bml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXNzZXJ0VXJsLCByZXNvbHZlUGFnZVVybCB9IGZyb20gJy4uL3Rlc3QtcGFnZS11cmwnO1xuaW1wb3J0IGhhbmRsZVRhZ0FyZ3MgZnJvbSAnLi4vLi4vdXRpbHMvaGFuZGxlLXRhZy1hcmdzJztcbmltcG9ydCB7IGRlbGVnYXRlQVBJLCBnZXREZWxlZ2F0ZWRBUElMaXN0IH0gZnJvbSAnLi4vLi4vdXRpbHMvZGVsZWdhdGVkLWFwaSc7XG5pbXBvcnQgeyBhc3NlcnRUeXBlLCBpcyB9IGZyb20gJy4uLy4uL2Vycm9ycy9ydW50aW1lL3R5cGUtYXNzZXJ0aW9ucyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVzdGluZ1VuaXQge1xuICAgIGNvbnN0cnVjdG9yICh0ZXN0RmlsZSwgdW5pdFR5cGVOYW1lKSB7XG4gICAgICAgIHRoaXMudGVzdEZpbGUgICAgID0gdGVzdEZpbGU7XG4gICAgICAgIHRoaXMudW5pdFR5cGVOYW1lID0gdW5pdFR5cGVOYW1lO1xuXG4gICAgICAgIHRoaXMubmFtZSAgICAgICAgICAgID0gbnVsbDtcbiAgICAgICAgdGhpcy5wYWdlVXJsICAgICAgICAgPSBudWxsO1xuICAgICAgICB0aGlzLmF1dGhDcmVkZW50aWFscyA9IG51bGw7XG4gICAgICAgIHRoaXMubWV0YSAgICAgICAgICAgID0ge307XG4gICAgICAgIHRoaXMub25seSAgICAgICAgICAgID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2tpcCAgICAgICAgICAgID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kaXNhYmxlUGFnZVJlbG9hZHMgPSB2b2lkIDA7XG5cbiAgICAgICAgY29uc3QgdW5pdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5hcGlPcmlnaW4gPSBmdW5jdGlvbiBhcGlPcmlnaW4gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB1bml0Ll9hZGQoLi4uYXJncyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZGVsZWdhdGVBUEkodGhpcy5hcGlPcmlnaW4sIHRoaXMuY29uc3RydWN0b3IuQVBJX0xJU1QsIHsgaGFuZGxlcjogdGhpcyB9KTtcbiAgICB9XG5cbiAgICBfYWRkICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICB9XG5cbiAgICBfb25seSRnZXR0ZXIgKCkge1xuICAgICAgICB0aGlzLm9ubHkgPSB0cnVlO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFwaU9yaWdpbjtcbiAgICB9XG5cbiAgICBfc2tpcCRnZXR0ZXIgKCkge1xuICAgICAgICB0aGlzLnNraXAgPSB0cnVlO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFwaU9yaWdpbjtcbiAgICB9XG5cbiAgICBfZGlzYWJsZVBhZ2VSZWxvYWRzJGdldHRlciAoKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVBhZ2VSZWxvYWRzID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gdGhpcy5hcGlPcmlnaW47XG4gICAgfVxuXG4gICAgX2VuYWJsZVBhZ2VSZWxvYWRzJGdldHRlciAoKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVBhZ2VSZWxvYWRzID0gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpT3JpZ2luO1xuICAgIH1cblxuICAgIF9wYWdlJCAodXJsLCAuLi5yZXN0KSB7XG4gICAgICAgIHRoaXMucGFnZVVybCA9IGhhbmRsZVRhZ0FyZ3ModXJsLCByZXN0KTtcblxuICAgICAgICBhc3NlcnRUeXBlKGlzLnN0cmluZywgJ3BhZ2UnLCAnVGhlIHBhZ2UgVVJMJywgdGhpcy5wYWdlVXJsKTtcblxuICAgICAgICBhc3NlcnRVcmwodGhpcy5wYWdlVXJsLCAncGFnZScpO1xuXG4gICAgICAgIHRoaXMucGFnZVVybCA9IHJlc29sdmVQYWdlVXJsKHRoaXMucGFnZVVybCwgdGhpcy50ZXN0RmlsZS5maWxlbmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpT3JpZ2luO1xuICAgIH1cblxuICAgIF9odHRwQXV0aCQgKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGFzc2VydFR5cGUoaXMubm9uTnVsbE9iamVjdCwgJ2h0dHBBdXRoJywgJ2NyZWRlbnRpYWxzJywgY3JlZGVudGlhbHMpO1xuICAgICAgICBhc3NlcnRUeXBlKGlzLnN0cmluZywgJ2h0dHBBdXRoJywgJ2NyZWRlbnRpYWxzLnVzZXJuYW1lJywgY3JlZGVudGlhbHMudXNlcm5hbWUpO1xuICAgICAgICBhc3NlcnRUeXBlKGlzLnN0cmluZywgJ2h0dHBBdXRoJywgJ2NyZWRlbnRpYWxzLnBhc3N3b3JkJywgY3JlZGVudGlhbHMucGFzc3dvcmQpO1xuXG4gICAgICAgIGlmIChjcmVkZW50aWFscy5kb21haW4pXG4gICAgICAgICAgICBhc3NlcnRUeXBlKGlzLnN0cmluZywgJ2h0dHBBdXRoJywgJ2NyZWRlbnRpYWxzLmRvbWFpbicsIGNyZWRlbnRpYWxzLmRvbWFpbik7XG4gICAgICAgIGlmIChjcmVkZW50aWFscy53b3Jrc3RhdGlvbilcbiAgICAgICAgICAgIGFzc2VydFR5cGUoaXMuc3RyaW5nLCAnaHR0cEF1dGgnLCAnY3JlZGVudGlhbHMud29ya3N0YXRpb24nLCBjcmVkZW50aWFscy53b3Jrc3RhdGlvbik7XG5cbiAgICAgICAgdGhpcy5hdXRoQ3JlZGVudGlhbHMgPSBjcmVkZW50aWFscztcblxuICAgICAgICByZXR1cm4gdGhpcy5hcGlPcmlnaW47XG4gICAgfVxuXG4gICAgX21ldGEkICguLi5hcmdzKSB7XG4gICAgICAgIGFzc2VydFR5cGUoW2lzLnN0cmluZywgaXMubm9uTnVsbE9iamVjdF0sICdtZXRhJywgYCR7dGhpcy51bml0VHlwZU5hbWV9Lm1ldGFgLCBhcmdzWzBdKTtcblxuICAgICAgICBjb25zdCBkYXRhID0gdHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnID8geyBbYXJnc1swXV06IGFyZ3NbMV0gfSA6IGFyZ3NbMF07XG5cbiAgICAgICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgdGhpcy5tZXRhW2tleV0gPSBkYXRhW2tleV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmFwaU9yaWdpbjtcbiAgICB9XG5cbiAgICBzdGF0aWMgX21ha2VBUElMaXN0Rm9yQ2hpbGRDbGFzcyAoQ2hpbGRDbGFzcykge1xuICAgICAgICBDaGlsZENsYXNzLkFQSV9MSVNUID0gVGVzdGluZ1VuaXQuQVBJX0xJU1QuY29uY2F0KGdldERlbGVnYXRlZEFQSUxpc3QoQ2hpbGRDbGFzcy5wcm90b3R5cGUpKTtcbiAgICB9XG59XG5cblRlc3RpbmdVbml0LkFQSV9MSVNUID0gZ2V0RGVsZWdhdGVkQVBJTGlzdChUZXN0aW5nVW5pdC5wcm90b3R5cGUpO1xuXG5cbiJdfQ==
