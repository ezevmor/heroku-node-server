(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('dispensarHomeComponent', {
            bindings: {

            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'dispensar/views/home/home.html'
        });

    Controller.$inject = ['$state'];

    /* @ngInject */
    function Controller($state) {
      var vm = this;

      vm.irVideoAyuda = irVideoAyuda;
      vm.irVideoLlamada = irVideoLlamada;
      vm.irAccesoTarjeta = irAccesoTarjeta;

      function irVideoAyuda(){
        $state.go('dispensar.videoAyuda')
      }
      function irVideoLlamada(){
        $state.go('dispensar.videoLlamada')
      }
      function irAccesoTarjeta(){
        $state.go('dispensar.accesoTarjeta')
      }

    }
})();
