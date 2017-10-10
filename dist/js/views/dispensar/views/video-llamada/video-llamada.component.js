(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('videoLlamadaComponent', {
            bindings: {

            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'dispensar/views/video-llamada/video-llamada.html'
        });

    Controller.$inject = ['$state'];

    /* @ngInject */
    function Controller($state) {
      var vm = this;
      vm.irInicio=irInicio;


      function irInicio(){
        $state.go($state.params.pageReturn,{id:'123'})
      }

    }
})();
