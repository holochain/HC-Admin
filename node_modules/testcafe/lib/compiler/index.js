'use strict';

exports.__esModule = true;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _lodash = require('lodash');

var _stripBom = require('strip-bom');

var _stripBom2 = _interopRequireDefault(_stripBom);

var _testcafeLegacyApi = require('testcafe-legacy-api');

var _testcafeHammerhead = require('testcafe-hammerhead');

var _testcafeHammerhead2 = _interopRequireDefault(_testcafeHammerhead);

var _compiler = require('./test-file/formats/es-next/compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _compiler3 = require('./test-file/formats/typescript/compiler');

var _compiler4 = _interopRequireDefault(_compiler3);

var _compiler5 = require('./test-file/formats/coffeescript/compiler');

var _compiler6 = _interopRequireDefault(_compiler5);

var _raw = require('./test-file/formats/raw');

var _raw2 = _interopRequireDefault(_raw);

var _promisifiedFunctions = require('../utils/promisified-functions');

var _runtime = require('../errors/runtime');

var _message = require('../errors/runtime/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SOURCE_CHUNK_LENGTH = 1000;

const testFileCompilers = [new _testcafeLegacyApi.Compiler(_testcafeHammerhead2.default.processScript), new _compiler2.default(), new _compiler4.default(), new _compiler6.default(), new _raw2.default()];

class Compiler {
    constructor(sources, disableTestSyntaxValidation) {
        this.sources = sources;

        this.disableTestSyntaxValidation = disableTestSyntaxValidation;
    }

    static getSupportedTestFileExtensions() {
        return (0, _lodash.uniq)(testFileCompilers.map(c => c.getSupportedExtension()));
    }

    _compileTestFile(filename) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            let code = null;

            try {
                code = yield (0, _promisifiedFunctions.readFile)(filename);
            } catch (err) {
                throw new _runtime.GeneralError(_message2.default.cantFindSpecifiedTestSource, filename);
            }

            code = (0, _stripBom2.default)(code).toString();

            const compiler = (0, _lodash.find)(testFileCompilers, function (c) {
                return c.canCompile(code, filename, _this.disableTestSyntaxValidation);
            });

            return compiler ? yield compiler.compile(code, filename) : null;
        })();
    }

    getTests() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const sourceChunks = (0, _lodash.chunk)(_this2.sources, SOURCE_CHUNK_LENGTH);
            let tests = [];
            let compileUnits = [];

            // NOTE: split sources into chunks because the fs module can't read all files
            // simultaneously if the number of them is too large (several thousands).
            while (sourceChunks.length) {
                compileUnits = sourceChunks.shift().map(function (filename) {
                    return _this2._compileTestFile(filename);
                });
                tests = tests.concat((yield _pinkie2.default.all(compileUnits)));
            }

            testFileCompilers.forEach(function (c) {
                return c.cleanUp();
            });

            tests = (0, _lodash.flattenDeep)(tests).filter(function (test) {
                return !!test;
            });

            return tests;
        })();
    }
}
exports.default = Compiler;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21waWxlci9pbmRleC5qcyJdLCJuYW1lcyI6WyJTT1VSQ0VfQ0hVTktfTEVOR1RIIiwidGVzdEZpbGVDb21waWxlcnMiLCJMZWdhY3lUZXN0RmlsZUNvbXBpbGVyIiwiaGFtbWVyaGVhZCIsInByb2Nlc3NTY3JpcHQiLCJFc05leHRUZXN0RmlsZUNvbXBpbGVyIiwiVHlwZVNjcmlwdFRlc3RGaWxlQ29tcGlsZXIiLCJDb2ZmZWVTY3JpcHRUZXN0RmlsZUNvbXBpbGVyIiwiUmF3VGVzdEZpbGVDb21waWxlciIsIkNvbXBpbGVyIiwiY29uc3RydWN0b3IiLCJzb3VyY2VzIiwiZGlzYWJsZVRlc3RTeW50YXhWYWxpZGF0aW9uIiwiZ2V0U3VwcG9ydGVkVGVzdEZpbGVFeHRlbnNpb25zIiwibWFwIiwiYyIsImdldFN1cHBvcnRlZEV4dGVuc2lvbiIsIl9jb21waWxlVGVzdEZpbGUiLCJmaWxlbmFtZSIsImNvZGUiLCJlcnIiLCJHZW5lcmFsRXJyb3IiLCJNRVNTQUdFIiwiY2FudEZpbmRTcGVjaWZpZWRUZXN0U291cmNlIiwidG9TdHJpbmciLCJjb21waWxlciIsImNhbkNvbXBpbGUiLCJjb21waWxlIiwiZ2V0VGVzdHMiLCJzb3VyY2VDaHVua3MiLCJ0ZXN0cyIsImNvbXBpbGVVbml0cyIsImxlbmd0aCIsInNoaWZ0IiwiY29uY2F0IiwiUHJvbWlzZSIsImFsbCIsImZvckVhY2giLCJjbGVhblVwIiwiZmlsdGVyIiwidGVzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFHQSxNQUFNQSxzQkFBc0IsSUFBNUI7O0FBRUEsTUFBTUMsb0JBQW9CLENBQ3RCLElBQUlDLDJCQUFKLENBQTJCQyw2QkFBV0MsYUFBdEMsQ0FEc0IsRUFFdEIsSUFBSUMsa0JBQUosRUFGc0IsRUFHdEIsSUFBSUMsa0JBQUosRUFIc0IsRUFJdEIsSUFBSUMsa0JBQUosRUFKc0IsRUFLdEIsSUFBSUMsYUFBSixFQUxzQixDQUExQjs7QUFRZSxNQUFNQyxRQUFOLENBQWU7QUFDMUJDLGdCQUFhQyxPQUFiLEVBQXNCQywyQkFBdEIsRUFBbUQ7QUFDL0MsYUFBS0QsT0FBTCxHQUFlQSxPQUFmOztBQUVBLGFBQUtDLDJCQUFMLEdBQW1DQSwyQkFBbkM7QUFDSDs7QUFFRCxXQUFPQyw4QkFBUCxHQUF5QztBQUNyQyxlQUFPLGtCQUFLWixrQkFBa0JhLEdBQWxCLENBQXNCQyxLQUFLQSxFQUFFQyxxQkFBRixFQUEzQixDQUFMLENBQVA7QUFDSDs7QUFFS0Msb0JBQU4sQ0FBd0JDLFFBQXhCLEVBQWtDO0FBQUE7O0FBQUE7QUFDOUIsZ0JBQUlDLE9BQU8sSUFBWDs7QUFFQSxnQkFBSTtBQUNBQSx1QkFBTyxNQUFNLG9DQUFTRCxRQUFULENBQWI7QUFDSCxhQUZELENBR0EsT0FBT0UsR0FBUCxFQUFZO0FBQ1Isc0JBQU0sSUFBSUMscUJBQUosQ0FBaUJDLGtCQUFRQywyQkFBekIsRUFBc0RMLFFBQXRELENBQU47QUFDSDs7QUFFREMsbUJBQU8sd0JBQVNBLElBQVQsRUFBZUssUUFBZixFQUFQOztBQUVBLGtCQUFNQyxXQUFXLGtCQUFLeEIsaUJBQUwsRUFBd0I7QUFBQSx1QkFBS2MsRUFBRVcsVUFBRixDQUFhUCxJQUFiLEVBQW1CRCxRQUFuQixFQUE2QixNQUFLTiwyQkFBbEMsQ0FBTDtBQUFBLGFBQXhCLENBQWpCOztBQUVBLG1CQUFPYSxXQUFXLE1BQU1BLFNBQVNFLE9BQVQsQ0FBaUJSLElBQWpCLEVBQXVCRCxRQUF2QixDQUFqQixHQUFvRCxJQUEzRDtBQWQ4QjtBQWVqQzs7QUFFS1UsWUFBTixHQUFrQjtBQUFBOztBQUFBO0FBQ2Qsa0JBQU1DLGVBQWUsbUJBQU0sT0FBS2xCLE9BQVgsRUFBb0JYLG1CQUFwQixDQUFyQjtBQUNBLGdCQUFJOEIsUUFBZSxFQUFuQjtBQUNBLGdCQUFJQyxlQUFlLEVBQW5COztBQUVBO0FBQ0E7QUFDQSxtQkFBT0YsYUFBYUcsTUFBcEIsRUFBNEI7QUFDeEJELCtCQUFlRixhQUFhSSxLQUFiLEdBQXFCbkIsR0FBckIsQ0FBeUI7QUFBQSwyQkFBWSxPQUFLRyxnQkFBTCxDQUFzQkMsUUFBdEIsQ0FBWjtBQUFBLGlCQUF6QixDQUFmO0FBQ0FZLHdCQUFlQSxNQUFNSSxNQUFOLEVBQWEsTUFBTUMsaUJBQVFDLEdBQVIsQ0FBWUwsWUFBWixDQUFuQixFQUFmO0FBQ0g7O0FBRUQ5Qiw4QkFBa0JvQyxPQUFsQixDQUEwQjtBQUFBLHVCQUFLdEIsRUFBRXVCLE9BQUYsRUFBTDtBQUFBLGFBQTFCOztBQUVBUixvQkFBUSx5QkFBUUEsS0FBUixFQUFlUyxNQUFmLENBQXNCO0FBQUEsdUJBQVEsQ0FBQyxDQUFDQyxJQUFWO0FBQUEsYUFBdEIsQ0FBUjs7QUFFQSxtQkFBT1YsS0FBUDtBQWhCYztBQWlCakI7QUE3Q3lCO2tCQUFUckIsUSIsImZpbGUiOiJjb21waWxlci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9taXNlIGZyb20gJ3BpbmtpZSc7XG5pbXBvcnQgeyBmbGF0dGVuRGVlcCBhcyBmbGF0dGVuLCBmaW5kLCBjaHVuaywgdW5pcSB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgc3RyaXBCb20gZnJvbSAnc3RyaXAtYm9tJztcbmltcG9ydCB7IENvbXBpbGVyIGFzIExlZ2FjeVRlc3RGaWxlQ29tcGlsZXIgfSBmcm9tICd0ZXN0Y2FmZS1sZWdhY3ktYXBpJztcbmltcG9ydCBoYW1tZXJoZWFkIGZyb20gJ3Rlc3RjYWZlLWhhbW1lcmhlYWQnO1xuaW1wb3J0IEVzTmV4dFRlc3RGaWxlQ29tcGlsZXIgZnJvbSAnLi90ZXN0LWZpbGUvZm9ybWF0cy9lcy1uZXh0L2NvbXBpbGVyJztcbmltcG9ydCBUeXBlU2NyaXB0VGVzdEZpbGVDb21waWxlciBmcm9tICcuL3Rlc3QtZmlsZS9mb3JtYXRzL3R5cGVzY3JpcHQvY29tcGlsZXInO1xuaW1wb3J0IENvZmZlZVNjcmlwdFRlc3RGaWxlQ29tcGlsZXIgZnJvbSAnLi90ZXN0LWZpbGUvZm9ybWF0cy9jb2ZmZWVzY3JpcHQvY29tcGlsZXInO1xuaW1wb3J0IFJhd1Rlc3RGaWxlQ29tcGlsZXIgZnJvbSAnLi90ZXN0LWZpbGUvZm9ybWF0cy9yYXcnO1xuaW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tICcuLi91dGlscy9wcm9taXNpZmllZC1mdW5jdGlvbnMnO1xuaW1wb3J0IHsgR2VuZXJhbEVycm9yIH0gZnJvbSAnLi4vZXJyb3JzL3J1bnRpbWUnO1xuaW1wb3J0IE1FU1NBR0UgZnJvbSAnLi4vZXJyb3JzL3J1bnRpbWUvbWVzc2FnZSc7XG5cblxuY29uc3QgU09VUkNFX0NIVU5LX0xFTkdUSCA9IDEwMDA7XG5cbmNvbnN0IHRlc3RGaWxlQ29tcGlsZXJzID0gW1xuICAgIG5ldyBMZWdhY3lUZXN0RmlsZUNvbXBpbGVyKGhhbW1lcmhlYWQucHJvY2Vzc1NjcmlwdCksXG4gICAgbmV3IEVzTmV4dFRlc3RGaWxlQ29tcGlsZXIoKSxcbiAgICBuZXcgVHlwZVNjcmlwdFRlc3RGaWxlQ29tcGlsZXIoKSxcbiAgICBuZXcgQ29mZmVlU2NyaXB0VGVzdEZpbGVDb21waWxlcigpLFxuICAgIG5ldyBSYXdUZXN0RmlsZUNvbXBpbGVyKClcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBpbGVyIHtcbiAgICBjb25zdHJ1Y3RvciAoc291cmNlcywgZGlzYWJsZVRlc3RTeW50YXhWYWxpZGF0aW9uKSB7XG4gICAgICAgIHRoaXMuc291cmNlcyA9IHNvdXJjZXM7XG5cbiAgICAgICAgdGhpcy5kaXNhYmxlVGVzdFN5bnRheFZhbGlkYXRpb24gPSBkaXNhYmxlVGVzdFN5bnRheFZhbGlkYXRpb247XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFN1cHBvcnRlZFRlc3RGaWxlRXh0ZW5zaW9ucyAoKSB7XG4gICAgICAgIHJldHVybiB1bmlxKHRlc3RGaWxlQ29tcGlsZXJzLm1hcChjID0+IGMuZ2V0U3VwcG9ydGVkRXh0ZW5zaW9uKCkpKTtcbiAgICB9XG5cbiAgICBhc3luYyBfY29tcGlsZVRlc3RGaWxlIChmaWxlbmFtZSkge1xuICAgICAgICBsZXQgY29kZSA9IG51bGw7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvZGUgPSBhd2FpdCByZWFkRmlsZShmaWxlbmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihNRVNTQUdFLmNhbnRGaW5kU3BlY2lmaWVkVGVzdFNvdXJjZSwgZmlsZW5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29kZSA9IHN0cmlwQm9tKGNvZGUpLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgY29uc3QgY29tcGlsZXIgPSBmaW5kKHRlc3RGaWxlQ29tcGlsZXJzLCBjID0+IGMuY2FuQ29tcGlsZShjb2RlLCBmaWxlbmFtZSwgdGhpcy5kaXNhYmxlVGVzdFN5bnRheFZhbGlkYXRpb24pKTtcblxuICAgICAgICByZXR1cm4gY29tcGlsZXIgPyBhd2FpdCBjb21waWxlci5jb21waWxlKGNvZGUsIGZpbGVuYW1lKSA6IG51bGw7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VGVzdHMgKCkge1xuICAgICAgICBjb25zdCBzb3VyY2VDaHVua3MgPSBjaHVuayh0aGlzLnNvdXJjZXMsIFNPVVJDRV9DSFVOS19MRU5HVEgpO1xuICAgICAgICBsZXQgdGVzdHMgICAgICAgID0gW107XG4gICAgICAgIGxldCBjb21waWxlVW5pdHMgPSBbXTtcblxuICAgICAgICAvLyBOT1RFOiBzcGxpdCBzb3VyY2VzIGludG8gY2h1bmtzIGJlY2F1c2UgdGhlIGZzIG1vZHVsZSBjYW4ndCByZWFkIGFsbCBmaWxlc1xuICAgICAgICAvLyBzaW11bHRhbmVvdXNseSBpZiB0aGUgbnVtYmVyIG9mIHRoZW0gaXMgdG9vIGxhcmdlIChzZXZlcmFsIHRob3VzYW5kcykuXG4gICAgICAgIHdoaWxlIChzb3VyY2VDaHVua3MubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb21waWxlVW5pdHMgPSBzb3VyY2VDaHVua3Muc2hpZnQoKS5tYXAoZmlsZW5hbWUgPT4gdGhpcy5fY29tcGlsZVRlc3RGaWxlKGZpbGVuYW1lKSk7XG4gICAgICAgICAgICB0ZXN0cyAgICAgICAgPSB0ZXN0cy5jb25jYXQoYXdhaXQgUHJvbWlzZS5hbGwoY29tcGlsZVVuaXRzKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXN0RmlsZUNvbXBpbGVycy5mb3JFYWNoKGMgPT4gYy5jbGVhblVwKCkpO1xuXG4gICAgICAgIHRlc3RzID0gZmxhdHRlbih0ZXN0cykuZmlsdGVyKHRlc3QgPT4gISF0ZXN0KTtcblxuICAgICAgICByZXR1cm4gdGVzdHM7XG4gICAgfVxufVxuIl19
