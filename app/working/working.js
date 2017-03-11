(function () {
    'use strict';

    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;

    angular.module('myApp.Working', ['ngRoute'])
        .controller('WorkingCtrl', WorkingCtrl);


    WorkingCtrl.$inject = ['$scope'];
    function WorkingCtrl($scope) {

        var vm = this;

    }

})();