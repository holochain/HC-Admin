'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _parse = require('parse5');

var _callsiteRecord = require('callsite-record');

var _templates = require('./templates');

var _templates2 = _interopRequireDefault(_templates);

var _createStackFilter = require('../create-stack-filter');

var _createStackFilter2 = _interopRequireDefault(_createStackFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const parser = new _parse.Parser();

class TestRunErrorFormattableAdapter {
    constructor(err, metaInfo) {
        this.TEMPLATES = _templates2.default;

        this.userAgent = metaInfo.userAgent;
        this.screenshotPath = metaInfo.screenshotPath;
        this.testRunPhase = metaInfo.testRunPhase;

        (0, _lodash.assignIn)(this, err);

        this.callsite = this.callsite || metaInfo.callsite;
    }

    static _getSelector(node) {
        const classAttr = (0, _lodash.find)(node.attrs, { name: 'class' });
        const cls = classAttr && classAttr.value;

        return cls ? `${node.tagName} ${cls}` : node.tagName;
    }

    static _decorateHtml(node, decorator) {
        let msg = '';

        if (node.nodeName === '#text') msg = node.value;else {
            if (node.childNodes.length) {
                msg += node.childNodes.map(childNode => TestRunErrorFormattableAdapter._decorateHtml(childNode, decorator)).join('');
            }

            if (node.nodeName !== '#document-fragment') {
                const selector = TestRunErrorFormattableAdapter._getSelector(node);

                msg = decorator[selector](msg, node.attrs);
            }
        }

        return msg;
    }

    getErrorMarkup(viewportWidth) {
        return this.TEMPLATES[this.type](this, viewportWidth);
    }

    getCallsiteMarkup() {
        if (!this.callsite) return '';

        // NOTE: for raw API callsites
        if (typeof this.callsite === 'string') return this.callsite;

        try {
            return this.callsite.renderSync({
                renderer: _callsiteRecord.renderers.html,
                stackFilter: (0, _createStackFilter2.default)(Error.stackTraceLimit)
            });
        } catch (err) {
            return '';
        }
    }

    formatMessage(decorator, viewportWidth) {
        const msgHtml = this.getErrorMarkup(viewportWidth);
        const fragment = parser.parseFragment(msgHtml);

        return TestRunErrorFormattableAdapter._decorateHtml(fragment, decorator);
    }
}
exports.default = TestRunErrorFormattableAdapter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lcnJvcnMvdGVzdC1ydW4vZm9ybWF0dGFibGUtYWRhcHRlci5qcyJdLCJuYW1lcyI6WyJwYXJzZXIiLCJQYXJzZXIiLCJUZXN0UnVuRXJyb3JGb3JtYXR0YWJsZUFkYXB0ZXIiLCJjb25zdHJ1Y3RvciIsImVyciIsIm1ldGFJbmZvIiwiVEVNUExBVEVTIiwidXNlckFnZW50Iiwic2NyZWVuc2hvdFBhdGgiLCJ0ZXN0UnVuUGhhc2UiLCJjYWxsc2l0ZSIsIl9nZXRTZWxlY3RvciIsIm5vZGUiLCJjbGFzc0F0dHIiLCJhdHRycyIsIm5hbWUiLCJjbHMiLCJ2YWx1ZSIsInRhZ05hbWUiLCJfZGVjb3JhdGVIdG1sIiwiZGVjb3JhdG9yIiwibXNnIiwibm9kZU5hbWUiLCJjaGlsZE5vZGVzIiwibGVuZ3RoIiwibWFwIiwiY2hpbGROb2RlIiwiam9pbiIsInNlbGVjdG9yIiwiZ2V0RXJyb3JNYXJrdXAiLCJ2aWV3cG9ydFdpZHRoIiwidHlwZSIsImdldENhbGxzaXRlTWFya3VwIiwicmVuZGVyU3luYyIsInJlbmRlcmVyIiwicmVuZGVyZXJzIiwiaHRtbCIsInN0YWNrRmlsdGVyIiwiRXJyb3IiLCJzdGFja1RyYWNlTGltaXQiLCJmb3JtYXRNZXNzYWdlIiwibXNnSHRtbCIsImZyYWdtZW50IiwicGFyc2VGcmFnbWVudCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLFNBQVMsSUFBSUMsYUFBSixFQUFmOztBQUVlLE1BQU1DLDhCQUFOLENBQXFDO0FBQ2hEQyxnQkFBYUMsR0FBYixFQUFrQkMsUUFBbEIsRUFBNEI7QUFDeEIsYUFBS0MsU0FBTCxHQUFpQkEsbUJBQWpCOztBQUVBLGFBQUtDLFNBQUwsR0FBc0JGLFNBQVNFLFNBQS9CO0FBQ0EsYUFBS0MsY0FBTCxHQUFzQkgsU0FBU0csY0FBL0I7QUFDQSxhQUFLQyxZQUFMLEdBQXNCSixTQUFTSSxZQUEvQjs7QUFFQSw4QkFBUyxJQUFULEVBQWVMLEdBQWY7O0FBRUEsYUFBS00sUUFBTCxHQUFnQixLQUFLQSxRQUFMLElBQWlCTCxTQUFTSyxRQUExQztBQUNIOztBQUVELFdBQU9DLFlBQVAsQ0FBcUJDLElBQXJCLEVBQTJCO0FBQ3ZCLGNBQU1DLFlBQVksa0JBQUtELEtBQUtFLEtBQVYsRUFBaUIsRUFBRUMsTUFBTSxPQUFSLEVBQWpCLENBQWxCO0FBQ0EsY0FBTUMsTUFBWUgsYUFBYUEsVUFBVUksS0FBekM7O0FBRUEsZUFBT0QsTUFBTyxHQUFFSixLQUFLTSxPQUFRLElBQUdGLEdBQUksRUFBN0IsR0FBaUNKLEtBQUtNLE9BQTdDO0FBQ0g7O0FBRUQsV0FBT0MsYUFBUCxDQUFzQlAsSUFBdEIsRUFBNEJRLFNBQTVCLEVBQXVDO0FBQ25DLFlBQUlDLE1BQU0sRUFBVjs7QUFFQSxZQUFJVCxLQUFLVSxRQUFMLEtBQWtCLE9BQXRCLEVBQ0lELE1BQU1ULEtBQUtLLEtBQVgsQ0FESixLQUVLO0FBQ0QsZ0JBQUlMLEtBQUtXLFVBQUwsQ0FBZ0JDLE1BQXBCLEVBQTRCO0FBQ3hCSCx1QkFBT1QsS0FBS1csVUFBTCxDQUNGRSxHQURFLENBQ0VDLGFBQWF4QiwrQkFBK0JpQixhQUEvQixDQUE2Q08sU0FBN0MsRUFBd0ROLFNBQXhELENBRGYsRUFFRk8sSUFGRSxDQUVHLEVBRkgsQ0FBUDtBQUdIOztBQUVELGdCQUFJZixLQUFLVSxRQUFMLEtBQWtCLG9CQUF0QixFQUE0QztBQUN4QyxzQkFBTU0sV0FBVzFCLCtCQUErQlMsWUFBL0IsQ0FBNENDLElBQTVDLENBQWpCOztBQUVBUyxzQkFBTUQsVUFBVVEsUUFBVixFQUFvQlAsR0FBcEIsRUFBeUJULEtBQUtFLEtBQTlCLENBQU47QUFDSDtBQUNKOztBQUVELGVBQU9PLEdBQVA7QUFDSDs7QUFFRFEsbUJBQWdCQyxhQUFoQixFQUErQjtBQUMzQixlQUFPLEtBQUt4QixTQUFMLENBQWUsS0FBS3lCLElBQXBCLEVBQTBCLElBQTFCLEVBQWdDRCxhQUFoQyxDQUFQO0FBQ0g7O0FBRURFLHdCQUFxQjtBQUNqQixZQUFJLENBQUMsS0FBS3RCLFFBQVYsRUFDSSxPQUFPLEVBQVA7O0FBRUo7QUFDQSxZQUFJLE9BQU8sS0FBS0EsUUFBWixLQUF5QixRQUE3QixFQUNJLE9BQU8sS0FBS0EsUUFBWjs7QUFFSixZQUFJO0FBQ0EsbUJBQU8sS0FBS0EsUUFBTCxDQUFjdUIsVUFBZCxDQUF5QjtBQUM1QkMsMEJBQWFDLDBCQUFVQyxJQURLO0FBRTVCQyw2QkFBYSxpQ0FBa0JDLE1BQU1DLGVBQXhCO0FBRmUsYUFBekIsQ0FBUDtBQUlILFNBTEQsQ0FNQSxPQUFPbkMsR0FBUCxFQUFZO0FBQ1IsbUJBQU8sRUFBUDtBQUNIO0FBQ0o7O0FBRURvQyxrQkFBZXBCLFNBQWYsRUFBMEJVLGFBQTFCLEVBQXlDO0FBQ3JDLGNBQU1XLFVBQVcsS0FBS1osY0FBTCxDQUFvQkMsYUFBcEIsQ0FBakI7QUFDQSxjQUFNWSxXQUFXMUMsT0FBTzJDLGFBQVAsQ0FBcUJGLE9BQXJCLENBQWpCOztBQUVBLGVBQU92QywrQkFBK0JpQixhQUEvQixDQUE2Q3VCLFFBQTdDLEVBQXVEdEIsU0FBdkQsQ0FBUDtBQUNIO0FBdEUrQztrQkFBL0JsQiw4QiIsImZpbGUiOiJlcnJvcnMvdGVzdC1ydW4vZm9ybWF0dGFibGUtYWRhcHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpbmQsIGFzc2lnbkluIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gJ3BhcnNlNSc7XG5pbXBvcnQgeyByZW5kZXJlcnMgfSBmcm9tICdjYWxsc2l0ZS1yZWNvcmQnO1xuaW1wb3J0IFRFTVBMQVRFUyBmcm9tICcuL3RlbXBsYXRlcyc7XG5pbXBvcnQgY3JlYXRlU3RhY2tGaWx0ZXIgZnJvbSAnLi4vY3JlYXRlLXN0YWNrLWZpbHRlcic7XG5cbmNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVzdFJ1bkVycm9yRm9ybWF0dGFibGVBZGFwdGVyIHtcbiAgICBjb25zdHJ1Y3RvciAoZXJyLCBtZXRhSW5mbykge1xuICAgICAgICB0aGlzLlRFTVBMQVRFUyA9IFRFTVBMQVRFUztcblxuICAgICAgICB0aGlzLnVzZXJBZ2VudCAgICAgID0gbWV0YUluZm8udXNlckFnZW50O1xuICAgICAgICB0aGlzLnNjcmVlbnNob3RQYXRoID0gbWV0YUluZm8uc2NyZWVuc2hvdFBhdGg7XG4gICAgICAgIHRoaXMudGVzdFJ1blBoYXNlICAgPSBtZXRhSW5mby50ZXN0UnVuUGhhc2U7XG5cbiAgICAgICAgYXNzaWduSW4odGhpcywgZXJyKTtcblxuICAgICAgICB0aGlzLmNhbGxzaXRlID0gdGhpcy5jYWxsc2l0ZSB8fCBtZXRhSW5mby5jYWxsc2l0ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgX2dldFNlbGVjdG9yIChub2RlKSB7XG4gICAgICAgIGNvbnN0IGNsYXNzQXR0ciA9IGZpbmQobm9kZS5hdHRycywgeyBuYW1lOiAnY2xhc3MnIH0pO1xuICAgICAgICBjb25zdCBjbHMgICAgICAgPSBjbGFzc0F0dHIgJiYgY2xhc3NBdHRyLnZhbHVlO1xuXG4gICAgICAgIHJldHVybiBjbHMgPyBgJHtub2RlLnRhZ05hbWV9ICR7Y2xzfWAgOiBub2RlLnRhZ05hbWU7XG4gICAgfVxuXG4gICAgc3RhdGljIF9kZWNvcmF0ZUh0bWwgKG5vZGUsIGRlY29yYXRvcikge1xuICAgICAgICBsZXQgbXNnID0gJyc7XG5cbiAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT09ICcjdGV4dCcpXG4gICAgICAgICAgICBtc2cgPSBub2RlLnZhbHVlO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChub2RlLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbXNnICs9IG5vZGUuY2hpbGROb2Rlc1xuICAgICAgICAgICAgICAgICAgICAubWFwKGNoaWxkTm9kZSA9PiBUZXN0UnVuRXJyb3JGb3JtYXR0YWJsZUFkYXB0ZXIuX2RlY29yYXRlSHRtbChjaGlsZE5vZGUsIGRlY29yYXRvcikpXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKCcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUgIT09ICcjZG9jdW1lbnQtZnJhZ21lbnQnKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBUZXN0UnVuRXJyb3JGb3JtYXR0YWJsZUFkYXB0ZXIuX2dldFNlbGVjdG9yKG5vZGUpO1xuXG4gICAgICAgICAgICAgICAgbXNnID0gZGVjb3JhdG9yW3NlbGVjdG9yXShtc2csIG5vZGUuYXR0cnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1zZztcbiAgICB9XG5cbiAgICBnZXRFcnJvck1hcmt1cCAodmlld3BvcnRXaWR0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5URU1QTEFURVNbdGhpcy50eXBlXSh0aGlzLCB2aWV3cG9ydFdpZHRoKTtcbiAgICB9XG5cbiAgICBnZXRDYWxsc2l0ZU1hcmt1cCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5jYWxsc2l0ZSlcbiAgICAgICAgICAgIHJldHVybiAnJztcblxuICAgICAgICAvLyBOT1RFOiBmb3IgcmF3IEFQSSBjYWxsc2l0ZXNcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmNhbGxzaXRlID09PSAnc3RyaW5nJylcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGxzaXRlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWxsc2l0ZS5yZW5kZXJTeW5jKHtcbiAgICAgICAgICAgICAgICByZW5kZXJlcjogICAgcmVuZGVyZXJzLmh0bWwsXG4gICAgICAgICAgICAgICAgc3RhY2tGaWx0ZXI6IGNyZWF0ZVN0YWNrRmlsdGVyKEVycm9yLnN0YWNrVHJhY2VMaW1pdClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvcm1hdE1lc3NhZ2UgKGRlY29yYXRvciwgdmlld3BvcnRXaWR0aCkge1xuICAgICAgICBjb25zdCBtc2dIdG1sICA9IHRoaXMuZ2V0RXJyb3JNYXJrdXAodmlld3BvcnRXaWR0aCk7XG4gICAgICAgIGNvbnN0IGZyYWdtZW50ID0gcGFyc2VyLnBhcnNlRnJhZ21lbnQobXNnSHRtbCk7XG5cbiAgICAgICAgcmV0dXJuIFRlc3RSdW5FcnJvckZvcm1hdHRhYmxlQWRhcHRlci5fZGVjb3JhdGVIdG1sKGZyYWdtZW50LCBkZWNvcmF0b3IpO1xuICAgIH1cbn1cbiJdfQ==
