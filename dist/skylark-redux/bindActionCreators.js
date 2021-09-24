/**
 * skylark-redux - A version of redux that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-redux/
 * @license MIT
 */
define(["./utils/kindOf"],function(t){"use strict";function n(t,n){return function(){return n(t.apply(this,arguments))}}return function(o,r){if("function"==typeof o)return n(o,r);if("object"!=typeof o||null===o)throw new Error(`bindActionCreators expected an object or a function, but instead received: '${t.kindOf(o)}'. `+'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');const i={};for(const t in o){const e=o[t];"function"==typeof e&&(i[t]=n(e,r))}return i}});
//# sourceMappingURL=sourcemaps/bindActionCreators.js.map
