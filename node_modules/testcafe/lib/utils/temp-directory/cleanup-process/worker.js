'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let removeDirectory = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (dirPath) {
        if (!DIRECTORIES_TO_CLEANUP[dirPath]) return;

        let delPromise = DIRECTORIES_TO_CLEANUP[dirPath].delPromise;

        if (!delPromise) {
            delPromise = (0, _process.killBrowserProcess)(_path2.default.basename(dirPath)).then(function () {
                return (0, _del2.default)(dirPath, { force: true });
            });

            DIRECTORIES_TO_CLEANUP[dirPath].delPromise = delPromise;
        }

        yield DIRECTORIES_TO_CLEANUP[dirPath].delPromise;

        delete DIRECTORIES_TO_CLEANUP[dirPath].delPromise;
    });

    return function removeDirectory(_x) {
        return _ref.apply(this, arguments);
    };
})();

let dispatchCommand = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (message) {
        switch (message.command) {
            case _commands2.default.init:
                return;
            case _commands2.default.add:
                addDirectory(message.path);
                return;
            case _commands2.default.remove:
                addDirectory(message.path);
                yield removeDirectory(message.path);
                return;
        }
    });

    return function dispatchCommand(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('util');

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _lodash = require('lodash');

var _process = require('../../process');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DIRECTORIES_TO_CLEANUP = {};

function addDirectory(dirPath) {
    if (!DIRECTORIES_TO_CLEANUP[dirPath]) DIRECTORIES_TO_CLEANUP[dirPath] = {};
}

process.on('message', (() => {
    var _ref3 = (0, _asyncToGenerator3.default)(function* (message) {
        let error = '';

        try {
            yield dispatchCommand(message);
        } catch (e) {
            error = (0, _util.inspect)(e);
        }

        process.send({ id: message.id, error });
    });

    return function (_x3) {
        return _ref3.apply(this, arguments);
    };
})());

process.on('disconnect', (0, _asyncToGenerator3.default)(function* () {
    const removePromises = (0, _keys2.default)(DIRECTORIES_TO_CLEANUP).map(function (dirPath) {
        return removeDirectory(dirPath).catch(_lodash.noop);
    });

    yield _pinkie2.default.all(removePromises);

    process.exit(0); //eslint-disable-line no-process-exit
}));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlscy90ZW1wLWRpcmVjdG9yeS9jbGVhbnVwLXByb2Nlc3Mvd29ya2VyLmpzIl0sIm5hbWVzIjpbImRpclBhdGgiLCJESVJFQ1RPUklFU19UT19DTEVBTlVQIiwiZGVsUHJvbWlzZSIsInBhdGgiLCJiYXNlbmFtZSIsInRoZW4iLCJmb3JjZSIsInJlbW92ZURpcmVjdG9yeSIsIm1lc3NhZ2UiLCJjb21tYW5kIiwiQ09NTUFORFMiLCJpbml0IiwiYWRkIiwiYWRkRGlyZWN0b3J5IiwicmVtb3ZlIiwiZGlzcGF0Y2hDb21tYW5kIiwicHJvY2VzcyIsIm9uIiwiZXJyb3IiLCJlIiwic2VuZCIsImlkIiwicmVtb3ZlUHJvbWlzZXMiLCJtYXAiLCJjYXRjaCIsIm5vb3AiLCJQcm9taXNlIiwiYWxsIiwiZXhpdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7K0NBZ0JBLFdBQWdDQSxPQUFoQyxFQUF5QztBQUNyQyxZQUFJLENBQUNDLHVCQUF1QkQsT0FBdkIsQ0FBTCxFQUNJOztBQUVKLFlBQUlFLGFBQWFELHVCQUF1QkQsT0FBdkIsRUFBZ0NFLFVBQWpEOztBQUVBLFlBQUksQ0FBQ0EsVUFBTCxFQUFpQjtBQUNiQSx5QkFBYSxpQ0FBbUJDLGVBQUtDLFFBQUwsQ0FBY0osT0FBZCxDQUFuQixFQUNSSyxJQURRLENBQ0g7QUFBQSx1QkFBTSxtQkFBSUwsT0FBSixFQUFhLEVBQUVNLE9BQU8sSUFBVCxFQUFiLENBQU47QUFBQSxhQURHLENBQWI7O0FBR0FMLG1DQUF1QkQsT0FBdkIsRUFBZ0NFLFVBQWhDLEdBQTZDQSxVQUE3QztBQUNIOztBQUVELGNBQU1ELHVCQUF1QkQsT0FBdkIsRUFBZ0NFLFVBQXRDOztBQUVBLGVBQU9ELHVCQUF1QkQsT0FBdkIsRUFBZ0NFLFVBQXZDO0FBQ0gsSzs7b0JBaEJjSyxlOzs7Ozs7Z0RBa0JmLFdBQWdDQyxPQUFoQyxFQUF5QztBQUNyQyxnQkFBUUEsUUFBUUMsT0FBaEI7QUFDSSxpQkFBS0MsbUJBQVNDLElBQWQ7QUFDSTtBQUNKLGlCQUFLRCxtQkFBU0UsR0FBZDtBQUNJQyw2QkFBYUwsUUFBUUwsSUFBckI7QUFDQTtBQUNKLGlCQUFLTyxtQkFBU0ksTUFBZDtBQUNJRCw2QkFBYUwsUUFBUUwsSUFBckI7QUFDQSxzQkFBTUksZ0JBQWdCQyxRQUFRTCxJQUF4QixDQUFOO0FBQ0E7QUFUUjtBQVdILEs7O29CQVpjWSxlOzs7OztBQWxDZjs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBR0EsTUFBTWQseUJBQXlCLEVBQS9COztBQUVBLFNBQVNZLFlBQVQsQ0FBdUJiLE9BQXZCLEVBQWdDO0FBQzVCLFFBQUksQ0FBQ0MsdUJBQXVCRCxPQUF2QixDQUFMLEVBQ0lDLHVCQUF1QkQsT0FBdkIsSUFBa0MsRUFBbEM7QUFDUDs7QUFrQ0RnQixRQUFRQyxFQUFSLENBQVcsU0FBWDtBQUFBLGdEQUFzQixXQUFNVCxPQUFOLEVBQWlCO0FBQ25DLFlBQUlVLFFBQVEsRUFBWjs7QUFFQSxZQUFJO0FBQ0Esa0JBQU1ILGdCQUFnQlAsT0FBaEIsQ0FBTjtBQUNILFNBRkQsQ0FHQSxPQUFPVyxDQUFQLEVBQVU7QUFDTkQsb0JBQVEsbUJBQVFDLENBQVIsQ0FBUjtBQUNIOztBQUVESCxnQkFBUUksSUFBUixDQUFhLEVBQUVDLElBQUliLFFBQVFhLEVBQWQsRUFBa0JILEtBQWxCLEVBQWI7QUFDSCxLQVhEOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWFBRixRQUFRQyxFQUFSLENBQVcsWUFBWCxrQ0FBeUIsYUFBWTtBQUNqQyxVQUFNSyxpQkFBaUIsb0JBQ2JyQixzQkFEYSxFQUVsQnNCLEdBRmtCLENBRWQ7QUFBQSxlQUFXaEIsZ0JBQWdCUCxPQUFoQixFQUF5QndCLEtBQXpCLENBQStCQyxZQUEvQixDQUFYO0FBQUEsS0FGYyxDQUF2Qjs7QUFJQSxVQUFNQyxpQkFBUUMsR0FBUixDQUFZTCxjQUFaLENBQU47O0FBRUFOLFlBQVFZLElBQVIsQ0FBYSxDQUFiLEVBUGlDLENBT2hCO0FBQ3BCLENBUkQiLCJmaWxlIjoidXRpbHMvdGVtcC1kaXJlY3RvcnkvY2xlYW51cC1wcm9jZXNzL3dvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgaW5zcGVjdCB9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IGRlbCBmcm9tICdkZWwnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAncGlua2llJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsga2lsbEJyb3dzZXJQcm9jZXNzIH0gZnJvbSAnLi4vLi4vcHJvY2Vzcyc7XG5pbXBvcnQgQ09NTUFORFMgZnJvbSAnLi9jb21tYW5kcyc7XG5cblxuY29uc3QgRElSRUNUT1JJRVNfVE9fQ0xFQU5VUCA9IHt9O1xuXG5mdW5jdGlvbiBhZGREaXJlY3RvcnkgKGRpclBhdGgpIHtcbiAgICBpZiAoIURJUkVDVE9SSUVTX1RPX0NMRUFOVVBbZGlyUGF0aF0pXG4gICAgICAgIERJUkVDVE9SSUVTX1RPX0NMRUFOVVBbZGlyUGF0aF0gPSB7fTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlRGlyZWN0b3J5IChkaXJQYXRoKSB7XG4gICAgaWYgKCFESVJFQ1RPUklFU19UT19DTEVBTlVQW2RpclBhdGhdKVxuICAgICAgICByZXR1cm47XG5cbiAgICBsZXQgZGVsUHJvbWlzZSA9IERJUkVDVE9SSUVTX1RPX0NMRUFOVVBbZGlyUGF0aF0uZGVsUHJvbWlzZTtcblxuICAgIGlmICghZGVsUHJvbWlzZSkge1xuICAgICAgICBkZWxQcm9taXNlID0ga2lsbEJyb3dzZXJQcm9jZXNzKHBhdGguYmFzZW5hbWUoZGlyUGF0aCkpXG4gICAgICAgICAgICAudGhlbigoKSA9PiBkZWwoZGlyUGF0aCwgeyBmb3JjZTogdHJ1ZSB9KSk7XG5cbiAgICAgICAgRElSRUNUT1JJRVNfVE9fQ0xFQU5VUFtkaXJQYXRoXS5kZWxQcm9taXNlID0gZGVsUHJvbWlzZTtcbiAgICB9XG5cbiAgICBhd2FpdCBESVJFQ1RPUklFU19UT19DTEVBTlVQW2RpclBhdGhdLmRlbFByb21pc2U7XG5cbiAgICBkZWxldGUgRElSRUNUT1JJRVNfVE9fQ0xFQU5VUFtkaXJQYXRoXS5kZWxQcm9taXNlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkaXNwYXRjaENvbW1hbmQgKG1lc3NhZ2UpIHtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UuY29tbWFuZCkge1xuICAgICAgICBjYXNlIENPTU1BTkRTLmluaXQ6XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNhc2UgQ09NTUFORFMuYWRkOlxuICAgICAgICAgICAgYWRkRGlyZWN0b3J5KG1lc3NhZ2UucGF0aCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNhc2UgQ09NTUFORFMucmVtb3ZlOlxuICAgICAgICAgICAgYWRkRGlyZWN0b3J5KG1lc3NhZ2UucGF0aCk7XG4gICAgICAgICAgICBhd2FpdCByZW1vdmVEaXJlY3RvcnkobWVzc2FnZS5wYXRoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICB9XG59XG5cbnByb2Nlc3Mub24oJ21lc3NhZ2UnLCBhc3luYyBtZXNzYWdlID0+IHtcbiAgICBsZXQgZXJyb3IgPSAnJztcblxuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGRpc3BhdGNoQ29tbWFuZChtZXNzYWdlKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3IgPSBpbnNwZWN0KGUpO1xuICAgIH1cblxuICAgIHByb2Nlc3Muc2VuZCh7IGlkOiBtZXNzYWdlLmlkLCBlcnJvciB9KTtcbn0pO1xuXG5wcm9jZXNzLm9uKCdkaXNjb25uZWN0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlbW92ZVByb21pc2VzID0gT2JqZWN0XG4gICAgICAgIC5rZXlzKERJUkVDVE9SSUVTX1RPX0NMRUFOVVApXG4gICAgICAgIC5tYXAoZGlyUGF0aCA9PiByZW1vdmVEaXJlY3RvcnkoZGlyUGF0aCkuY2F0Y2gobm9vcCkpO1xuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocmVtb3ZlUHJvbWlzZXMpO1xuXG4gICAgcHJvY2Vzcy5leGl0KDApOyAvL2VzbGludC1kaXNhYmxlLWxpbmUgbm8tcHJvY2Vzcy1leGl0XG59KTtcbiJdfQ==
