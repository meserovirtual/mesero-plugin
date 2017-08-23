(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;

    angular.module('myApp.registro', ['ngRoute', ['bower_components/mv-angular-usuarios/mv-clientes.js']])
        .controller('RegistroController', RegistroController);


    RegistroController.$inject = ['$scope'];
    function RegistroController($scope) {

        var vm = this;

    }

})();