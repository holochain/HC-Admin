'use strict';

exports.__esModule = true;
exports.TestFileParserBase = exports.Test = exports.Fixture = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _promisify = require('../../utils/promisify');

var _promisify2 = _interopRequireDefault(_promisify);

var _util = require('util');

var _runtime = require('../../errors/runtime');

var _message = require('../../errors/runtime/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readFile = (0, _promisify2.default)(_fs2.default.readFile);

const METHODS_SPECIFYING_NAME = ['only', 'skip'];
const COMPUTED_NAME_TEXT_TMP = '<computed name>(line: %s)';

class Fixture {
    constructor(name, start, end, loc, meta) {
        this.name = name;
        this.loc = loc;
        this.start = start;
        this.end = end;
        this.meta = meta;
        this.tests = [];
    }
}

exports.Fixture = Fixture;
class Test {
    constructor(name, start, end, loc, meta) {
        this.name = name;
        this.loc = loc;
        this.start = start;
        this.end = end;
        this.meta = meta;
    }
}

exports.Test = Test;
class TestFileParserBase {
    constructor(tokenType) {
        this.tokenType = tokenType;
    }

    static formatComputedName(line) {
        return (0, _util.format)(COMPUTED_NAME_TEXT_TMP, line);
    }

    isAsyncFn() /* token */{
        throw new Error('Not implemented');
    }

    getRValue() /* token */{
        throw new Error('Not implemented');
    }

    getFunctionBody() /* token */{
        throw new Error('Not implemented');
    }

    formatFnData() /* name, value, token */{
        throw new Error('Not implemented');
    }

    analyzeMemberExp() /* token */{
        throw new Error('Not implemented');
    }

    formatFnArg() /* arg */{
        throw new Error('Not implemented');
    }

    getFnCall() /* token */{
        throw new Error('Not implemented');
    }

    getTaggedTemplateExp() /* token */{
        throw new Error('Not implemented');
    }

    analyzeFnCall() /* token */{
        throw new Error('Not implemented');
    }

    parse() /* filePath, code */{
        throw new Error('Not implemented');
    }

    getTokenType() /* token */{
        throw new Error('Not implemented');
    }

    getCalleeToken() /* token */{
        throw new Error('Not implemented');
    }

    getMemberFnName() {
        throw new Error('Not implemented');
    }

    getKeyValue() {
        throw new Error('Not implemented');
    }

    getStringValue() {
        throw new Error('Not implemented');
    }

    isApiFn(fn) {
        return fn === 'fixture' || fn === 'test';
    }

    serializeObjExp(token) {
        if (this.getTokenType(token) !== this.tokenType.ObjectLiteralExpression) return {};

        return token.properties.reduce((obj, prop) => {
            var _getKeyValue = this.getKeyValue(prop);

            const key = _getKeyValue.key,
                  value = _getKeyValue.value;


            if (typeof value !== 'string') return {};

            obj[key] = value;

            return obj;
        }, {});
    }

    processMetaArgs(token) {
        if (this.getTokenType(token) !== this.tokenType.CallExpression) return null;

        const args = token.arguments;

        let meta = {};

        if (args.length === 2) {
            const value = this.getStringValue(args[1]);

            if (typeof value !== 'string') return {};

            meta = { [this.formatFnArg(args[0])]: value };
        } else if (args.length === 1) meta = this.serializeObjExp(args[0]);

        return meta;
    }

    getMetaInfo(callStack) {
        return callStack.reduce((metaCalls, exp) => {
            if (this.getTokenType(exp) !== this.tokenType.CallExpression) return metaCalls;

            const callee = this.getCalleeToken(exp);
            const calleeType = this.getTokenType(callee);
            const isCalleeMemberExp = calleeType === this.tokenType.PropertyAccessExpression;

            if (isCalleeMemberExp && this.getMemberFnName(exp) === 'meta') return [this.processMetaArgs(exp)].concat(metaCalls);

            return metaCalls;
        }, []);
    }

    checkExpDefineTargetName(type, apiFn) {
        //NOTE: fixture('fixtureName').chainFn or test('testName').chainFn
        const isDirectCall = type === this.tokenType.Identifier;

        //NOTE: fixture.skip('fixtureName'), test.only('testName') etc.
        const isMemberCall = type === this.tokenType.PropertyAccessExpression && METHODS_SPECIFYING_NAME.indexOf(apiFn) > -1;

        //NOTE: fixture.before().after()('fixtureName'), test.before()`testName`.after() etc.
        const isTailCall = type === this.tokenType.CallExpression;

        return isDirectCall || isMemberCall || isTailCall;
    }

    analyzeToken(token) {
        const tokenType = this.tokenType;
        const currTokenType = this.getTokenType(token);

        switch (currTokenType) {
            case tokenType.ExpressionStatement:
            case tokenType.TypeAssertionExpression:
                return this.analyzeToken(token.expression);

            case tokenType.FunctionDeclaration:
            case tokenType.FunctionExpression:
                if (this.isAsyncFn(token)) return null;

                return this.getFunctionBody(token).map(this.analyzeToken, this);

            case tokenType.VariableDeclaration:
            case tokenType.VariableStatement:
                {
                    const variableValue = this.getRValue(token); // Skip variable declarations like `var foo;`

                    return variableValue ? this.analyzeToken(variableValue) : null;
                }
            case tokenType.CallExpression:
            case tokenType.PropertyAccessExpression:
            case tokenType.TaggedTemplateExpression:
                return this.analyzeFnCall(token);

            case tokenType.ReturnStatement:
                return token.argument ? this.analyzeToken(token.argument) : null;
        }

        return null;
    }

    collectTestCafeCalls(astBody) {
        let calls = [];

        astBody.forEach(token => {
            const callExps = this.analyzeToken(token);

            if (callExps) calls = calls.concat(callExps);
        });

        return calls;
    }

    analyze(astBody) {
        const fixtures = [];
        const testCafeAPICalls = this.collectTestCafeCalls(astBody);

        testCafeAPICalls.forEach(call => {
            if (!call || typeof call.value !== 'string') return;

            if (call.fnName === 'fixture') {
                fixtures.push(new Fixture(call.value, call.start, call.end, call.loc, call.meta));
                return;
            }

            if (!fixtures.length) return;

            const test = new Test(call.value, call.start, call.end, call.loc, call.meta);

            fixtures[fixtures.length - 1].tests.push(test);
        });

        return fixtures;
    }

    readFile(filePath) {
        return (0, _asyncToGenerator3.default)(function* () {
            let fileContent = '';

            try {
                fileContent = yield readFile(filePath, 'utf8');
            } catch (err) {
                throw new _runtime.GeneralError(_message2.default.cantFindSpecifiedTestSource, filePath);
            }

            return fileContent;
        })();
    }

    getTestList(filePath) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            const fileContent = yield _this.readFile(filePath);

            return _this.parse(fileContent);
        })();
    }

    getTestListFromCode(code) {
        return this.parse(code);
    }
}
exports.TestFileParserBase = TestFileParserBase;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlci90ZXN0LWZpbGUvdGVzdC1maWxlLXBhcnNlci1iYXNlLmpzIl0sIm5hbWVzIjpbInJlYWRGaWxlIiwiZnMiLCJNRVRIT0RTX1NQRUNJRllJTkdfTkFNRSIsIkNPTVBVVEVEX05BTUVfVEVYVF9UTVAiLCJGaXh0dXJlIiwiY29uc3RydWN0b3IiLCJuYW1lIiwic3RhcnQiLCJlbmQiLCJsb2MiLCJtZXRhIiwidGVzdHMiLCJUZXN0IiwiVGVzdEZpbGVQYXJzZXJCYXNlIiwidG9rZW5UeXBlIiwiZm9ybWF0Q29tcHV0ZWROYW1lIiwibGluZSIsImlzQXN5bmNGbiIsIkVycm9yIiwiZ2V0UlZhbHVlIiwiZ2V0RnVuY3Rpb25Cb2R5IiwiZm9ybWF0Rm5EYXRhIiwiYW5hbHl6ZU1lbWJlckV4cCIsImZvcm1hdEZuQXJnIiwiZ2V0Rm5DYWxsIiwiZ2V0VGFnZ2VkVGVtcGxhdGVFeHAiLCJhbmFseXplRm5DYWxsIiwicGFyc2UiLCJnZXRUb2tlblR5cGUiLCJnZXRDYWxsZWVUb2tlbiIsImdldE1lbWJlckZuTmFtZSIsImdldEtleVZhbHVlIiwiZ2V0U3RyaW5nVmFsdWUiLCJpc0FwaUZuIiwiZm4iLCJzZXJpYWxpemVPYmpFeHAiLCJ0b2tlbiIsIk9iamVjdExpdGVyYWxFeHByZXNzaW9uIiwicHJvcGVydGllcyIsInJlZHVjZSIsIm9iaiIsInByb3AiLCJrZXkiLCJ2YWx1ZSIsInByb2Nlc3NNZXRhQXJncyIsIkNhbGxFeHByZXNzaW9uIiwiYXJncyIsImFyZ3VtZW50cyIsImxlbmd0aCIsImdldE1ldGFJbmZvIiwiY2FsbFN0YWNrIiwibWV0YUNhbGxzIiwiZXhwIiwiY2FsbGVlIiwiY2FsbGVlVHlwZSIsImlzQ2FsbGVlTWVtYmVyRXhwIiwiUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uIiwiY29uY2F0IiwiY2hlY2tFeHBEZWZpbmVUYXJnZXROYW1lIiwidHlwZSIsImFwaUZuIiwiaXNEaXJlY3RDYWxsIiwiSWRlbnRpZmllciIsImlzTWVtYmVyQ2FsbCIsImluZGV4T2YiLCJpc1RhaWxDYWxsIiwiYW5hbHl6ZVRva2VuIiwiY3VyclRva2VuVHlwZSIsIkV4cHJlc3Npb25TdGF0ZW1lbnQiLCJUeXBlQXNzZXJ0aW9uRXhwcmVzc2lvbiIsImV4cHJlc3Npb24iLCJGdW5jdGlvbkRlY2xhcmF0aW9uIiwiRnVuY3Rpb25FeHByZXNzaW9uIiwibWFwIiwiVmFyaWFibGVEZWNsYXJhdGlvbiIsIlZhcmlhYmxlU3RhdGVtZW50IiwidmFyaWFibGVWYWx1ZSIsIlRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbiIsIlJldHVyblN0YXRlbWVudCIsImFyZ3VtZW50IiwiY29sbGVjdFRlc3RDYWZlQ2FsbHMiLCJhc3RCb2R5IiwiY2FsbHMiLCJmb3JFYWNoIiwiY2FsbEV4cHMiLCJhbmFseXplIiwiZml4dHVyZXMiLCJ0ZXN0Q2FmZUFQSUNhbGxzIiwiY2FsbCIsImZuTmFtZSIsInB1c2giLCJ0ZXN0IiwiZmlsZVBhdGgiLCJmaWxlQ29udGVudCIsImVyciIsIkdlbmVyYWxFcnJvciIsIk1FU1NBR0UiLCJjYW50RmluZFNwZWNpZmllZFRlc3RTb3VyY2UiLCJnZXRUZXN0TGlzdCIsImdldFRlc3RMaXN0RnJvbUNvZGUiLCJjb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7OztBQUVBLE1BQU1BLFdBQVcseUJBQVVDLGFBQUdELFFBQWIsQ0FBakI7O0FBRUEsTUFBTUUsMEJBQTBCLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FBaEM7QUFDQSxNQUFNQyx5QkFBMEIsMkJBQWhDOztBQUVPLE1BQU1DLE9BQU4sQ0FBYztBQUNqQkMsZ0JBQWFDLElBQWIsRUFBbUJDLEtBQW5CLEVBQTBCQyxHQUExQixFQUErQkMsR0FBL0IsRUFBb0NDLElBQXBDLEVBQTBDO0FBQ3RDLGFBQUtKLElBQUwsR0FBYUEsSUFBYjtBQUNBLGFBQUtHLEdBQUwsR0FBYUEsR0FBYjtBQUNBLGFBQUtGLEtBQUwsR0FB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O0FBSHlCO0FBSTVCOztBQUVETSx3QkFBcUJDLElBQXJCLEVBQTJCO0FBQ3ZCLGVBQU8sS0FBS3pFLEtBQUwsQ0FBV3lFLElBQVgsQ0FBUDtBQUNIO0FBdk8yQjtRQUFuQnZGLGtCLEdBQUFBLGtCIiwiZmlsZSI6ImNvbXBpbGVyL3Rlc3QtZmlsZS90ZXN0LWZpbGUtcGFyc2VyLWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHByb21pc2lmeSBmcm9tICcuLi8uLi91dGlscy9wcm9taXNpZnknO1xuaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSAndXRpbCc7XG5pbXBvcnQgeyBHZW5lcmFsRXJyb3IgfSBmcm9tICcuLi8uLi9lcnJvcnMvcnVudGltZSc7XG5cbmltcG9ydCBNRVNTQUdFIGZyb20gJy4uLy4uL2Vycm9ycy9ydW50aW1lL21lc3NhZ2UnO1xuXG5jb25zdCByZWFkRmlsZSA9IHByb21pc2lmeShmcy5yZWFkRmlsZSk7XG5cbmNvbnN0IE1FVEhPRFNfU1BFQ0lGWUlOR19OQU1FID0gWydvbmx5JywgJ3NraXAnXTtcbmNvbnN0IENPTVBVVEVEX05BTUVfVEVYVF9UTVAgID0gJzxjb21wdXRlZCBuYW1lPihsaW5lOiAlcyknO1xuXG5leHBvcnQgY2xhc3MgRml4dHVyZSB7XG4gICAgY29uc3RydWN0b3IgKG5hbWUsIHN0YXJ0LCBlbmQsIGxvYywgbWV0YSkge1xuICAgICAgICB0aGlzLm5hbWUgID0gbmFtZTtcbiAgICAgICAgdGhpcy5sb2MgICA9IGxvYztcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLmVuZCAgID0gZW5kO1xuICAgICAgICB0aGlzLm1ldGEgID0gbWV0YTtcbiAgICAgICAgdGhpcy50ZXN0cyA9IFtdO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRlc3Qge1xuICAgIGNvbnN0cnVjdG9yIChuYW1lLCBzdGFydCwgZW5kLCBsb2MsIG1ldGEpIHtcbiAgICAgICAgdGhpcy5uYW1lICA9IG5hbWU7XG4gICAgICAgIHRoaXMubG9jICAgPSBsb2M7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy5lbmQgICA9IGVuZDtcbiAgICAgICAgdGhpcy5tZXRhICA9IG1ldGE7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVzdEZpbGVQYXJzZXJCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAodG9rZW5UeXBlKSB7XG4gICAgICAgIHRoaXMudG9rZW5UeXBlID0gdG9rZW5UeXBlO1xuICAgIH1cblxuICAgIHN0YXRpYyBmb3JtYXRDb21wdXRlZE5hbWUgKGxpbmUpIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdChDT01QVVRFRF9OQU1FX1RFWFRfVE1QLCBsaW5lKTtcbiAgICB9XG5cbiAgICBpc0FzeW5jRm4gKC8qIHRva2VuICovKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG4gICAgfVxuXG4gICAgZ2V0UlZhbHVlICgvKiB0b2tlbiAqLykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICAgIH1cblxuICAgIGdldEZ1bmN0aW9uQm9keSAoLyogdG9rZW4gKi8pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICB9XG5cbiAgICBmb3JtYXRGbkRhdGEgKC8qIG5hbWUsIHZhbHVlLCB0b2tlbiAqLykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICAgIH1cblxuICAgIGFuYWx5emVNZW1iZXJFeHAgKC8qIHRva2VuICovKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG4gICAgfVxuXG4gICAgZm9ybWF0Rm5BcmcgKC8qIGFyZyAqLykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICAgIH1cblxuICAgIGdldEZuQ2FsbCAoLyogdG9rZW4gKi8pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICB9XG5cbiAgICBnZXRUYWdnZWRUZW1wbGF0ZUV4cCAoLyogdG9rZW4gKi8pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICB9XG5cbiAgICBhbmFseXplRm5DYWxsICgvKiB0b2tlbiAqLykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICAgIH1cblxuICAgIHBhcnNlICgvKiBmaWxlUGF0aCwgY29kZSAqLykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICAgIH1cblxuICAgIGdldFRva2VuVHlwZSAoLyogdG9rZW4gKi8pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICB9XG5cbiAgICBnZXRDYWxsZWVUb2tlbiAoLyogdG9rZW4gKi8pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICB9XG5cbiAgICBnZXRNZW1iZXJGbk5hbWUgKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZCcpO1xuICAgIH1cblxuICAgIGdldEtleVZhbHVlICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQnKTtcbiAgICB9XG5cbiAgICBnZXRTdHJpbmdWYWx1ZSAoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkJyk7XG4gICAgfVxuXG4gICAgaXNBcGlGbiAoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZuID09PSAnZml4dHVyZScgfHwgZm4gPT09ICd0ZXN0JztcbiAgICB9XG5cbiAgICBzZXJpYWxpemVPYmpFeHAgKHRva2VuKSB7XG4gICAgICAgIGlmICh0aGlzLmdldFRva2VuVHlwZSh0b2tlbikgIT09IHRoaXMudG9rZW5UeXBlLk9iamVjdExpdGVyYWxFeHByZXNzaW9uKVxuICAgICAgICAgICAgcmV0dXJuIHt9O1xuXG4gICAgICAgIHJldHVybiB0b2tlbi5wcm9wZXJ0aWVzLnJlZHVjZSgob2JqLCBwcm9wKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGtleSwgdmFsdWUgfSA9IHRoaXMuZ2V0S2V5VmFsdWUocHJvcCk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSByZXR1cm4ge307XG5cbiAgICAgICAgICAgIG9ialtrZXldID0gdmFsdWU7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH0sIHt9KTtcbiAgICB9XG5cbiAgICBwcm9jZXNzTWV0YUFyZ3MgKHRva2VuKSB7XG4gICAgICAgIGlmICh0aGlzLmdldFRva2VuVHlwZSh0b2tlbikgIT09IHRoaXMudG9rZW5UeXBlLkNhbGxFeHByZXNzaW9uKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgYXJncyA9IHRva2VuLmFyZ3VtZW50cztcblxuICAgICAgICBsZXQgbWV0YSA9IHt9O1xuXG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldFN0cmluZ1ZhbHVlKGFyZ3NbMV0pO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykgcmV0dXJuIHt9O1xuXG4gICAgICAgICAgICBtZXRhID0geyBbdGhpcy5mb3JtYXRGbkFyZyhhcmdzWzBdKV06IHZhbHVlIH07XG4gICAgICAgIH1cblxuICAgICAgICBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICAgIG1ldGEgPSB0aGlzLnNlcmlhbGl6ZU9iakV4cChhcmdzWzBdKTtcblxuICAgICAgICByZXR1cm4gbWV0YTtcbiAgICB9XG5cbiAgICBnZXRNZXRhSW5mbyAoY2FsbFN0YWNrKSB7XG4gICAgICAgIHJldHVybiBjYWxsU3RhY2sucmVkdWNlKChtZXRhQ2FsbHMsIGV4cCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0VG9rZW5UeXBlKGV4cCkgIT09IHRoaXMudG9rZW5UeXBlLkNhbGxFeHByZXNzaW9uKVxuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhQ2FsbHM7XG5cbiAgICAgICAgICAgIGNvbnN0IGNhbGxlZSAgICAgICAgICAgID0gdGhpcy5nZXRDYWxsZWVUb2tlbihleHApO1xuICAgICAgICAgICAgY29uc3QgY2FsbGVlVHlwZSAgICAgICAgPSB0aGlzLmdldFRva2VuVHlwZShjYWxsZWUpO1xuICAgICAgICAgICAgY29uc3QgaXNDYWxsZWVNZW1iZXJFeHAgPSBjYWxsZWVUeXBlID09PSB0aGlzLnRva2VuVHlwZS5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb247XG5cbiAgICAgICAgICAgIGlmIChpc0NhbGxlZU1lbWJlckV4cCAmJiB0aGlzLmdldE1lbWJlckZuTmFtZShleHApID09PSAnbWV0YScpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFt0aGlzLnByb2Nlc3NNZXRhQXJncyhleHApXS5jb25jYXQobWV0YUNhbGxzKTtcblxuICAgICAgICAgICAgcmV0dXJuIG1ldGFDYWxscztcbiAgICAgICAgfSwgW10pO1xuICAgIH1cblxuICAgIGNoZWNrRXhwRGVmaW5lVGFyZ2V0TmFtZSAodHlwZSwgYXBpRm4pIHtcbiAgICAgICAgLy9OT1RFOiBmaXh0dXJlKCdmaXh0dXJlTmFtZScpLmNoYWluRm4gb3IgdGVzdCgndGVzdE5hbWUnKS5jaGFpbkZuXG4gICAgICAgIGNvbnN0IGlzRGlyZWN0Q2FsbCA9IHR5cGUgPT09IHRoaXMudG9rZW5UeXBlLklkZW50aWZpZXI7XG5cbiAgICAgICAgLy9OT1RFOiBmaXh0dXJlLnNraXAoJ2ZpeHR1cmVOYW1lJyksIHRlc3Qub25seSgndGVzdE5hbWUnKSBldGMuXG4gICAgICAgIGNvbnN0IGlzTWVtYmVyQ2FsbCA9IHR5cGUgPT09IHRoaXMudG9rZW5UeXBlLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNRVRIT0RTX1NQRUNJRllJTkdfTkFNRS5pbmRleE9mKGFwaUZuKSA+IC0xO1xuXG4gICAgICAgIC8vTk9URTogZml4dHVyZS5iZWZvcmUoKS5hZnRlcigpKCdmaXh0dXJlTmFtZScpLCB0ZXN0LmJlZm9yZSgpYHRlc3ROYW1lYC5hZnRlcigpIGV0Yy5cbiAgICAgICAgY29uc3QgaXNUYWlsQ2FsbCA9IHR5cGUgPT09IHRoaXMudG9rZW5UeXBlLkNhbGxFeHByZXNzaW9uO1xuXG4gICAgICAgIHJldHVybiBpc0RpcmVjdENhbGwgfHwgaXNNZW1iZXJDYWxsIHx8IGlzVGFpbENhbGw7XG4gICAgfVxuXG4gICAgYW5hbHl6ZVRva2VuICh0b2tlbikge1xuICAgICAgICBjb25zdCB0b2tlblR5cGUgICAgID0gdGhpcy50b2tlblR5cGU7XG4gICAgICAgIGNvbnN0IGN1cnJUb2tlblR5cGUgPSB0aGlzLmdldFRva2VuVHlwZSh0b2tlbik7XG5cbiAgICAgICAgc3dpdGNoIChjdXJyVG9rZW5UeXBlKSB7XG4gICAgICAgICAgICBjYXNlIHRva2VuVHlwZS5FeHByZXNzaW9uU3RhdGVtZW50OlxuICAgICAgICAgICAgY2FzZSB0b2tlblR5cGUuVHlwZUFzc2VydGlvbkV4cHJlc3Npb246XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYW5hbHl6ZVRva2VuKHRva2VuLmV4cHJlc3Npb24pO1xuXG4gICAgICAgICAgICBjYXNlIHRva2VuVHlwZS5GdW5jdGlvbkRlY2xhcmF0aW9uOlxuICAgICAgICAgICAgY2FzZSB0b2tlblR5cGUuRnVuY3Rpb25FeHByZXNzaW9uOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQXN5bmNGbih0b2tlbikpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RnVuY3Rpb25Cb2R5KHRva2VuKS5tYXAodGhpcy5hbmFseXplVG9rZW4sIHRoaXMpO1xuXG4gICAgICAgICAgICBjYXNlIHRva2VuVHlwZS5WYXJpYWJsZURlY2xhcmF0aW9uOlxuICAgICAgICAgICAgY2FzZSB0b2tlblR5cGUuVmFyaWFibGVTdGF0ZW1lbnQ6IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YXJpYWJsZVZhbHVlID0gdGhpcy5nZXRSVmFsdWUodG9rZW4pOyAvLyBTa2lwIHZhcmlhYmxlIGRlY2xhcmF0aW9ucyBsaWtlIGB2YXIgZm9vO2BcblxuICAgICAgICAgICAgICAgIHJldHVybiB2YXJpYWJsZVZhbHVlID8gdGhpcy5hbmFseXplVG9rZW4odmFyaWFibGVWYWx1ZSkgOiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSB0b2tlblR5cGUuQ2FsbEV4cHJlc3Npb246XG4gICAgICAgICAgICBjYXNlIHRva2VuVHlwZS5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb246XG4gICAgICAgICAgICBjYXNlIHRva2VuVHlwZS5UYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb246XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYW5hbHl6ZUZuQ2FsbCh0b2tlbik7XG5cbiAgICAgICAgICAgIGNhc2UgdG9rZW5UeXBlLlJldHVyblN0YXRlbWVudDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW4uYXJndW1lbnQgPyB0aGlzLmFuYWx5emVUb2tlbih0b2tlbi5hcmd1bWVudCkgOiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29sbGVjdFRlc3RDYWZlQ2FsbHMgKGFzdEJvZHkpIHtcbiAgICAgICAgbGV0IGNhbGxzID0gW107XG5cbiAgICAgICAgYXN0Qm9keS5mb3JFYWNoKHRva2VuID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxFeHBzID0gdGhpcy5hbmFseXplVG9rZW4odG9rZW4pO1xuXG4gICAgICAgICAgICBpZiAoY2FsbEV4cHMpXG4gICAgICAgICAgICAgICAgY2FsbHMgPSBjYWxscy5jb25jYXQoY2FsbEV4cHMpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY2FsbHM7XG4gICAgfVxuXG4gICAgYW5hbHl6ZSAoYXN0Qm9keSkge1xuICAgICAgICBjb25zdCBmaXh0dXJlcyAgICAgICAgID0gW107XG4gICAgICAgIGNvbnN0IHRlc3RDYWZlQVBJQ2FsbHMgPSB0aGlzLmNvbGxlY3RUZXN0Q2FmZUNhbGxzKGFzdEJvZHkpO1xuXG4gICAgICAgIHRlc3RDYWZlQVBJQ2FsbHMuZm9yRWFjaChjYWxsID0+IHtcbiAgICAgICAgICAgIGlmICghY2FsbCB8fCB0eXBlb2YgY2FsbC52YWx1ZSAhPT0gJ3N0cmluZycpIHJldHVybjtcblxuICAgICAgICAgICAgaWYgKGNhbGwuZm5OYW1lID09PSAnZml4dHVyZScpIHtcbiAgICAgICAgICAgICAgICBmaXh0dXJlcy5wdXNoKG5ldyBGaXh0dXJlKGNhbGwudmFsdWUsIGNhbGwuc3RhcnQsIGNhbGwuZW5kLCBjYWxsLmxvYywgY2FsbC5tZXRhKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWZpeHR1cmVzLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCB0ZXN0ID0gbmV3IFRlc3QoY2FsbC52YWx1ZSwgY2FsbC5zdGFydCwgY2FsbC5lbmQsIGNhbGwubG9jLCBjYWxsLm1ldGEpO1xuXG4gICAgICAgICAgICBmaXh0dXJlc1tmaXh0dXJlcy5sZW5ndGggLSAxXS50ZXN0cy5wdXNoKHRlc3QpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZml4dHVyZXM7XG4gICAgfVxuXG4gICAgYXN5bmMgcmVhZEZpbGUgKGZpbGVQYXRoKSB7XG4gICAgICAgIGxldCBmaWxlQ29udGVudCA9ICcnO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaWxlQ29udGVudCA9IGF3YWl0IHJlYWRGaWxlKGZpbGVQYXRoLCAndXRmOCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEdlbmVyYWxFcnJvcihNRVNTQUdFLmNhbnRGaW5kU3BlY2lmaWVkVGVzdFNvdXJjZSwgZmlsZVBhdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVDb250ZW50O1xuICAgIH1cblxuICAgIGFzeW5jIGdldFRlc3RMaXN0IChmaWxlUGF0aCkge1xuICAgICAgICBjb25zdCBmaWxlQ29udGVudCA9IGF3YWl0IHRoaXMucmVhZEZpbGUoZmlsZVBhdGgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlKGZpbGVDb250ZW50KTtcbiAgICB9XG5cbiAgICBnZXRUZXN0TGlzdEZyb21Db2RlIChjb2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlKGNvZGUpO1xuICAgIH1cbn1cbiJdfQ==
