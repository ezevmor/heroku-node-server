(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('horariosComponent', {
            bindings: {
                config: '<'
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'catalogos/agendas/agenda/horarios/horarios.html'
        });

    Controller.$inject = ['requestFactory','modalFactory'];

    /* @ngInject */
    function Controller(requestFactory,modalFactory) {
        var vm = this;
        var modalInstance = null;

        vm.$onInit = onInit;

        function onInit(){
            vm.showSpinner = true;
            vm.showError = false;

            vm.horarios = null;
            vm.selected = null;
            getHorarios()
        }

        function getHorarios(){
            requestFactory.request('getHorarios')
                .then(function(response){
                    formatToDate(response.content);
                    vm.horarios = response.content;
                    vm.tableConfig = {
                        items:[
                            {label:'Id',key:'id'},
                            {label:'Calendario',key:'calendario'},
                            {label:'H. desde',key:'horaDesde',filter:{name:'date',params:'HH:mm'}},
                            {label:'H. hasta',key:'horaHasta',filter:{name:'date',params:'HH:mm'}},
                            {label:'Sobrecarga',key:'sobrecarga'},
                            {label:'Estado',key:'estado'}
                        ],
                        primaryKey:'id',
                        onCreate: createHorario,
                        onEdit: editHorario,
                        onDelete: deleteHorario,
                        stateChange:{
                            itemKey: 'estado',
                            activeValue: "A",
                            onChange: changeState
                        },
                        data: vm.horarios
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

        function createHorario(){
            return openHorario()
        }

        function editHorario(horario){
            return openHorario(horario)
        }

        function changeState(horario){
            return requestFactory.request('updateHorario')
                .then(function(response){
                    if(horario.estado === 'A'){
                        horario.estado = 'B'
                    }else{
                        horario.estado = 'A'
                    }
                    return true
                })
                .catch(function(error){
                    modalFactory.openError('Modificar horario',error.message);
                    throw error
                })
        }

        function deleteHorario(horario){
            var title = 'Borrar horario';
            var message = 'Seguro que quieres borrar el horario con id: '+horario.id+'?';
            var config = {
                onConfirmData: horario,
                onConfirm: 'deleteHorario',
                onCancel: null
            };
            return modalFactory.openConfirm(title,message,config).result
                .then(function(){
                    return true
                })
                .catch(function(error){
                    modalFactory.openError('Borrar horario',error.message);
                    throw error
                })
        }

        function openHorario(horario){
            var modalData = {
                title: horario? 'Editar horario' : 'Crear horario',
                component: 'horario-component',
                componentConfig:{
                    horario: angular.copy(horario),
                    horarios: angular.copy(vm.horarios),
                    validate: validateDaysHours
                }
            };

            modalInstance =  modalFactory.open(modalData);

            return modalInstance.result
                .then(function(response){
                    if(!horario) {
                        vm.horarios.unshift(response);
                        openCreateSuccessModal(response);
                    }
                    return response
                })
                .catch(function(error){
                    throw error
                })
        }

        function openCreateSuccessModal(horario){
            var title = 'Crear horario';
            var message = 'Horario creado con éxito, quieres abrir el horario para añadir prestaciones?';
            var config = {
                onConfirmData: horario,
                onConfirm: openHorario,
                onCancel: null,
                type: 'success'
            };
            modalFactory.openConfirm(title,message,config).result
                .then(function(){})
                .catch(function(){})
        }

        function formatToDate(list){
            list.forEach(function(elem,index){
                elem.horaDesde = new Date(elem.horaDesde);
                elem.horaHasta = new Date(elem.horaHasta)
            })
        }

        function validateDaysHours(horario,horarios){
            for(var i=0; i<horarios.length; i++){
                var coincidentDay = dayConcidence(horario.calendario,horarios[i].calendario);
                if(coincidentDay && horarios[i].estado === 'A'){
                    var firstRange = {
                        start: horario.horaDesde.getHours()*60 + horario.horaDesde.getMinutes(),
                        end: horario.horaHasta.getHours()*60 + horario.horaHasta.getMinutes()
                    };
                    for(var j=0; j<horarios.length; j++){
                        var secondRange = {
                            start: horarios[i].horaDesde.getHours()*60 + horarios[i].horaDesde.getMinutes(),
                            end: horarios[i].horaHasta.getHours()*60 + horarios[i].horaHasta.getMinutes()
                        };
                        if(timeRangeCoincidence(firstRange,secondRange)){
                            modalFactory.openError('Crear horario','Ya existe horario para el dia y hora especificados');
                            return false
                        }
                    }
                }
            }
            return true
        }

        function dayConcidence(firstString,secondString){
            var coincident = null;
            for(var i=0; i<firstString.length; i++){
                for(var j=0; j<secondString.length; j++){
                    if(firstString[i] === secondString[j]){
                        coincident = firstString[i];
                        return coincident
                    }
                }
            }
            return coincident
        }

        function timeRangeCoincidence(firstRange,secondRange){
            if( (firstRange.start > secondRange.start && firstRange.start >= secondRange.end) || firstRange.end <= secondRange.start ){
                return false
            }else{
                return true
            }
        }

    }
})();
