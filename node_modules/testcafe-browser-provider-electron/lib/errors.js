'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n        The main window page at {{{mainWindowUrl}}} was not loaded.\n        Use the mainWindowUrl option to specify one of the following pages as the main window page:\n        \n        {{#openedUrls}}\n        {{{.}}}\n        {{/openedUrls}}\n    '], ['\n        The main window page at {{{mainWindowUrl}}} was not loaded.\n        Use the mainWindowUrl option to specify one of the following pages as the main window page:\n        \n        {{#openedUrls}}\n        {{{.}}}\n        {{/openedUrls}}\n    ']);

var _dedent = require('dedent');

var _dedent2 = _interopRequireDefault(_dedent);

var _mustache = require('mustache');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    mainUrlWasNotLoaded: (0, _dedent2.default)(_templateObject),

    invalidMenuItemArgument: 'Invalid menu item argument',

    render: function render(template, data) {
        return (0, _mustache.render)(template, data);
    }
};
module.exports = exports['default'];