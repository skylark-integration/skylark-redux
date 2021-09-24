define([
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