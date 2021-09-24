/**
 * skylark-redux - A version of redux that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-redux/
 * @license MIT
 */
define(["./compose"],function(t){"use strict";return function(...e){return i=>(...n)=>{const r=i(...n);let o=()=>{throw new Error("Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.")};const c={getState:r.getState,dispatch:(...t)=>o(...t)},s=e.map(t=>t(c));return o=t(...s)(r.dispatch),{...r,dispatch:o}}}});
//# sourceMappingURL=sourcemaps/applyMiddleware.js.map
