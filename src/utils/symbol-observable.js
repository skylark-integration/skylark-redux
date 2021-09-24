define(function () {
    'use strict';
    return (() => typeof Symbol === 'function' && Symbol.observable || '@@observable')();
});