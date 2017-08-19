(function () {
    'use strict';

// Declare app level module which depends on views, and components
    angular.module('mesero', ['oc.lazyLoad',
        'ngRoute',
        //'ngAnimate',
        'angular-jwt',
        'auth0',
        'mvUtils',
        'mvAutocomplete',
        'mvUsuarios',
        'mvProductos',
        'mvSucursales',
        'mvProductosInsite',
        'mvComandas',
        'mvMiPedido',
        'mvContacts',
        'LangTables',
        'acHelper'
    ]).config(['$locationProvider', '$routeProvider', 'jwtOptionsProvider', function ($locationProvider, $routeProvider, jwtOptionsProvider) {

        jwtOptionsProvider.config({whiteListedDomains: ['api.ipify.org']});

        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({redirectTo: '/main'});

        /*
         $routeProvider.when('/settings/controles', {
         templateUrl: 'controles/controles.html',
         controller: 'ControlesCtrl',
         //data: {requiresLogin: false},
         resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
         loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
         // you can lazy load files for an existing module
         return $ocLazyLoad.load('controles/controles.js');
         }]
         }
         });
         */

        // $routeProvider.when('/mesa/:id', {
        //     redirectTo: '/'
        // });

        $routeProvider.when('/settings/usuarios', {
            templateUrl: 'usuarios/usuarios.html',
            controller: 'UsuariosCtrl',
            data: {requiresLogin: true},
            resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    return $ocLazyLoad.load('usuarios/usuarios.js');
                }]
            }
        });

        $routeProvider.when('/productos', {
            templateUrl: 'productos/productos.html',
            controller: 'ProductosCtrl',
            data: {requiresLogin: false},
            resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    return $ocLazyLoad.load('productos/productos.js');
                }]
            }
        });

        $routeProvider.when('/mi-pedido', {
            templateUrl: 'mi-pedido/mi-pedido.html',
            controller: 'MiPedidoCtrl',
            data: {requiresLogin: false},
            resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    return $ocLazyLoad.load('mi-pedido/mi-pedido.js');
                }]
            }
        });


        $routeProvider.when('/working', {
            templateUrl: 'working/working.html',
            controller: 'WorkingCtrl',
            data: {requiresLogin: false},
            resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    return $ocLazyLoad.load('working/working.js');
                }]
            }
        });


        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginController',
            data: {requiresLogin: false},
            resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    return $ocLazyLoad.load('login/login.js');
                }]
            }
        });

        $routeProvider.when('/main', {
            templateUrl: 'main/main.html',
            controller: 'MainController',
            data: {requiresLogin: false},
            resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    return $ocLazyLoad.load('main/main.js');
                }]
            }
        });


    }]).run(function ($rootScope) {
        // Para activar la seguridad en una vista, agregar data:{requiresLogin:false} dentro de $routeProvider.when


        $rootScope.$on('$routeChangeStart', function (e, to, a) {
            // console.log(localStorage.getItem(window.app));
        });
    })
        .controller('AppCtrl', AppCtrl)
        .factory('AppService', AppService)
        .directive('twitter', twitter)
        .directive('facebook', facebook);

    AppCtrl.$inject = ['AppService', '$location', 'ProductoInsiteService', 'ComandasService', 'UserService',
        '$rootScope', 'mvMiPedidoService', 'ContactsService'];
    function AppCtrl(AppService, $location, ProductoInsiteService, ComandasService, UserService,
                     $rootScope, mvMiPedidoService, ContactsService) {

        var vm = this;
        vm.hideLoader = true;
        vm.sub_menu_mobile_open = false;
        vm.isLogged = false;


        // $scope.onSuccess = function(data) {
        //     console.log(data);
        // };
        // $scope.onError = function(error) {
        //     console.log(error);
        // };
        // $scope.onVideoError = function(error) {
        //     console.log(error);
        // };

        // INIT
        ContactsService.facebookInit();



        $rootScope.$on('login-success', function (data) {
            vm.isLogged = true;
        });
        $rootScope.$on('login-error', function (data) {
            vm.isLogged = false;
        });


        vm.goToPagina = goToPagina;
        vm.limpiarHeader = function () {
            localStorage.removeItem(window.app);
        };

        if (UserService.getDataFromToken('usuario_id') != undefined &&
            UserService.getDataFromToken('usuario_id') != '') {
            vm.isLogged = true;
        }


        if (UserService.getDataFromToken('session_id') == undefined ||
            UserService.getDataFromToken('session_id') == '') {

            AppService.getIp().then(function (data) {
                UserService.generateSession(data.replace(/["]/g, "").replace(/\./g, '')).then(
                    function (data) {
                        console.log(data);
                        console.log(UserService.getDataFromToken());
                        ComandasService.getByMesa(UserService.getDataFromToken('mesa_id'), UserService.getDataFromToken('session_id')).then(
                            function (data) {
                                console.log(data);
                                vm.comanda = data;
                            }
                        );
                    }
                );

            });

        } else {
            ComandasService.getByMesa(UserService.getDataFromToken('mesa_id'), UserService.getDataFromToken('session_id')).then(
                function (data) {
                    console.log(data);
                    vm.comanda = data;
                }
            );
        }


        function goToPagina(page) {
            $location.path(page);
        }


        ProductoInsiteService.listen(function (data) {
            console.log(ProductoInsiteService.producto);
            ProductoInsiteService.producto.mesa_id = UserService.getDataFromToken('mesa_id');
            ProductoInsiteService.producto.origen_id = 2;
            ProductoInsiteService.producto.status = 0;
            ProductoInsiteService.producto.usuario_id = UserService.getDataFromToken('usuario_id');
            ProductoInsiteService.producto.precio = ProductoInsiteService.producto.precios[0].precio;


            console.log(ProductoInsiteService.producto);
            var comanda = {
                mesa_id: UserService.getDataFromToken('mesa_id'),
                origen_id: 1,
                usuario_id: UserService.getDataFromToken('usuario_id'),
                detalles: [ProductoInsiteService.producto]
            };

            ComandasService.save(comanda).then(function (data) {
                console.log(data);
                mvMiPedidoService.refresh();
                ComandasService.getByMesa(UserService.getDataFromToken('mesa_id'), UserService.getDataFromToken('session_id')).then(
                    function (data) {
                        console.log(data);
                        vm.comanda = data;
                    }
                );
            }).catch(function (data) {
                console.log(data);
            });
        });

    }

    AppService.$inject = ['$http'];
    function AppService($http) {
        var service = this;
        service.prodToPlato = prodToPlato;
        service.getIp = getIp;


        return service;


        function getIp() {
            return $http.get("//api.ipify.org?format=jsonp&callback=?").then(function (data) {
                return JSON.stringify(data.data.replace('?({"ip":"', '').replace('"});', ''));
            }).catch(function (data) {
                console.log(data || "Request failed");
            });
        }

        function prodToPlato(producto) {

            var detalles = [];
            var extras = [];

            var comanda = {
                usuario_id: -2,
                status: producto.status,
                mesa_id: -2,
                total: producto.total,
                origen_id: 2, // Plugin
                detalles: []
            };


            // for (var i in producto.kits){
            //     detalles.push({
            //         producto_id: producto.producto_id,
            //         status: producto.status,
            //         comentarios: producto.comentarios,
            //         cantidad: producto.cantidad,
            //         precio: producto.precios[0].precio,
            //         extras: []
            //         })
            //     for(var x in producto.kit)
            // }


            return plato;
        }
    }


    twitter.$inject = ['$timeout'];
    function twitter($timeout) {
        return {
            scope: {
                'url': '='
            },
            controller: function ($scope, $element, $attrs) {
                var vm = this;

                watchUrl();
                function watchUrl() {
                    console.log($scope.url);

                    if ($scope.url == undefined) {
                        $timeout(watchUrl, 1000);
                    } else {
                        twttr.widgets.createShareButton(
                            'http://meserovirtual.com.ar/plugin/' + $scope.url,
                            $element[0],
                            function (el) {
                            }, {
                                count: 'none',
                                text: $attrs.text
                            }
                        );
                    }
                }
            }
        }
    }

    facebook.$inject = ['$window', '$timeout'];
    function facebook($window, $timeout) {
        return {
            restrict: 'A',
            scope: {
                producto: '='
            },
            template: '<div class="fb-share-button main-button-face" style="height: 30px; width: 30px;" data-layout="button_count" data-mobile-iframe="true" ' +
            'data-href="http://meserovirtual.com.ar/plugin/{{producto}}/"></div>',
            link: function (scope, element, attrs, compile) {
                scope.$watch(function () {
                        console.log(scope.producto);
                        return !!$window.FB;
                    },
                    function (fbIsReady) {
                        if (fbIsReady) {
                            setFace();
                        }
                    });

                function setFace() {
                    if (scope.producto == undefined) {
                        $timeout(setFace, 1000)
                    } else {
                        $window.FB.XFBML.parse(element.parent()[0]);
                    }
                }

            }
        };
    }


})();
