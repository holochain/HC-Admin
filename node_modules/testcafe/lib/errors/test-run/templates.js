'use strict';

exports.__esModule = true;

var _dedent = require('dedent');

var _dedent2 = _interopRequireDefault(_dedent);

var _lodash = require('lodash');

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _renderForbiddenCharsList = require('../render-forbidden-chars-list');

var _renderForbiddenCharsList2 = _interopRequireDefault(_renderForbiddenCharsList);

var _string = require('../../utils/string');

var _phase = require('../../test-run/phase');

var _phase2 = _interopRequireDefault(_phase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SUBTITLES = {
    [_phase2.default.initial]: '',
    [_phase2.default.inFixtureBeforeHook]: '<span class="subtitle">Error in fixture.before hook</span>\n',
    [_phase2.default.inFixtureBeforeEachHook]: '<span class="subtitle">Error in fixture.beforeEach hook</span>\n',
    [_phase2.default.inTestBeforeHook]: '<span class="subtitle">Error in test.before hook</span>\n',
    [_phase2.default.inTest]: '',
    [_phase2.default.inTestAfterHook]: '<span class="subtitle">Error in test.after hook</span>\n',
    [_phase2.default.inFixtureAfterEachHook]: '<span class="subtitle">Error in fixture.afterEach hook</span>\n',
    [_phase2.default.inFixtureAfterHook]: '<span class="subtitle">Error in fixture.after hook</span>\n',
    [_phase2.default.inRoleInitializer]: '<span class="subtitle">Error in Role initializer</span>\n',
    [_phase2.default.inBookmarkRestore]: '<span class="subtitle">Error while restoring configuration after Role switch</span>\n'
};

function formatSelectorCallstack(apiFnChain, apiFnIndex, viewportWidth) {
    if (typeof apiFnIndex === 'undefined') return '';

    const emptySpaces = 10;
    const ellipsis = '...)';
    const availableWidth = viewportWidth - emptySpaces;

    return apiFnChain.map((apiFn, index) => {
        let formattedApiFn = String.fromCharCode(160);

        formattedApiFn += index === apiFnIndex ? '>' : ' ';
        formattedApiFn += ' | ';
        formattedApiFn += index !== 0 ? '  ' : '';
        formattedApiFn += apiFn;

        if (formattedApiFn.length > availableWidth) return formattedApiFn.substr(0, availableWidth - emptySpaces) + ellipsis;

        return formattedApiFn;
    }).join('\n');
}

function markup(err, msgMarkup, opts = {}) {
    msgMarkup = (0, _dedent2.default)(`
        ${SUBTITLES[err.testRunPhase]}<div class="message">${(0, _dedent2.default)(msgMarkup)}</div>

        <strong>Browser:</strong> <span class="user-agent">${err.userAgent}</span>
    `);

    if (err.screenshotPath) msgMarkup += `\n<div class="screenshot-info"><strong>Screenshot:</strong> <a class="screenshot-path">${(0, _lodash.escape)(err.screenshotPath)}</a></div>`;

    if (!opts.withoutCallsite) {
        const callsiteMarkup = err.getCallsiteMarkup();

        if (callsiteMarkup) msgMarkup += `\n\n${callsiteMarkup}`;
    }

    return msgMarkup.replace('\t', '&nbsp;'.repeat(4));
}

exports.default = {
    [_type2.default.actionIntegerOptionError]: err => markup(err, `
        The "${err.optionName}" option is expected to be an integer, but it was ${err.actualValue}.
    `),

    [_type2.default.actionPositiveIntegerOptionError]: err => markup(err, `
        The "${err.optionName}" option is expected to be a positive integer, but it was ${err.actualValue}.
    `),

    [_type2.default.actionBooleanOptionError]: err => markup(err, `
        The "${err.optionName}" option is expected to be a boolean value, but it was ${err.actualValue}.
    `),

    [_type2.default.actionSpeedOptionError]: err => markup(err, `
        The "${err.optionName}" option is expected to be a number between 0.01 and 1, but it was ${err.actualValue}.
    `),

    [_type2.default.pageLoadError]: err => markup(err, `
        ${err.errMsg}
    `),

    [_type2.default.uncaughtErrorOnPage]: err => markup(err, `
        Error on page <a href="${err.pageDestUrl}">${err.pageDestUrl}</a>:

        ${(0, _string.replaceLeadingSpacesWithNbsp)((0, _lodash.escape)(err.errStack))}
    `),

    [_type2.default.uncaughtErrorInTestCode]: err => markup(err, `
        ${(0, _lodash.escape)(err.errMsg)}
    `),

    [_type2.default.nativeDialogNotHandledError]: err => markup(err, `
        A native ${err.dialogType} dialog was invoked on page <a href="${err.pageUrl}">${err.pageUrl}</a>, but no handler was set for it. Use the "setNativeDialogHandler" function to introduce a handler function for native dialogs.
    `),

    [_type2.default.uncaughtErrorInNativeDialogHandler]: err => markup(err, `
        An error occurred in the native dialog handler called for a native ${err.dialogType} dialog on page <a href="${err.pageUrl}">${err.pageUrl}</a>:

        ${(0, _lodash.escape)(err.errMsg)}
    `),

    [_type2.default.setTestSpeedArgumentError]: err => markup(err, `
        Speed is expected to be a number between 0.01 and 1, but ${err.actualValue} was passed.
    `),

    [_type2.default.setNativeDialogHandlerCodeWrongTypeError]: err => markup(err, `
        The native dialog handler is expected to be a function, ClientFunction or null, but it was ${err.actualType}.
    `),

    [_type2.default.uncaughtErrorInClientFunctionCode]: err => markup(err, `
        An error occurred in ${err.instantiationCallsiteName} code:

        ${(0, _lodash.escape)(err.errMsg)}
    `),

    [_type2.default.uncaughtErrorInCustomDOMPropertyCode]: err => markup(err, `
        An error occurred when trying to calculate a custom Selector property "${err.property}":

        ${(0, _lodash.escape)(err.errMsg)}
    `),

    [_type2.default.clientFunctionExecutionInterruptionError]: err => markup(err, `
        ${err.instantiationCallsiteName} execution was interrupted by page unload. This problem may appear if you trigger page navigation from ${err.instantiationCallsiteName} code.
    `),

    [_type2.default.uncaughtNonErrorObjectInTestCode]: err => markup(err, `
        Uncaught ${err.objType} "${(0, _lodash.escape)(err.objStr)}" was thrown. Throw Error instead.
    `, { withoutCallsite: true }),

    [_type2.default.unhandledPromiseRejection]: err => markup(err, `
        Unhandled promise rejection:
        
        ${(0, _lodash.escape)(err.errMsg)}
    `, { withoutCallsite: true }),

    [_type2.default.uncaughtException]: err => markup(err, `
        Uncaught exception:
        
        ${(0, _lodash.escape)(err.errMsg)}
    `, { withoutCallsite: true }),

    [_type2.default.actionOptionsTypeError]: err => markup(err, `
        Action options is expected to be an object, null or undefined but it was ${err.actualType}.
    `),

    [_type2.default.actionStringArgumentError]: err => markup(err, `
        The "${err.argumentName}" argument is expected to be a non-empty string, but it was ${err.actualValue}.
    `),

    [_type2.default.actionBooleanArgumentError]: err => markup(err, `
        The "${err.argumentName}" argument is expected to be a boolean value, but it was ${err.actualValue}.
    `),

    [_type2.default.actionNullableStringArgumentError]: err => markup(err, `
        The "${err.argumentName}" argument is expected to be a null or a string, but it was ${err.actualValue}.
    `),

    [_type2.default.actionStringOrStringArrayArgumentError]: err => markup(err, `
        The "${err.argumentName}" argument is expected to be a non-empty string or a string array, but it was ${err.actualValue}.
    `),

    [_type2.default.actionStringArrayElementError]: err => markup(err, `
        Elements of the "${err.argumentName}" argument are expected to be non-empty strings, but the element at index ${err.elementIndex} was ${err.actualValue}.
    `),

    [_type2.default.actionIntegerArgumentError]: err => markup(err, `
        The "${err.argumentName}" argument is expected to be an integer, but it was ${err.actualValue}.
    `),

    [_type2.default.actionRoleArgumentError]: err => markup(err, `
        The "${err.argumentName}" argument is expected to be a Role instance, but it was ${err.actualValue}.
    `),

    [_type2.default.actionPositiveIntegerArgumentError]: err => markup(err, `
        The "${err.argumentName}" argument is expected to be a positive integer, but it was ${err.actualValue}.
    `),

    [_type2.default.actionElementNotFoundError]: (err, viewportWidth) => markup(err, `
        The specified selector does not match any element in the DOM tree.
        
        ${formatSelectorCallstack(err.apiFnChain, err.apiFnIndex, viewportWidth)}
    `),

    [_type2.default.actionElementIsInvisibleError]: err => markup(err, `
        The element that matches the specified selector is not visible.
    `),

    [_type2.default.actionSelectorMatchesWrongNodeTypeError]: err => markup(err, `
        The specified selector is expected to match a DOM element, but it matches a ${err.nodeDescription} node.
    `),

    [_type2.default.actionAdditionalElementNotFoundError]: (err, viewportWidth) => markup(err, `
        The specified "${err.argumentName}" does not match any element in the DOM tree.
        
        ${formatSelectorCallstack(err.apiFnChain, err.apiFnIndex, viewportWidth)}
    `),

    [_type2.default.actionAdditionalElementIsInvisibleError]: err => markup(err, `
        The element that matches the specified "${err.argumentName}" is not visible.
    `),

    [_type2.default.actionAdditionalSelectorMatchesWrongNodeTypeError]: err => markup(err, `
        The specified "${err.argumentName}" is expected to match a DOM element, but it matches a ${err.nodeDescription} node.
    `),

    [_type2.default.actionElementNonEditableError]: err => markup(err, `
        The action element is expected to be editable (an input, textarea or element with the contentEditable attribute).
    `),

    [_type2.default.actionElementNonContentEditableError]: err => markup(err, `
        The element that matches the specified "${err.argumentName}" is expected to have the contentEditable attribute enabled or the entire document should be in design mode.
    `),

    [_type2.default.actionRootContainerNotFoundError]: err => markup(err, `
        Content between the action elements cannot be selected because the root container for the selection range cannot be found, i.e. these elements do not have a common ancestor with the contentEditable attribute.
    `),

    [_type2.default.actionElementIsNotFileInputError]: err => markup(err, `
        The specified selector does not match a file input element.
    `),

    [_type2.default.actionCanNotFindFileToUploadError]: err => markup(err, `
        Cannot find the following file(s) to upload:
        ${err.filePaths.map(path => `  ${(0, _lodash.escape)(path)}`).join('\n')}
    `),

    [_type2.default.actionElementNotTextAreaError]: err => markup(err, `
        The action element is expected to be a &lt;textarea&gt;.
    `),

    [_type2.default.actionElementNotIframeError]: err => markup(err, `
        The action element is expected to be an &lt;iframe&gt.
    `),

    [_type2.default.actionIncorrectKeysError]: err => markup(err, `
        The "${err.argumentName}" argument contains an incorrect key or key combination.
    `),

    [_type2.default.actionUnsupportedDeviceTypeError]: err => markup(err, `
        The "${err.argumentName}" argument specifies an unsupported "${err.actualValue}" device. For a list of supported devices, refer to <a href="http://viewportsizes.com">http://viewportsizes.com</a>.
    `),

    [_type2.default.actionInvalidScrollTargetError]: err => markup(err, `
        Unable to scroll to the specified point because a point with the specified ${err.properties} is not located inside the element's cropping region.
    `),

    [_type2.default.actionIframeIsNotLoadedError]: err => markup(err, `
        Content of the iframe to which you are switching did not load.
    `),

    [_type2.default.currentIframeIsNotLoadedError]: err => markup(err, `
        Content of the iframe in which the test is currently operating did not load.
    `),

    [_type2.default.currentIframeNotFoundError]: err => markup(err, `
        The iframe in which the test is currently operating does not exist anymore.
    `),

    [_type2.default.currentIframeIsInvisibleError]: err => markup(err, `
        The iframe in which the test is currently operating is not visible anymore.
    `),

    [_type2.default.missingAwaitError]: err => markup(err, `
        A call to an async function is not awaited. Use the "await" keyword before actions, assertions or chains of them to ensure that they run in the right sequence.
    `),

    [_type2.default.externalAssertionLibraryError]: err => markup(err, `
        ${(0, _lodash.escape)(err.errMsg)}
    `),

    [_type2.default.domNodeClientFunctionResultError]: err => markup(err, `
       ${err.instantiationCallsiteName} cannot return DOM elements. Use Selector functions for this purpose.
    `),

    [_type2.default.invalidSelectorResultError]: err => markup(err, `
        Function that specifies a selector can only return a DOM node, an array of nodes, NodeList, HTMLCollection, null or undefined. Use ClientFunction to return other values.
    `),

    [_type2.default.actionSelectorError]: err => markup(err, `
        Action "${err.selectorName}" argument error:

        ${(0, _lodash.escape)(err.errMsg)}
    `),

    [_type2.default.cantObtainInfoForElementSpecifiedBySelectorError]: (err, viewportWidth) => markup(err, `
        Cannot obtain information about the node because the specified selector does not match any node in the DOM tree.
        
        ${formatSelectorCallstack(err.apiFnChain, err.apiFnIndex, viewportWidth)}
    `),

    [_type2.default.windowDimensionsOverflowError]: err => markup(err, `
        Unable to resize the window because the specified size exceeds the screen size. On macOS, a window cannot be larger than the screen.
    `),

    [_type2.default.forbiddenCharactersInScreenshotPathError]: err => markup(err, `
        There are forbidden characters in the "${err.screenshotPath}" screenshot path:
        ${(0, _renderForbiddenCharsList2.default)(err.forbiddenCharsList)}
    `),

    [_type2.default.invalidElementScreenshotDimensionsError]: err => markup(err, `
         Unable to capture an element image because the resulting image ${err.dimensions} ${err.verb} zero or negative.
    `),

    [_type2.default.roleSwitchInRoleInitializerError]: err => markup(err, `
        Role cannot be switched while another role is being initialized.
    `),

    [_type2.default.assertionExecutableArgumentError]: err => markup(err, `
        Cannot evaluate the "${err.actualValue}" expression in the "${err.argumentName}" parameter because of the following error:

        ${err.errMsg}
    `),

    [_type2.default.assertionWithoutMethodCallError]: err => markup(err, `
        An assertion method is not specified.
    `),

    [_type2.default.assertionUnawaitedPromiseError]: err => markup(err, `
        Attempted to run assertions on a Promise object. Did you forget to await it? If not, pass "{ allowUnawaitedPromise: true }" to the assertion options.
    `)
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lcnJvcnMvdGVzdC1ydW4vdGVtcGxhdGVzLmpzIl0sIm5hbWVzIjpbIlNVQlRJVExFUyIsIlRFU1RfUlVOX1BIQVNFIiwiaW5pdGlhbCIsImluRml4dHVyZUJlZm9yZUhvb2siLCJpbkZpeHR1cmVCZWZvcmVFYWNoSG9vayIsImluVGVzdEJlZm9yZUhvb2siLCJpblRlc3QiLCJpblRlc3RBZnRlckhvb2siLCJpbkZpeHR1cmVBZnRlckVhY2hIb29rIiwiaW5GaXh0dXJlQWZ0ZXJIb29rIiwiaW5Sb2xlSW5pdGlhbGl6ZXIiLCJpbkJvb2ttYXJrUmVzdG9yZSIsImZvcm1hdFNlbGVjdG9yQ2FsbHN0YWNrIiwiYXBpRm5DaGFpbiIsImFwaUZuSW5kZXgiLCJ2aWV3cG9ydFdpZHRoIiwiZW1wdHlTcGFjZXMiLCJlbGxpcHNpcyIsImF2YWlsYWJsZVdpZHRoIiwibWFwIiwiYXBpRm4iLCJpbmRleCIsImZvcm1hdHRlZEFwaUZuIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwibGVuZ3RoIiwic3Vic3RyIiwiam9pbiIsIm1hcmt1cCIsImVyciIsIm1zZ01hcmt1cCIsIm9wdHMiLCJ0ZXN0UnVuUGhhc2UiLCJ1c2VyQWdlbnQiLCJzY3JlZW5zaG90UGF0aCIsIndpdGhvdXRDYWxsc2l0ZSIsImNhbGxzaXRlTWFya3VwIiwiZ2V0Q2FsbHNpdGVNYXJrdXAiLCJyZXBsYWNlIiwicmVwZWF0IiwiVFlQRSIsImFjdGlvbkludGVnZXJPcHRpb25FcnJvciIsIm9wdGlvbk5hbWUiLCJhY3R1YWxWYWx1ZSIsImFjdGlvblBvc2l0aXZlSW50ZWdlck9wdGlvbkVycm9yIiwiYWN0aW9uQm9vbGVhbk9wdGlvbkVycm9yIiwiYWN0aW9uU3BlZWRPcHRpb25FcnJvciIsInBhZ2VMb2FkRXJyb3IiLCJlcnJNc2ciLCJ1bmNhdWdodEVycm9yT25QYWdlIiwicGFnZURlc3RVcmwiLCJlcnJTdGFjayIsInVuY2F1Z2h0RXJyb3JJblRlc3RDb2RlIiwibmF0aXZlRGlhbG9nTm90SGFuZGxlZEVycm9yIiwiZGlhbG9nVHlwZSIsInBhZ2VVcmwiLCJ1bmNhdWdodEVycm9ySW5OYXRpdmVEaWFsb2dIYW5kbGVyIiwic2V0VGVzdFNwZWVkQXJndW1lbnRFcnJvciIsInNldE5hdGl2ZURpYWxvZ0hhbmRsZXJDb2RlV3JvbmdUeXBlRXJyb3IiLCJhY3R1YWxUeXBlIiwidW5jYXVnaHRFcnJvckluQ2xpZW50RnVuY3Rpb25Db2RlIiwiaW5zdGFudGlhdGlvbkNhbGxzaXRlTmFtZSIsInVuY2F1Z2h0RXJyb3JJbkN1c3RvbURPTVByb3BlcnR5Q29kZSIsInByb3BlcnR5IiwiY2xpZW50RnVuY3Rpb25FeGVjdXRpb25JbnRlcnJ1cHRpb25FcnJvciIsInVuY2F1Z2h0Tm9uRXJyb3JPYmplY3RJblRlc3RDb2RlIiwib2JqVHlwZSIsIm9ialN0ciIsInVuaGFuZGxlZFByb21pc2VSZWplY3Rpb24iLCJ1bmNhdWdodEV4Y2VwdGlvbiIsImFjdGlvbk9wdGlvbnNUeXBlRXJyb3IiLCJhY3Rpb25TdHJpbmdBcmd1bWVudEVycm9yIiwiYXJndW1lbnROYW1lIiwiYWN0aW9uQm9vbGVhbkFyZ3VtZW50RXJyb3IiLCJhY3Rpb25OdWxsYWJsZVN0cmluZ0FyZ3VtZW50RXJyb3IiLCJhY3Rpb25TdHJpbmdPclN0cmluZ0FycmF5QXJndW1lbnRFcnJvciIsImFjdGlvblN0cmluZ0FycmF5RWxlbWVudEVycm9yIiwiZWxlbWVudEluZGV4IiwiYWN0aW9uSW50ZWdlckFyZ3VtZW50RXJyb3IiLCJhY3Rpb25Sb2xlQXJndW1lbnRFcnJvciIsImFjdGlvblBvc2l0aXZlSW50ZWdlckFyZ3VtZW50RXJyb3IiLCJhY3Rpb25FbGVtZW50Tm90Rm91bmRFcnJvciIsImFjdGlvbkVsZW1lbnRJc0ludmlzaWJsZUVycm9yIiwiYWN0aW9uU2VsZWN0b3JNYXRjaGVzV3JvbmdOb2RlVHlwZUVycm9yIiwibm9kZURlc2NyaXB0aW9uIiwiYWN0aW9uQWRkaXRpb25hbEVsZW1lbnROb3RGb3VuZEVycm9yIiwiYWN0aW9uQWRkaXRpb25hbEVsZW1lbnRJc0ludmlzaWJsZUVycm9yIiwiYWN0aW9uQWRkaXRpb25hbFNlbGVjdG9yTWF0Y2hlc1dyb25nTm9kZVR5cGVFcnJvciIsImFjdGlvbkVsZW1lbnROb25FZGl0YWJsZUVycm9yIiwiYWN0aW9uRWxlbWVudE5vbkNvbnRlbnRFZGl0YWJsZUVycm9yIiwiYWN0aW9uUm9vdENvbnRhaW5lck5vdEZvdW5kRXJyb3IiLCJhY3Rpb25FbGVtZW50SXNOb3RGaWxlSW5wdXRFcnJvciIsImFjdGlvbkNhbk5vdEZpbmRGaWxlVG9VcGxvYWRFcnJvciIsImZpbGVQYXRocyIsInBhdGgiLCJhY3Rpb25FbGVtZW50Tm90VGV4dEFyZWFFcnJvciIsImFjdGlvbkVsZW1lbnROb3RJZnJhbWVFcnJvciIsImFjdGlvbkluY29ycmVjdEtleXNFcnJvciIsImFjdGlvblVuc3VwcG9ydGVkRGV2aWNlVHlwZUVycm9yIiwiYWN0aW9uSW52YWxpZFNjcm9sbFRhcmdldEVycm9yIiwicHJvcGVydGllcyIsImFjdGlvbklmcmFtZUlzTm90TG9hZGVkRXJyb3IiLCJjdXJyZW50SWZyYW1lSXNOb3RMb2FkZWRFcnJvciIsImN1cnJlbnRJZnJhbWVOb3RGb3VuZEVycm9yIiwiY3VycmVudElmcmFtZUlzSW52aXNpYmxlRXJyb3IiLCJtaXNzaW5nQXdhaXRFcnJvciIsImV4dGVybmFsQXNzZXJ0aW9uTGlicmFyeUVycm9yIiwiZG9tTm9kZUNsaWVudEZ1bmN0aW9uUmVzdWx0RXJyb3IiLCJpbnZhbGlkU2VsZWN0b3JSZXN1bHRFcnJvciIsImFjdGlvblNlbGVjdG9yRXJyb3IiLCJzZWxlY3Rvck5hbWUiLCJjYW50T2J0YWluSW5mb0ZvckVsZW1lbnRTcGVjaWZpZWRCeVNlbGVjdG9yRXJyb3IiLCJ3aW5kb3dEaW1lbnNpb25zT3ZlcmZsb3dFcnJvciIsImZvcmJpZGRlbkNoYXJhY3RlcnNJblNjcmVlbnNob3RQYXRoRXJyb3IiLCJmb3JiaWRkZW5DaGFyc0xpc3QiLCJpbnZhbGlkRWxlbWVudFNjcmVlbnNob3REaW1lbnNpb25zRXJyb3IiLCJkaW1lbnNpb25zIiwidmVyYiIsInJvbGVTd2l0Y2hJblJvbGVJbml0aWFsaXplckVycm9yIiwiYXNzZXJ0aW9uRXhlY3V0YWJsZUFyZ3VtZW50RXJyb3IiLCJhc3NlcnRpb25XaXRob3V0TWV0aG9kQ2FsbEVycm9yIiwiYXNzZXJ0aW9uVW5hd2FpdGVkUHJvbWlzZUVycm9yIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLFlBQVk7QUFDZCxLQUFDQyxnQkFBZUMsT0FBaEIsR0FBMEMsRUFENUI7QUFFZCxLQUFDRCxnQkFBZUUsbUJBQWhCLEdBQTBDLDhEQUY1QjtBQUdkLEtBQUNGLGdCQUFlRyx1QkFBaEIsR0FBMEMsa0VBSDVCO0FBSWQsS0FBQ0gsZ0JBQWVJLGdCQUFoQixHQUEwQywyREFKNUI7QUFLZCxLQUFDSixnQkFBZUssTUFBaEIsR0FBMEMsRUFMNUI7QUFNZCxLQUFDTCxnQkFBZU0sZUFBaEIsR0FBMEMsMERBTjVCO0FBT2QsS0FBQ04sZ0JBQWVPLHNCQUFoQixHQUEwQyxpRUFQNUI7QUFRZCxLQUFDUCxnQkFBZVEsa0JBQWhCLEdBQTBDLDZEQVI1QjtBQVNkLEtBQUNSLGdCQUFlUyxpQkFBaEIsR0FBMEMsMkRBVDVCO0FBVWQsS0FBQ1QsZ0JBQWVVLGlCQUFoQixHQUEwQztBQVY1QixDQUFsQjs7QUFhQSxTQUFTQyx1QkFBVCxDQUFrQ0MsVUFBbEMsRUFBOENDLFVBQTlDLEVBQTBEQyxhQUExRCxFQUF5RTtBQUNyRSxRQUFJLE9BQU9ELFVBQVAsS0FBc0IsV0FBMUIsRUFDSSxPQUFPLEVBQVA7O0FBRUosVUFBTUUsY0FBaUIsRUFBdkI7QUFDQSxVQUFNQyxXQUFpQixNQUF2QjtBQUNBLFVBQU1DLGlCQUFpQkgsZ0JBQWdCQyxXQUF2Qzs7QUFFQSxXQUFPSCxXQUFXTSxHQUFYLENBQWUsQ0FBQ0MsS0FBRCxFQUFRQyxLQUFSLEtBQWtCO0FBQ3BDLFlBQUlD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QTBPWCxLQUFDVyxlQUFLeUUsd0NBQU4sR0FBaURwRixPQUFPRCxPQUFPQyxHQUFQLEVBQWE7aURBQ3hCQSxJQUFJSyxjQUFlO1VBQzFELHdDQUF5QkwsSUFBSXFGLGtCQUE3QixDQUFpRDtLQUZDLENBMU83Qzs7QUErT1gsS0FBQzFFLGVBQUsyRSx1Q0FBTixHQUFnRHRGLE9BQU9ELE9BQU9DLEdBQVAsRUFBYTswRUFDRUEsSUFBSXVGLFVBQVcsSUFBR3ZGLElBQUl3RixJQUFLO0tBRDFDLENBL081Qzs7QUFtUFgsS0FBQzdFLGVBQUs4RSxnQ0FBTixHQUF5Q3pGLE9BQU9ELE9BQU9DLEdBQVAsRUFBYTs7S0FBYixDQW5QckM7O0FBdVBYLEtBQUNXLGVBQUsrRSxnQ0FBTixHQUF5QzFGLE9BQU9ELE9BQU9DLEdBQVAsRUFBYTsrQkFDbENBLElBQUljLFdBQVksd0JBQXVCZCxJQUFJMkMsWUFBYTs7VUFFN0UzQyxJQUFJbUIsTUFBTztLQUgrQixDQXZQckM7O0FBNlBYLEtBQUNSLGVBQUtnRiwrQkFBTixHQUF3QzNGLE9BQU9ELE9BQU9DLEdBQVAsRUFBYTs7S0FBYixDQTdQcEM7O0FBaVFYLEtBQUNXLGVBQUtpRiw4QkFBTixHQUF1QzVGLE9BQU9ELE9BQU9DLEdBQVAsRUFBYTs7S0FBYjtBQWpRbkMsQyIsImZpbGUiOiJlcnJvcnMvdGVzdC1ydW4vdGVtcGxhdGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlZGVudCBmcm9tICdkZWRlbnQnO1xuaW1wb3J0IHsgZXNjYXBlIGFzIGVzY2FwZUh0bWwgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFRZUEUgZnJvbSAnLi90eXBlJztcbmltcG9ydCByZW5kZXJGb3JiaWRkZW5DaGFyc0xpc3QgZnJvbSAnLi4vcmVuZGVyLWZvcmJpZGRlbi1jaGFycy1saXN0JztcbmltcG9ydCB7IHJlcGxhY2VMZWFkaW5nU3BhY2VzV2l0aE5ic3AgfSBmcm9tICcuLi8uLi91dGlscy9zdHJpbmcnO1xuaW1wb3J0IFRFU1RfUlVOX1BIQVNFIGZyb20gJy4uLy4uL3Rlc3QtcnVuL3BoYXNlJztcblxuY29uc3QgU1VCVElUTEVTID0ge1xuICAgIFtURVNUX1JVTl9QSEFTRS5pbml0aWFsXTogICAgICAgICAgICAgICAgICcnLFxuICAgIFtURVNUX1JVTl9QSEFTRS5pbkZpeHR1cmVCZWZvcmVIb29rXTogICAgICc8c3BhbiBjbGFzcz1cInN1YnRpdGxlXCI+RXJyb3IgaW4gZml4dHVyZS5iZWZvcmUgaG9vazwvc3Bhbj5cXG4nLFxuICAgIFtURVNUX1JVTl9QSEFTRS5pbkZpeHR1cmVCZWZvcmVFYWNoSG9va106ICc8c3BhbiBjbGFzcz1cInN1YnRpdGxlXCI+RXJyb3IgaW4gZml4dHVyZS5iZWZvcmVFYWNoIGhvb2s8L3NwYW4+XFxuJyxcbiAgICBbVEVTVF9SVU5fUEhBU0UuaW5UZXN0QmVmb3JlSG9va106ICAgICAgICAnPHNwYW4gY2xhc3M9XCJzdWJ0aXRsZVwiPkVycm9yIGluIHRlc3QuYmVmb3JlIGhvb2s8L3NwYW4+XFxuJyxcbiAgICBbVEVTVF9SVU5fUEhBU0UuaW5UZXN0XTogICAgICAgICAgICAgICAgICAnJyxcbiAgICBbVEVTVF9SVU5fUEhBU0UuaW5UZXN0QWZ0ZXJIb29rXTogICAgICAgICAnPHNwYW4gY2xhc3M9XCJzdWJ0aXRsZVwiPkVycm9yIGluIHRlc3QuYWZ0ZXIgaG9vazwvc3Bhbj5cXG4nLFxuICAgIFtURVNUX1JVTl9QSEFTRS5pbkZpeHR1cmVBZnRlckVhY2hIb29rXTogICc8c3BhbiBjbGFzcz1cInN1YnRpdGxlXCI+RXJyb3IgaW4gZml4dHVyZS5hZnRlckVhY2ggaG9vazwvc3Bhbj5cXG4nLFxuICAgIFtURVNUX1JVTl9QSEFTRS5pbkZpeHR1cmVBZnRlckhvb2tdOiAgICAgICc8c3BhbiBjbGFzcz1cInN1YnRpdGxlXCI+RXJyb3IgaW4gZml4dHVyZS5hZnRlciBob29rPC9zcGFuPlxcbicsXG4gICAgW1RFU1RfUlVOX1BIQVNFLmluUm9sZUluaXRpYWxpemVyXTogICAgICAgJzxzcGFuIGNsYXNzPVwic3VidGl0bGVcIj5FcnJvciBpbiBSb2xlIGluaXRpYWxpemVyPC9zcGFuPlxcbicsXG4gICAgW1RFU1RfUlVOX1BIQVNFLmluQm9va21hcmtSZXN0b3JlXTogICAgICAgJzxzcGFuIGNsYXNzPVwic3VidGl0bGVcIj5FcnJvciB3aGlsZSByZXN0b3JpbmcgY29uZmlndXJhdGlvbiBhZnRlciBSb2xlIHN3aXRjaDwvc3Bhbj5cXG4nXG59O1xuXG5mdW5jdGlvbiBmb3JtYXRTZWxlY3RvckNhbGxzdGFjayAoYXBpRm5DaGFpbiwgYXBpRm5JbmRleCwgdmlld3BvcnRXaWR0aCkge1xuICAgIGlmICh0eXBlb2YgYXBpRm5JbmRleCA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHJldHVybiAnJztcblxuICAgIGNvbnN0IGVtcHR5U3BhY2VzICAgID0gMTA7XG4gICAgY29uc3QgZWxsaXBzaXMgICAgICAgPSAnLi4uKSc7XG4gICAgY29uc3QgYXZhaWxhYmxlV2lkdGggPSB2aWV3cG9ydFdpZHRoIC0gZW1wdHlTcGFjZXM7XG5cbiAgICByZXR1cm4gYXBpRm5DaGFpbi5tYXAoKGFwaUZuLCBpbmRleCkgPT4ge1xuICAgICAgICBsZXQgZm9ybWF0dGVkQXBpRm4gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDE2MCk7XG5cbiAgICAgICAgZm9ybWF0dGVkQXBpRm4gKz0gaW5kZXggPT09IGFwaUZuSW5kZXggPyAnPicgOiAnICc7XG4gICAgICAgIGZvcm1hdHRlZEFwaUZuICs9ICcgfCAnO1xuICAgICAgICBmb3JtYXR0ZWRBcGlGbiArPSBpbmRleCAhPT0gMCA/ICcgICcgOiAnJztcbiAgICAgICAgZm9ybWF0dGVkQXBpRm4gKz0gYXBpRm47XG5cbiAgICAgICAgaWYgKGZvcm1hdHRlZEFwaUZuLmxlbmd0aCA+IGF2YWlsYWJsZVdpZHRoKVxuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlZEFwaUZuLnN1YnN0cigwLCBhdmFpbGFibGVXaWR0aCAtIGVtcHR5U3BhY2VzKSArIGVsbGlwc2lzO1xuXG4gICAgICAgIHJldHVybiBmb3JtYXR0ZWRBcGlGbjtcbiAgICB9KS5qb2luKCdcXG4nKTtcbn1cblxuZnVuY3Rpb24gbWFya3VwIChlcnIsIG1zZ01hcmt1cCwgb3B0cyA9IHt9KSB7XG4gICAgbXNnTWFya3VwID0gZGVkZW50KGBcbiAgICAgICAgJHtTVUJUSVRMRVNbZXJyLnRlc3RSdW5QaGFzZV19PGRpdiBjbGFzcz1cIm1lc3NhZ2VcIj4ke2RlZGVudChtc2dNYXJrdXApfTwvZGl2PlxuXG4gICAgICAgIDxzdHJvbmc+QnJvd3Nlcjo8L3N0cm9uZz4gPHNwYW4gY2xhc3M9XCJ1c2VyLWFnZW50XCI+JHtlcnIudXNlckFnZW50fTwvc3Bhbj5cbiAgICBgKTtcblxuICAgIGlmIChlcnIuc2NyZWVuc2hvdFBhdGgpXG4gICAgICAgIG1zZ01hcmt1cCArPSBgXFxuPGRpdiBjbGFzcz1cInNjcmVlbnNob3QtaW5mb1wiPjxzdHJvbmc+U2NyZWVuc2hvdDo8L3N0cm9uZz4gPGEgY2xhc3M9XCJzY3JlZW5zaG90LXBhdGhcIj4ke2VzY2FwZUh0bWwoZXJyLnNjcmVlbnNob3RQYXRoKX08L2E+PC9kaXY+YDtcblxuICAgIGlmICghb3B0cy53aXRob3V0Q2FsbHNpdGUpIHtcbiAgICAgICAgY29uc3QgY2FsbHNpdGVNYXJrdXAgPSBlcnIuZ2V0Q2FsbHNpdGVNYXJrdXAoKTtcblxuICAgICAgICBpZiAoY2FsbHNpdGVNYXJrdXApXG4gICAgICAgICAgICBtc2dNYXJrdXAgKz0gYFxcblxcbiR7Y2FsbHNpdGVNYXJrdXB9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gbXNnTWFya3VwXG4gICAgICAgIC5yZXBsYWNlKCdcXHQnLCAnJm5ic3A7Jy5yZXBlYXQoNCkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgW1RZUEUuYWN0aW9uSW50ZWdlck9wdGlvbkVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgVGhlIFwiJHtlcnIub3B0aW9uTmFtZX1cIiBvcHRpb24gaXMgZXhwZWN0ZWQgdG8gYmUgYW4gaW50ZWdlciwgYnV0IGl0IHdhcyAke2Vyci5hY3R1YWxWYWx1ZX0uXG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25Qb3NpdGl2ZUludGVnZXJPcHRpb25FcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFRoZSBcIiR7ZXJyLm9wdGlvbk5hbWV9XCIgb3B0aW9uIGlzIGV4cGVjdGVkIHRvIGJlIGEgcG9zaXRpdmUgaW50ZWdlciwgYnV0IGl0IHdhcyAke2Vyci5hY3R1YWxWYWx1ZX0uXG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25Cb29sZWFuT3B0aW9uRXJyb3JdOiBlcnIgPT4gbWFya3VwKGVyciwgYFxuICAgICAgICBUaGUgXCIke2Vyci5vcHRpb25OYW1lfVwiIG9wdGlvbiBpcyBleHBlY3RlZCB0byBiZSBhIGJvb2xlYW4gdmFsdWUsIGJ1dCBpdCB3YXMgJHtlcnIuYWN0dWFsVmFsdWV9LlxuICAgIGApLFxuXG4gICAgW1RZUEUuYWN0aW9uU3BlZWRPcHRpb25FcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFRoZSBcIiR7ZXJyLm9wdGlvbk5hbWV9XCIgb3B0aW9uIGlzIGV4cGVjdGVkIHRvIGJlIGEgbnVtYmVyIGJldHdlZW4gMC4wMSBhbmQgMSwgYnV0IGl0IHdhcyAke2Vyci5hY3R1YWxWYWx1ZX0uXG4gICAgYCksXG5cbiAgICBbVFlQRS5wYWdlTG9hZEVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgJHtlcnIuZXJyTXNnfVxuICAgIGApLFxuXG4gICAgW1RZUEUudW5jYXVnaHRFcnJvck9uUGFnZV06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIEVycm9yIG9uIHBhZ2UgPGEgaHJlZj1cIiR7ZXJyLnBhZ2VEZXN0VXJsfVwiPiR7ZXJyLnBhZ2VEZXN0VXJsfTwvYT46XG5cbiAgICAgICAgJHtyZXBsYWNlTGVhZGluZ1NwYWNlc1dpdGhOYnNwKGVzY2FwZUh0bWwoZXJyLmVyclN0YWNrKSl9XG4gICAgYCksXG5cbiAgICBbVFlQRS51bmNhdWdodEVycm9ySW5UZXN0Q29kZV06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgICR7ZXNjYXBlSHRtbChlcnIuZXJyTXNnKX1cbiAgICBgKSxcblxuICAgIFtUWVBFLm5hdGl2ZURpYWxvZ05vdEhhbmRsZWRFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIEEgbmF0aXZlICR7ZXJyLmRpYWxvZ1R5cGV9IGRpYWxvZyB3YXMgaW52b2tlZCBvbiBwYWdlIDxhIGhyZWY9XCIke2Vyci5wYWdlVXJsfVwiPiR7ZXJyLnBhZ2VVcmx9PC9hPiwgYnV0IG5vIGhhbmRsZXIgd2FzIHNldCBmb3IgaXQuIFVzZSB0aGUgXCJzZXROYXRpdmVEaWFsb2dIYW5kbGVyXCIgZnVuY3Rpb24gdG8gaW50cm9kdWNlIGEgaGFuZGxlciBmdW5jdGlvbiBmb3IgbmF0aXZlIGRpYWxvZ3MuXG4gICAgYCksXG5cbiAgICBbVFlQRS51bmNhdWdodEVycm9ySW5OYXRpdmVEaWFsb2dIYW5kbGVyXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgQW4gZXJyb3Igb2NjdXJyZWQgaW4gdGhlIG5hdGl2ZSBkaWFsb2cgaGFuZGxlciBjYWxsZWQgZm9yIGEgbmF0aXZlICR7ZXJyLmRpYWxvZ1R5cGV9IGRpYWxvZyBvbiBwYWdlIDxhIGhyZWY9XCIke2Vyci5wYWdlVXJsfVwiPiR7ZXJyLnBhZ2VVcmx9PC9hPjpcblxuICAgICAgICAke2VzY2FwZUh0bWwoZXJyLmVyck1zZyl9XG4gICAgYCksXG5cbiAgICBbVFlQRS5zZXRUZXN0U3BlZWRBcmd1bWVudEVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgU3BlZWQgaXMgZXhwZWN0ZWQgdG8gYmUgYSBudW1iZXIgYmV0d2VlbiAwLjAxIGFuZCAxLCBidXQgJHtlcnIuYWN0dWFsVmFsdWV9IHdhcyBwYXNzZWQuXG4gICAgYCksXG5cbiAgICBbVFlQRS5zZXROYXRpdmVEaWFsb2dIYW5kbGVyQ29kZVdyb25nVHlwZUVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgVGhlIG5hdGl2ZSBkaWFsb2cgaGFuZGxlciBpcyBleHBlY3RlZCB0byBiZSBhIGZ1bmN0aW9uLCBDbGllbnRGdW5jdGlvbiBvciBudWxsLCBidXQgaXQgd2FzICR7ZXJyLmFjdHVhbFR5cGV9LlxuICAgIGApLFxuXG4gICAgW1RZUEUudW5jYXVnaHRFcnJvckluQ2xpZW50RnVuY3Rpb25Db2RlXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgQW4gZXJyb3Igb2NjdXJyZWQgaW4gJHtlcnIuaW5zdGFudGlhdGlvbkNhbGxzaXRlTmFtZX0gY29kZTpcblxuICAgICAgICAke2VzY2FwZUh0bWwoZXJyLmVyck1zZyl9XG4gICAgYCksXG5cbiAgICBbVFlQRS51bmNhdWdodEVycm9ySW5DdXN0b21ET01Qcm9wZXJ0eUNvZGVdOiBlcnIgPT4gbWFya3VwKGVyciwgYFxuICAgICAgICBBbiBlcnJvciBvY2N1cnJlZCB3aGVuIHRyeWluZyB0byBjYWxjdWxhdGUgYSBjdXN0b20gU2VsZWN0b3IgcHJvcGVydHkgXCIke2Vyci5wcm9wZXJ0eX1cIjpcblxuICAgICAgICAke2VzY2FwZUh0bWwoZXJyLmVyck1zZyl9XG4gICAgYCksXG5cbiAgICBbVFlQRS5jbGllbnRGdW5jdGlvbkV4ZWN1dGlvbkludGVycnVwdGlvbkVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgJHtlcnIuaW5zdGFudGlhdGlvbkNhbGxzaXRlTmFtZX0gZXhlY3V0aW9uIHdhcyBpbnRlcnJ1cHRlZCBieSBwYWdlIHVubG9hZC4gVGhpcyBwcm9ibGVtIG1heSBhcHBlYXIgaWYgeW91IHRyaWdnZXIgcGFnZSBuYXZpZ2F0aW9uIGZyb20gJHtlcnIuaW5zdGFudGlhdGlvbkNhbGxzaXRlTmFtZX0gY29kZS5cbiAgICBgKSxcblxuICAgIFtUWVBFLnVuY2F1Z2h0Tm9uRXJyb3JPYmplY3RJblRlc3RDb2RlXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgVW5jYXVnaHQgJHtlcnIub2JqVHlwZX0gXCIke2VzY2FwZUh0bWwoZXJyLm9ialN0cil9XCIgd2FzIHRocm93bi4gVGhyb3cgRXJyb3IgaW5zdGVhZC5cbiAgICBgLCB7IHdpdGhvdXRDYWxsc2l0ZTogdHJ1ZSB9KSxcblxuICAgIFtUWVBFLnVuaGFuZGxlZFByb21pc2VSZWplY3Rpb25dOiBlcnIgPT4gbWFya3VwKGVyciwgYFxuICAgICAgICBVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb246XG4gICAgICAgIFxuICAgICAgICAke2VzY2FwZUh0bWwoZXJyLmVyck1zZyl9XG4gICAgYCwgeyB3aXRob3V0Q2FsbHNpdGU6IHRydWUgfSksXG5cbiAgICBbVFlQRS51bmNhdWdodEV4Y2VwdGlvbl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFVuY2F1Z2h0IGV4Y2VwdGlvbjpcbiAgICAgICAgXG4gICAgICAgICR7ZXNjYXBlSHRtbChlcnIuZXJyTXNnKX1cbiAgICBgLCB7IHdpdGhvdXRDYWxsc2l0ZTogdHJ1ZSB9KSxcblxuICAgIFtUWVBFLmFjdGlvbk9wdGlvbnNUeXBlRXJyb3JdOiBlcnIgPT4gbWFya3VwKGVyciwgYFxuICAgICAgICBBY3Rpb24gb3B0aW9ucyBpcyBleHBlY3RlZCB0byBiZSBhbiBvYmplY3QsIG51bGwgb3IgdW5kZWZpbmVkIGJ1dCBpdCB3YXMgJHtlcnIuYWN0dWFsVHlwZX0uXG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25TdHJpbmdBcmd1bWVudEVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgVGhlIFwiJHtlcnIuYXJndW1lbnROYW1lfVwiIGFyZ3VtZW50IGlzIGV4cGVjdGVkIHRvIGJlIGEgbm9uLWVtcHR5IHN0cmluZywgYnV0IGl0IHdhcyAke2Vyci5hY3R1YWxWYWx1ZX0uXG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25Cb29sZWFuQXJndW1lbnRFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFRoZSBcIiR7ZXJyLmFyZ3VtZW50TmFtZX1cIiBhcmd1bWVudCBpcyBleHBlY3RlZCB0byBiZSBhIGJvb2xlYW4gdmFsdWUsIGJ1dCBpdCB3YXMgJHtlcnIuYWN0dWFsVmFsdWV9LlxuICAgIGApLFxuXG4gICAgW1RZUEUuYWN0aW9uTnVsbGFibGVTdHJpbmdBcmd1bWVudEVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgVGhlIFwiJHtlcnIuYXJndW1lbnROYW1lfVwiIGFyZ3VtZW50IGlzIGV4cGVjdGVkIHRvIGJlIGEgbnVsbCBvciBhIHN0cmluZywgYnV0IGl0IHdhcyAke2Vyci5hY3R1YWxWYWx1ZX0uXG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25TdHJpbmdPclN0cmluZ0FycmF5QXJndW1lbnRFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFRoZSBcIiR7ZXJyLmFyZ3VtZW50TmFtZX1cIiBhcmd1bWVudCBpcyBleHBlY3RlZCB0byBiZSBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSBzdHJpbmcgYXJyYXksIGJ1dCBpdCB3YXMgJHtlcnIuYWN0dWFsVmFsdWV9LlxuICAgIGApLFxuXG4gICAgW1RZUEUuYWN0aW9uU3RyaW5nQXJyYXlFbGVtZW50RXJyb3JdOiBlcnIgPT4gbWFya3VwKGVyciwgYFxuICAgICAgICBFbGVtZW50cyBvZiB0aGUgXCIke2Vyci5hcmd1bWVudE5hbWV9XCIgYXJndW1lbnQgYXJlIGV4cGVjdGVkIHRvIGJlIG5vbi1lbXB0eSBzdHJpbmdzLCBidXQgdGhlIGVsZW1lbnQgYXQgaW5kZXggJHtlcnIuZWxlbWVudEluZGV4fSB3YXMgJHtlcnIuYWN0dWFsVmFsdWV9LlxuICAgIGApLFxuXG4gICAgW1RZUEUuYWN0aW9uSW50ZWdlckFyZ3VtZW50RXJyb3JdOiBlcnIgPT4gbWFya3VwKGVyciwgYFxuICAgICAgICBUaGUgXCIke2Vyci5hcmd1bWVudE5hbWV9XCIgYXJndW1lbnQgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gaW50ZWdlciwgYnV0IGl0IHdhcyAke2Vyci5hY3R1YWxWYWx1ZX0uXG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25Sb2xlQXJndW1lbnRFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFRoZSBcIiR7ZXJyLmFyZ3VtZW50TmFtZX1cIiBhcmd1bWVudCBpcyBleHBlY3RlZCB0byBiZSBhIFJvbGUgaW5zdGFuY2UsIGJ1dCBpdCB3YXMgJHtlcnIuYWN0dWFsVmFsdWV9LlxuICAgIGApLFxuXG4gICAgW1RZUEUuYWN0aW9uUG9zaXRpdmVJbnRlZ2VyQXJndW1lbnRFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFRoZSBcIiR7ZXJyLmFyZ3VtZW50TmFtZX1cIiBhcmd1bWVudCBpcyBleHBlY3RlZCB0byBiZSBhIHBvc2l0aXZlIGludGVnZXIsIGJ1dCBpdCB3YXMgJHtlcnIuYWN0dWFsVmFsdWV9LlxuICAgIGApLFxuXG4gICAgW1RZUEUuYWN0aW9uRWxlbWVudE5vdEZvdW5kRXJyb3JdOiAoZXJyLCB2aWV3cG9ydFdpZHRoKSA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFRoZSBzcGVjaWZpZWQgc2VsZWN0b3IgZG9lcyBub3QgbWF0Y2ggYW55IGVsZW1lbnQgaW4gdGhlIERPTSB0cmVlLlxuICAgICAgICBcbiAgICAgICAgJHsgZm9ybWF0U2VsZWN0b3JDYWxsc3RhY2soZXJyLmFwaUZuQ2hhaW4sIGVyci5hcGlGbkluZGV4LCB2aWV3cG9ydFdpZHRoKSB9XG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25FbGVtZW50SXNJbnZpc2libGVFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFRoZSBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIHNlbGVjdG9yIGlzIG5vdCB2aXNpYmxlLlxuICAgIGApLFxuXG4gICAgW1RZUEUuYWN0aW9uU2VsZWN0b3JNYXRjaGVzV3JvbmdOb2RlVHlwZUVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgVGhlIHNwZWNpZmllZCBzZWxlY3RvciBpcyBleHBlY3RlZCB0byBtYXRjaCBhIERPTSBlbGVtZW50LCBidXQgaXQgbWF0Y2hlcyBhICR7ZXJyLm5vZGVEZXNjcmlwdGlvbn0gbm9kZS5cbiAgICBgKSxcblxuICAgIFtUWVBFLmFjdGlvbkFkZGl0aW9uYWxFbGVtZW50Tm90Rm91bmRFcnJvcl06IChlcnIsIHZpZXdwb3J0V2lkdGgpID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgVGhlIHNwZWNpZmllZCBcIiR7ZXJyLmFyZ3VtZW50TmFtZX1cIiBkb2VzIG5vdCBtYXRjaCBhbnkgZWxlbWVudCBpbiB0aGUgRE9NIHRyZWUuXG4gICAgICAgIFxuICAgICAgICAkeyBmb3JtYXRTZWxlY3RvckNhbGxzdGFjayhlcnIuYXBpRm5DaGFpbiwgZXJyLmFwaUZuSW5kZXgsIHZpZXdwb3J0V2lkdGgpIH1cbiAgICBgKSxcblxuICAgIFtUWVBFLmFjdGlvbkFkZGl0aW9uYWxFbGVtZW50SXNJbnZpc2libGVFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFRoZSBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIFwiJHtlcnIuYXJndW1lbnROYW1lfVwiIGlzIG5vdCB2aXNpYmxlLlxuICAgIGApLFxuXG4gICAgW1RZUEUuYWN0aW9uQWRkaXRpb25hbFNlbGVjdG9yTWF0Y2hlc1dyb25nTm9kZVR5cGVFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFRoZSBzcGVjaWZpZWQgXCIke2Vyci5hcmd1bWVudE5hbWV9XCIgaXMgZXhwZWN0ZWQgdG8gbWF0Y2ggYSBET00gZWxlbWVudCwgYnV0IGl0IG1hdGNoZXMgYSAke2Vyci5ub2RlRGVzY3JpcHRpb259IG5vZGUuXG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25FbGVtZW50Tm9uRWRpdGFibGVFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFRoZSBhY3Rpb24gZWxlbWVudCBpcyBleHBlY3RlZCB0byBiZSBlZGl0YWJsZSAoYW4gaW5wdXQsIHRleHRhcmVhIG9yIGVsZW1lbnQgd2l0aCB0aGUgY29udGVudEVkaXRhYmxlIGF0dHJpYnV0ZSkuXG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25FbGVtZW50Tm9uQ29udGVudEVkaXRhYmxlRXJyb3JdOiBlcnIgPT4gbWFya3VwKGVyciwgYFxuICAgICAgICBUaGUgZWxlbWVudCB0aGF0IG1hdGNoZXMgdGhlIHNwZWNpZmllZCBcIiR7ZXJyLmFyZ3VtZW50TmFtZX1cIiBpcyBleHBlY3RlZCB0byBoYXZlIHRoZSBjb250ZW50RWRpdGFibGUgYXR0cmlidXRlIGVuYWJsZWQgb3IgdGhlIGVudGlyZSBkb2N1bWVudCBzaG91bGQgYmUgaW4gZGVzaWduIG1vZGUuXG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25Sb290Q29udGFpbmVyTm90Rm91bmRFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIENvbnRlbnQgYmV0d2VlbiB0aGUgYWN0aW9uIGVsZW1lbnRzIGNhbm5vdCBiZSBzZWxlY3RlZCBiZWNhdXNlIHRoZSByb290IGNvbnRhaW5lciBmb3IgdGhlIHNlbGVjdGlvbiByYW5nZSBjYW5ub3QgYmUgZm91bmQsIGkuZS4gdGhlc2UgZWxlbWVudHMgZG8gbm90IGhhdmUgYSBjb21tb24gYW5jZXN0b3Igd2l0aCB0aGUgY29udGVudEVkaXRhYmxlIGF0dHJpYnV0ZS5cbiAgICBgKSxcblxuICAgIFtUWVBFLmFjdGlvbkVsZW1lbnRJc05vdEZpbGVJbnB1dEVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgVGhlIHNwZWNpZmllZCBzZWxlY3RvciBkb2VzIG5vdCBtYXRjaCBhIGZpbGUgaW5wdXQgZWxlbWVudC5cbiAgICBgKSxcblxuICAgIFtUWVBFLmFjdGlvbkNhbk5vdEZpbmRGaWxlVG9VcGxvYWRFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIENhbm5vdCBmaW5kIHRoZSBmb2xsb3dpbmcgZmlsZShzKSB0byB1cGxvYWQ6XG4gICAgICAgICR7ZXJyLmZpbGVQYXRocy5tYXAocGF0aCA9PiBgICAke2VzY2FwZUh0bWwocGF0aCl9YCkuam9pbignXFxuJyl9XG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25FbGVtZW50Tm90VGV4dEFyZWFFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFRoZSBhY3Rpb24gZWxlbWVudCBpcyBleHBlY3RlZCB0byBiZSBhICZsdDt0ZXh0YXJlYSZndDsuXG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25FbGVtZW50Tm90SWZyYW1lRXJyb3JdOiBlcnIgPT4gbWFya3VwKGVyciwgYFxuICAgICAgICBUaGUgYWN0aW9uIGVsZW1lbnQgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gJmx0O2lmcmFtZSZndC5cbiAgICBgKSxcblxuICAgIFtUWVBFLmFjdGlvbkluY29ycmVjdEtleXNFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFRoZSBcIiR7ZXJyLmFyZ3VtZW50TmFtZX1cIiBhcmd1bWVudCBjb250YWlucyBhbiBpbmNvcnJlY3Qga2V5IG9yIGtleSBjb21iaW5hdGlvbi5cbiAgICBgKSxcblxuICAgIFtUWVBFLmFjdGlvblVuc3VwcG9ydGVkRGV2aWNlVHlwZUVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgVGhlIFwiJHtlcnIuYXJndW1lbnROYW1lfVwiIGFyZ3VtZW50IHNwZWNpZmllcyBhbiB1bnN1cHBvcnRlZCBcIiR7ZXJyLmFjdHVhbFZhbHVlfVwiIGRldmljZS4gRm9yIGEgbGlzdCBvZiBzdXBwb3J0ZWQgZGV2aWNlcywgcmVmZXIgdG8gPGEgaHJlZj1cImh0dHA6Ly92aWV3cG9ydHNpemVzLmNvbVwiPmh0dHA6Ly92aWV3cG9ydHNpemVzLmNvbTwvYT4uXG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25JbnZhbGlkU2Nyb2xsVGFyZ2V0RXJyb3JdOiBlcnIgPT4gbWFya3VwKGVyciwgYFxuICAgICAgICBVbmFibGUgdG8gc2Nyb2xsIHRvIHRoZSBzcGVjaWZpZWQgcG9pbnQgYmVjYXVzZSBhIHBvaW50IHdpdGggdGhlIHNwZWNpZmllZCAke2Vyci5wcm9wZXJ0aWVzfSBpcyBub3QgbG9jYXRlZCBpbnNpZGUgdGhlIGVsZW1lbnQncyBjcm9wcGluZyByZWdpb24uXG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25JZnJhbWVJc05vdExvYWRlZEVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgQ29udGVudCBvZiB0aGUgaWZyYW1lIHRvIHdoaWNoIHlvdSBhcmUgc3dpdGNoaW5nIGRpZCBub3QgbG9hZC5cbiAgICBgKSxcblxuICAgIFtUWVBFLmN1cnJlbnRJZnJhbWVJc05vdExvYWRlZEVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgQ29udGVudCBvZiB0aGUgaWZyYW1lIGluIHdoaWNoIHRoZSB0ZXN0IGlzIGN1cnJlbnRseSBvcGVyYXRpbmcgZGlkIG5vdCBsb2FkLlxuICAgIGApLFxuXG4gICAgW1RZUEUuY3VycmVudElmcmFtZU5vdEZvdW5kRXJyb3JdOiBlcnIgPT4gbWFya3VwKGVyciwgYFxuICAgICAgICBUaGUgaWZyYW1lIGluIHdoaWNoIHRoZSB0ZXN0IGlzIGN1cnJlbnRseSBvcGVyYXRpbmcgZG9lcyBub3QgZXhpc3QgYW55bW9yZS5cbiAgICBgKSxcblxuICAgIFtUWVBFLmN1cnJlbnRJZnJhbWVJc0ludmlzaWJsZUVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgVGhlIGlmcmFtZSBpbiB3aGljaCB0aGUgdGVzdCBpcyBjdXJyZW50bHkgb3BlcmF0aW5nIGlzIG5vdCB2aXNpYmxlIGFueW1vcmUuXG4gICAgYCksXG5cbiAgICBbVFlQRS5taXNzaW5nQXdhaXRFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIEEgY2FsbCB0byBhbiBhc3luYyBmdW5jdGlvbiBpcyBub3QgYXdhaXRlZC4gVXNlIHRoZSBcImF3YWl0XCIga2V5d29yZCBiZWZvcmUgYWN0aW9ucywgYXNzZXJ0aW9ucyBvciBjaGFpbnMgb2YgdGhlbSB0byBlbnN1cmUgdGhhdCB0aGV5IHJ1biBpbiB0aGUgcmlnaHQgc2VxdWVuY2UuXG4gICAgYCksXG5cbiAgICBbVFlQRS5leHRlcm5hbEFzc2VydGlvbkxpYnJhcnlFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgICR7ZXNjYXBlSHRtbChlcnIuZXJyTXNnKX1cbiAgICBgKSxcblxuICAgIFtUWVBFLmRvbU5vZGVDbGllbnRGdW5jdGlvblJlc3VsdEVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAke2Vyci5pbnN0YW50aWF0aW9uQ2FsbHNpdGVOYW1lfSBjYW5ub3QgcmV0dXJuIERPTSBlbGVtZW50cy4gVXNlIFNlbGVjdG9yIGZ1bmN0aW9ucyBmb3IgdGhpcyBwdXJwb3NlLlxuICAgIGApLFxuXG4gICAgW1RZUEUuaW52YWxpZFNlbGVjdG9yUmVzdWx0RXJyb3JdOiBlcnIgPT4gbWFya3VwKGVyciwgYFxuICAgICAgICBGdW5jdGlvbiB0aGF0IHNwZWNpZmllcyBhIHNlbGVjdG9yIGNhbiBvbmx5IHJldHVybiBhIERPTSBub2RlLCBhbiBhcnJheSBvZiBub2RlcywgTm9kZUxpc3QsIEhUTUxDb2xsZWN0aW9uLCBudWxsIG9yIHVuZGVmaW5lZC4gVXNlIENsaWVudEZ1bmN0aW9uIHRvIHJldHVybiBvdGhlciB2YWx1ZXMuXG4gICAgYCksXG5cbiAgICBbVFlQRS5hY3Rpb25TZWxlY3RvckVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgQWN0aW9uIFwiJHtlcnIuc2VsZWN0b3JOYW1lfVwiIGFyZ3VtZW50IGVycm9yOlxuXG4gICAgICAgICR7ZXNjYXBlSHRtbChlcnIuZXJyTXNnKX1cbiAgICBgKSxcblxuICAgIFtUWVBFLmNhbnRPYnRhaW5JbmZvRm9yRWxlbWVudFNwZWNpZmllZEJ5U2VsZWN0b3JFcnJvcl06IChlcnIsIHZpZXdwb3J0V2lkdGgpID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgQ2Fubm90IG9idGFpbiBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbm9kZSBiZWNhdXNlIHRoZSBzcGVjaWZpZWQgc2VsZWN0b3IgZG9lcyBub3QgbWF0Y2ggYW55IG5vZGUgaW4gdGhlIERPTSB0cmVlLlxuICAgICAgICBcbiAgICAgICAgJHsgZm9ybWF0U2VsZWN0b3JDYWxsc3RhY2soZXJyLmFwaUZuQ2hhaW4sIGVyci5hcGlGbkluZGV4LCB2aWV3cG9ydFdpZHRoKSB9XG4gICAgYCksXG5cbiAgICBbVFlQRS53aW5kb3dEaW1lbnNpb25zT3ZlcmZsb3dFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFVuYWJsZSB0byByZXNpemUgdGhlIHdpbmRvdyBiZWNhdXNlIHRoZSBzcGVjaWZpZWQgc2l6ZSBleGNlZWRzIHRoZSBzY3JlZW4gc2l6ZS4gT24gbWFjT1MsIGEgd2luZG93IGNhbm5vdCBiZSBsYXJnZXIgdGhhbiB0aGUgc2NyZWVuLlxuICAgIGApLFxuXG4gICAgW1RZUEUuZm9yYmlkZGVuQ2hhcmFjdGVyc0luU2NyZWVuc2hvdFBhdGhFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFRoZXJlIGFyZSBmb3JiaWRkZW4gY2hhcmFjdGVycyBpbiB0aGUgXCIke2Vyci5zY3JlZW5zaG90UGF0aH1cIiBzY3JlZW5zaG90IHBhdGg6XG4gICAgICAgICR7cmVuZGVyRm9yYmlkZGVuQ2hhcnNMaXN0KGVyci5mb3JiaWRkZW5DaGFyc0xpc3QpfVxuICAgIGApLFxuXG4gICAgW1RZUEUuaW52YWxpZEVsZW1lbnRTY3JlZW5zaG90RGltZW5zaW9uc0Vycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgIFVuYWJsZSB0byBjYXB0dXJlIGFuIGVsZW1lbnQgaW1hZ2UgYmVjYXVzZSB0aGUgcmVzdWx0aW5nIGltYWdlICR7ZXJyLmRpbWVuc2lvbnN9ICR7ZXJyLnZlcmJ9IHplcm8gb3IgbmVnYXRpdmUuXG4gICAgYCksXG5cbiAgICBbVFlQRS5yb2xlU3dpdGNoSW5Sb2xlSW5pdGlhbGl6ZXJFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIFJvbGUgY2Fubm90IGJlIHN3aXRjaGVkIHdoaWxlIGFub3RoZXIgcm9sZSBpcyBiZWluZyBpbml0aWFsaXplZC5cbiAgICBgKSxcblxuICAgIFtUWVBFLmFzc2VydGlvbkV4ZWN1dGFibGVBcmd1bWVudEVycm9yXTogZXJyID0+IG1hcmt1cChlcnIsIGBcbiAgICAgICAgQ2Fubm90IGV2YWx1YXRlIHRoZSBcIiR7ZXJyLmFjdHVhbFZhbHVlfVwiIGV4cHJlc3Npb24gaW4gdGhlIFwiJHtlcnIuYXJndW1lbnROYW1lfVwiIHBhcmFtZXRlciBiZWNhdXNlIG9mIHRoZSBmb2xsb3dpbmcgZXJyb3I6XG5cbiAgICAgICAgJHtlcnIuZXJyTXNnfVxuICAgIGApLFxuXG4gICAgW1RZUEUuYXNzZXJ0aW9uV2l0aG91dE1ldGhvZENhbGxFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIEFuIGFzc2VydGlvbiBtZXRob2QgaXMgbm90IHNwZWNpZmllZC5cbiAgICBgKSxcblxuICAgIFtUWVBFLmFzc2VydGlvblVuYXdhaXRlZFByb21pc2VFcnJvcl06IGVyciA9PiBtYXJrdXAoZXJyLCBgXG4gICAgICAgIEF0dGVtcHRlZCB0byBydW4gYXNzZXJ0aW9ucyBvbiBhIFByb21pc2Ugb2JqZWN0LiBEaWQgeW91IGZvcmdldCB0byBhd2FpdCBpdD8gSWYgbm90LCBwYXNzIFwieyBhbGxvd1VuYXdhaXRlZFByb21pc2U6IHRydWUgfVwiIHRvIHRoZSBhc3NlcnRpb24gb3B0aW9ucy5cbiAgICBgKVxufTtcbiJdfQ==
