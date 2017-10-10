(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('prestacionComponent', {
            bindings: {
                config: '<'
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'catalogos/prestaciones/prestacion/prestacion.html'
        });

    Controller.$inject = ['requestFactory','modalFactory','$q'];

    /* @ngInject */
    function Controller(requestFactory,modalFactory,$q) {
        var vm = this;

        vm.$onInit = onInit;
        vm.create = create;
        vm.update = update;
        vm.cancel = cancel;
        vm.hasEventsError = hasEventsError;

        function onInit(){
            vm.showSpinner = true;
            vm.showError = false;

            vm.programs = null;
            vm.types = null;
            vm.createMode = vm.config.prestacion? false : true;
            vm.prestacion = vm.config.prestacion;
            vm.disableForm = false;

            getSelectData();
        }

        function getSelectData(){
            var programs = getPrograms();
            var types = getTypes();
            $q.all([programs,types])
                .then(function(){
                    if(vm.prestacion){
                        vm.events = stringEventsToObject(vm.prestacion.evento);
                    }
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

        function getPrograms(){
            return requestFactory.request('getPrograms')
                .then(function(response){
                  vm.programs = response.content
                })
                .catch(function(error){
                    throw error
                })
        }

        function getTypes(){
            return requestFactory.request('getTypes')
                .then(function(response){
                    vm.types = response.content
                })
                .catch(function(error){
                    throw error
                })
        }

        function create(prestacionForm){
            if(prestacionForm.$valid && !hasEventsError(prestacionForm)) {
                vm.disableForm = true;
                vm.prestacion.evento = ObjectEventsToString(vm.events);

                requestFactory.request('createPrestacion')
                    .then(function () {
                        if (vm.config && vm.config.onSave) {
                            vm.config.onSave(vm.prestacion)
                        } else if (vm.config && vm.config.ok) {
                            vm.config.ok(vm.prestacion)
                        }
                    })
                    .catch(function (error) {
                        modalFactory.openError('Guardar prestacion', error.message)
                    })
                    .finally(function () {
                        vm.disableForm = false;
                    })
            }else{
                prestacionForm.$submitted = true;
            }
        }

        function update(prestacionForm){
            if(prestacionForm.$valid){
                vm.disableForm = true;
                vm.prestacion.evento = ObjectEventsToString(vm.events);
                requestFactory.request('updatePrestacion')
                    .then(function(){
                        if(vm.config && vm.config.onSave){
                            vm.config.onSave(vm.prestacion)
                        }else if(vm.config && vm.config.ok){
                            vm.config.ok(vm.prestacion)
                        }
                    })
                    .catch(function(errorMessage){
                        modalFactory.openError('Editar prestacion',errorMessage)
                    })
                    .finally(function(){
                        vm.disableForm = false;
                    })
            }else{
                prestacionForm.$submitted = true;
            }
        }

        function cancel(){
            if(vm.config && vm.config.onCancel){
                vm.config.onCancel()
            }else if(vm.config && vm.config.cancel){
                vm.config.cancel()
            }
        }

        function stringEventsToObject(string){
            var auxObject = {};
            var events = string.split('');
            events.forEach(function(elem,index){
                auxObject[elem] = true;
            });
            return auxObject
        }

        function ObjectEventsToString(object){
            var listAux = [];
            angular.forEach(object,function(value,key){
                if(value){
                    listAux.push(key)
                }
            });
            return listAux.join('')
        }

        function hasEventsError(prestacionForm){
            var noEvents = true;
            angular.forEach(vm.events,function(value,key){
                noEvents = false
            });
            return noEvents && prestacionForm.$submitted
        }
    }
})();