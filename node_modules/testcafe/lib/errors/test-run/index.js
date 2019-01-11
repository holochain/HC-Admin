'use strict';

exports.__esModule = true;
exports.SetNativeDialogHandlerCodeWrongTypeError = exports.UncaughtErrorInNativeDialogHandler = exports.NativeDialogNotHandledError = exports.CurrentIframeIsInvisibleError = exports.CurrentIframeNotFoundError = exports.CurrentIframeIsNotLoadedError = exports.ActionIframeIsNotLoadedError = exports.ActionElementNotIframeError = exports.RoleSwitchInRoleInitializerError = exports.ForbiddenCharactersInScreenshotPathError = exports.InvalidElementScreenshotDimensionsError = exports.WindowDimensionsOverflowError = exports.ActionInvalidScrollTargetError = exports.ActionElementIsNotFileInputError = exports.ActionCanNotFindFileToUploadError = exports.ActionIncorrectKeysError = exports.ActionRootContainerNotFoundError = exports.ActionElementNonContentEditableError = exports.ActionElementNotTextAreaError = exports.ActionElementNonEditableError = exports.ActionAdditionalSelectorMatchesWrongNodeTypeError = exports.ActionAdditionalElementIsInvisibleError = exports.ActionAdditionalElementNotFoundError = exports.ActionSelectorMatchesWrongNodeTypeError = exports.ActionElementIsInvisibleError = exports.ActionElementNotFoundError = exports.ActionSelectorError = exports.ActionUnsupportedDeviceTypeError = exports.SetTestSpeedArgumentError = exports.ActionStringArrayElementError = exports.ActionStringOrStringArrayArgumentError = exports.ActionPositiveIntegerArgumentError = exports.ActionRoleArgumentError = exports.ActionIntegerArgumentError = exports.ActionNullableStringArgumentError = exports.ActionStringArgumentError = exports.ActionOptionsTypeError = exports.ActionSpeedOptionError = exports.ActionBooleanArgumentError = exports.ActionBooleanOptionError = exports.ActionPositiveIntegerOptionError = exports.ActionIntegerOptionError = exports.AssertionUnawaitedPromiseError = exports.AssertionWithoutMethodCallError = exports.AssertionExecutableArgumentError = exports.ExternalAssertionLibraryError = exports.UncaughtExceptionError = exports.UnhandledPromiseRejectionError = exports.UncaughtErrorInCustomDOMPropertyCode = exports.UncaughtErrorInClientFunctionCode = exports.UncaughtNonErrorObjectInTestCode = exports.UncaughtErrorInTestCode = exports.UncaughtErrorOnPage = exports.PageLoadError = exports.CantObtainInfoForElementSpecifiedBySelectorError = exports.InvalidSelectorResultError = exports.DomNodeClientFunctionResultError = exports.ClientFunctionExecutionInterruptionError = exports.MissingAwaitError = undefined;

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Base
//--------------------------------------------------------------------
class TestRunErrorBase {
    constructor(type) {
        this.type = type;
        this.isTestCafeError = true;
        this.callsite = null;
    }
} // -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------


class ActionOptionErrorBase extends TestRunErrorBase {
    constructor(type, optionName, actualValue) {
        super(type);

        this.optionName = optionName;
        this.actualValue = actualValue;
    }
}

class ActionArgumentErrorBase extends TestRunErrorBase {
    constructor(type, argumentName, actualValue) {
        super(type);

        this.argumentName = argumentName;
        this.actualValue = actualValue;
    }
}

// Synchronization errors
//--------------------------------------------------------------------
class MissingAwaitError extends TestRunErrorBase {
    constructor(callsite) {
        super(_type2.default.missingAwaitError);

        this.callsite = callsite;
    }
}

exports.MissingAwaitError = MissingAwaitError; // Client function errors
//--------------------------------------------------------------------

class ClientFunctionExecutionInterruptionError extends TestRunErrorBase {
    constructor(instantiationCallsiteName) {
        super(_type2.default.clientFunctionExecutionInterruptionError);

        this.instantiationCallsiteName = instantiationCallsiteName;
    }
}

exports.ClientFunctionExecutionInterruptionError = ClientFunctionExecutionInterruptionError;
class DomNodeClientFunctionResultError extends TestRunErrorBase {
    constructor(instantiationCallsiteName) {
        super(_type2.default.domNodeClientFunctionResultError);

        this.instantiationCallsiteName = instantiationCallsiteName;
    }
}

exports.DomNodeClientFunctionResultError = DomNodeClientFunctionResultError; // Selector errors
//--------------------------------------------------------------------

class SelectorErrorBase extends TestRunErrorBase {
    constructor(type, { apiFnChain, apiFnIndex }) {
        super(type);

        this.apiFnChain = apiFnChain;
        this.apiFnIndex = apiFnIndex;
    }
}

class InvalidSelectorResultError extends TestRunErrorBase {
    constructor() {
        super(_type2.default.invalidSelectorResultError);
    }
}

exports.InvalidSelectorResultError = InvalidSelectorResultError;
class CantObtainInfoForElementSpecifiedBySelectorError extends SelectorErrorBase {
    constructor(callsite, apiFnArgs) {
        super(_type2.default.cantObtainInfoForElementSpecifiedBySelectorError, apiFnArgs);

        this.callsite = callsite;
    }
}

exports.CantObtainInfoForElementSpecifiedBySelectorError = CantObtainInfoForElementSpecifiedBySelectorError; // Page errors
//--------------------------------------------------------------------

class PageLoadError extends TestRunErrorBase {
    constructor(errMsg) {
        super(_type2.default.pageLoadError);

        this.errMsg = errMsg;
    }
}

exports.PageLoadError = PageLoadError; // Uncaught errors
//--------------------------------------------------------------------

class UncaughtErrorOnPage extends TestRunErrorBase {
    constructor(errStack, pageDestUrl) {
        super(_type2.default.uncaughtErrorOnPage);

        this.errStack = errStack;
        this.pageDestUrl = pageDestUrl;
    }
}

exports.UncaughtErrorOnPage = UncaughtErrorOnPage;
class UncaughtErrorInTestCode extends TestRunErrorBase {
    constructor(err, callsite) {
        super(_type2.default.uncaughtErrorInTestCode);

        this.errMsg = String(err);
        this.callsite = callsite;
    }
}

exports.UncaughtErrorInTestCode = UncaughtErrorInTestCode;
class UncaughtNonErrorObjectInTestCode extends TestRunErrorBase {
    constructor(obj) {
        super(_type2.default.uncaughtNonErrorObjectInTestCode);

        this.objType = typeof obj;
        this.objStr = String(obj);
    }
}

exports.UncaughtNonErrorObjectInTestCode = UncaughtNonErrorObjectInTestCode;
class UncaughtErrorInClientFunctionCode extends TestRunErrorBase {
    constructor(instantiationCallsiteName, err) {
        super(_type2.default.uncaughtErrorInClientFunctionCode);

        this.errMsg = String(err);
        this.instantiationCallsiteName = instantiationCallsiteName;
    }
}

exports.UncaughtErrorInClientFunctionCode = UncaughtErrorInClientFunctionCode;
class UncaughtErrorInCustomDOMPropertyCode extends TestRunErrorBase {
    constructor(instantiationCallsiteName, err, prop) {
        super(_type2.default.uncaughtErrorInCustomDOMPropertyCode, err, prop);

        this.errMsg = String(err);
        this.property = prop;
        this.instantiationCallsiteName = instantiationCallsiteName;
    }
}

exports.UncaughtErrorInCustomDOMPropertyCode = UncaughtErrorInCustomDOMPropertyCode;
class UnhandledPromiseRejectionError extends TestRunErrorBase {
    constructor(err) {
        super(_type2.default.unhandledPromiseRejection);

        this.errMsg = String(err);
    }
}

exports.UnhandledPromiseRejectionError = UnhandledPromiseRejectionError;
class UncaughtExceptionError extends TestRunErrorBase {
    constructor(err) {
        super(_type2.default.uncaughtException);

        this.errMsg = String(err);
    }
}

exports.UncaughtExceptionError = UncaughtExceptionError; // Assertion errors
//--------------------------------------------------------------------

class ExternalAssertionLibraryError extends TestRunErrorBase {
    constructor(err, callsite) {
        super(_type2.default.externalAssertionLibraryError);

        this.errMsg = String(err);
        this.callsite = callsite;
    }
}

exports.ExternalAssertionLibraryError = ExternalAssertionLibraryError;
class AssertionExecutableArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, argumentValue, errMsg) {
        super(_type2.default.assertionExecutableArgumentError, argumentName, argumentValue);

