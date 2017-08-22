(function () {
    'use strict';

    angular.module('mvMiPedido', [])
        .component('mvMiPedido', mvMiPedido())
        .service('mvMiPedidoService', mvMiPedidoService)
        .service('ComandaService', ComandaService);

    function mvMiPedido() {
        return {
            bindings: {
                searchFunction: '&'
            },
            templateUrl: window.installPath + '/mv-angular-comandas/mv-mi-pedido.html',
            controller: MvMiPedidoController
        }
    }

    MvMiPedidoController.$inject = ['ComandasService', 'UserService', '$rootScope', 'ComandaService', 'MvUtils', 'EnviosService'];
    /**
     * @param MvMiPedido
     * @constructor
     */
    function MvMiPedidoController(ComandasService, UserService, $rootScope, ComandaService, MvUtils, EnviosService) {
        var vm = this;

        vm.comandas = [];
        vm.comanda = {};
        vm.comensales = 0;
        vm.detalles = [];

        //FUNCIONES
        vm.quitar = quitar;
        vm.saveReserva = saveReserva;
        vm.saveDelivery = saveDelivery;


        $rootScope.$on('miPedidoRefresh', function(){
            ComandasService.getByMesa(UserService.getDataFromToken('mesa_id'), UserService.getDataFromToken('session_id')).then(
                function (data) {
                    //console.log(data);
                    vm.comanda = data;
                }
            );
        });

        ComandasService.getByMesa(UserService.getDataFromToken('mesa_id'), UserService.getDataFromToken('session_id')).then(
            function (data) {
                //console.log(data);
                vm.comanda = data;
            }
        );


        /*
        function quitar(comanda_detalle_id) {
            ComandasService.quitar(comanda_detalle_id).then(function (data) {
                ComandasService.getByMesa(UserService.getDataFromToken('mesa_id'), UserService.getDataFromToken('session_id')).then(
                    function (data) {
                        console.log(data);
                        vm.comanda = data;
                    }
                );
            })
        }
        */

        function quitar(item) {
            //console.log(item);
            //console.log(vm.comanda[0]);
            var total = vm.comanda[0].total - (item.cantidad * item.precio);

            var comanda = {
                comanda_id: vm.comanda[0].comanda_id,
                usuario_id: UserService.getFromToken().data.id,
                status: vm.comanda[0].status,
                mesa_id: UserService.getDataFromToken('mesa_id'),
                total: total,
                origen_id: 1
            };

            //console.log(comanda);

            ComandasService.quitar(item.comanda_detalle_id).then(function (data) {
                ComandasService.updateComanda2(comanda).then(function(data){
                    //console.log(data);
                    vm.comanda[0].total = total;
                    ComandasService.getByMesa(UserService.getDataFromToken('mesa_id'), UserService.getDataFromToken('session_id')).then(
                        function (data) {
                            //console.log(data);
                            vm.comanda = data;
                            vm.comanda[0].usuario_id = comanda.usuario_id;
                            ComandaService.comanda = comanda;
                            ComandaService.broadcast();
                        }
                    );
                }).catch(function(error){
                    console.log(error);
                });
            }).catch(function(error){
               console.log(error);
            });
        }

        function saveReserva() {
            if(vm.comensales <= 0) {
                MvUtils.showMessage('error', 'Los comensales no pueden ser menor a 0');
                return;
            }
            var reserva = {
                comanda_id: vm.comanda[0].comanda_id,
                sucursal_id: 1,
                comensales: vm.comensales,
                //fecha:
                pagado: 0   //'0-No Pagada, 1-Pagada'
            };
            ComandasService.createReserva(reserva).then(function(data){
                console.log(data);
            }).catch(function(error){
                console.log(error);
            });
        }


        function saveDelivery() {
            //rol_id = 3 clientes
            UserService.get('0,1,2,3').then(function(user){
                console.log(vm.comanda[0]);
                var encontrado = false;
                var usuario = {};
                var usuarios = Object.getOwnPropertyNames(user);
                usuarios.forEach(function (item, index, array) {
                    //console.log(user[item]);
                    if(user[item].usuario_id == vm.comanda[0].usuario_id) {
                        usuario = user[item];
                        encontrado = true;
                    }
                });
                console.log(usuario);
                if(encontrado) {
                    vm.detalles = vm.comanda[0].detalles;
                    //Creo el envio
                    EnviosService.save(createEnvio(usuario)).then(function (data) {
                        console.log(data);
                        console.log('Envio creado');
                    }).catch(function (data) {
                        console.log(data);
                    });
                }
                //EnviosService
            }).catch(function(error){
                console.log(error);
            });
        }

        function createEnvio(usuario) {
            var envio = {
                fecha_entrega: new Date(),
                usuario_id: UserService.getFromToken().data.id,
                cliente_id: usuario.usuario_id,
                total: vm.comanda[0].total,
                //calle: usuario.direcciones[0].calle,
                //nro: usuario.direcciones[0].nro,
                calle: '',
                nro: '',
                cp: '',
                forma_pago: '01',
                status: 0,
                descuento: 0,
                detalles: []
            };
            envio.detalles = createEnvioDetalle();

            console.log(envio);

            return envio;
        }

        function createEnvioDetalle() {
            var envios = [];

            console.log(vm.detalles);
            var detalles = Object.getOwnPropertyNames(vm.detalles);
            detalles.forEach(function (item, index, array) {
                console.log(vm.detalles[item]);
                var detalle = {};
                detalle.envio_id = 0;
                detalle.producto_id = vm.detalles[item].producto_id;
                detalle.cantidad = vm.detalles[item].cantidad;
                detalle.precio = vm.detalles[item].precio;

                envios.push(detalle);
            });

            return envios;
        }
    }

    mvMiPedidoService.$inject = ['$rootScope'];

    function mvMiPedidoService($rootScope) {
        var service = this;
        service.refresh = refresh;

        return service;

        function refresh(){
            $rootScope.$broadcast('miPedidoRefresh')
        }
    }


    ComandaService.$inject = ['$rootScope'];
    function ComandaService($rootScope){
        this.broadcast = function () {
            $rootScope.$broadcast("ComandaService")
        };
        this.listen = function (callback) {
            $rootScope.$on("ComandaService", callback)
        };

        this.comanda = {};
    }

})();
