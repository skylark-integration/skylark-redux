/**
 * skylark-redux - A version of redux that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-redux/
 * @license MIT
 */
define(["./utils/symbol-observable","./utils/actionTypes","./utils/isPlainObject","./utils/kindOf"],function(e,t,r,n){"use strict";return function o(i,s,a){if("function"==typeof s&&"function"==typeof a||"function"==typeof a&&"function"==typeof arguments[3])throw new Error("It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");if("function"==typeof s&&void 0===a&&(a=s,s=void 0),void 0!==a){if("function"!=typeof a)throw new Error(`Expected the enhancer to be a function. Instead, received: '${n.kindOf(a)}'`);return a(o)(i,s)}if("function"!=typeof i)throw new Error(`Expected the root reducer to be a function. Instead, received: '${n.kindOf(i)}'`);let u=i,c=s,d=[],f=d,l=!1;function h(){f===d&&(f=d.slice())}function p(){if(l)throw new Error("You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");return c}function w(e){if("function"!=typeof e)throw new Error(`Expected the listener to be a function. Instead, received: '${n.kindOf(e)}'`);if(l)throw new Error("You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");let t=!0;return h(),f.push(e),function(){if(!t)return;if(l)throw new Error("You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");t=!1,h();const r=f.indexOf(e);f.splice(r,1),d=null}}function y(e){if(!r(e))throw new Error(`Actions must be plain objects. Instead, the actual type was: '${n.kindOf(e)}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`);if(void 0===e.type)throw new Error('Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');if(l)throw new Error("Reducers may not dispatch actions.");try{l=!0,c=u(c,e)}finally{l=!1}const t=d=f;for(let e=0;e<t.length;e++){(0,t[e])()}return e}return y({type:t.INIT}),{dispatch:y,subscribe:w,getState:p,replaceReducer:function(e){if("function"!=typeof e)throw new Error(`Expected the nextReducer to be a function. Instead, received: '${n.kindOf(e)}`);u=e,y({type:t.REPLACE})},[e]:function(){const t=w;return{subscribe(e){if("object"!=typeof e||null===e)throw new TypeError(`Expected the observer to be an object. Instead, received: '${n.kindOf(e)}'`);function r(){e.next&&e.next(p())}return r(),{unsubscribe:t(r)}},[e](){return this}}}}}});
//# sourceMappingURL=sourcemaps/createStore.js.map