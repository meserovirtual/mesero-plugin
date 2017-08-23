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
        vm.comensales = 1;
        vm.detalles = [];
        vm.title = "Dónde vas a comer?";
        vm.enableReserva = false;
        vm.enableDelivery = false;
        vm.fecha_reserva = new Date;
        vm.hora_reserva = new Date;
        vm.usuario = {};

        //FUNCIONES
        vm.quitar = quitar;
        vm.saveReserva = saveReserva;
        vm.saveDelivery = saveDelivery;
        vm.showReserva = showReserva;
        vm.showDelivery = showDelivery;
        vm.limpiarVariables = limpiarVariables;


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

        //console.log(UserService.getFromToken().data);

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


        function showReserva() {
            vm.title = "Reserva";

            vm.enableReserva = true;
            vm.enableDelivery = false;
        }


        function showDelivery() {
            vm.title = "Delivery";

            vm.enableReserva = false;
            vm.enableDelivery = true;

            UserService.get('0,1,2,3').then(function(user){
                console.log(vm.comanda[0]);
                //var encontrado = false;
                var usuarios = Object.getOwnPropertyNames(user);
                usuarios.forEach(function (item, index, array) {
                    //console.log(user[item]);
                    //if(user[item].usuario_id == vm.comanda[0].usuario_id) {
                    if(user[item].usuario_id == UserService.getFromToken().data.id) {
                        vm.usuario = user[item];
                        console.log(vm.usuario);
                        //encontrado = true;
                    }
                });
            }).catch(function(error){
                console.log(error);
            });

            console.log(vm.usuario);
        }

        function limpiarVariables() {
            vm.comensales = 1;
            vm.title = "Dónde vas a comer?";
            vm.enableReserva = false;
            vm.enableDelivery = false;
            vm.fecha_reserva = new Date;
            vm.hora_reserva = new Date;
        }

        function saveReserva() {
            if(vm.comensales <= 0) {
                MvUtils.showMessage('error', 'Los comensales no pueden ser menor a 0');
                return;
            }
            console.log(vm.fecha_reserva);
            console.log(vm.hora_reserva);
            var reserva_fecha = new Date(vm.fecha_reserva.getFullYear(), vm.fecha_reserva.getMonth(), vm.fecha_reserva.getDate(), vm.hora_reserva.getHours(), vm.hora_reserva.getMinutes());

            console.log(reserva_fecha);
            var reserva = {
                comanda_id: vm.comanda[0].comanda_id,
                sucursal_id: 1,
                comensales: vm.comensales,
                fecha: reserva_fecha,
                pagado: 0   //'0-No Pagada, 1-Pagada'
            };
            ComandasService.createReserva(reserva).then(function(data){
                //console.log(data);
                limpiarVariables();
                MvUtils.showMessage('success', 'Su reserva ya fue guardado. Lo esperamos');
            }).catch(function(error){
                console.log(error);
            });
        }


        function saveDelivery() {
            console.log(vm.usuario);
            if(vm.usuario == {}) {
                MvUtils.showMessage('error', 'Cliente no encontrado');
            } else {
                vm.detalles = vm.comanda[0].detalles;
                //Creo el envio
                EnviosService.save(createEnvio(vm.usuario)).then(function (data) {
                    //console.log(data);
                    limpiarVariables();
                    MvUtils.showMessage('success', 'Su delivery ya fue guardado. Espere su pedido');
                }).catch(function (data) {
                    console.log(data);
                });
            }
            /*
            //rol_id = 3 clientes
            UserService.get('0,1,2,3').then(function(user){
                //console.log(vm.comanda[0]);
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
                //console.log(usuario);
                if(encontrado) {
                    vm.detalles = vm.comanda[0].detalles;
                    //Creo el envio
                    EnviosService.save(createEnvio(usuario)).then(function (data) {
                        //console.log(data);
                        limpiarVariables();
                        MvUtils.showMessage('success', 'Su delivery ya fue guardado. Espere su pedido');
                    }).catch(function (data) {
                        console.log(data);
                    });
                }
                //EnviosService
            }).catch(function(error){
                console.log(error);
            });
            */
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
