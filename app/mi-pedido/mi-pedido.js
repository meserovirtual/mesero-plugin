(function () {
  'use strict';
  var scripts = document.getElementsByTagName("script");
  var currentScriptPath = scripts[scripts.length - 1].src;

  angular.module('myApp.comandas', ['ngRoute'])
      .controller('MiPedidoCtrl', MiPedidoCtrl);


  MiPedidoCtrl.$inject = ['$scope', 'ProductoInsiteService'];
  function MiPedidoCtrl($scope, ProductoInsiteService) {

    var vm = this;
  }

})();