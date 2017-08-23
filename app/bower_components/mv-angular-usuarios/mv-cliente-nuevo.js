(function () {
    'use strict';

    angular.module('mvUsuariosNuevo', [])
        .component('mvUsuariosNuevo', mvUsuariosNuevo());

    function mvUsuariosNuevo() {
        return {
            bindings: {
                //usuario: '=',
                //visibility: '='
            },
            templateUrl: window.installPath + '/mv-angular-usuarios/mv-cliente-nuevo.html',
            controller: MvUsuariosController
        }
    }

    MvUsuariosController.$inject = ['UserService', 'MvUtils', '$location'];
    /**
     * @param AcUsuarios
     * @constructor
     */
    function MvUsuariosController(UserService, MvUtils, $location) {
        var vm = this;

        vm.usuario = {};
        vm.status = true;


        //FUNCIONES
        vm.save = save;
        vm.cancel = cancel;




        var element1 = angular.element(document.getElementById('apellido'));
        var element2 = angular.element(document.getElementById('nombre'));
        var element3 = angular.element(document.getElementById('telefono'));
        var element4 = angular.element(document.getElementById('nro_doc'));
        var element5 = angular.element(document.getElementById('fecha_nacimiento'));
        var element6 = angular.element(document.getElementById('email'));
        var element7 = angular.element(document.getElementById('direccion'));
        var element8 = angular.element(document.getElementById('dir_nro'));

        element1[0].addEventListener('focus', function () {
            element1[0].classList.remove('error-input');
            element1[0].removeEventListener('focus', removeFocus);
        });

        element2[0].addEventListener('focus', function () {
            element2[0].classList.remove('error-input');
            element2[0].removeEventListener('focus', removeFocus);
        });

        element3[0].addEventListener('focus', function () {
            element3[0].classList.remove('error-input');
            element3[0].removeEventListener('focus', removeFocus);
        });

        element4[0].addEventListener('focus', function () {
            element4[0].classList.remove('error-input');
            element4[0].removeEventListener('focus', removeFocus);
        });

        element5[0].addEventListener('focus', function () {
            element5[0].classList.remove('error-input');
            element5[0].removeEventListener('focus', removeFocus);
        });

        element6[0].addEventListener('focus', function () {
            element6[0].classList.remove('error-input');
            element6[0].removeEventListener('focus', removeFocus);
        });

        element7[0].addEventListener('focus', function () {
            element7[0].classList.remove('error-input');
            element7[0].removeEventListener('focus', removeFocus);
        });

        element8[0].addEventListener('focus', function () {
            element8[0].classList.remove('error-input');
            element8[0].removeEventListener('focus', removeFocus);
        });


        function removeFocus() { }



        function getFechaNacimiento(fechaNacimiento) {
            var dia = fechaNacimiento.substring(0,2);
            var mes = fechaNacimiento.substring(3,5);
            var anio = fechaNacimiento.substring(6,10);
            var date = new Date(anio, mes-1, dia);

            return date;
        }

        function save() {
            console.log(vm.usuario);

            if(vm.usuario.apellido === undefined || vm.usuario.apellido.length == 0) {
                element1[0].classList.add('error-input');
                MvUtils.showMessage('error', 'El apellido es obligatorio');
                return;
            }
            if(vm.usuario.nombre === undefined || vm.usuario.nombre.length == 0) {
                element2[0].classList.add('error-input');
                MvUtils.showMessage('error', 'El nombre es obligatorio');
                return;
            }
            if(vm.usuario.telefono === undefined || vm.usuario.telefono.length == 0) {
                element3[0].classList.add('error-input');
                MvUtils.showMessage('error', 'El teléfono es obligatorio');
                return;
            } else if(!MvUtils.validaTelefono(vm.usuario.telefono)) {
                element3[0].classList.add('error-input');
                MvUtils.showMessage('error', 'El formato del teléfono no es correcto');
                return;
            }
            if(vm.usuario.mail === undefined || vm.usuario.mail.length == 0) {
                element6[0].classList.add('error-input');
                MvUtils.showMessage('error', 'El mail es obligatorio');
                return;
            } else if(!MvUtils.validateEmail(vm.usuario.mail)) {
                element6[0].classList.add('error-input');
                MvUtils.showMessage('error', 'El mail no tiene un formato correcto');
                return;
            }
            if(vm.usuario.nro_doc != undefined && vm.usuario.nro_doc.length > 0) {
                if(!MvUtils.validaNumero(vm.usuario.nro_doc)){
                    element4[0].classList.add('error-input');
                    MvUtils.showMessage('error', 'Por favor ingrese solo números en DNI/CUIT');
                    return;
                } else if(vm.usuario.nro_doc.length > 8) {
                    //Si es mayor a 8 digitos que valida un cuit
                    if(!MvUtils.validaCuit(vm.usuario.nro_doc)) {
                        element4[0].classList.add('error-input');
                        MvUtils.showMessage('error', 'El CUIL/CUIT no tiene un formato correcto');
                        return;
                    } else {
                        element4[0].classList.remove('error-input');
                    }
                }
            }
            if(vm.usuario.fecha_nacimiento != undefined && vm.usuario.fecha_nacimiento.length > 0) {
                var currentDate = new Date();
                if(!MvUtils.validaFecha(vm.usuario.fecha_nacimiento)) {
                    element5[0].classList.add('error-input');
                    MvUtils.showMessage('error', 'El formato de la fecha no es correcto');
                    return;
                } else if(getFechaNacimiento(vm.usuario.fecha_nacimiento) >= currentDate) {
                    element5[0].classList.add('error-input');
                    MvUtils.showMessage('error', 'La fecha ingresada no puede ser mayor que la fecha actual');
                    return;
                } else {
                    element5[0].classList.remove('error-input');
                }
            }

            if(vm.usuario.direcciones != undefined) {
                if(vm.usuario.direcciones[0].calle.length > 100){
                    element7[0].classList.add('error-input');
                    MvUtils.showMessage('error', 'El calle no puede tener más de 100 caracteres');
                    return;
                }
                if(vm.usuario.direcciones[0].nro === undefined) {
                    element8[0].classList.add('error-input');
                    MvUtils.showMessage('error', 'El número no puede ser mayor a 99999');
                    return;
                } else if(vm.usuario.direcciones[0].nro < 0) {
                    element8[0].classList.add('error-input');
                    MvUtils.showMessage('error', 'El número no puede ser negativo');
                    return;
                }
            }

            vm.usuario.rol_id = 3;
            vm.usuario.news_letter = 1;
            vm.usuario.cta_cte = 0;
            if (vm.usuario.usuario_id == undefined) {
                vm.usuario.status = 1;
            } else {
                vm.usuario.status = vm.status ? 1 : 0;
            }
            UserService.save(vm.usuario).then(function (data) {
                //vm.detailsOpen = (data === undefined || data < 0) ? true : false;
                if(data.error) {
                    element1[0].classList.add('error-input');
                    element2[0].classList.add('error-input');
                    element3[0].classList.add('error-input');
                    element6[0].classList.add('error-input');
                    MvUtils.showMessage('error', data.message);
                }
                else {
                    vm.usuario = {};
                    element1[0].classList.remove('error-input');
                    element2[0].classList.remove('error-input');
                    element3[0].classList.remove('error-input');
                    element6[0].classList.remove('error-input');
                    MvUtils.showMessage('success', data.message);
                    $location.path('/login');
                }
            }).catch(function (error) {
                vm.usuario = {};
                console.log(error);
            });

        }


        function cancel() {
            //vm.usuario = {};
            $location.path('/login');
        }


    }


})();
