(function () {
    'use strict';

    angular.module('acHelper', ['ngRoute'])
        .factory('HelperService', HelperService);


    HelperService.$inject = ['$http', '$q', 'UserService'];
    function HelperService($http, $q, UserService) {
        var service = {};
        var url = './helper/includes/ac-helper.php';


        service.create = create;

        return service;


        /**
         * @description: Crea un sucursal.
         * @param sucursal
         * @param callback
         * @returns {*}
         */
        function create(data) {

            data.usuario_id = UserService.getFromToken().data.id;
            data.mail = UserService.getFromToken().data.mail;

            return $http.post(url,
                {
                    'function': 'create',
                    'data': JSON.stringify(data)
                })
                .then(function (data) {
                    console.log(data);
                })
                .catch(function (data) {
                    console.log(data);
                    console.log('error');
                });
        }



    }



})();