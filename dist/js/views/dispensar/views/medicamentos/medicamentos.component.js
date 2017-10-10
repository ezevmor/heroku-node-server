(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('medicamentosComponent', {
            bindings: {
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'dispensar/views/medicamentos/medicamentos.html'
        });

    Controller.$inject = ['$state','$q','$stateParams'];

    /* @ngInject */
    function Controller($state,$q,$stateParams) {
      var vm = this;

      vm.irVideoAyuda=irVideoAyuda;
      vm.irVideoLlamada=irVideoLlamada;
      vm.irInicio=irInicio;
      vm.irTransacion=irTransacion;

      vm.$onInit = onInit;

      function onInit(){
          vm.showSpinner = true;
          if($stateParams.id){
              getMedication($stateParams.id)
          }else{
              //algun error que se pueda mostrar en pantalla cuando no ha recibido el id del usuario de la lectura
              //de la tarjeta
          }
      }

      function getMedication(userId){
          getMedicationService(userId)
              .then(function(response){
                  vm.medication = response
              })
              .catch(function(){
                  $state.go('dispensar.mensajeError',{id:2})
              })
              .finally(function(){
                  vm.showSpinner = false
              })
      }

      function getMedicationService(){
          var medication = [
              {nombre: "IBUPROFENO TÓPICO", unidades:5},
              {nombre: "ACETILSALICÍLICO ÁCIDO", unidades:2},
              {nombre: "OMEPRAZOL" ,unidades:2},
              {nombre: "FORTASEC OXO ",unidades:3}
          ];
          return $q.when(medication)
          //return $q.reject()
      }



      function irVideoAyuda(){
        $state.go('dispensar.videoAyuda',{pageReturn:'dispensar.medicamentos'})
      }
      function irVideoLlamada(){
        $state.go('dispensar.videoLlamada',{pageReturn:'dispensar.medicamentos'})
      }
      function irInicio(){
        $state.go('dispensar.home')
      }
      function irTransacion(){
        $state.go('dispensar.transacion')
      }

    }
})();
