(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('agendasComponent', {
            bindings: {
                config: '<'
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl:'catalogos/agendas/agendas.html'

        });

    Controller.$inject = ['modalFactory','requestFactory','userFactory'];

    /* @ngInject */
    function Controller(modalFactory,requestFactory,userFactory) {
        var vm = this;
        var modalInstance = null;

        vm.$onInit = onInit;

        function onInit(){
            vm.showSpinner = true;
            vm.showError = false;

            vm.agendas = null;
            vm.selected = null;
            vm.userData = userFactory.getUserData();
            getAgendas();
        }

        function getAgendas(){
            var requestData = {
                searchAnd: "codCentro_#IGUAL#_" + vm.userData.centro
            };
            requestFactory.request('getAgendas',requestData)
                .then(function(response){
                    vm.agendas = response.content;
                    vm.tableConfig = {
                        items:[
                            {label:'id',key:'id'},
                            {label:'Descripción',key:'descripcion'},
                            {label:'Puesto',key:'puestoAtencion.id'},
                            {label:'Festivos',key:'usaFestivos.id'},
                            {label:'Estado',key:'estado.id'}
                        ],
                        primaryKey:'id',
                        onCreate: createAgenda,
                        onEdit: editAgenda,
                        onDelete: deleteAgenda,
                        stateChange:{
                            itemKey: 'estado.id',
                            activeValue: 'A',
                            onChange: changeState
                        },
                        data: vm.agendas
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

        function createAgenda(){
            return openAgenda()
        }

        function editAgenda(agenda){
            return openAgenda(agenda)
        }

        function changeState(agenda){
            var newState = null;

            if(agenda.estado.id === 'A'){
                newState = 'B'
            }else{
                newState = 'A'
            }

            var urlConcat = '/' + agenda.id + '/' + newState;

            return requestFactory.request('changeAgendaState',{},urlConcat)
                .then(function(response){
                    agenda.estado = response.estado;
                    return true
                })
                .catch(function(error){
                    modalFactory.openError('Modificar estado',error.message);
                    throw error
                })
        }

        function deleteAgenda(agenda){
            var title = 'Borrar agenda';
            var message = 'Seguro que quieres borrar la agenda con id: '+agenda.id+'?';
            var config = {
                onConfirmData: agenda,
                onConfirm: 'deleteAgenda',
                onCancel: null
            };
            return modalFactory.openConfirm(title,message,config).result
            //es la modal la que llama al servicio de borrado para que se muestre hasta obtener alguna respuesta
            //cuando la obtiene se cierra y lanza then o catch segun sea el caso
                .then(function(){
                    return true
                })
                .catch(function(error){
                    modalFactory.openError('Borrar agenda',error.message);
                    throw error
                })
        }

        function openAgenda(agenda){
            var modalData = {
                title: agenda? 'Editar Agenda' : 'Crear Agenda',
                component: 'agenda-component',
                size:  'lg',
                componentConfig:{
                    agenda: angular.copy(agenda)
                }
            };

            modalInstance =  modalFactory.open(modalData);

            return modalInstance.result
                .then(function(response){
                    if(!agenda) {
                        openCreateSuccessModal(response);
                    };
                    return response
                })
                .catch(function(error){
                    throw error
                })
        }

        function openCreateSuccessModal(agenda){
            var title = 'Crear agenda';
            var message = 'Agenda creada con exito, quieres abrir la agenda para añadir horarios?';
            var config = {
                onConfirmData: agenda,
                onConfirm: openAgenda,
                onCancel: null,
                type: 'success'
            };
            modalFactory.openConfirm(title,message,config).result
                .then(function(){})
                .catch(function(){})
        }
    }
})();
