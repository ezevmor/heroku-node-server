(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('elegirPrestacionComponent', {
            bindings: {
                config: '<'
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'catalogos/agendas/agenda/horarios/horario/elegir-prestacion/elegir-prestacion.html'
        });

    Controller.$inject = ['requestFactory','$element','$timeout','modalFactory'];

    /* @ngInject */
    function Controller(requestFactory,$element,$timeout,modalFactory) {
        var vm = this;

        vm.$onInit = onInit;
        vm.focusDuration = focusDuration;
        vm.cancel = cancel;
        vm.save = save;

        function onInit(){
            vm.showSpinner = true;
            vm.showError = false;

            vm.defaultDuration = 'true';
            vm.prestaciones = null;
            vm.prestacion = null;
            getPrestaciones()
        }

        function getPrestaciones(){
            requestFactory.request('getPrestaciones')
                .then(function(response){
                    vm.prestaciones = response.content;
                    if(vm.config.prestaciones && vm.prestaciones.length === vm.config.prestaciones.length){
                        modalFactory.openInformative('Asignar prestacion','ya estan asignadas todas las prestaciones disponibles')
                    }
                })
                .catch(function(error){
                    vm.errorMessage = error.message;
                    vm.showError = true
                })
                .finally(function(){
                    vm.showSpinner = false
                })
        }

        function focusDuration(){
            var input = $element[0].querySelector('#duration');
            $timeout(function(){
                input.focus()
            })
        }

        function cancel(){
            if(vm.config && vm.config.onCancel){
                vm.config.onCancel()
            }else if(vm.config && vm.config.cancel){
                vm.config.cancel()
            }
        }

        function save(prestacionForm){
            if(prestacionForm.$valid){
                vm.disableForm = true;
                requestFactory.request('addPrestacion')
                    .then(function(response){
                        if (vm.config && vm.config.onSave) {
                            vm.config.onSave(vm.prestacion)
                        } else if (vm.config && vm.config.ok) {
                            vm.config.ok(vm.prestacion)
                        }
                    })
                    .catch(function(error){
                        throw error
                    })
                    .finally(function(){
                        vm.disableForm = false;
                    })
            }else{
                prestacionForm.$submitted = true;
            }
        }

    }
})();