        this.errMsg = errMsg;
    }
}

exports.AssertionExecutableArgumentError = AssertionExecutableArgumentError;
class AssertionWithoutMethodCallError extends TestRunErrorBase {
    constructor(callsite) {
        super(_type2.default.assertionWithoutMethodCallError);

        this.callsite = callsite;
    }
}

exports.AssertionWithoutMethodCallError = AssertionWithoutMethodCallError;
class AssertionUnawaitedPromiseError extends TestRunErrorBase {
    constructor(callsite) {
        super(_type2.default.assertionUnawaitedPromiseError);

        this.callsite = callsite;
    }
}

exports.AssertionUnawaitedPromiseError = AssertionUnawaitedPromiseError; // Action parameters errors
//--------------------------------------------------------------------
// Options errors

class ActionIntegerOptionError extends ActionOptionErrorBase {
    constructor(optionName, actualValue) {
        super(_type2.default.actionIntegerOptionError, optionName, actualValue);
    }
}

exports.ActionIntegerOptionError = ActionIntegerOptionError;
class ActionPositiveIntegerOptionError extends ActionOptionErrorBase {
    constructor(optionName, actualValue) {
        super(_type2.default.actionPositiveIntegerOptionError, optionName, actualValue);
    }
}

exports.ActionPositiveIntegerOptionError = ActionPositiveIntegerOptionError;
class ActionBooleanOptionError extends ActionOptionErrorBase {
    constructor(optionName, actualValue) {
        super(_type2.default.actionBooleanOptionError, optionName, actualValue);
    }
}

exports.ActionBooleanOptionError = ActionBooleanOptionError;
class ActionBooleanArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(_type2.default.actionBooleanArgumentError, argumentName, actualValue);
    }
}

exports.ActionBooleanArgumentError = ActionBooleanArgumentError;
class ActionSpeedOptionError extends ActionOptionErrorBase {
    constructor(optionName, actualValue) {
        super(_type2.default.actionSpeedOptionError, optionName, actualValue);
    }
}

exports.ActionSpeedOptionError = ActionSpeedOptionError;
class ActionOptionsTypeError extends TestRunErrorBase {
    constructor(actualType) {
        super(_type2.default.actionOptionsTypeError);

        this.actualType = actualType;
    }
}

exports.ActionOptionsTypeError = ActionOptionsTypeError; // Arguments errors

class ActionStringArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(_type2.default.actionStringArgumentError, argumentName, actualValue);
    }
}

exports.ActionStringArgumentError = ActionStringArgumentError;
class ActionNullableStringArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(_type2.default.actionNullableStringArgumentError, argumentName, actualValue);
    }
}

exports.ActionNullableStringArgumentError = ActionNullableStringArgumentError;
class ActionIntegerArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(_type2.default.actionIntegerArgumentError, argumentName, actualValue);
    }
}

exports.ActionIntegerArgumentError = ActionIntegerArgumentError;
class ActionRoleArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(_type2.default.actionRoleArgumentError, argumentName, actualValue);
    }
}

exports.ActionRoleArgumentError = ActionRoleArgumentError;
class ActionPositiveIntegerArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(_type2.default.actionPositiveIntegerArgumentError, argumentName, actualValue);
    }
}

exports.ActionPositiveIntegerArgumentError = ActionPositiveIntegerArgumentError;
class ActionStringOrStringArrayArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(_type2.default.actionStringOrStringArrayArgumentError, argumentName, actualValue);
    }
}

exports.ActionStringOrStringArrayArgumentError = ActionStringOrStringArrayArgumentError;
class ActionStringArrayElementError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue, elementIndex) {
        super(_type2.default.actionStringArrayElementError, argumentName, actualValue);

        this.elementIndex = elementIndex;
    }
}

exports.ActionStringArrayElementError = ActionStringArrayElementError;
class SetTestSpeedArgumentError extends ActionArgumentErrorBase {
    constructor(argumentName, actualValue) {
        super(_type2.default.setTestSpeedArgumentError, argumentName, actualValue);
    }
}

exports.SetTestSpeedArgumentError = SetTestSpeedArgumentError;
class ActionUnsupportedDeviceTypeError extends ActionArgumentErrorBase {
    constructor(argumentName, argumentValue) {
        super(_type2.default.actionUnsupportedDeviceTypeError, argumentName, argumentValue);
    }
}

exports.ActionUnsupportedDeviceTypeError = ActionUnsupportedDeviceTypeError; // Selector errors

class ActionSelectorError extends TestRunErrorBase {
    constructor(selectorName, errMsg) {
        super(_type2.default.actionSelectorError);

        this.selectorName = selectorName;
        this.errMsg = errMsg;
    }
}

exports.ActionSelectorError = ActionSelectorError; // Action execution errors
//--------------------------------------------------------------------

class ActionElementNotFoundError extends SelectorErrorBase {
    constructor(apiFnArgs) {
        super(_type2.default.actionElementNotFoundError, apiFnArgs);
    }
}

exports.ActionElementNotFoundError = ActionElementNotFoundError;
class ActionElementIsInvisibleError extends TestRunErrorBase {
    constructor() {
        super(_type2.default.actionElementIsInvisibleError);
    }
}

exports.ActionElementIsInvisibleError = ActionElementIsInvisibleError;
class ActionSelectorMatchesWrongNodeTypeError extends TestRunErrorBase {
    constructor(nodeDescription) {
        super(_type2.default.actionSelectorMatchesWrongNodeTypeError);

        this.nodeDescription = nodeDescription;
    }
}

exports.ActionSelectorMatchesWrongNodeTypeError = ActionSelectorMatchesWrongNodeTypeError;
class ActionAdditionalElementNotFoundError extends SelectorErrorBase {
    constructor(argumentName, apiFnArgs) {
        super(_type2.default.actionAdditionalElementNotFoundError, apiFnArgs);

        this.argumentName = argumentName;
    }
}

exports.ActionAdditionalElementNotFoundError = ActionAdditionalElementNotFoundError;
class ActionAdditionalElementIsInvisibleError extends TestRunErrorBase {
    constructor(argumentName) {
        super(_type2.default.actionAdditionalElementIsInvisibleError);

        this.argumentName = argumentName;
    }
}

exports.ActionAdditionalElementIsInvisibleError = ActionAdditionalElementIsInvisibleError;
class ActionAdditionalSelectorMatchesWrongNodeTypeError extends TestRunErrorBase {
    constructor(argumentName, nodeDescription) {
        super(_type2.default.actionAdditionalSelectorMatchesWrongNodeTypeError);

        this.argumentName = argumentName;
        this.nodeDescription = nodeDescription;
    }
}

exports.ActionAdditionalSelectorMatchesWrongNodeTypeError = ActionAdditionalSelectorMatchesWrongNodeTypeError;
class ActionElementNonEditableError extends TestRunErrorBase {
    constructor() {
        super(_type2.default.actionElementNonEditableError);
    }
}

exports.ActionElementNonEditableError = ActionElementNonEditableError;
class ActionElementNotTextAreaError extends TestRunErrorBase {
    constructor() {
        super(_type2.default.actionElementNotTextAreaError);
    }
}

exports.ActionElementNotTextAreaError = ActionElementNotTextAreaError;
class ActionElementNonContentEditableError extends TestRunErrorBase {
    constructor(argumentName) {
        super(_type2.default.actionElementNonContentEditableError);

        this.argumentName = argumentName;
    }
}

exports.ActionElementNonContentEditableError = ActionElementNonContentEditableError;
class ActionRootContainerNotFoundError extends TestRunErrorBase {
    constructor() {
        super(_type2.default.actionRootContainerNotFoundError);
    }
}

exports.ActionRootContainerNotFoundError = ActionRootContainerNotFoundError;
class ActionIncorrectKeysError extends TestRunErrorBase {
    constructor(argumentName) {
        super(_type2.default.actionIncorrectKeysError);

        this.argumentName = argumentName;
    }
}

exports.ActionIncorrectKeysError = ActionIncorrectKeysError;
class ActionCanNotFindFileToUploadError extends TestRunErrorBase {
    constructor(filePaths) {
        super(_type2.default.actionCanNotFindFileToUploadError);

        this.filePaths = filePaths;
    }
}

exports.ActionCanNotFindFileToUploadError = ActionCanNotFindFileToUploadError;
class ActionElementIsNotFileInputError extends TestRunErrorBase {
    constructor() {
        super(_type2.default.actionElementIsNotFileInputError);
    }
}

