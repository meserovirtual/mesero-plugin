(function () {
  'use strict';
  var scripts = document.getElementsByTagName("script");
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular.module('myApp.productos', ['ngRoute'])
      .controller('ProductosCtrl', ProductosCtrl);


  ProductosCtrl.$inject = ['$scope'];
  function ProductosCtrl($scope) {

    var vm = this;

  }

})();