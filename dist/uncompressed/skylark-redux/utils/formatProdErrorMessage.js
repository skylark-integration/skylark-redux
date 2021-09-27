define(function () {
    'use strict';
    function formatProdErrorMessage(code) {
        return `Minified Redux error #${ code }; visit https://redux.js.org/Errors?code=${ code } for the full message or ` + 'use the non-minified dev environment for full errors. ';
    }
    return formatProdErrorMessage;
});