exports.ActionElementIsNotFileInputError = ActionElementIsNotFileInputError;
class ActionInvalidScrollTargetError extends TestRunErrorBase {
    constructor(scrollTargetXValid, scrollTargetYValid) {
        super(_type2.default.actionInvalidScrollTargetError);

        if (!scrollTargetXValid) {
            if (!scrollTargetYValid) this.properties = 'scrollTargetX and scrollTargetY properties';else this.properties = 'scrollTargetX property';
        } else this.properties = 'scrollTargetY property';
    }
}

exports.ActionInvalidScrollTargetError = ActionInvalidScrollTargetError;
class WindowDimensionsOverflowError extends TestRunErrorBase {
    constructor(callsite) {
        super(_type2.default.windowDimensionsOverflowError);

        this.callsite = callsite;
    }
}

exports.WindowDimensionsOverflowError = WindowDimensionsOverflowError;
class InvalidElementScreenshotDimensionsError extends TestRunErrorBase {
    constructor(width, height) {
        super(_type2.default.invalidElementScreenshotDimensionsError);

        const widthIsInvalid = width <= 0;
        const heightIsInvalid = height <= 0;

        if (widthIsInvalid) {
            if (heightIsInvalid) {
                this.verb = 'are';
                this.dimensions = 'width and height';
            } else {
                this.verb = 'is';
                this.dimensions = 'width';
            }
        } else {
            this.verb = 'is';
            this.dimensions = 'height';
        }
    }
}

exports.InvalidElementScreenshotDimensionsError = InvalidElementScreenshotDimensionsError;
class ForbiddenCharactersInScreenshotPathError extends TestRunErrorBase {
    constructor(screenshotPath, forbiddenCharsList) {
        super(_type2.default.forbiddenCharactersInScreenshotPathError);

        this.screenshotPath = screenshotPath;
        this.forbiddenCharsList = forbiddenCharsList;
    }
}

exports.ForbiddenCharactersInScreenshotPathError = ForbiddenCharactersInScreenshotPathError;
class RoleSwitchInRoleInitializerError extends TestRunErrorBase {
    constructor(callsite) {
        super(_type2.default.roleSwitchInRoleInitializerError);

        this.callsite = callsite;
    }
}

exports.RoleSwitchInRoleInitializerError = RoleSwitchInRoleInitializerError; // Iframe errors

class ActionElementNotIframeError extends TestRunErrorBase {
    constructor() {
        super(_type2.default.actionElementNotIframeError);
    }
}

exports.ActionElementNotIframeError = ActionElementNotIframeError;
class ActionIframeIsNotLoadedError extends TestRunErrorBase {
    constructor() {
        super(_type2.default.actionIframeIsNotLoadedError);
    }
}

exports.ActionIframeIsNotLoadedError = ActionIframeIsNotLoadedError;
class CurrentIframeIsNotLoadedError extends TestRunErrorBase {
    constructor() {
        super(_type2.default.currentIframeIsNotLoadedError);
    }
}

exports.CurrentIframeIsNotLoadedError = CurrentIframeIsNotLoadedError;
class CurrentIframeNotFoundError extends TestRunErrorBase {
    constructor() {
        super(_type2.default.currentIframeNotFoundError);
    }
}

exports.CurrentIframeNotFoundError = CurrentIframeNotFoundError;
class CurrentIframeIsInvisibleError extends TestRunErrorBase {
    constructor() {
        super(_type2.default.currentIframeIsInvisibleError);
    }
}

exports.CurrentIframeIsInvisibleError = CurrentIframeIsInvisibleError; // Native dialog errors

class NativeDialogNotHandledError extends TestRunErrorBase {
    constructor(dialogType, url) {
        super(_type2.default.nativeDialogNotHandledError);

        this.dialogType = dialogType;
        this.pageUrl = url;
    }
}

exports.NativeDialogNotHandledError = NativeDialogNotHandledError;
class UncaughtErrorInNativeDialogHandler extends TestRunErrorBase {
    constructor(dialogType, errMsg, url) {
        super(_type2.default.uncaughtErrorInNativeDialogHandler);

        this.dialogType = dialogType;
        this.errMsg = errMsg;
        this.pageUrl = url;
    }
}

