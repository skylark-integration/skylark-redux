/**
 * skylark-redux - A version of redux that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-redux/
 * @license MIT
 */
define(function(){"use strict";function e(e){if(void 0===e)return"undefined";if(null===e)return"null";const t=typeof e;switch(t){case"boolean":case"string":case"number":case"symbol":case"function":return t}if(Array.isArray(e))return"array";if(function(e){return e instanceof Date||"function"==typeof e.toDateString&&"function"==typeof e.getDate&&"function"==typeof e.setDate}(e))return"date";if(function(e){return e instanceof Error||"string"==typeof e.message&&e.constructor&&"number"==typeof e.constructor.stackTraceLimit}(e))return"error";const n=function(e){return"function"==typeof e.constructor?e.constructor.name:null}(e);switch(n){case"Symbol":case"Promise":case"WeakMap":case"WeakSet":case"Map":case"Set":return n}return t.slice(8,-1).toLowerCase().replace(/\s/g,"")}return{kindOf:function(t){let n=typeof t;return n=e(t)}}});
//# sourceMappingURL=../sourcemaps/utils/kindOf.js.map
