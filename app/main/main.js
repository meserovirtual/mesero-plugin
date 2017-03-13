(function () {
  'use strict';
  var scripts = document.getElementsByTagName("script");
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular.module('myApp.comandas', ['ngRoute'])
      .controller('MainController', MainController);


  MainController.$inject = ['$scope', 'ProductoInsiteService'];
  function MainController($scope, ProductoInsiteService) {

    var vm = this;
  }

})();