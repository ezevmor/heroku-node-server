(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('transacionComponent', {
            bindings: {

            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'dispensar/views/transacion/transacion.html'
        });

    Controller.$inject = ['$state','$timeout'];

    /* @ngInject */
    function Controller($state,$timeout) {
      var vm = this;

      vm.$onInit = onInit;

      function onInit(){
          $timeout(function(){
              $state.go('dispensar.home')
          },4000)
      }
    }
})();
