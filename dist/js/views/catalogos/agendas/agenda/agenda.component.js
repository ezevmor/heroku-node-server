(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('agendaComponent', {
            bindings: {
                config: '<'
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'catalogos/agendas/agenda/agenda.html'
        });

    Controller.$inject = ['requestFactory','modalFactory'];

    /* @ngInject */
    function Controller(requestFactory,modalFactory) {
        var vm = this;
        var modalInstance = null;

        vm.$onInit = onInit;
        vm.create = create;
        vm.update = update;
        vm.cancel = cancel;

        vm.selectTab = selectTab;

        vm.tabs=[
          {id:1,name:"Agenda",active:true},
          {id:2,name:"Horarios",active:false}
        ];

        function onInit(){
            vm.showSpinner = true;
            vm.showError = false;

            vm.createMode = vm.config.agenda? false : true;
            vm.agenda = vm.config.agenda;
            vm.disableForm = false;
            getPlaces();
        }

        function create(agendaForm){
            if(agendaForm.$valid) {
                vm.disableForm = true;
                requestFactory.request('createAgenda')
                    .then(function (response) {
                        if (vm.config && vm.config.onSave) {
                            vm.config.onSave(response)
                        } else if (vm.config && vm.config.ok) {
                            vm.config.ok(response)
                        }
                    })
                    .catch(function (error) {
                        modalFactory.openError('Guardar agenda', error.message)
                    })
                    .finally(function () {
                        vm.disableForm = false;
                    })
            }else{
                agendaForm.$submitted = true;
            }
        }

        function update(agendaForm){
            if(agendaForm.$valid){
                vm.disableForm = true;
                requestFactory.request('updateAgenda')
                    .then(function(response){
                        if(vm.config && vm.config.onSave){
                            vm.config.onSave(response)
                        }else if(vm.config && vm.config.ok){
                            vm.config.ok(response)
                        }
                    })
                    .catch(function(errorMessage){
                        modalFactory.openError('Editar agenda',errorMessage)
                    })
                    .finally(function(){
                        vm.disableForm = false;
                    })
            }else{
                agendaForm.$submitted = true;
            }
        }

        function cancel(){
            if(vm.config && vm.config.onCancel){
                vm.config.onCancel()
            }else if(vm.config && vm.config.cancel){
                vm.config.cancel()
            }
        }

        function selectTab(tab){
            vm.selectedTab = tab
        }

        function getPlaces(){
            requestFactory.request('getPlaces')
                .then(function(response){
                    vm.places = response.content;
                    if(!vm.createMode){
                        vm.selectedTab = vm.config.initialTab? vm.config.initialTab : 1;
                    }else{
                        vm.selectedTab = 1;
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

    }
})();