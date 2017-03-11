(function () {
  'use strict';
  var scripts = document.getElementsByTagName("script");
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular.module('myApp.productos', ['ngRoute'])
      .controller('ProductosCtrl', ProductosCtrl);


  ProductosCtrl.$inject = ['$scope', 'ProductoInsiteService'];
  function ProductosCtrl($scope, ProductoInsiteService) {

    var vm = this;
  }

})();