(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('puestosComponent', {
            bindings: {

            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'catalogos/puestos/puestos.html'

        });

    Controller.$inject = ['requestFactory','modalFactory'];

    /* @ngInject */
    function Controller(requestFactory,modalFactory) {
        var vm = this;

        vm.$onInit = onInit;

        function onInit(){
            vm.showSpinner = true;
            vm.showError = false;
            vm.selected = null;
            vm.places = null;
            getPlaces();
        }

        function getPlaces(){
            var requestData = {};
            vm.showSpinner = true;

            requestFactory.request('getPlaces',requestData)
                .then(function(response){
                    vm.places = response.content;
                    vm.tableConfig = {
                        items:[
                            {label:'id',key:'id'},
                            {label:'Cod. Centro',key:'codCentro'},
                            {label:'Descripcion',key:'descripcion'},
                            {label:'Estado',key:'estado.id'}
                        ],
                        primaryKey:'id',
                        onCreate: createPlace,
                        onEdit: editPlace,
                        onDelete: deletePlace,
                        stateChange:{
                            itemKey: 'estado.id',
                            activeValue: 'A',
                            onChange: changeState
                        },
                        data: vm.places
                    }

                })
                .catch(function(error){
                    vm.showError = true;
                    vm.errorMessage = error.message
                })
                .finally(function(){
                    vm.showSpinner = false
                })
        }

        function createPlace(){
            return openPlace()
        }

        function editPlace(place){
            return openPlace(place)
        }

        function deletePlace(place){
            var title = 'Borrar puesto';
            var message = 'Seguro que quieres borrar el puesto con id: '+place.id+'?';
            var config = {
                onConfirmData: place,
                onConfirm: 'deletePlace',
                onCancel: null
            };
            return modalFactory.openConfirm(title,message,config).result
            //es la modal la que llama al servicio de borrado para que se muestre hasta obtener alguna respuesta
            //cuando la obtiene se cierra y lanza then o catch segun sea el caso
                .then(function(){
                    /*for(var i=0; i<vm.places.length; i++){
                        if(vm.places[i].id === vm.selected.id){
                            vm.places.splice(i,1);
                        }
                    }*/
                    // onInit()
                    return true
                })
                .catch(function(error){
                    modalFactory.openError('Borrar puesto',error.message);
                    throw error
                })
        }

        function changeState(place){
            return requestFactory.request('updatePlace')
                .then(function(response){
                    if(place.estado.id === 'A'){
                        place.estado.id = 'B'
                    }else{
                        place.estado.id = 'A'
                    }
                    return true
                })
                .catch(function(error){
                    modalFactory.openError('Modificar estado',error.message);
                    throw error
                })
        }

        function openPlace(place){
            var modalData = {
                title: place? 'Editar Puesto' : 'Crear Puesto',
                component: 'puesto-component',
                componentConfig:{
                    place: angular.copy(place)
                }
            };

            return modalFactory.open(modalData).result
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

    }
})();
