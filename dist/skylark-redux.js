/**
 * skylark-redux - A version of redux that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-redux/
 * @license MIT
 */
!function(e,t){var r=t.define,require=t.require,n="function"==typeof r&&r.amd,o=!n&&"undefined"!=typeof exports;if(!n&&!r){var i={};r=t.define=function(e,t,r){"function"==typeof r?(i[e]={factory:r,deps:t.map(function(t){return function(e,t){if("."!==e[0])return e;var r=t.split("/"),n=e.split("/");r.pop();for(var o=0;o<n.length;o++)"."!=n[o]&&(".."==n[o]?r.pop():r.push(n[o]));return r.join("/")}(t,e)}),resolved:!1,exports:null},require(e)):i[e]={factory:null,resolved:!0,exports:r}},require=t.require=function(e){if(!i.hasOwnProperty(e))throw new Error("Module "+e+" has not been defined");var module=i[e];if(!module.resolved){var r=[];module.deps.forEach(function(e){r.push(require(e))}),module.exports=module.factory.apply(t,r)||null,module.resolved=!0}return module.exports}}if(!r)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(e,require){e("skylark-redux/utils/symbol-observable",[],function(){"use strict";return(()=>"function"==typeof Symbol&&Symbol.observable||"@@observable")()}),e("skylark-redux/utils/actionTypes",[],function(){"use strict";const e=()=>Math.random().toString(36).substring(7).split("").join("."),t={INIT:`@@redux/INIT${e()}`,REPLACE:`@@redux/REPLACE${e()}`,PROBE_UNKNOWN_ACTION:()=>`@@redux/PROBE_UNKNOWN_ACTION${e()}`};return t}),e("skylark-redux/utils/isPlainObject",[],function(){"use strict";return function(e){if("object"!=typeof e||null===e)return!1;let t=e;for(;null!==Object.getPrototypeOf(t);)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}}),e("skylark-redux/utils/kindOf",[],function(){"use strict";function e(e){if(void 0===e)return"undefined";if(null===e)return"null";const t=typeof e;switch(t){case"boolean":case"string":case"number":case"symbol":case"function":return t}if(Array.isArray(e))return"array";if(function(e){return e instanceof Date||"function"==typeof e.toDateString&&"function"==typeof e.getDate&&"function"==typeof e.setDate}(e))return"date";if(function(e){return e instanceof Error||"string"==typeof e.message&&e.constructor&&"number"==typeof e.constructor.stackTraceLimit}(e))return"error";const r=function(e){return"function"==typeof e.constructor?e.constructor.name:null}(e);switch(r){case"Symbol":case"Promise":case"WeakMap":case"WeakSet":case"Map":case"Set":return r}return t.slice(8,-1).toLowerCase().replace(/\s/g,"")}return{kindOf:function(t){let r=typeof t;"production"!==process.env.NODE_ENV&&(r=e(t));return r}}}),e("skylark-redux/createStore",["./utils/symbol-observable","./utils/actionTypes","./utils/isPlainObject","./utils/kindOf"],function(e,t,r,n){"use strict";return function o(i,s,u){if("function"==typeof s&&"function"==typeof u||"function"==typeof u&&"function"==typeof arguments[3])throw new Error("It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");if("function"==typeof s&&void 0===u&&(u=s,s=void 0),void 0!==u){if("function"!=typeof u)throw new Error(`Expected the enhancer to be a function. Instead, received: '${n.kindOf(u)}'`);return u(o)(i,s)}if("function"!=typeof i)throw new Error(`Expected the root reducer to be a function. Instead, received: '${n.kindOf(i)}'`);let c=i,a=s,d=[],f=d,l=!1;function p(){f===d&&(f=d.slice())}function y(){if(l)throw new Error("You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");return a}function h(e){if("function"!=typeof e)throw new Error(`Expected the listener to be a function. Instead, received: '${n.kindOf(e)}'`);if(l)throw new Error("You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");let t=!0;return p(),f.push(e),function(){if(!t)return;if(l)throw new Error("You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");t=!1,p();const r=f.indexOf(e);f.splice(r,1),d=null}}function b(e){if(!r(e))throw new Error(`Actions must be plain objects. Instead, the actual type was: '${n.kindOf(e)}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`);if(void 0===e.type)throw new Error('Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');if(l)throw new Error("Reducers may not dispatch actions.");try{l=!0,a=c(a,e)}finally{l=!1}const t=d=f;for(let e=0;e<t.length;e++){const r=t[e];r()}return e}return b({type:t.INIT}),{dispatch:b,subscribe:h,getState:y,replaceReducer:function(e){if("function"!=typeof e)throw new Error(`Expected the nextReducer to be a function. Instead, received: '${n.kindOf(e)}`);c=e,b({type:t.REPLACE})},[e]:function(){const t=h;return{subscribe(e){if("object"!=typeof e||null===e)throw new TypeError(`Expected the observer to be an object. Instead, received: '${n.kindOf(e)}'`);function r(){e.next&&e.next(y())}r();const o=t(r);return{unsubscribe:o}},[e](){return this}}}}}}),e("skylark-redux/utils/warning",[],function(){"use strict";return function(e){"undefined"!=typeof console&&"function"==typeof console.error&&console.error(e);try{throw new Error(e)}catch(e){}}}),e("skylark-redux/combineReducers",["./utils/actionTypes","./utils/warning","./utils/isPlainObject","./utils/kindOf"],function(e,t,r,n){"use strict";return function(o){const i=Object.keys(o),s={};for(let e=0;e<i.length;e++){const r=i[e];"production"!==process.env.NODE_ENV&&void 0===o[r]&&t(`No reducer provided for key "${r}"`),"function"==typeof o[r]&&(s[r]=o[r])}const u=Object.keys(s);let c,a;"production"!==process.env.NODE_ENV&&(c={});try{!function(t){Object.keys(t).forEach(r=>{const n=t[r],o=n(void 0,{type:e.INIT});if(void 0===o)throw new Error(`The slice reducer for key "${r}" returned undefined during initialization. `+"If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");if(void 0===n(void 0,{type:e.PROBE_UNKNOWN_ACTION()}))throw new Error(`The slice reducer for key "${r}" returned undefined when probed with a random type. `+`Don't try to handle '${e.INIT}' or other actions in "redux/*" `+"namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.")})}(s)}catch(e){a=e}return function(o={},i){if(a)throw a;if("production"!==process.env.NODE_ENV){const u=function(t,o,i,s){const u=Object.keys(o),c=i&&i.type===e.INIT?"preloadedState argument passed to createStore":"previous state received by the reducer";if(0===u.length)return"Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";if(!r(t))return`The ${c} has unexpected type of "${n.kindOf(t)}". Expected argument to be an object with the following `+`keys: "${u.join('", "')}"`;const a=Object.keys(t).filter(e=>!o.hasOwnProperty(e)&&!s[e]);if(a.forEach(e=>{s[e]=!0}),i&&i.type===e.REPLACE)return;if(a.length>0)return`Unexpected ${a.length>1?"keys":"key"} `+`"${a.join('", "')}" found in ${c}. `+"Expected to find one of the known reducer keys instead: "+`"${u.join('", "')}". Unexpected keys will be ignored.`}(o,s,i,c);u&&t(u)}let d=!1;const f={};for(let e=0;e<u.length;e++){const t=u[e],r=s[t],n=o[t],c=r(n,i);if(void 0===c){const e=i&&i.type;throw new Error(`When called with an action of type ${e?`"${String(e)}"`:"(unknown type)"}, the slice reducer for key "${t}" returned undefined. `+"To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.")}f[t]=c,d=d||c!==n}return(d=d||u.length!==Object.keys(o).length)?f:o}}}),e("skylark-redux/bindActionCreators",["./utils/kindOf"],function(e){"use strict";function t(e,t){return function(){return t(e.apply(this,arguments))}}return function(r,n){if("function"==typeof r)return t(r,n);if("object"!=typeof r||null===r)throw new Error(`bindActionCreators expected an object or a function, but instead received: '${e.kindOf(r)}'. `+'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');const o={};for(const e in r){const i=r[e];"function"==typeof i&&(o[e]=t(i,n))}return o}}),e("skylark-redux/compose",[],function(){"use strict";return function(...e){return 0===e.length?e=>e:1===e.length?e[0]:e.reduce((e,t)=>(...r)=>e(t(...r)))}}),e("skylark-redux/applyMiddleware",["./compose"],function(e){"use strict";return function(...t){return r=>(...n)=>{const o=r(...n);let i=()=>{throw new Error("Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.")};const s={getState:o.getState,dispatch:(...e)=>i(...e)},u=t.map(e=>e(s));return i=e(...u)(o.dispatch),{...o,dispatch:i}}}}),e("skylark-redux/main",["skylark-langx-ns","./createStore","./combineReducers","./bindActionCreators","./applyMiddleware","./compose","./utils/warning","./utils/actionTypes"],function(e,t,r,n,o,i,s,u){"use strict";return slylark.attach("intg.redux",{createStore:t,combineReducers:r,bindActionCreators:n,applyMiddleware:o,compose:i,__DO_NOT_USE__ActionTypes:u})}),e("skylark-redux",["skylark-redux/main"],function(e){return e})}(r),!n){var s=require("skylark-langx-ns");o?module.exports=s:t.skylarkjs=s}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-redux.js.map
