(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('horarioComponent', {
            bindings: {
                config: '<'
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'catalogos/agendas/agenda/horarios/horario/horario.html'
        });

    Controller.$inject = ['requestFactory','modalFactory'];

    /* @ngInject */
    function Controller(requestFactory,modalFactory) {
        var vm = this;
        var modalInstance = null;

        vm.$onInit = onInit;
        vm.cancel = cancel;
        vm.create = create;
        vm.update = update;

        function onInit(){
            vm.selectedTab = 1;
            vm.createMode = vm.config.horario? false : true;
            vm.horario = vm.config.horario;
            vm.tableConfig = null;
            if(vm.horario){
                vm.calendario = stringEventsToObject(vm.horario.calendario);
                getPrestaciones()
            }
            vm.disableForm = false;
        }

        function getPrestaciones(){
            requestFactory.request('getPrestaciones')
                .then(function(response){
                    vm.prestaciones = response.content;
                    vm.tableConfig = {
                        items:[
                            {label:'Id',key:'id'},
                            {label:'Descripcion',key:'descripcion'},
                            {label:'Cod. programa',key:'codPrograma'},
                            {label:'Tipo',key:'tipo'},
                            {label:'Evento',key:'evento'},
                            {label:'Duracion',key:'duracion'}
                        ],
                        primaryKey:'id',
                        onCreate: assignPrestacion,
                        onDelete: unassignPrestacion,
                        data: vm.prestaciones
                    }
                })
                .catch(function(){

                })
                .finally(function(){

                })
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

        function create(horarioForm){
            vm.horario.calendario = ObjectEventsToString(vm.calendario);
            if(horarioForm.$valid && vm.config.validate(vm.horario,vm.config.horarios)) {
                vm.disableForm = true;
                requestFactory.request('createHorario')
                    .then(function (response) {
                        response.horaDesde = new Date(response.horaDesde);
                        response.horaHasta = new Date(response.horaHasta);
                        if (vm.config && vm.config.onSave) {
                            vm.config.onSave(response)
                        } else if (vm.config && vm.config.ok) {
                            vm.config.ok(response)
                        }
                    })
                    .catch(function (error) {
                        modalFactory.openError('Crear horario', error.message)
                    })
                    .finally(function () {
                        vm.disableForm = false;
                    })
            }else{
                horarioForm.$submitted = true;
            }
        }

        function update(horarioForm){
            if(horarioForm.$valid) {
                vm.disableForm = true;
                vm.horario.calendario = ObjectEventsToString(vm.calendario);

                requestFactory.request('updateHorario')
                    .then(function (response) {
                        if (vm.config && vm.config.onSave) {
                            vm.config.onSave(response)
                        } else if (vm.config && vm.config.ok) {
                            vm.config.ok(response)
                        }
                    })
                    .catch(function (error) {
                        modalFactory.openError('Modificar horario', error.message)
                    })
                    .finally(function () {
                        vm.disableForm = false;
                    })
            }else{
                horarioForm.$submitted = true;
            }
        }

        function assignPrestacion(dato){
            var modalData = {
                title: 'Elegir prestacion',
                component: 'elegir-prestacion-component',
                componentConfig:{
                    dato: angular.copy(dato),
                    prestaciones: vm.prestaciones
                }
            };

            modalInstance =  modalFactory.open(modalData);

            return modalInstance.result
                .then(function(response){
                    return response
                })
                .catch(function(error){
                    console.log(fallo);
                    throw error
                })
        }

        function unassignPrestacion(prestacion){
            var title = 'Borrar prestacion';
            var message = 'Seguro que quieres borrar la prestacion con id: '+prestacion.id_prestacion+'?';
            var config = {
                onConfirmData: prestacion,
                onConfirm: 'deletePrestacion',
                onCancel: null
            };
            return modalFactory.openConfirm(title,message,config).result
                .then(function(){
                    return true
                })
                .catch(function(error){
                    modalFactory.openError('Borrar prestacion',error.message);
                    throw error
                })
        }
    }
})();
