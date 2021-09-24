/**
 * skylark-redux - A version of redux that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-redux/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-redux/utils/symbol-observable',[],function () {
    'use strict';
    return (() => typeof Symbol === 'function' && Symbol.observable || '@@observable')();
});
define('skylark-redux/utils/actionTypes',[],function () {
    'use strict';
    const randomString = () => Math.random().toString(36).substring(7).split('').join('.');
    const ActionTypes = {
        INIT: `@@redux/INIT${ randomString() }`,
        REPLACE: `@@redux/REPLACE${ randomString() }`,
        PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${ randomString() }`
    };
    return ActionTypes;
});
define('skylark-redux/utils/isPlainObject',[],function () {
    'use strict';
    return function isPlainObject(obj) {
        if (typeof obj !== 'object' || obj === null)
            return false;
        let proto = obj;
        while (Object.getPrototypeOf(proto) !== null) {
            proto = Object.getPrototypeOf(proto);
        }
        return Object.getPrototypeOf(obj) === proto;
    };
});
define('skylark-redux/utils/kindOf',[],function () {
    'use strict';
    function miniKindOf(val) {
        if (val === void 0)
            return 'undefined';
        if (val === null)
            return 'null';
        const type = typeof val;
        switch (type) {
        case 'boolean':
        case 'string':
        case 'number':
        case 'symbol':
        case 'function': {
                return type;
            }
        default:
            break;
        }
        if (Array.isArray(val))
            return 'array';
        if (isDate(val))
            return 'date';
        if (isError(val))
            return 'error';
        const constructorName = ctorName(val);
        switch (constructorName) {
        case 'Symbol':
        case 'Promise':
        case 'WeakMap':
        case 'WeakSet':
        case 'Map':
        case 'Set':
            return constructorName;
        default:
            break;
        }
        return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
    }
    function ctorName(val) {
        return typeof val.constructor === 'function' ? val.constructor.name : null;
    }
    function isError(val) {
        return val instanceof Error || typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number';
    }
    function isDate(val) {
        if (val instanceof Date)
            return true;
        return typeof val.toDateString === 'function' && typeof val.getDate === 'function' && typeof val.setDate === 'function';
    }
    function kindOf(val) {
        let typeOfVal = typeof val;
        if (process.env.NODE_ENV !== 'production') {
            typeOfVal = miniKindOf(val);
        }
        return typeOfVal;
    }
    return { kindOf: kindOf };
});
define('skylark-redux/createStore',[
    './utils/symbol-observable',
    './utils/actionTypes',
    './utils/isPlainObject',
    './utils/kindOf'
], function ($$observable, ActionTypes, isPlainObject, a) {
    'use strict';
    return function createStore(reducer, preloadedState, enhancer) {
        if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
            throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.');
        }
        if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
            enhancer = preloadedState;
            preloadedState = undefined;
        }
        if (typeof enhancer !== 'undefined') {
            if (typeof enhancer !== 'function') {
                throw new Error(`Expected the enhancer to be a function. Instead, received: '${ a.kindOf(enhancer) }'`);
            }
            return enhancer(createStore)(reducer, preloadedState);
        }
        if (typeof reducer !== 'function') {
            throw new Error(`Expected the root reducer to be a function. Instead, received: '${ a.kindOf(reducer) }'`);
        }
        let currentReducer = reducer;
        let currentState = preloadedState;
        let currentListeners = [];
        let nextListeners = currentListeners;
        let isDispatching = false;
        function ensureCanMutateNextListeners() {
            if (nextListeners === currentListeners) {
                nextListeners = currentListeners.slice();
            }
        }
        function getState() {
            if (isDispatching) {
                throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
            }
            return currentState;
        }
        function subscribe(listener) {
            if (typeof listener !== 'function') {
                throw new Error(`Expected the listener to be a function. Instead, received: '${ a.kindOf(listener) }'`);
            }
            if (isDispatching) {
                throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api/store#subscribelistener for more details.');
            }
            let isSubscribed = true;
            ensureCanMutateNextListeners();
            nextListeners.push(listener);
            return function unsubscribe() {
                if (!isSubscribed) {
                    return;
                }
                if (isDispatching) {
                    throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api/store#subscribelistener for more details.');
                }
                isSubscribed = false;
                ensureCanMutateNextListeners();
                const index = nextListeners.indexOf(listener);
                nextListeners.splice(index, 1);
                currentListeners = null;
            };
        }
        function dispatch(action) {
            if (!isPlainObject(action)) {
                throw new Error(`Actions must be plain objects. Instead, the actual type was: '${ a.kindOf(action) }'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`);
            }
            if (typeof action.type === 'undefined') {
                throw new Error('Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
            }
            if (isDispatching) {
                throw new Error('Reducers may not dispatch actions.');
            }
            try {
                isDispatching = true;
                currentState = currentReducer(currentState, action);
            } finally {
                isDispatching = false;
            }
            const listeners = currentListeners = nextListeners;
            for (let i = 0; i < listeners.length; i++) {
                const listener = listeners[i];
                listener();
            }
            return action;
        }
        function replaceReducer(nextReducer) {
            if (typeof nextReducer !== 'function') {
                throw new Error(`Expected the nextReducer to be a function. Instead, received: '${ a.kindOf(nextReducer) }`);
            }
            currentReducer = nextReducer;
            dispatch({ type: ActionTypes.REPLACE });
        }
        function observable() {
            const outerSubscribe = subscribe;
            return {
                subscribe(observer) {
                    if (typeof observer !== 'object' || observer === null) {
                        throw new TypeError(`Expected the observer to be an object. Instead, received: '${ a.kindOf(observer) }'`);
                    }
                    function observeState() {
                        if (observer.next) {
                            observer.next(getState());
                        }
                    }
                    observeState();
                    const unsubscribe = outerSubscribe(observeState);
                    return { unsubscribe };
                },
                [$$observable]() {
                    return this;
                }
            };
        }
        dispatch({ type: ActionTypes.INIT });
        return {
            dispatch,
            subscribe,
            getState,
            replaceReducer,
            [$$observable]: observable
        };
    };
});
define('skylark-redux/utils/warning',[],function () {
    'use strict';
    return function warning(message) {
        if (typeof console !== 'undefined' && typeof console.error === 'function') {
            console.error(message);
        }
        try {
            throw new Error(message);
        } catch (e) {
        }
    };
});
define('skylark-redux/combineReducers',[
    './utils/actionTypes',
    './utils/warning',
    './utils/isPlainObject',
    './utils/kindOf'
], function (ActionTypes, warning, isPlainObject, a) {
    'use strict';
    function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
        const reducerKeys = Object.keys(reducers);
        const argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';
        if (reducerKeys.length === 0) {
            return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
        }
        if (!isPlainObject(inputState)) {
            return `The ${ argumentName } has unexpected type of "${ a.kindOf(inputState) }". Expected argument to be an object with the following ` + `keys: "${ reducerKeys.join('", "') }"`;
        }
        const unexpectedKeys = Object.keys(inputState).filter(key => !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key]);
        unexpectedKeys.forEach(key => {
            unexpectedKeyCache[key] = true;
        });
        if (action && action.type === ActionTypes.REPLACE)
            return;
        if (unexpectedKeys.length > 0) {
            return `Unexpected ${ unexpectedKeys.length > 1 ? 'keys' : 'key' } ` + `"${ unexpectedKeys.join('", "') }" found in ${ argumentName }. ` + `Expected to find one of the known reducer keys instead: ` + `"${ reducerKeys.join('", "') }". Unexpected keys will be ignored.`;
        }
    }
    function assertReducerShape(reducers) {
        Object.keys(reducers).forEach(key => {
            const reducer = reducers[key];
            const initialState = reducer(undefined, { type: ActionTypes.INIT });
            if (typeof initialState === 'undefined') {
                throw new Error(`The slice reducer for key "${ key }" returned undefined during initialization. ` + `If the state passed to the reducer is undefined, you must ` + `explicitly return the initial state. The initial state may ` + `not be undefined. If you don't want to set a value for this reducer, ` + `you can use null instead of undefined.`);
            }
            if (typeof reducer(undefined, { type: ActionTypes.PROBE_UNKNOWN_ACTION() }) === 'undefined') {
                throw new Error(`The slice reducer for key "${ key }" returned undefined when probed with a random type. ` + `Don't try to handle '${ ActionTypes.INIT }' or other actions in "redux/*" ` + `namespace. They are considered private. Instead, you must return the ` + `current state for any unknown actions, unless it is undefined, ` + `in which case you must return the initial state, regardless of the ` + `action type. The initial state may not be undefined, but can be null.`);
            }
        });
    }
    return function combineReducers(reducers) {
        const reducerKeys = Object.keys(reducers);
        const finalReducers = {};
        for (let i = 0; i < reducerKeys.length; i++) {
            const key = reducerKeys[i];
            if (process.env.NODE_ENV !== 'production') {
                if (typeof reducers[key] === 'undefined') {
                    warning(`No reducer provided for key "${ key }"`);
                }
            }
            if (typeof reducers[key] === 'function') {
                finalReducers[key] = reducers[key];
            }
        }
        const finalReducerKeys = Object.keys(finalReducers);
        let unexpectedKeyCache;
        if (process.env.NODE_ENV !== 'production') {
            unexpectedKeyCache = {};
        }
        let shapeAssertionError;
        try {
            assertReducerShape(finalReducers);
        } catch (e) {
            shapeAssertionError = e;
        }
        return function combination(state = {}, action) {
            if (shapeAssertionError) {
                throw shapeAssertionError;
            }
            if (process.env.NODE_ENV !== 'production') {
                const warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
                if (warningMessage) {
                    warning(warningMessage);
                }
            }
            let hasChanged = false;
            const nextState = {};
            for (let i = 0; i < finalReducerKeys.length; i++) {
                const key = finalReducerKeys[i];
                const reducer = finalReducers[key];
                const previousStateForKey = state[key];
                const nextStateForKey = reducer(previousStateForKey, action);
                if (typeof nextStateForKey === 'undefined') {
                    const actionType = action && action.type;
                    throw new Error(`When called with an action of type ${ actionType ? `"${ String(actionType) }"` : '(unknown type)' }, the slice reducer for key "${ key }" returned undefined. ` + `To ignore an action, you must explicitly return the previous state. ` + `If you want this reducer to hold no value, you can return null instead of undefined.`);
                }
                nextState[key] = nextStateForKey;
                hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
            }
            hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
            return hasChanged ? nextState : state;
        };
    };
});
define('skylark-redux/bindActionCreators',['./utils/kindOf'], function (a) {
    'use strict';
    function bindActionCreator(actionCreator, dispatch) {
        return function () {
            return dispatch(actionCreator.apply(this, arguments));
        };
    }
    return function bindActionCreators(actionCreators, dispatch) {
        if (typeof actionCreators === 'function') {
            return bindActionCreator(actionCreators, dispatch);
        }
        if (typeof actionCreators !== 'object' || actionCreators === null) {
            throw new Error(`bindActionCreators expected an object or a function, but instead received: '${ a.kindOf(actionCreators) }'. ` + `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`);
        }
        const boundActionCreators = {};
        for (const key in actionCreators) {
            const actionCreator = actionCreators[key];
            if (typeof actionCreator === 'function') {
                boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
            }
        }
        return boundActionCreators;
    };
});
define('skylark-redux/compose',[],function () {
    'use strict';
    return function compose(...funcs) {
        if (funcs.length === 0) {
            return arg => arg;
        }
        if (funcs.length === 1) {
            return funcs[0];
        }
        return funcs.reduce((a, b) => (...args) => a(b(...args)));
    };
});
define('skylark-redux/applyMiddleware',['./compose'], function (compose) {
    'use strict';
    return function applyMiddleware(...middlewares) {
        return createStore => (...args) => {
            const store = createStore(...args);
            let dispatch = () => {
                throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
            };
            const middlewareAPI = {
                getState: store.getState,
                dispatch: (...args) => dispatch(...args)
            };
            const chain = middlewares.map(middleware => middleware(middlewareAPI));
            dispatch = compose(...chain)(store.dispatch);
            return {
                ...store,
                dispatch
            };
        };
    };
});
define('skylark-redux/main',[
    "skylark-langx-ns",
    './createStore',
    './combineReducers',
    './bindActionCreators',
    './applyMiddleware',
    './compose',
    './utils/warning',
    './utils/actionTypes'
], function (
    skylark,
    createStore, 
    combineReducers, 
    bindActionCreators, 
    applyMiddleware, 
    compose, 
    warning, 
    __DO_NOT_USE__ActionTypes
) {
    'use strict';

    function isCrushed() {
    }
    
    return slylark.attach("intg.redux",{
        createStore,
        combineReducers,
        bindActionCreators,
        applyMiddleware,
        compose,
        __DO_NOT_USE__ActionTypes
    });
});
define('skylark-redux', ['skylark-redux/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-redux.js.map
