(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('puestoComponent', {
            bindings: {
                config: '<'
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'catalogos/puestos/puesto/puesto.html'

        });

    Controller.$inject = ['requestFactory','modalFactory'];

    /* @ngInject */
    function Controller(requestFactory,modalFactory) {
        var vm = this;

        vm.$onInit = onInit;
        vm.cancel = cancel;
        vm.save = save;

        function onInit(){
            vm.showSpinner = true;
            vm.showError = false;
            vm.disableForm = false;

            vm.place = vm.config.place;
            getPlaceTypes();
        }

        function getPlaceTypes(){
            requestFactory.request('getPlaceTypes')
                .then(function(response){
                    vm.types = response.list;
                })
                .catch(function(error){
                    vm.errorMessage = error.message;
                    vm.showError = true;
                    if(vm.config && vm.config.failLoadComponent){
                        vm.config.failLoadComponent()
                    }
                })
                .finally(function(){
                    vm.showSpinner = false
                })
        }

        function save(placeForm){
            if(placeForm.$valid){
                vm.disableForm = true;
                var requestName = vm.config.place? 'updatePlace' : 'createPlace';
                var errorModalTitle = vm.config.place? 'Editar puesto' : 'Crear puesto';
                var requestData = vm.place;

                requestFactory.request(requestName,requestData)
                    .then(function(){
                        if(vm.config && vm.config.onSave){
                            vm.config.onSave(vm.place)
                        }else if(vm.config && vm.config.ok){
                            vm.config.ok(vm.place)
                        }
                    })
                    .catch(function(error){
                        modalFactory.openError(errorModalTitle,error.message);
                    })
                    .finally(function(){
                        vm.disableForm = false
                    })
            }else{
                placeForm.$submitted = true;
            }
        }

        function cancel(){
            if(vm.config && vm.config.onCancel){
                vm.config.onCancel()
            }else if(vm.config && vm.config.cancel){
                vm.config.cancel()
            }
        }
    }
})();
