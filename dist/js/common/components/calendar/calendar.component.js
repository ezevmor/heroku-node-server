(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('calendarComponent', {
            bindings: {
                config: '<'
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'components/calendar/calendar.html'

        });

    Controller.$inject = ['$timeout','modalFactory'];

    /* @ngInject */
    function Controller($timeout,modalFactory) {
        var vm = this;
        var $calendar = null;
        var listForEdit = [];

        vm.$onInit = onInit;
        vm.$onChanges = onChanges;

        function onInit(){
            vm.dayColor = '#E0E0E0';
            vm.editModeDayColor = '#00BBD3';
            vm.unselectDayColor = 'white';
            vm.name = vm.config.name;
            vm.initialList = formatData(vm.config.daysList);
            vm.selectedList = angular.copy(vm.initialList);

            var configuration = getConfiguration();
            configuration.dataSource = angular.copy(vm.initialList);

            $timeout(function(){
                $calendar = $('.'+vm.config.name);
                $calendar.calendar(configuration);
            })
        }

        function formatData(list){
            var auxList = [];
            list.forEach(function(elem,index){
                auxList.push(formatDay(elem))
            });
            return auxList
        }

        function onChanges(changes){
            if(changes.config && changes.config.isFirstChange()){
                return;
            }
            if(changes.config){
                if(vm.config.restore){
                    //cancela la edicion de los dias seleccionados
                    changeColor(vm.initialList,vm.dayColor);
                    $calendar.data('calendar').setDataSource(angular.copy(vm.initialList));
                }else{
                    if(vm.config.getList){
                        //guardar los cambios
                        var newList = angular.copy(listForEdit);
                        vm.config.getList(newList)
                            .then(function(){
                                changeColor(newList,vm.dayColor);
                                vm.initialList = angular.copy(newList);
                                $calendar.data('calendar').setDataSource(vm.initialList);
                            })
                            .catch(function(){})
                    }else{
                        //edicion
                        listForEdit = angular.copy(vm.initialList);
                        changeColor(listForEdit,vm.editModeDayColor);
                        $calendar.data('calendar').setDataSource(listForEdit);
                    }
                }
            }
        }

        function getConfiguration(){
            var configuration = {
                allowOverlap: true,
                language: 'es',
                enableContextMenu: false,
                contextMenuItems:[],
                clickDay: selectDay,
                style:'background'
            };

            return configuration
        }

        function changeColor(list,color){
            list.forEach(function(elem){
                elem.color = color
            })
        }

        function formatDay(event){
            var formatedDay = {
                id: event.id,
                startDate: new Date(event.date),
                endDate: new Date(event.date),
                color: vm.dayColor
            };
            return formatedDay
        }

        function selectDay(event){
            if(vm.config.editMode){
                for(var i=0; i<listForEdit.length; i++){
                    if(event.date.getTime() === listForEdit[i].startDate.getTime()){
                        listForEdit.splice(i,1);
                        $(event.element[0]).css('background-color',vm.unselectDayColor);
                        return
                    }
                }

                listForEdit.push(formatDay(event));
                $(event.element[0]).css('background-color',vm.editModeDayColor);
            }
        }

    }
})();