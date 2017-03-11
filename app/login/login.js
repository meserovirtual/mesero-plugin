(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;

    angular.module('myApp.login', ['ngRoute', ['bower_components/mv-angular-usuarios/mv-clientes.js']])
        .controller('LoginController', LoginController);


    LoginController.$inject = ['$scope'];
    function LoginController($scope) {

        var vm = this;

    }

})();