exports.UncaughtErrorInNativeDialogHandler = UncaughtErrorInNativeDialogHandler;
class SetNativeDialogHandlerCodeWrongTypeError extends TestRunErrorBase {
    constructor(actualType) {
        super(_type2.default.setNativeDialogHandlerCodeWrongTypeError);

        this.actualType = actualType;
    }
}
exports.SetNativeDialogHandlerCodeWrongTypeError = SetNativeDialogHandlerCodeWrongTypeError;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lcnJvcnMvdGVzdC1ydW4vaW5kZXguanMiXSwibmFtZXMiOlsiVGVzdFJ1bkVycm9yQmFzZSIsImNvbnN0cnVjdG9yIiwidHlwZSIsImlzVGVzdENhZmVFcnJvciIsImNhbGxzaXRlIiwiQWN0aW9uT3B0aW9uRXJyb3JCYXNlIiwib3B0aW9uTmFtZSIsImFjdHVhbFZhbHVlIiwiQWN0aW9uQXJndW1lbnRFcnJvckJhc2UiLCJhcmd1bWVudE5hbWUiLCJNaXNzaW5nQXdhaXRFcnJvciIsIlRZUEUiLCJtaXNzaW5nQXdhaXRFcnJvciIsIkNsaWVudEZ1bmN0aW9uRXhlY3V0aW9uSW50ZXJydXB0aW9uRXJyb3IiLCJpbnN0YW50aWF0aW9uQ2FsbHNpdGVOYW1lIiwiY2xpZW50RnVuY3Rpb25FeGVjdXRpb25JbnRlcnJ1cHRpb25FcnJvciIsIkRvbU5vZGVDbGllbnRGdW5jdGlvblJlc3VsdEVycm9yIiwiZG9tTm9kZUNsaWVudEZ1bmN0aW9uUmVzdWx0RXJyb3IiLCJTZWxlY3RvckVycm9yQmFzZSIsImFwaUZuQ2hhaW4iLCJhcGlGbkluZGV4IiwiSW52YWxpZFNlbGVjdG9yUmVzdWx0RXJyb3IiLCJpbnZhbGlkU2VsZWN0b3JSZXN1bHRFcnJvciIsIkNhbnRPYnRhaW5JbmZvRm9yRWxlbWVudFNwZWNpZmllZEJ5U2VsZWN0b3JFcnJvciIsImFwaUZuQXJncyIsImNhbnRPYnRhaW5JbmZvRm9yRWxlbWVudFNwZWNpZmllZEJ5U2VsZWN0b3JFcnJvciIsIlBhZ2VMb2FkRXJyb3IiLCJlcnJNc2ciLCJwYWdlTG9hZEVycm9yIiwiVW5jYXVnaHRFcnJvck9uUGFnZSIsImVyclN0YWNrIiwicGFnZURlc3RVcmwiLCJ1bmNhdWdodEVycm9yT25QYWdlIiwiVW5jYXVnaHRFcnJvckluVGVzdENvZGUiLCJlcnIiLCJ1bmNhdWdodEVycm9ySW5UZXN0Q29kZSIsIlN0cmluZyIsIlVuY2F1Z2h0Tm9uRXJyb3JPYmplY3RJblRlc3RDb2RlIiwib2JqIiwidW5jYXVnaHROb25FcnJvck9iamVjdEluVGVzdENvZGUiLCJvYmpUeXBlIiwib2JqU3RyIiwiVW5jYXVnaHRFcnJvckluQ2xpZW50RnVuY3Rpb25Db2RlIiwidW5jYXVnaHRFcnJvckluQ2xpZW50RnVuY3Rpb25Db2RlIiwiVW5jYXVnaHRFcnJvckluQ3VzdG9tRE9NUHJvcGVydHlDb2RlIiwicHJvcCIsInVuY2F1Z2h0RXJyb3JJbkN1c3RvbURPTVByb3BlcnR5Q29kZSIsInByb3BlcnR5IiwiVW5oYW5kbGVkUHJvbWlzZVJlamVjdGlvbkVycm9yIiwidW5oYW5kbGVkUHJvbWlzZVJlamVjdGlvbiIsIlVuY2F1Z2h0RXhjZXB0aW9uRXJyb3IiLCJ1bmNhdWdodEV4Y2VwdGlvbiIsIkV4dGVybmFsQXNzZXJ0aW9uTGlicmFyeUVycm9yIiwiZXh0ZXJuYWxBc3NlcnRpb25MaWJyYXJ5RXJyb3IiLCJBc3NlcnRpb25FeGVjdXRhYmxlQXJndW1lbnRFcnJvciIsImFyZ3VtZW50VmFsdWUiLCJhc3NlcnRpb25FeGVjdXRhYmxlQXJndW1lbnRFcnJvciIsIkFzc2VydGlvbldpdGhvdXRNZXRob2RDYWxsRXJyb3IiLCJhc3NlcnRpb25XaXRob3V0TWV0aG9kQ2FsbEVycm9yIiwiQXNzZXJ0aW9uVW5hd2FpdGVkUHJvbWlzZUVycm9yIiwiYXNzZXJ0aW9uVW5hd2FpdGVkUHJvbWlzZUVycm9yIiwiQWN0aW9uSW50ZWdlck9wdGlvbkVycm9yIiwiYWN0aW9uSW50ZWdlck9wdGlvbkVycm9yIiwiQWN0aW9uUG9zaXRpdmVJbnRlZ2VyT3B0aW9uRXJyb3IiLCJhY3Rpb25Qb3NpdGl2ZUludGVnZXJPcHRpb25FcnJvciIsIkFjdGlvbkJvb2xlYW5PcHRpb25FcnJvciIsImFjdGlvbkJvb2xlYW5PcHRpb25FcnJvciIsIkFjdGlvbkJvb2xlYW5Bcmd1bWVudEVycm9yIiwiYWN0aW9uQm9vbGVhbkFyZ3VtZW50RXJyb3IiLCJBY3Rpb25TcGVlZE9wdGlvbkVycm9yIiwiYWN0aW9uU3BlZWRPcHRpb25FcnJvciIsIkFjdGlvbk9wdGlvbnNUeXBlRXJyb3IiLCJhY3R1YWxUeXBlIiwiYWN0aW9uT3B0aW9uc1R5cGVFcnJvciIsIkFjdGlvblN0cmluZ0FyZ3VtZW50RXJyb3IiLCJhY3Rpb25TdHJpbmdBcmd1bWVudEVycm9yIiwiQWN0aW9uTnVsbGFibGVTdHJpbmdBcmd1bWVudEVycm9yIiwiYWN0aW9uTnVsbGFibGVTdHJpbmdBcmd1bWVudEVycm9yIiwiQWN0aW9uSW50ZWdlckFyZ3VtZW50RXJyb3IiLCJhY3Rpb25JbnRlZ2VyQXJndW1lbnRFcnJvciIsIkFjdGlvblJvbGVBcmd1bWVudEVycm9yIiwiYWN0aW9uUm9sZUFyZ3VtZW50RXJyb3IiLCJBY3Rpb25Qb3NpdGl2ZUludGVnZXJBcmd1bWVudEVycm9yIiwiYWN0aW9uUG9zaXRpdmVJbnRlZ2VyQXJndW1lbnRFcnJvciIsIkFjdGlvblN0cmluZ09yU3RyaW5nQXJyYXlBcmd1bWVudEVycm9yIiwiYWN0aW9uU3RyaW5nT3JTdHJpbmdBcnJheUFyZ3VtZW50RXJyb3IiLCJBY3Rpb25TdHJpbmdBcnJheUVsZW1lbnRFcnJvciIsImVsZW1lbnRJbmRleCIsImFjdGlvblN0cmluZ0FycmF5RWxlbWVudEVycm9yIiwiU2V0VGVzdFNwZWVkQXJndW1lbnRFcnJvciIsInNldFRlc3RTcGVlZEFyZ3VtZW50RXJyb3IiLCJBY3Rpb25VbnN1cHBvcnRlZERldmljZVR5cGVFcnJvciIsImFjdGlvblVuc3VwcG9ydGVkRGV2aWNlVHlwZUVycm9yIiwiQWN0aW9uU2VsZWN0b3JFcnJvciIsInNlbGVjdG9yTmFtZSIsImFjdGlvblNlbGVjdG9yRXJyb3IiLCJBY3Rpb25FbGVtZW50Tm90Rm91bmRFcnJvciIsImFjdGlvbkVsZW1lbnROb3RGb3VuZEVycm9yIiwiQWN0aW9uRWxlbWVudElzSW52aXNpYmxlRXJyb3IiLCJhY3Rpb25FbGVtZW50SXNJbnZpc2libGVFcnJvciIsIkFjdGlvblNlbGVjdG9yTWF0Y2hlc1dyb25nTm9kZVR5cGVFcnJvciIsIm5vZGVEZXNjcmlwdGlvbiIsImFjdGlvblNlbGVjdG9yTWF0Y2hlc1dyb25nTm9kZVR5cGVFcnJvciIsIkFjdGlvbkFkZGl0aW9uYWxFbGVtZW50Tm90Rm91bmRFcnJvciIsImFjdGlvbkFkZGl0aW9uYWxFbGVtZW50Tm90Rm91bmRFcnJvciIsIkFjdGlvbkFkZGl0aW9uYWxFbGVtZW50SXNJbnZpc2libGVFcnJvciIsImFjdGlvbkFkZGl0aW9uYWxFbGVtZW50SXNJbnZpc2libGVFcnJvciIsIkFjdGlvbkFkZGl0aW9uYWxTZWxlY3Rvck1hdGNoZXNXcm9uZ05vZGVUeXBlRXJyb3IiLCJhY3Rpb25BZGRpdGlvbmFsU2VsZWN0b3JNYXRjaGVzV3JvbmdOb2RlVHlwZUVycm9yIiwiQWN0aW9uRWxlbWVudE5vbkVkaXRhYmxlRXJyb3IiLCJhY3Rpb25FbGVtZW50Tm9uRWRpdGFibGVFcnJvciIsIkFjdGlvbkVsZW1lbnROb3RUZXh0QXJlYUVycm9yIiwiYWN0aW9uRWxlbWVudE5vdFRleHRBcmVhRXJyb3IiLCJBY3Rpb25FbGVtZW50Tm9uQ29udGVudEVkaXRhYmxlRXJyb3IiLCJhY3Rpb25FbGVtZW50Tm9uQ29udGVudEVkaXRhYmxlRXJyb3IiLCJBY3Rpb25Sb290Q29udGFpbmVyTm90Rm91bmRFcnJvciIsImFjdGlvblJvb3RDb250YWluZXJOb3RGb3VuZEVycm9yIiwiQWN0aW9uSW5jb3JyZWN0S2V5c0Vycm9yIiwiYWN0aW9uSW5jb3JyZWN0S2V5c0Vycm9yIiwiQWN0aW9uQ2FuTm90RmluZEZpbGVUb1VwbG9hZEVycm9yIiwiZmlsZVBhdGhzIiwiYWN0aW9uQ2FuTm90RmluZEZpbGVUb1VwbG9hZEVycm9yIiwiQWN0aW9uRWxlbWVudElzTm90RmlsZUlucHV0RXJyb3IiLCJhY3Rpb25FbGVtZW50SXNOb3RGaWxlSW5wdXRFcnJvciIsIkFjdGlvbkludmFsaWRTY3JvbGxUYXJnZXRFcnJvciIsInNjcm9sbFRhcmdldFhWYWxpZCIsInNjcm9sbFRhcmdldFlWYWxpZCIsImFjdGlvbkludmFsaWRTY3JvbGxUYXJnZXRFcnJvciIsInByb3BlcnRpZXMiLCJXaW5kb3dEaW1lbnNpb25zT3ZlcmZsb3dFcnJvciIsIndpbmRvd0RpbWVuc2lvbnNPdmVyZmxvd0Vycm9yIiwiSW52YWxpZEVsZW1lbnRTY3JlZW5zaG90RGltZW5zaW9uc0Vycm9yIiwid2lkdGgiLCJoZWlnaHQiLCJpbnZhbGlkRWxlbWVudFNjcmVlbnNob3REaW1lbnNpb25zRXJyb3IiLCJ3aWR0aElzSW52YWxpZCIsImhlaWdodElzSW52YWxpZCIsInZlcmIiLCJkaW1lbnNpb25zIiwiRm9yYmlkZGVuQ2hhcmFjdGVyc0luU2NyZWVuc2hvdFBhdGhFcnJvciIsInNjcmVlbnNob3RQYXRoIiwiZm9yYmlkZGVuQ2hhcnNMaXN0IiwiZm9yYmlkZGVuQ2hhcmFjdGVyc0luU2NyZWVuc2hvdFBhdGhFcnJvciIsIlJvbGVTd2l0Y2hJblJvbGVJbml0aWFsaXplckVycm9yIiwicm9sZVN3aXRjaEluUm9sZUluaXRpYWxpemVyRXJyb3IiLCJBY3Rpb25FbGVtZW50Tm90SWZyYW1lRXJyb3IiLCJhY3Rpb25FbGVtZW50Tm90SWZyYW1lRXJyb3IiLCJBY3Rpb25JZnJhbWVJc05vdExvYWRlZEVycm9yIiwiYWN0aW9uSWZyYW1lSXNOb3RMb2FkZWRFcnJvciIsIkN1cnJlbnRJZnJhbWVJc05vdExvYWRlZEVycm9yIiwiY3VycmVudElmcmFtZUlzTm90TG9hZGVkRXJyb3IiLCJDdXJyZW50SWZyYW1lTm90Rm91bmRFcnJvciIsImN1cnJlbnRJZnJhbWVOb3RGb3VuZEVycm9yIiwiQ3VycmVudElmcmFtZUlzSW52aXNpYmxlRXJyb3IiLCJjdXJyZW50SWZyYW1lSXNJbnZpc2libGVFcnJvciIsIk5hdGl2ZURpYWxvZ05vdEhhbmRsZWRFcnJvciIsImRpYWxvZ1R5cGUiLCJ1cmwiLCJuYXRpdmVEaWFsb2dOb3RIYW5kbGVkRXJyb3IiLCJwYWdlVXJsIiwiVW5jYXVnaHRFcnJvckluTmF0aXZlRGlhbG9nSGFuZGxlciIsInVuY2F1Z2h0RXJyb3JJbk5hdGl2ZURpYWxvZ0hhbmRsZXIiLCJTZXROYXRpdmVEaWFsb2dIYW5kbGVyQ29kZVdyb25nVHlwZUVycm9yIiwic2V0TmF0aXZlRGlhbG9nSGFuZGxlckNvZGVXcm9uZ1R5cGVFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQTs7Ozs7O0FBRUE7QUFDQTtBQUNBLE1BQU1BLGdCQUFOLENBQXVCO0FBQ25CQyxnQkFBYUMsSUFBYixFQUFtQjtBQUNmLGFBQUtBLElBQUwsR0FBdUJBLElBQXZCO0FBQ0EsYUFBS0MsZUFBTCxHQUF1QixJQUF2QjtBQUNBLGFBQUtDLFFBQUwsR0FBdUIsSUFBdkI7QUFDSDtBQUxrQixDLENBUnZCO0FBQ0E7QUFDQTtBQUNBOzs7QUFhQSxNQUFNQyxxQkFBTixTQUFvQ0wsZ0JBQXBDLENBQXFEO0FBQ2pEQyxnQkFBYUMsSUFBYixFQUFtQkksVUFBbkIsRUFBK0JDLFdBQS9CLEVBQTRDO0FBQ3hDLGNBQU1MLElBQU47O0FBRUEsYUFBS0ksVUFBTCxHQUFtQkEsVUFBbkI7QUFDQSxhQUFLQyxXQUFMLEdBQW1CQSxXQUFuQjtBQUNIO0FBTmdEOztBQVNyRCxNQUFNQyx1QkFBTixTQUFzQ1IsZ0JBQXRDLENBQXVEO0FBQ25EQyxnQkFBYUMsSUFBYixFQUFtQk8sWUFBbkIsRUFBaUNGLFdBQWpDLEVBQThDO0FBQzFDLGNBQU1MLElBQU47O0FBRUEsYUFBS08sWUFBTCxHQUFvQkEsWUFBcEI7QUFDQSxhQUFLRixXQUFMLEdBQW9CQSxXQUFwQjtBQUNIO0FBTmtEOztBQVN2RDtBQUNBO0FBQ08sTUFBTUcsaUJBQU4sU0FBZ0NWLGdCQUFoQyxDQUFpRDtBQUNwREMsZ0JBQWFHLFFBQWIsRUFBdUI7QUFDbkIsY0FBTU8sZUFBS0MsaUJBQVg7O0FBRUEsYUFBS1IsUUFBTCxHQUFnQkEsUUFBaEI7QUFDSDtBQUxtRDs7UUFBM0NNLGlCLEdBQUFBLGlCLEVBU2I7QUFDQTs7QUFDTyxNQUFNRyx3Q0FBTixTQUF1RGIsZ0JBQXZELENBQXdFO0FBQzNFQyxnQkFBYWEseUJBQWIsRUFBd0M7QUFDcEMsY0FBTUgsZUFBS0ksd0NB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LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFdBUk5JTkc6IHRoaXMgZmlsZSBpcyB1c2VkIGJ5IGJvdGggdGhlIGNsaWVudCBhbmQgdGhlIHNlcnZlci5cbi8vIERvIG5vdCB1c2UgYW55IGJyb3dzZXIgb3Igbm9kZS1zcGVjaWZpYyBBUEkhXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5pbXBvcnQgVFlQRSBmcm9tICcuL3R5cGUnO1xuXG4vLyBCYXNlXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAodHlwZSkge1xuICAgICAgICB0aGlzLnR5cGUgICAgICAgICAgICA9IHR5cGU7XG4gICAgICAgIHRoaXMuaXNUZXN0Q2FmZUVycm9yID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jYWxsc2l0ZSAgICAgICAgPSBudWxsO1xuICAgIH1cbn1cblxuY2xhc3MgQWN0aW9uT3B0aW9uRXJyb3JCYXNlIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKHR5cGUsIG9wdGlvbk5hbWUsIGFjdHVhbFZhbHVlKSB7XG4gICAgICAgIHN1cGVyKHR5cGUpO1xuXG4gICAgICAgIHRoaXMub3B0aW9uTmFtZSAgPSBvcHRpb25OYW1lO1xuICAgICAgICB0aGlzLmFjdHVhbFZhbHVlID0gYWN0dWFsVmFsdWU7XG4gICAgfVxufVxuXG5jbGFzcyBBY3Rpb25Bcmd1bWVudEVycm9yQmFzZSBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICh0eXBlLCBhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKSB7XG4gICAgICAgIHN1cGVyKHR5cGUpO1xuXG4gICAgICAgIHRoaXMuYXJndW1lbnROYW1lID0gYXJndW1lbnROYW1lO1xuICAgICAgICB0aGlzLmFjdHVhbFZhbHVlICA9IGFjdHVhbFZhbHVlO1xuICAgIH1cbn1cblxuLy8gU3luY2hyb25pemF0aW9uIGVycm9yc1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGNsYXNzIE1pc3NpbmdBd2FpdEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGNhbGxzaXRlKSB7XG4gICAgICAgIHN1cGVyKFRZUEUubWlzc2luZ0F3YWl0RXJyb3IpO1xuXG4gICAgICAgIHRoaXMuY2FsbHNpdGUgPSBjYWxsc2l0ZTtcbiAgICB9XG59XG5cblxuLy8gQ2xpZW50IGZ1bmN0aW9uIGVycm9yc1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGNsYXNzIENsaWVudEZ1bmN0aW9uRXhlY3V0aW9uSW50ZXJydXB0aW9uRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoaW5zdGFudGlhdGlvbkNhbGxzaXRlTmFtZSkge1xuICAgICAgICBzdXBlcihUWVBFLmNsaWVudEZ1bmN0aW9uRXhlY3V0aW9uSW50ZXJydXB0aW9uRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuaW5zdGFudGlhdGlvbkNhbGxzaXRlTmFtZSA9IGluc3RhbnRpYXRpb25DYWxsc2l0ZU5hbWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRG9tTm9kZUNsaWVudEZ1bmN0aW9uUmVzdWx0RXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoaW5zdGFudGlhdGlvbkNhbGxzaXRlTmFtZSkge1xuICAgICAgICBzdXBlcihUWVBFLmRvbU5vZGVDbGllbnRGdW5jdGlvblJlc3VsdEVycm9yKTtcblxuICAgICAgICB0aGlzLmluc3RhbnRpYXRpb25DYWxsc2l0ZU5hbWUgPSBpbnN0YW50aWF0aW9uQ2FsbHNpdGVOYW1lO1xuICAgIH1cbn1cblxuLy8gU2VsZWN0b3IgZXJyb3JzXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jbGFzcyBTZWxlY3RvckVycm9yQmFzZSBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICh0eXBlLCB7IGFwaUZuQ2hhaW4sIGFwaUZuSW5kZXggfSkge1xuICAgICAgICBzdXBlcih0eXBlKTtcblxuICAgICAgICB0aGlzLmFwaUZuQ2hhaW4gPSBhcGlGbkNoYWluO1xuICAgICAgICB0aGlzLmFwaUZuSW5kZXggPSBhcGlGbkluZGV4O1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEludmFsaWRTZWxlY3RvclJlc3VsdEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcihUWVBFLmludmFsaWRTZWxlY3RvclJlc3VsdEVycm9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDYW50T2J0YWluSW5mb0ZvckVsZW1lbnRTcGVjaWZpZWRCeVNlbGVjdG9yRXJyb3IgZXh0ZW5kcyBTZWxlY3RvckVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGNhbGxzaXRlLCBhcGlGbkFyZ3MpIHtcbiAgICAgICAgc3VwZXIoVFlQRS5jYW50T2J0YWluSW5mb0ZvckVsZW1lbnRTcGVjaWZpZWRCeVNlbGVjdG9yRXJyb3IsIGFwaUZuQXJncyk7XG5cbiAgICAgICAgdGhpcy5jYWxsc2l0ZSA9IGNhbGxzaXRlO1xuICAgIH1cbn1cblxuLy8gUGFnZSBlcnJvcnNcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBjbGFzcyBQYWdlTG9hZEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGVyck1zZykge1xuICAgICAgICBzdXBlcihUWVBFLnBhZ2VMb2FkRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuZXJyTXNnID0gZXJyTXNnO1xuICAgIH1cbn1cblxuXG4vLyBVbmNhdWdodCBlcnJvcnNcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydCBjbGFzcyBVbmNhdWdodEVycm9yT25QYWdlIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGVyclN0YWNrLCBwYWdlRGVzdFVybCkge1xuICAgICAgICBzdXBlcihUWVBFLnVuY2F1Z2h0RXJyb3JPblBhZ2UpO1xuXG4gICAgICAgIHRoaXMuZXJyU3RhY2sgICAgPSBlcnJTdGFjaztcbiAgICAgICAgdGhpcy5wYWdlRGVzdFVybCA9IHBhZ2VEZXN0VXJsO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuY2F1Z2h0RXJyb3JJblRlc3RDb2RlIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGVyciwgY2FsbHNpdGUpIHtcbiAgICAgICAgc3VwZXIoVFlQRS51bmNhdWdodEVycm9ySW5UZXN0Q29kZSk7XG5cbiAgICAgICAgdGhpcy5lcnJNc2cgICA9IFN0cmluZyhlcnIpO1xuICAgICAgICB0aGlzLmNhbGxzaXRlID0gY2FsbHNpdGU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5jYXVnaHROb25FcnJvck9iamVjdEluVGVzdENvZGUgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAob2JqKSB7XG4gICAgICAgIHN1cGVyKFRZUEUudW5jYXVnaHROb25FcnJvck9iamVjdEluVGVzdENvZGUpO1xuXG4gICAgICAgIHRoaXMub2JqVHlwZSA9IHR5cGVvZiBvYmo7XG4gICAgICAgIHRoaXMub2JqU3RyICA9IFN0cmluZyhvYmopO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuY2F1Z2h0RXJyb3JJbkNsaWVudEZ1bmN0aW9uQ29kZSBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChpbnN0YW50aWF0aW9uQ2FsbHNpdGVOYW1lLCBlcnIpIHtcbiAgICAgICAgc3VwZXIoVFlQRS51bmNhdWdodEVycm9ySW5DbGllbnRGdW5jdGlvbkNvZGUpO1xuXG4gICAgICAgIHRoaXMuZXJyTXNnICAgICAgICAgICAgICAgICAgICA9IFN0cmluZyhlcnIpO1xuICAgICAgICB0aGlzLmluc3RhbnRpYXRpb25DYWxsc2l0ZU5hbWUgPSBpbnN0YW50aWF0aW9uQ2FsbHNpdGVOYW1lO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuY2F1Z2h0RXJyb3JJbkN1c3RvbURPTVByb3BlcnR5Q29kZSBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChpbnN0YW50aWF0aW9uQ2FsbHNpdGVOYW1lLCBlcnIsIHByb3ApIHtcbiAgICAgICAgc3VwZXIoVFlQRS51bmNhdWdodEVycm9ySW5DdXN0b21ET01Qcm9wZXJ0eUNvZGUsIGVyciwgcHJvcCk7XG5cbiAgICAgICAgdGhpcy5lcnJNc2cgICAgICAgICAgICAgICAgICAgID0gU3RyaW5nKGVycik7XG4gICAgICAgIHRoaXMucHJvcGVydHkgICAgICAgICAgICAgICAgICA9IHByb3A7XG4gICAgICAgIHRoaXMuaW5zdGFudGlhdGlvbkNhbGxzaXRlTmFtZSA9IGluc3RhbnRpYXRpb25DYWxsc2l0ZU5hbWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5oYW5kbGVkUHJvbWlzZVJlamVjdGlvbkVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGVycikge1xuICAgICAgICBzdXBlcihUWVBFLnVuaGFuZGxlZFByb21pc2VSZWplY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuZXJyTXNnID0gU3RyaW5nKGVycik7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5jYXVnaHRFeGNlcHRpb25FcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChlcnIpIHtcbiAgICAgICAgc3VwZXIoVFlQRS51bmNhdWdodEV4Y2VwdGlvbik7XG5cbiAgICAgICAgdGhpcy5lcnJNc2cgPSBTdHJpbmcoZXJyKTtcbiAgICB9XG59XG5cblxuLy8gQXNzZXJ0aW9uIGVycm9yc1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0IGNsYXNzIEV4dGVybmFsQXNzZXJ0aW9uTGlicmFyeUVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGVyciwgY2FsbHNpdGUpIHtcbiAgICAgICAgc3VwZXIoVFlQRS5leHRlcm5hbEFzc2VydGlvbkxpYnJhcnlFcnJvcik7XG5cbiAgICAgICAgdGhpcy5lcnJNc2cgICA9IFN0cmluZyhlcnIpO1xuICAgICAgICB0aGlzLmNhbGxzaXRlID0gY2FsbHNpdGU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXNzZXJ0aW9uRXhlY3V0YWJsZUFyZ3VtZW50RXJyb3IgZXh0ZW5kcyBBY3Rpb25Bcmd1bWVudEVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFyZ3VtZW50TmFtZSwgYXJndW1lbnRWYWx1ZSwgZXJyTXNnKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuYXNzZXJ0aW9uRXhlY3V0YWJsZUFyZ3VtZW50RXJyb3IsIGFyZ3VtZW50TmFtZSwgYXJndW1lbnRWYWx1ZSk7XG5cbiAgICAgICAgdGhpcy5lcnJNc2cgPSBlcnJNc2c7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQXNzZXJ0aW9uV2l0aG91dE1ldGhvZENhbGxFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChjYWxsc2l0ZSkge1xuICAgICAgICBzdXBlcihUWVBFLmFzc2VydGlvbldpdGhvdXRNZXRob2RDYWxsRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuY2FsbHNpdGUgPSBjYWxsc2l0ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBc3NlcnRpb25VbmF3YWl0ZWRQcm9taXNlRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoY2FsbHNpdGUpIHtcbiAgICAgICAgc3VwZXIoVFlQRS5hc3NlcnRpb25VbmF3YWl0ZWRQcm9taXNlRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuY2FsbHNpdGUgPSBjYWxsc2l0ZTtcbiAgICB9XG59XG5cbi8vIEFjdGlvbiBwYXJhbWV0ZXJzIGVycm9yc1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3B0aW9ucyBlcnJvcnNcbmV4cG9ydCBjbGFzcyBBY3Rpb25JbnRlZ2VyT3B0aW9uRXJyb3IgZXh0ZW5kcyBBY3Rpb25PcHRpb25FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChvcHRpb25OYW1lLCBhY3R1YWxWYWx1ZSkge1xuICAgICAgICBzdXBlcihUWVBFLmFjdGlvbkludGVnZXJPcHRpb25FcnJvciwgb3B0aW9uTmFtZSwgYWN0dWFsVmFsdWUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvblBvc2l0aXZlSW50ZWdlck9wdGlvbkVycm9yIGV4dGVuZHMgQWN0aW9uT3B0aW9uRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAob3B0aW9uTmFtZSwgYWN0dWFsVmFsdWUpIHtcbiAgICAgICAgc3VwZXIoVFlQRS5hY3Rpb25Qb3NpdGl2ZUludGVnZXJPcHRpb25FcnJvciwgb3B0aW9uTmFtZSwgYWN0dWFsVmFsdWUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvbkJvb2xlYW5PcHRpb25FcnJvciBleHRlbmRzIEFjdGlvbk9wdGlvbkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKG9wdGlvbk5hbWUsIGFjdHVhbFZhbHVlKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuYWN0aW9uQm9vbGVhbk9wdGlvbkVycm9yLCBvcHRpb25OYW1lLCBhY3R1YWxWYWx1ZSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uQm9vbGVhbkFyZ3VtZW50RXJyb3IgZXh0ZW5kcyBBY3Rpb25Bcmd1bWVudEVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFyZ3VtZW50TmFtZSwgYWN0dWFsVmFsdWUpIHtcbiAgICAgICAgc3VwZXIoVFlQRS5hY3Rpb25Cb29sZWFuQXJndW1lbnRFcnJvciwgYXJndW1lbnROYW1lLCBhY3R1YWxWYWx1ZSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uU3BlZWRPcHRpb25FcnJvciBleHRlbmRzIEFjdGlvbk9wdGlvbkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKG9wdGlvbk5hbWUsIGFjdHVhbFZhbHVlKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuYWN0aW9uU3BlZWRPcHRpb25FcnJvciwgb3B0aW9uTmFtZSwgYWN0dWFsVmFsdWUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvbk9wdGlvbnNUeXBlRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoYWN0dWFsVHlwZSkge1xuICAgICAgICBzdXBlcihUWVBFLmFjdGlvbk9wdGlvbnNUeXBlRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuYWN0dWFsVHlwZSA9IGFjdHVhbFR5cGU7XG4gICAgfVxufVxuXG5cbi8vIEFyZ3VtZW50cyBlcnJvcnNcbmV4cG9ydCBjbGFzcyBBY3Rpb25TdHJpbmdBcmd1bWVudEVycm9yIGV4dGVuZHMgQWN0aW9uQXJndW1lbnRFcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuYWN0aW9uU3RyaW5nQXJndW1lbnRFcnJvciwgYXJndW1lbnROYW1lLCBhY3R1YWxWYWx1ZSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uTnVsbGFibGVTdHJpbmdBcmd1bWVudEVycm9yIGV4dGVuZHMgQWN0aW9uQXJndW1lbnRFcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuYWN0aW9uTnVsbGFibGVTdHJpbmdBcmd1bWVudEVycm9yLCBhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25JbnRlZ2VyQXJndW1lbnRFcnJvciBleHRlbmRzIEFjdGlvbkFyZ3VtZW50RXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoYXJndW1lbnROYW1lLCBhY3R1YWxWYWx1ZSkge1xuICAgICAgICBzdXBlcihUWVBFLmFjdGlvbkludGVnZXJBcmd1bWVudEVycm9yLCBhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25Sb2xlQXJndW1lbnRFcnJvciBleHRlbmRzIEFjdGlvbkFyZ3VtZW50RXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoYXJndW1lbnROYW1lLCBhY3R1YWxWYWx1ZSkge1xuICAgICAgICBzdXBlcihUWVBFLmFjdGlvblJvbGVBcmd1bWVudEVycm9yLCBhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25Qb3NpdGl2ZUludGVnZXJBcmd1bWVudEVycm9yIGV4dGVuZHMgQWN0aW9uQXJndW1lbnRFcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuYWN0aW9uUG9zaXRpdmVJbnRlZ2VyQXJndW1lbnRFcnJvciwgYXJndW1lbnROYW1lLCBhY3R1YWxWYWx1ZSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uU3RyaW5nT3JTdHJpbmdBcnJheUFyZ3VtZW50RXJyb3IgZXh0ZW5kcyBBY3Rpb25Bcmd1bWVudEVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFyZ3VtZW50TmFtZSwgYWN0dWFsVmFsdWUpIHtcbiAgICAgICAgc3VwZXIoVFlQRS5hY3Rpb25TdHJpbmdPclN0cmluZ0FycmF5QXJndW1lbnRFcnJvciwgYXJndW1lbnROYW1lLCBhY3R1YWxWYWx1ZSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uU3RyaW5nQXJyYXlFbGVtZW50RXJyb3IgZXh0ZW5kcyBBY3Rpb25Bcmd1bWVudEVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFyZ3VtZW50TmFtZSwgYWN0dWFsVmFsdWUsIGVsZW1lbnRJbmRleCkge1xuICAgICAgICBzdXBlcihUWVBFLmFjdGlvblN0cmluZ0FycmF5RWxlbWVudEVycm9yLCBhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnRJbmRleCA9IGVsZW1lbnRJbmRleDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXRUZXN0U3BlZWRBcmd1bWVudEVycm9yIGV4dGVuZHMgQWN0aW9uQXJndW1lbnRFcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChhcmd1bWVudE5hbWUsIGFjdHVhbFZhbHVlKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuc2V0VGVzdFNwZWVkQXJndW1lbnRFcnJvciwgYXJndW1lbnROYW1lLCBhY3R1YWxWYWx1ZSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uVW5zdXBwb3J0ZWREZXZpY2VUeXBlRXJyb3IgZXh0ZW5kcyBBY3Rpb25Bcmd1bWVudEVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFyZ3VtZW50TmFtZSwgYXJndW1lbnRWYWx1ZSkge1xuICAgICAgICBzdXBlcihUWVBFLmFjdGlvblVuc3VwcG9ydGVkRGV2aWNlVHlwZUVycm9yLCBhcmd1bWVudE5hbWUsIGFyZ3VtZW50VmFsdWUpO1xuICAgIH1cbn1cblxuLy8gU2VsZWN0b3IgZXJyb3JzXG5leHBvcnQgY2xhc3MgQWN0aW9uU2VsZWN0b3JFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChzZWxlY3Rvck5hbWUsIGVyck1zZykge1xuICAgICAgICBzdXBlcihUWVBFLmFjdGlvblNlbGVjdG9yRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0b3JOYW1lID0gc2VsZWN0b3JOYW1lO1xuICAgICAgICB0aGlzLmVyck1zZyAgICAgICA9IGVyck1zZztcbiAgICB9XG59XG5cbi8vIEFjdGlvbiBleGVjdXRpb24gZXJyb3JzXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnQgY2xhc3MgQWN0aW9uRWxlbWVudE5vdEZvdW5kRXJyb3IgZXh0ZW5kcyBTZWxlY3RvckVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFwaUZuQXJncykge1xuICAgICAgICBzdXBlcihUWVBFLmFjdGlvbkVsZW1lbnROb3RGb3VuZEVycm9yLCBhcGlGbkFyZ3MpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvbkVsZW1lbnRJc0ludmlzaWJsZUVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcihUWVBFLmFjdGlvbkVsZW1lbnRJc0ludmlzaWJsZUVycm9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25TZWxlY3Rvck1hdGNoZXNXcm9uZ05vZGVUeXBlRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAobm9kZURlc2NyaXB0aW9uKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuYWN0aW9uU2VsZWN0b3JNYXRjaGVzV3JvbmdOb2RlVHlwZUVycm9yKTtcblxuICAgICAgICB0aGlzLm5vZGVEZXNjcmlwdGlvbiA9IG5vZGVEZXNjcmlwdGlvbjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25BZGRpdGlvbmFsRWxlbWVudE5vdEZvdW5kRXJyb3IgZXh0ZW5kcyBTZWxlY3RvckVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFyZ3VtZW50TmFtZSwgYXBpRm5BcmdzKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuYWN0aW9uQWRkaXRpb25hbEVsZW1lbnROb3RGb3VuZEVycm9yLCBhcGlGbkFyZ3MpO1xuXG4gICAgICAgIHRoaXMuYXJndW1lbnROYW1lID0gYXJndW1lbnROYW1lO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvbkFkZGl0aW9uYWxFbGVtZW50SXNJbnZpc2libGVFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChhcmd1bWVudE5hbWUpIHtcbiAgICAgICAgc3VwZXIoVFlQRS5hY3Rpb25BZGRpdGlvbmFsRWxlbWVudElzSW52aXNpYmxlRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuYXJndW1lbnROYW1lID0gYXJndW1lbnROYW1lO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvbkFkZGl0aW9uYWxTZWxlY3Rvck1hdGNoZXNXcm9uZ05vZGVUeXBlRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoYXJndW1lbnROYW1lLCBub2RlRGVzY3JpcHRpb24pIHtcbiAgICAgICAgc3VwZXIoVFlQRS5hY3Rpb25BZGRpdGlvbmFsU2VsZWN0b3JNYXRjaGVzV3JvbmdOb2RlVHlwZUVycm9yKTtcblxuICAgICAgICB0aGlzLmFyZ3VtZW50TmFtZSAgICA9IGFyZ3VtZW50TmFtZTtcbiAgICAgICAgdGhpcy5ub2RlRGVzY3JpcHRpb24gPSBub2RlRGVzY3JpcHRpb247XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uRWxlbWVudE5vbkVkaXRhYmxlRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuYWN0aW9uRWxlbWVudE5vbkVkaXRhYmxlRXJyb3IpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvbkVsZW1lbnROb3RUZXh0QXJlYUVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcihUWVBFLmFjdGlvbkVsZW1lbnROb3RUZXh0QXJlYUVycm9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25FbGVtZW50Tm9uQ29udGVudEVkaXRhYmxlRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoYXJndW1lbnROYW1lKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuYWN0aW9uRWxlbWVudE5vbkNvbnRlbnRFZGl0YWJsZUVycm9yKTtcblxuICAgICAgICB0aGlzLmFyZ3VtZW50TmFtZSA9IGFyZ3VtZW50TmFtZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25Sb290Q29udGFpbmVyTm90Rm91bmRFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoVFlQRS5hY3Rpb25Sb290Q29udGFpbmVyTm90Rm91bmRFcnJvcik7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uSW5jb3JyZWN0S2V5c0Vycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFyZ3VtZW50TmFtZSkge1xuICAgICAgICBzdXBlcihUWVBFLmFjdGlvbkluY29ycmVjdEtleXNFcnJvcik7XG5cbiAgICAgICAgdGhpcy5hcmd1bWVudE5hbWUgPSBhcmd1bWVudE5hbWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uQ2FuTm90RmluZEZpbGVUb1VwbG9hZEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGZpbGVQYXRocykge1xuICAgICAgICBzdXBlcihUWVBFLmFjdGlvbkNhbk5vdEZpbmRGaWxlVG9VcGxvYWRFcnJvcik7XG5cbiAgICAgICAgdGhpcy5maWxlUGF0aHMgPSBmaWxlUGF0aHM7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uRWxlbWVudElzTm90RmlsZUlucHV0RXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuYWN0aW9uRWxlbWVudElzTm90RmlsZUlucHV0RXJyb3IpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvbkludmFsaWRTY3JvbGxUYXJnZXRFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChzY3JvbGxUYXJnZXRYVmFsaWQsIHNjcm9sbFRhcmdldFlWYWxpZCkge1xuICAgICAgICBzdXBlcihUWVBFLmFjdGlvbkludmFsaWRTY3JvbGxUYXJnZXRFcnJvcik7XG5cbiAgICAgICAgaWYgKCFzY3JvbGxUYXJnZXRYVmFsaWQpIHtcbiAgICAgICAgICAgIGlmICghc2Nyb2xsVGFyZ2V0WVZhbGlkKVxuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9ICdzY3JvbGxUYXJnZXRYIGFuZCBzY3JvbGxUYXJnZXRZIHByb3BlcnRpZXMnO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9ICdzY3JvbGxUYXJnZXRYIHByb3BlcnR5JztcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSAnc2Nyb2xsVGFyZ2V0WSBwcm9wZXJ0eSc7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2luZG93RGltZW5zaW9uc092ZXJmbG93RXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoY2FsbHNpdGUpIHtcbiAgICAgICAgc3VwZXIoVFlQRS53aW5kb3dEaW1lbnNpb25zT3ZlcmZsb3dFcnJvcik7XG5cbiAgICAgICAgdGhpcy5jYWxsc2l0ZSA9IGNhbGxzaXRlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEludmFsaWRFbGVtZW50U2NyZWVuc2hvdERpbWVuc2lvbnNFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHN1cGVyKFRZUEUuaW52YWxpZEVsZW1lbnRTY3JlZW5zaG90RGltZW5zaW9uc0Vycm9yKTtcblxuICAgICAgICBjb25zdCB3aWR0aElzSW52YWxpZCAgPSB3aWR0aCA8PSAwO1xuICAgICAgICBjb25zdCBoZWlnaHRJc0ludmFsaWQgPSBoZWlnaHQgPD0gMDtcblxuICAgICAgICBpZiAod2lkdGhJc0ludmFsaWQpIHtcbiAgICAgICAgICAgIGlmIChoZWlnaHRJc0ludmFsaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZlcmIgICAgICA9ICdhcmUnO1xuICAgICAgICAgICAgICAgIHRoaXMuZGltZW5zaW9ucyA9ICd3aWR0aCBhbmQgaGVpZ2h0JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudmVyYiAgICAgID0gJ2lzJztcbiAgICAgICAgICAgICAgICB0aGlzLmRpbWVuc2lvbnMgPSAnd2lkdGgnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy52ZXJiICAgICAgPSAnaXMnO1xuICAgICAgICAgICAgdGhpcy5kaW1lbnNpb25zID0gJ2hlaWdodCc7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGb3JiaWRkZW5DaGFyYWN0ZXJzSW5TY3JlZW5zaG90UGF0aEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKHNjcmVlbnNob3RQYXRoLCBmb3JiaWRkZW5DaGFyc0xpc3QpIHtcbiAgICAgICAgc3VwZXIoVFlQRS5mb3JiaWRkZW5DaGFyYWN0ZXJzSW5TY3JlZW5zaG90UGF0aEVycm9yKTtcblxuICAgICAgICB0aGlzLnNjcmVlbnNob3RQYXRoICAgICA9IHNjcmVlbnNob3RQYXRoO1xuICAgICAgICB0aGlzLmZvcmJpZGRlbkNoYXJzTGlzdCA9IGZvcmJpZGRlbkNoYXJzTGlzdDtcbiAgICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFJvbGVTd2l0Y2hJblJvbGVJbml0aWFsaXplckVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGNhbGxzaXRlKSB7XG4gICAgICAgIHN1cGVyKFRZUEUucm9sZVN3aXRjaEluUm9sZUluaXRpYWxpemVyRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuY2FsbHNpdGUgPSBjYWxsc2l0ZTtcbiAgICB9XG59XG5cblxuLy8gSWZyYW1lIGVycm9yc1xuZXhwb3J0IGNsYXNzIEFjdGlvbkVsZW1lbnROb3RJZnJhbWVFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoVFlQRS5hY3Rpb25FbGVtZW50Tm90SWZyYW1lRXJyb3IpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvbklmcmFtZUlzTm90TG9hZGVkRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuYWN0aW9uSWZyYW1lSXNOb3RMb2FkZWRFcnJvcik7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ3VycmVudElmcmFtZUlzTm90TG9hZGVkRXJyb3IgZXh0ZW5kcyBUZXN0UnVuRXJyb3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuY3VycmVudElmcmFtZUlzTm90TG9hZGVkRXJyb3IpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEN1cnJlbnRJZnJhbWVOb3RGb3VuZEVycm9yIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICBzdXBlcihUWVBFLmN1cnJlbnRJZnJhbWVOb3RGb3VuZEVycm9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDdXJyZW50SWZyYW1lSXNJbnZpc2libGVFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoVFlQRS5jdXJyZW50SWZyYW1lSXNJbnZpc2libGVFcnJvcik7XG4gICAgfVxufVxuXG4vLyBOYXRpdmUgZGlhbG9nIGVycm9yc1xuZXhwb3J0IGNsYXNzIE5hdGl2ZURpYWxvZ05vdEhhbmRsZWRFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChkaWFsb2dUeXBlLCB1cmwpIHtcbiAgICAgICAgc3VwZXIoVFlQRS5uYXRpdmVEaWFsb2dOb3RIYW5kbGVkRXJyb3IpO1xuXG4gICAgICAgIHRoaXMuZGlhbG9nVHlwZSA9IGRpYWxvZ1R5cGU7XG4gICAgICAgIHRoaXMucGFnZVVybCAgICA9IHVybDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVbmNhdWdodEVycm9ySW5OYXRpdmVEaWFsb2dIYW5kbGVyIGV4dGVuZHMgVGVzdFJ1bkVycm9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGRpYWxvZ1R5cGUsIGVyck1zZywgdXJsKSB7XG4gICAgICAgIHN1cGVyKFRZUEUudW5jYXVnaHRFcnJvckluTmF0aXZlRGlhbG9nSGFuZGxlcik7XG5cbiAgICAgICAgdGhpcy5kaWFsb2dUeXBlID0gZGlhbG9nVHlwZTtcbiAgICAgICAgdGhpcy5lcnJNc2cgICAgID0gZXJyTXNnO1xuICAgICAgICB0aGlzLnBhZ2VVcmwgICAgPSB1cmw7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0TmF0aXZlRGlhbG9nSGFuZGxlckNvZGVXcm9uZ1R5cGVFcnJvciBleHRlbmRzIFRlc3RSdW5FcnJvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yIChhY3R1YWxUeXBlKSB7XG4gICAgICAgIHN1cGVyKFRZUEUuc2V0TmF0aXZlRGlhbG9nSGFuZGxlckNvZGVXcm9uZ1R5cGVFcnJvcik7XG5cbiAgICAgICAgdGhpcy5hY3R1YWxUeXBlID0gYWN0dWFsVHlwZTtcbiAgICB9XG59XG4iXX0=
