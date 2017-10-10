(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('accesoTarjetaComponent', {
            bindings: {
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'dispensar/views/acceso-tarjeta/acceso-tarjeta.html'
        });

    Controller.$inject = ['$state','$q'];

    /* @ngInject */
    function Controller($state,$q) {
      var vm = this;

      vm.sinAcceso = sinAcceso;
      vm.irMedicamentos = irMedicamentos;

      vm.$onInit = onInit;

      function onInit(){
          vm.readerData = null;
          vm.userId = null;
          vm.showSpinner = false;

          $.cardswipe({
              success:successRead
          });

          $(document).on("failure.cardswipe", failureRead)
      }

      function failureRead(){
          $state.go('dispensar.mensajeError',{id:1})
      }

      function successRead(readerData){
          vm.showSpinner = true;
          getUserIdService(readerData)
              .then(function(userId){
                  irMedicamentos(userId)
              })
              .catch(function(){
                  sinAcceso(1)
              })
              .finally(function(){
                    vm.showSpinner = false;
              });
      }

      function getUserIdService(data){
          //esto emula la llamada a un servicio, aqui deberia llamarse a un servicio que parsee el dato
          //leido de la tarjeta y que realice la identificacion y comprobacion del paciente
          return $q.when(data)
          //return $q.reject()
      }

      function sinAcceso(id){
          $state.go('dispensar.mensajeError',{id:id})
      }

      function irMedicamentos(id){
          $state.go('dispensar.medicamentos',{id:id})
      }

    }
})();
