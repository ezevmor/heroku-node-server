(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('dispensarComponent', {
            bindings: {

            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'dispensar/dispensar.html'
        });

    Controller.$inject = ['$state'];

    /* @ngInject */
    function Controller($state) {

      var vm = this;
      vm.$onInit = onInit;

        function onInit(){
            $state.go('dispensar.home')
        }

    }
})();
