(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('catalogTableComponent', {
            bindings: {
                config: '<'
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'components/catalog-table/catalog-table.html'
        });

    Controller.$inject = ['$filter'];

    /* @ngInject */
    function Controller($filter) {
        var vm = this;

        vm.$onInit = onInit;
        vm.select = select;
        vm.changeState = changeState;
        vm.isSelected = isSelected;
        vm.deleteSelected = deleteSelected;
        vm.editSelected = editSelected;
        vm.create = create;
        vm.getColspanLength = getColspanLength;
        vm.filterElement = filterElement;

        function onInit(){
            vm.selected = null;
            vm.data = angular.copy(vm.config.data);
            vm.primaryKey = vm.config.primaryKey;
        }

        function select(dataElement){
            vm.selected = dataElement;
        }

        function isSelected(dataElement){
            if(vm.selected){
                return dataElement[vm.primaryKey] === vm.selected[vm.primaryKey]
            }else{
                return false
            }
        }

        function changeState(dataElement){
            dataElement.changing = true;
            vm.config.stateChange.onChange(dataElement)
                .then(function(){})
                .catch(function(){})
                .finally(function(){
                    dataElement.changing = false;
                })
        }

        function deleteSelected(index){
            vm.config.onDelete(vm.selected)
                .then(function(){
                    vm.data.splice(index,1);
                })
                .catch(function(){})
                .finally(function(){})
        }

        function editSelected(index){
            vm.config.onEdit(vm.selected)
                .then(function(changedElement){
                    vm.data[index] = changedElement
                })
                .catch(function(){})
                .finally(function(){})
        }

        function create(){
            vm.config.onCreate()
                .then(function(createdElement){
                    vm.data.unshift(createdElement)
                })
                .catch(function(){})
                .finally(function(){})
        }

        function getColspanLength(){
            return vm.config.items.length + 1
        }

        function filterElement(element,filter){
            if(filter){
                return $filter(filter.name)(element,filter.params)
            }else{
                return element
            }

        }

        vm.getValueByKey = function(element,key){
            if(key){
                var keysArray = key.split('.');
                return getValue(element,keysArray)
            }
        }

        function getValue(object,keyList){
            var actualKey = keyList.shift();
            if(keyList.length > 0){
                return getValue(object[actualKey],keyList)
            }else{
                return object[actualKey]
            }
        }




    }
})();