(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('generarCalendarComponent', {
            bindings: {

            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'citas/generar-cita-elegir-dia/generar-cita-elegir-dia.html'
        });

    Controller.$inject = ['$stateParams','requestFactory','$compile', '$timeout', 'uiCalendarConfig','$state'];

    /* @ngInject */
    function Controller($stateParams,requestFactory,$compile, $timeout, uiCalendarConfig,$state) {
      var vm = this;
      vm.$onInit = onInit;
      
      vm.alertOnDrop = alertOnDrop;
      vm.alertOnResize = alertOnResize;
      function onInit(){
        vm.showError = false;
        vm.showSpinner = true;
        vm.idPrestacion = $stateParams.idPrestacion;
        vm.date = $stateParams.date;
        vm.error = null;
        if($stateParams.idPrestacion){
          getCalendar()
        }else{
          vm.error = 'parametros incorrectos'
          vm.showSpinner = false;
          vm.showError = true;
          vm.errorMessage = "Parametros incorrectos";
        }
      }
      function funtionClick(date, allDay, jsEvent, view){
        $state.go('home.generar', {idPrestacion: $stateParams.idPrestacion, date: Date.parse(date)});
        console.log('test ok ' +date);
      }
      function alertOnDrop(data){
        console.log("Evento alertOnDrop" +data);
      }
      function alertOnResize(data){
        console.log("Evento alertOnResize" +data);
      }
      function  getCalendar(){
        vm.uiConfig = {
          calendar:{
            lang: 'ES',
            aspectRatio: 2,
            height: 450,
            editable: true,
            header:{
              left: 'title',
              center: '',
              right: 'prev,next'

            },
            dayClick: funtionClick,
            background: '#f5f5f5'
          
          }
      };

      }
      
    }
})();
