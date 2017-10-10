(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('confirmarCitaComponent', {
            bindings: {

            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'citas/finalizar-cita/finalizar-cita.html'

        });

    Controller.$inject = ['$stateParams','$state'];

    /* @ngInject */
    function Controller($stateParams,$state) {
        var vm = this;

        vm.$onInit = onInit;

        function onInit(){
          vm.print = print;
          vm.cambiarCita = cambiarCita;
          vm.cancelarCita = cancelarCita;
        }

        function print(){
          html2canvas($('#box'),{
            onrendered:function(canvas){
              var img=canvas.toDataURL("image/png");
              var doc = new jsPDF();
              doc.addImage(img,'JPEG',10,10);
              doc.autoPrint()
              window.open(doc.output('bloburl'), '_blank');
            }
          })
        }

        function cambiarCita(){
          $state.go('home.generarCalendar', {idPrestacion: 1});
        }

        function cancelarCita(){
          $state.go('home.catalogos.agendas');
        }

    }//end controller
})();
