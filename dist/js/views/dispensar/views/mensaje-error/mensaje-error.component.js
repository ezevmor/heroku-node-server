(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('mensajeErrorComponent', {
            bindings: {
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'dispensar/views/mensaje-error/mensaje-error.html'
        });

    Controller.$inject = ['$state','$stateParams'];

    /* @ngInject */
    function Controller($state,$stateParams) {

      var vm = this;
      vm.irInicio=irInicio;
      vm.irVideollamada=irVideollamada;
      vm.mensaje = $stateParams.id;

      switch (vm.mensaje) {
        case "1":
          vm.mensaje="Se ha producido un error en la lectura o no estas autorizado a recoger medicamentos";
          break;
        case "2":
          vm.mensaje="No tiene medicacion para recoger, Esta fuera de las fechas de recogida o no hay existencias suficientes"
      }
      function irInicio(){
        $state.go('dispensar.home')
      }
      function irVideollamada(){
        $state.go('dispensar.videoLlamada')
      }

    }

})();
