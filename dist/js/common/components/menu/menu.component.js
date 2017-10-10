(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('menuComponent', {
            bindings: {

            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl:'components/menu/menu.html'

        });

    Controller.$inject = ['$state','$timeout'];

    /* @ngInject */
    function Controller($state,$timeout) {
        var vm = this;

        vm.$onInit = onInit;
        vm.goTo = goTo;
        vm.doLogout = doLogout;

        function onInit(){
            vm.stateList = [];
            $timeout(function(){
                vm.stateList = getBreadCrumb($state.current.name)
            })
        }

        function goTo(state){
            $state.go(state);
            vm.stateList = getBreadCrumb(state);
        }

        function doLogout(){
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('centro');
            $timeout(function(){
                goTo('login')
            })
        }

        function getBreadCrumb(state){
            var stateList = state.split('.');
            var incrementalState = [];
            var crumbList = [];

            stateList.forEach(function(elem,index){
               incrementalState.push(elem);
               var crumb = getCrumb(incrementalState.join('.'));
               crumbList.push(crumb)
            });

            return crumbList
        }

        function getCrumb(state){
            return $state.get(state).crumb
        }

    }
})();