(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('prestacionesComponent', {
            bindings: {

            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'catalogos/prestaciones/prestaciones.html'
        });

    Controller.$inject = ['modalFactory','requestFactory'];

    /* @ngInject */
    function Controller(modalFactory,requestFactory){
        var vm = this;
        var modalInstance = null;

        vm.$onInit = onInit;

        function onInit(){
            vm.showSpinner = true;
            vm.showError = false;

            vm.prestaciones = null;
            vm.selected = null;
            getPrestaciones();
        }

        function getPrestaciones(){
            requestFactory.request('getPrestaciones')
                .then(function(response){
                    vm.prestaciones = response.content;
                    vm.tableConfig = {
                        items:[
                            {label:'id',key:'id'},
                            {label:'Cod. Centro',key:'codCentro'},
                            {label:'descripcion',key:'descripcion'},
                            {label:'Cod. Programa',key:'codPrograma'},
                            {label:'Tipo',key:'tipo'},
                            {label:'Evento',key:'evento'},
                            {label:'Duracion',key:'duracion'},
                            {label:'Estado',key:'estado.id'}
                        ],
                        primaryKey:'id',
                        onCreate: createPrestacion,
                        onEdit: editPrestacion,
                        onDelete: deletePrestacion,
                        stateChange:{
                            itemKey: 'estado.id',
                            activeValue: 'A',
                            onChange: changeState
                        },
                        data: vm.prestaciones
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

        function createPrestacion(){
            return openPrestacionModal()
        }

        function editPrestacion(prestacion){
            return openPrestacionModal(prestacion)
        }

        function changeState(prestacion){
            return requestFactory.request('updatePrestacion')
                .then(function(response){
                    if(prestacion.estado.id === 'A'){
                        prestacion.estado.id = 'B'
                    }else{
                        prestacion.estado.id = 'A'
                    }
                    return true
                })
                .catch(function(error){
                    modalFactory.openError('Modificar estado',error.message);
                    throw error
                })
        }

        function openPrestacionModal(prestacion){
            var modalData = {
                title: prestacion? 'Editar prestación' : 'Crear prestación',
                component: 'prestacion-component',
                componentConfig:{
                    prestacion: angular.copy(prestacion)
                }
            };

            modalInstance =  modalFactory.open(modalData);

            return modalInstance.result
                .then(function(prestacion){
                    for(var i=0; i<vm.prestaciones.length; i++){
                        if(vm.prestaciones[i].id_prestacion === prestacion.id_prestacion){
                            vm.prestaciones[i] = prestacion;
                            return
                        }
                    }
                    vm.prestaciones.unshift(prestacion);
                })
                .catch(function(error){
                    throw error
                })
        }

        function deletePrestacion(prestacion){
            var title = 'Borrar prestacion';
            var message = 'Seguro que quieres borrar la prestacion con id: '+prestacion.id+'?';
            var config = {
                onConfirmData: prestacion,
                onConfirm: 'deletePrestacion',
                onCancel: null
            };
            return modalFactory.openConfirm(title,message,config).result
            //es la modal la que llama al servicio de borrado para que se muestre hasta obtener alguna respuesta
            //cuando la obtiene se cierra y lanza then o catch segun sea el caso
                .then(function(){
                    for(var i=0; i<vm.prestaciones.length; i++){
                        if(vm.prestaciones[i].id === prestacion.id){
                            vm.prestaciones.splice(i,1);
                        }
                    }
                })
                .catch(function(error){
                    modalFactory.openError('Borrar prestacion',error.message)
                })
        }

    }
})();
