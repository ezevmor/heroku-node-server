(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('generarCitaComponent', {
            bindings: {

            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'citas/generar-cita/generar-cita.html'

        });

    Controller.$inject = ['$stateParams','requestFactory','modalFactory','$state'];

    /* @ngInject */
    function Controller($stateParams,requestFactory,modalFactory,$state) {
        var vm = this;

        vm.$onInit = onInit;
        vm.selectedDate = selectedDate;
        vm.calculoFilasHoras = calculoFilasHoras;
        vm.getParteEntera = getParteEntera;

        function onInit(){
            vm.selectedAgenda = null;
            vm.arrayCitasOrd = [];
            vm.showError = false;
            vm.showSpinner = true;
            vm.idPrestacion = $stateParams.idPrestacion;
            vm.date = $stateParams.date;
            vm.error = null;

            if($stateParams.idPrestacion && $stateParams.date){
                //getPrestacionesCustom();
                getDietariosLibres();
            }else{
                vm.error = 'parametros incorrectos'
                vm.showSpinner = false;
                vm.showError = true;
                vm.errorMessage = "Parametros incorrectos";
            }
        }
        function getPrestacionesCustom(){
            requestFactory.request('getPrestacionesCustom')
                .then(function(response){
                    vm.listadoPrestaciones = response.prestaciones;
                    vm.selectedPrestacion = vm.listadoPrestaciones[0];
                    //calculoFilasHoras();
                    //console.log( vm.citasLibres.descripcion);
                })
                .catch(function(error){
                    vm.errorMessage = error.message;
                    vm.showError = true
                })
                .finally(function(){
                    vm.showSpinner = false
                })
        }
        function getDietariosLibres(){
            return requestFactory.request('getDietariosLibres',{fecha:$stateParams.date,idPrestacion:$stateParams.idPrestacion})
                .then(function(response){
                    vm.listadoDietarios = response.listHuecos;
                    calculoFilasHoras();
                })
                .catch(function(error){
                    vm.errorMessage = error.message;
                    vm.showError = true
                })
                .finally(function(){
                    vm.showSpinner = false
                })
        }
        // function getCitasLibres(){
        //     requestFactory.request('getCitasLibres')
        //         .then(function(response){
        //             vm.citasLibres = response.list
        //             vm.selectedAgenda = vm.citasLibres[0];
        //             calculoFilasHoras();
        //             console.log( vm.citasLibres.descripcion);
        //         })
        //         .catch(function(error){
        //             vm.errorMessage = error.message;
        //             vm.showError = true
        //         })
        //         .finally(function(){
        //             vm.showSpinner = false
        //         })
        // }
        function conversorFecha(date){
            return date.getTime();
        }

        function minTomil(min){
            return min*60*1000;
        }
        function formatDate(date){
            var formatedDate = (date.getMonth()+1<10?"0"+ (date.getMonth()+1):date.getMonth()+1) + " "+(date.getDate()<10?"0"+ date.getDate():date.getDate())
                                +" "+(date.getHours()<10?"0"+ date.getHours():date.getHours())+":"+(date.getMinutes()<10?"0"+ date.getMinutes():date.getMinutes()) 
                                +":"+(date.getSeconds()<10?"0"+ date.getSeconds():date.getSeconds()); 

            return formatedDate;
        }

        function generateDtoCita(cita){
            var today = new Date();
            var dtoCita = {
                            idDietario: cita.id,
                            nProceso:100,
                            fecha:cita.fecha,
                            idPrestacion:$stateParams.idPrestacion,
                            hora:cita.fechaCita,
                            duracion:cita.duracion,
                            sobrecarga:null,
                            usuarioDeCreacion:"admin",
                            horaCreacion:today,
                            estado:"A"
                        }
            return dtoCita;
            }
        function selectedDate(cita){            
            var title = 'Crear Cita';
            var message = 'Seguro que quieres Reservar la cita para el dia: '+cita.fecha+'?';
            //angular.extend(cita,{hora:formatDate(cita.hora)})
            var config = {
                onConfirmData: cita,
                onConfirm: 'createDate',
                onCancel: null
            };
            modalFactory.openConfirm(title,message,config).result
                //es la modal la que llama al servicio de borrado para que se muestre hasta obtener alguna respuesta
                //cuando la obtiene se cierra y lanza then o catch segun sea el caso
                .then(function(result){
                    $state.go('home.confirmarCita');
                })
                .catch(function(error){
                    modalFactory.openError('Crear Cita',error.message)
                })  
        }
        // function onConfirm(cita){
        //     //esta es la funcion que se llama desde la modal
        //     //no se devuelve el objeto en return porque ya esta en el componente padre
        //     // return $q.when(function(){
        //     //     return status = "ok";
        //     // }).then(function(resolved){
        //     //     console.log(resolved.status);
        //     // });
            
        //     return requestFactory.request('createDate',cita)
        //         .then(function(){
        //             console.log(cita);
        //             return 
        //         })
        //         .catch(function(error){
        //             throw error
        //         })
           
        // }
        function getParteEntera(obj){
            var tiempo = obj.tiempoRestante;
            var duracion = obj.duracion;
            vm.fechaDesde = new Date(obj.horaDesde);
            var entero = parseInt(tiempo/duracion);
            return new Array(entero);
        }

        function calculoFilasHoras(){
            var arrayCitas = vm.listadoDietarios;
            vm.arrayAgendas = [];
            vm.datosAgendas = [];
            var arrayCitasOrd = [];
            var arrayCitaHora = [];
            var horaInicio = "";
            var fechaDesde,fechaFin,fechaCita;
            var contador = 0;
            var dtoCita;
            
            for (var i=0;i<arrayCitas.length;i++){

                for (var j=0;j<arrayCitas[i].dietarios.length;j++){
                    //arrayCitaHora[0]=arrayCitas[i].dietarios[j].horaDesde;
                    fechaDesde = new Date(arrayCitas[i].dietarios[j].horaDesde);
                    fechaFin = new Date(arrayCitas[i].dietarios[j].horaHasta);
                    var minutes = fechaDesde.getMinutes();
                    fechaCita = new Date(fechaDesde);
                    contador = 0;
                    do {                                            
                        angular.extend(arrayCitas[i].dietarios[j],{fecha:$stateParams.date,fechaCita:fechaCita});
                        dtoCita = generateDtoCita(arrayCitas[i].dietarios[j])
                        if (horaInicio !== fechaCita.getHours()){                                           
                            if (horaInicio !==""){           
                                 arrayCitasOrd.push(arrayCitaHora);
                                 arrayCitaHora = [];                                      
                                 arrayCitaHora.push(dtoCita);
                            }        
                            horaInicio = fechaCita.getHours();
                            fechaCita = new Date(conversorFecha(fechaDesde)+(minTomil(arrayCitas[i].dietarios[j].duracion*(contador))));
                            contador++;                
                        }
                        else {
                            arrayCitaHora.push(dtoCita);
                            fechaCita = new Date(conversorFecha(fechaDesde)+(minTomil(arrayCitas[i].dietarios[j].duracion*(contador))));
                            contador++; 
                        } 
                    }while (fechaCita < fechaFin);
                if  (arrayCitaHora.length !== 0 ){
                    arrayCitasOrd.push(arrayCitaHora);
                    arrayCitaHora = [];
                    horaInicio = "";
                }
                }            
                //arrayCitasOrd.push(arrayCitaHora);
                vm.arrayAgendas.push(arrayCitasOrd);
                vm.datosAgendas.push(arrayCitas[i].descripcion)
                arrayCitasOrd = [];
                //arrayCitaHora = [];            
            }           
        }

    }
})();