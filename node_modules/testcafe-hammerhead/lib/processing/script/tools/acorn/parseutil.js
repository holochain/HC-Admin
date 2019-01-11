"use strict";

exports.__esModule = true;
exports.DestructuringErrors = DestructuringErrors;

var _tokentype = require("./tokentype");

var _state = require("./state");

var _whitespace = require("./whitespace");

var pp = _state.Parser.prototype;

// ## Parser utilities

var literal = /^(?:'((?:\\.|[^'])*?)'|"((?:\\.|[^"])*?)"|;)/;
pp.strictDirective = function (start) {
  for (;;) {
    _whitespace.skipWhiteSpace.lastIndex = start;
    start += _whitespace.skipWhiteSpace.exec(this.input)[0].length;
    var match = literal.exec(this.input.slice(start));
    if (!match) return false;
    if ((match[1] || match[2]) == "use strict") return false;
    start += match[0].length;
  }
};

// Predicate that tests whether the next token is of the given
// type, and if yes, consumes it as a side effect.

pp.eat = function (type) {
  if (this.type === type) {
    this.next();
    return true;
  } else {
    return false;
  }
};

// Tests whether parsed token is a contextual keyword.

pp.isContextual = function (name) {
  return this.type === _tokentype.types.name && this.value === name;
};

// Consumes contextual keyword if possible.

pp.eatContextual = function (name) {
  return this.value === name && this.eat(_tokentype.types.name);
};

// Asserts that following token is given contextual keyword.

pp.expectContextual = function (name) {
  if (!this.eatContextual(name)) this.unexpected();
};

// Test whether a semicolon can be inserted at the current position.

pp.canInsertSemicolon = function () {
  return this.type === _tokentype.types.eof || this.type === _tokentype.types.braceR || _whitespace.lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};

pp.insertSemicolon = function () {
  if (this.canInsertSemicolon()) {
    if (this.options.onInsertedSemicolon) this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
    return true;
  }
};

// Consume a semicolon, or, failing that, see if we are allowed to
// pretend that there is a semicolon at this position.

pp.semicolon = function () {
  if (!this.eat(_tokentype.types.semi) && !this.insertSemicolon()) this.unexpected();
};

pp.afterTrailingComma = function (tokType, notNext) {
  if (this.type == tokType) {
    if (this.options.onTrailingComma) this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
    if (!notNext) this.next();
    return true;
  }
};

// Expect a token of a given type. If found, consume it, otherwise,
// raise an unexpected token error.

pp.expect = function (type) {
  this.eat(type) || this.unexpected();
};

// Raise an unexpected token error.

pp.unexpected = function (pos) {
  this.raise(pos != null ? pos : this.start, "Unexpected token");
};

function DestructuringErrors() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = -1;
}

pp.checkPatternErrors = function (refDestructuringErrors, isAssign) {
  if (!refDestructuringErrors) return;
  if (refDestructuringErrors.trailingComma > -1) this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
  var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
  if (parens > -1) this.raiseRecoverable(parens, "Parenthesized pattern");
};

pp.checkExpressionErrors = function (refDestructuringErrors, andThrow) {
  var pos = refDestructuringErrors ? refDestructuringErrors.shorthandAssign : -1;
  if (!andThrow) return pos >= 0;
  if (pos > -1) this.raise(pos, "Shorthand property assignments are valid only in destructuring patterns");
};

pp.checkYieldAwaitInDefaultParams = function () {
  if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos)) this.raise(this.yieldPos, "Yield expression cannot be a default value");
  if (this.awaitPos) this.raise(this.awaitPos, "Await expression cannot be a default value");
};

pp.isSimpleAssignTarget = function (expr) {
  if (expr.type === "ParenthesizedExpression") return this.isSimpleAssignTarget(expr.expression);
  return expr.type === "Identifier" || expr.type === "MemberExpression";
};