'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _runtime = require('../../../errors/runtime');

var _message = require('../../../errors/runtime/message');

var _message2 = _interopRequireDefault(_message);

var _testFile = require('../../../api/structure/test-file');

var _testFile2 = _interopRequireDefault(_testFile);

var _fixture = require('../../../api/structure/fixture');

var _fixture2 = _interopRequireDefault(_fixture);

var _test = require('../../../api/structure/test');

var _test2 = _interopRequireDefault(_test);

var _fromObject = require('../../../test-run/commands/from-object');

var _fromObject2 = _interopRequireDefault(_fromObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RawTestFileCompiler extends _base2.default {
    static _createTestFn(commands) {
        return (() => {
            var _ref = (0, _asyncToGenerator3.default)(function* (t) {
                for (let i = 0; i < commands.length; i++) {
                    const callsite = commands[i] && commands[i].callsite;
                    let command = null;

                    try {
                        command = (0, _fromObject2.default)(commands[i], t.testRun);

                        yield t.testRun.executeCommand(command, callsite);
                    } catch (err) {
                        err.callsite = callsite;
                        throw err;
                    }
                }
            });

            return function (_x) {
                return _ref.apply(this, arguments);
            };
        })();
    }

    static _assignCommonTestingUnitProperties(src, dest) {
        if (src.pageUrl) dest.page(src.pageUrl);

        if (src.authCredentials) dest.httpAuth(src.authCredentials);

        /* eslint-disable no-unused-expressions */
        if (src.only) dest.only;

        if (src.skip) dest.skip;

        if (src.disablePageReloads) dest.disablePageReloads;

        if (src.enablePageReloads) dest.enablePageReloads;
        /* eslint-enable no-unused-expressions */
    }

    static _addTest(testFile, src) {
        const test = new _test2.default(testFile);

        test(src.name, RawTestFileCompiler._createTestFn(src.commands));

        RawTestFileCompiler._assignCommonTestingUnitProperties(src, test);

        if (src.beforeCommands) test.before(RawTestFileCompiler._createTestFn(src.beforeCommands));

        if (src.afterCommands) test.after(RawTestFileCompiler._createTestFn(src.afterCommands));

        return test;
    }

    static _addFixture(testFile, src) {
        const fixture = new _fixture2.default(testFile);

        fixture(src.name);

        RawTestFileCompiler._assignCommonTestingUnitProperties(src, fixture);

        if (src.beforeEachCommands) fixture.beforeEach(RawTestFileCompiler._createTestFn(src.beforeEachCommands));

        if (src.afterEachCommands) fixture.afterEach(RawTestFileCompiler._createTestFn(src.afterEachCommands));

        src.tests.forEach(testSrc => RawTestFileCompiler._addTest(testFile, testSrc));
    }

    _hasTests() {
        return true;
    }

    getSupportedExtension() {
        return '.testcafe';
    }

    compile(code, filename) {
        let data = null;
        const testFile = new _testFile2.default(filename);

        try {
            data = JSON.parse(code);

            data.fixtures.forEach(fixtureSrc => RawTestFileCompiler._addFixture(testFile, fixtureSrc));

            return testFile.getTests();
        } catch (err) {
            throw new _runtime.GeneralError(_message2.default.cannotParseRawFile, filename, err.toString());
        }
    }
}
exports.default = RawTestFileCompiler;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlci90ZXN0LWZpbGUvZm9ybWF0cy9yYXcuanMiXSwibmFtZXMiOlsiUmF3VGVzdEZpbGVDb21waWxlciIsIlRlc3RGaWxlQ29tcGlsZXJCYXNlIiwiX2NyZWF0ZVRlc3RGbiIsImNvbW1hbmRzIiwidCIsImkiLCJsZW5ndGgiLCJjYWxsc2l0ZSIsImNvbW1hbmQiLCJ0ZXN0UnVuIiwiZXhlY3V0ZUNvbW1hbmQiLCJlcnIiLCJfYXNzaWduQ29tbW9uVGVzdGluZ1VuaXRQcm9wZXJ0aWVzIiwic3JjIiwiZGVzdCIsInBhZ2VVcmwiLCJwYWdlIiwiYXV0aENyZWRlbnRpYWxzIiwiaHR0cEF1dGgiLCJvbmx5Iiwic2tpcCIsImRpc2FibGVQYWdlUmVsb2FkcyIsImVuYWJsZVBhZ2VSZWxvYWRzIiwiX2FkZFRlc3QiLCJ0ZXN0RmlsZSIsInRlc3QiLCJUZXN0IiwibmFtZSIsImJlZm9yZUNvbW1hbmRzIiwiYmVmb3JlIiwiYWZ0ZXJDb21tYW5kcyIsImFmdGVyIiwiX2FkZEZpeHR1cmUiLCJmaXh0dXJlIiwiRml4dHVyZSIsImJlZm9yZUVhY2hDb21tYW5kcyIsImJlZm9yZUVhY2giLCJhZnRlckVhY2hDb21tYW5kcyIsImFmdGVyRWFjaCIsInRlc3RzIiwiZm9yRWFjaCIsInRlc3RTcmMiLCJfaGFzVGVzdHMiLCJnZXRTdXBwb3J0ZWRFeHRlbnNpb24iLCJjb21waWxlIiwiY29kZSIsImZpbGVuYW1lIiwiZGF0YSIsIlRlc3RGaWxlIiwiSlNPTiIsInBhcnNlIiwiZml4dHVyZXMiLCJmaXh0dXJlU3JjIiwiZ2V0VGVzdHMiLCJHZW5lcmFsRXJyb3IiLCJNRVNTQUdFIiwiY2Fubm90UGFyc2VSYXdGaWxlIiwidG9TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxtQkFBTixTQUFrQ0MsY0FBbEMsQ0FB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QUFJQyxPQUFXLElBQWY7QUFDQSxjQUFNdkIsV0FBVyxJQUFJd0Isa0JBQUosQ0FBYUYsUUFBYixDQUFqQjs7QUFFQSxZQUFJO0FBQ0FDLG1CQUFPRSxLQUFLQyxLQUFMLENBQVdMLElBQVgsQ0FBUDs7QUFFQUUsaUJBQUtJLFFBQUwsQ0FBY1gsT0FBZCxDQUFzQlksY0FBY3BELG9CQUFvQmdDLFdBQXBCLENBQWdDUixRQUFoQyxFQUEwQzRCLFVBQTFDLENBQXBDOztBQUVBLG1CQUFPNUIsU0FBUzZCLFFBQVQsRUFBUDtBQUNILFNBTkQsQ0FPQSxPQUFPMUMsR0FBUCxFQUFZO0FBQ1Isa0JBQU0sSUFBSTJDLHFCQUFKLENBQWlCQyxrQkFBUUMsa0JBQXpCLEVBQTZDVixRQUE3QyxFQUF1RG5DLElBQUk4QyxRQUFKLEVBQXZELENBQU47QUFDSDtBQUNKO0FBaEdpRTtrQkFBakR6RCxtQiIsImZpbGUiOiJjb21waWxlci90ZXN0LWZpbGUvZm9ybWF0cy9yYXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGVzdEZpbGVDb21waWxlckJhc2UgZnJvbSAnLi4vYmFzZSc7XG5pbXBvcnQgeyBHZW5lcmFsRXJyb3IgfSBmcm9tICcuLi8uLi8uLi9lcnJvcnMvcnVudGltZSc7XG5pbXBvcnQgTUVTU0FHRSBmcm9tICcuLi8uLi8uLi9lcnJvcnMvcnVudGltZS9tZXNzYWdlJztcbmltcG9ydCBUZXN0RmlsZSBmcm9tICcuLi8uLi8uLi9hcGkvc3RydWN0dXJlL3Rlc3QtZmlsZSc7XG5pbXBvcnQgRml4dHVyZSBmcm9tICcuLi8uLi8uLi9hcGkvc3RydWN0dXJlL2ZpeHR1cmUnO1xuaW1wb3J0IFRlc3QgZnJvbSAnLi4vLi4vLi4vYXBpL3N0cnVjdHVyZS90ZXN0JztcbmltcG9ydCBjcmVhdGVDb21tYW5kRnJvbU9iamVjdCBmcm9tICcuLi8uLi8uLi90ZXN0LXJ1bi9jb21tYW5kcy9mcm9tLW9iamVjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJhd1Rlc3RGaWxlQ29tcGlsZXIgZXh0ZW5kcyBUZXN0RmlsZUNvbXBpbGVyQmFzZSB7XG4gICAgc3RhdGljIF9jcmVhdGVUZXN0Rm4gKGNvbW1hbmRzKSB7XG4gICAgICAgIHJldHVybiBhc3luYyB0ID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29tbWFuZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYWxsc2l0ZSA9IGNvbW1hbmRzW2ldICYmIGNvbW1hbmRzW2ldLmNhbGxzaXRlO1xuICAgICAgICAgICAgICAgIGxldCBjb21tYW5kICA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb21tYW5kID0gY3JlYXRlQ29tbWFuZEZyb21PYmplY3QoY29tbWFuZHNbaV0sIHQudGVzdFJ1bik7XG5cbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdC50ZXN0UnVuLmV4ZWN1dGVDb21tYW5kKGNvbW1hbmQsIGNhbGxzaXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBlcnIuY2FsbHNpdGUgPSBjYWxsc2l0ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2Fzc2lnbkNvbW1vblRlc3RpbmdVbml0UHJvcGVydGllcyAoc3JjLCBkZXN0KSB7XG4gICAgICAgIGlmIChzcmMucGFnZVVybClcbiAgICAgICAgICAgIGRlc3QucGFnZShzcmMucGFnZVVybCk7XG5cbiAgICAgICAgaWYgKHNyYy5hdXRoQ3JlZGVudGlhbHMpXG4gICAgICAgICAgICBkZXN0Lmh0dHBBdXRoKHNyYy5hdXRoQ3JlZGVudGlhbHMpO1xuXG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC1leHByZXNzaW9ucyAqL1xuICAgICAgICBpZiAoc3JjLm9ubHkpXG4gICAgICAgICAgICBkZXN0Lm9ubHk7XG5cbiAgICAgICAgaWYgKHNyYy5za2lwKVxuICAgICAgICAgICAgZGVzdC5za2lwO1xuXG4gICAgICAgIGlmIChzcmMuZGlzYWJsZVBhZ2VSZWxvYWRzKVxuICAgICAgICAgICAgZGVzdC5kaXNhYmxlUGFnZVJlbG9hZHM7XG5cbiAgICAgICAgaWYgKHNyYy5lbmFibGVQYWdlUmVsb2FkcylcbiAgICAgICAgICAgIGRlc3QuZW5hYmxlUGFnZVJlbG9hZHM7XG4gICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLWV4cHJlc3Npb25zICovXG4gICAgfVxuXG4gICAgc3RhdGljIF9hZGRUZXN0ICh0ZXN0RmlsZSwgc3JjKSB7XG4gICAgICAgIGNvbnN0IHRlc3QgPSBuZXcgVGVzdCh0ZXN0RmlsZSk7XG5cbiAgICAgICAgdGVzdChzcmMubmFtZSwgUmF3VGVzdEZpbGVDb21waWxlci5fY3JlYXRlVGVzdEZuKHNyYy5jb21tYW5kcykpO1xuXG4gICAgICAgIFJhd1Rlc3RGaWxlQ29tcGlsZXIuX2Fzc2lnbkNvbW1vblRlc3RpbmdVbml0UHJvcGVydGllcyhzcmMsIHRlc3QpO1xuXG4gICAgICAgIGlmIChzcmMuYmVmb3JlQ29tbWFuZHMpXG4gICAgICAgICAgICB0ZXN0LmJlZm9yZShSYXdUZXN0RmlsZUNvbXBpbGVyLl9jcmVhdGVUZXN0Rm4oc3JjLmJlZm9yZUNvbW1hbmRzKSk7XG5cbiAgICAgICAgaWYgKHNyYy5hZnRlckNvbW1hbmRzKVxuICAgICAgICAgICAgdGVzdC5hZnRlcihSYXdUZXN0RmlsZUNvbXBpbGVyLl9jcmVhdGVUZXN0Rm4oc3JjLmFmdGVyQ29tbWFuZHMpKTtcblxuICAgICAgICByZXR1cm4gdGVzdDtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2FkZEZpeHR1cmUgKHRlc3RGaWxlLCBzcmMpIHtcbiAgICAgICAgY29uc3QgZml4dHVyZSA9IG5ldyBGaXh0dXJlKHRlc3RGaWxlKTtcblxuICAgICAgICBmaXh0dXJlKHNyYy5uYW1lKTtcblxuICAgICAgICBSYXdUZXN0RmlsZUNvbXBpbGVyLl9hc3NpZ25Db21tb25UZXN0aW5nVW5pdFByb3BlcnRpZXMoc3JjLCBmaXh0dXJlKTtcblxuICAgICAgICBpZiAoc3JjLmJlZm9yZUVhY2hDb21tYW5kcylcbiAgICAgICAgICAgIGZpeHR1cmUuYmVmb3JlRWFjaChSYXdUZXN0RmlsZUNvbXBpbGVyLl9jcmVhdGVUZXN0Rm4oc3JjLmJlZm9yZUVhY2hDb21tYW5kcykpO1xuXG4gICAgICAgIGlmIChzcmMuYWZ0ZXJFYWNoQ29tbWFuZHMpXG4gICAgICAgICAgICBmaXh0dXJlLmFmdGVyRWFjaChSYXdUZXN0RmlsZUNvbXBpbGVyLl9jcmVhdGVUZXN0Rm4oc3JjLmFmdGVyRWFjaENvbW1hbmRzKSk7XG5cbiAgICAgICAgc3JjLnRlc3RzLmZvckVhY2godGVzdFNyYyA9PiBSYXdUZXN0RmlsZUNvbXBpbGVyLl9hZGRUZXN0KHRlc3RGaWxlLCB0ZXN0U3JjKSk7XG4gICAgfVxuXG4gICAgX2hhc1Rlc3RzICgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZ2V0U3VwcG9ydGVkRXh0ZW5zaW9uICgpIHtcbiAgICAgICAgcmV0dXJuICcudGVzdGNhZmUnO1xuICAgIH1cblxuICAgIGNvbXBpbGUgKGNvZGUsIGZpbGVuYW1lKSB7XG4gICAgICAgIGxldCBkYXRhICAgICA9IG51bGw7XG4gICAgICAgIGNvbnN0IHRlc3RGaWxlID0gbmV3IFRlc3RGaWxlKGZpbGVuYW1lKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoY29kZSk7XG5cbiAgICAgICAgICAgIGRhdGEuZml4dHVyZXMuZm9yRWFjaChmaXh0dXJlU3JjID0+IFJhd1Rlc3RGaWxlQ29tcGlsZXIuX2FkZEZpeHR1cmUodGVzdEZpbGUsIGZpeHR1cmVTcmMpKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRlc3RGaWxlLmdldFRlc3RzKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihNRVNTQUdFLmNhbm5vdFBhcnNlUmF3RmlsZSwgZmlsZW5hbWUsIGVyci50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
