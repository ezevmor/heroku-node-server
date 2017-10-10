(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('festivosComponent', {
            bindings: {

            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl:'catalogos/festivos/festivos.html'

        });

    Controller.$inject = ['requestFactory','modalFactory'];

    /* @ngInject */
    function Controller(requestFactory,modalFactory) {
        var vm = this;
        vm.calendarConfig = null;

        vm.$onInit = onInit;
        vm.cancel = cancel;
        vm.saveHolidays = saveHolidays;
        vm.enableEditMode = enableEditMode;

        function onInit(){
            vm.showSpinner = true;
            vm.showError = false;

            vm.editMode = false;
            getHolidays();
        }

        function getHolidays(){
            requestFactory.request('getHolidays')
                .then(function(response){
                    vm.holidays = response.holidays;
                    vm.calendarConfig = getCalendarConfig();
                })
                .catch(function(errorMessage){
                    vm.errorMessage = errorMessage;
                    vm.showError = true;
                    return []
                })
                .finally(function(){
                    vm.showSpinner = false
                })
        }

        function getCalendarConfig(){
            var config = {
                name: 'calendario',
                daysList: vm.holidays,
                editMode:false
            };
            return config
        }

        function enableEditMode(){
            vm.editMode = true;
            var calendarConfig = getCalendarConfig();
            calendarConfig.editMode = true;
            vm.calendarConfig = angular.copy(calendarConfig);
        }

        function saveHolidays(){
            var calendarConfig = getCalendarConfig();
            calendarConfig.editMode = false;
            calendarConfig.getList = saveHolidayList;
            vm.calendarConfig = angular.copy(calendarConfig);
        }

        function cancel(){
            vm.editMode = false;
            var calendarConfig = getCalendarConfig();
            calendarConfig.editMode = false;
            calendarConfig.restore = true;
            vm.calendarConfig = angular.copy(calendarConfig);
        }

        function saveHolidayList(lista){
            return requestFactory.request('saveHolidays')
                .then(function(response){
                    vm.editMode = false;
                    return
                })
                .catch(function(errorMessage){
                    modalFactory.openError('Guardar festivos',errorMessage);
                    throw errorMessage;
                })
        }

    }
})();