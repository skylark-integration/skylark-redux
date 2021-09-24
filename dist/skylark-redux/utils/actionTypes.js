/**
 * skylark-redux - A version of redux that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-redux/
 * @license MIT
 */
define(function(){"use strict";const t=()=>Math.random().toString(36).substring(7).split("").join(".");return{INIT:`@@redux/INIT${t()}`,REPLACE:`@@redux/REPLACE${t()}`,PROBE_UNKNOWN_ACTION:()=>`@@redux/PROBE_UNKNOWN_ACTION${t()}`}});
//# sourceMappingURL=../sourcemaps/utils/actionTypes.js.map
