(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .config(config);

        config.$inject = ['$stateProvider','$urlRouterProvider'];

        function config($stateProvider,$urlRouterProvider){
            $stateProvider
                .state('home',{
                    url: '/gestion-citas',
                    crumb: 'Home',
                    component: 'homeComponent'
                })
                .state('home.catalogos',{
                    url:'/catalogos',
                    crumb:'Catálogos',
                    abstract: true
                })
                .state('home.catalogos.agendas',{
                    url:'/agendas',
                    crumb:'Agendas',
                    component:'agendasComponent'
                })
                .state('home.catalogos.puestos',{
                    url:'/puestos',
                    crumb:'Puestos',
                    component: 'puestosComponent'
                })
                .state('home.catalogos.prestaciones',{
                    url:'/prestaciones',
                    crumb:'Prestaciones',
                    component: 'prestacionesComponent'
                })
                .state('home.catalogos.festivos',{
                    url:'/festivos',
                    crumb:'Festivos',
                    component: 'festivosComponent'
                })

                .state('login',{
                    url:'/gestion-citas/login',
                    component: 'loginComponent'
                })

                .state('generar',{
                    url:'/gestion-citas/generar?idPrestacion&date',
                    component: 'generarCitaComponent'
                })
                .state('home.generarCalendar',{
                    url:'/generar?idPrestacion',
                    component: 'generarCalendarComponent'
                })
                .state('home.confirmarCita',{
                    url:'/confirmarCita',
                    component: 'confirmarCitaComponent'
                })

                .state('dispensar',{
                    url:'/gestion-citas/dispensar',
                    component: 'dispensarComponent'
                })
                  // Vistas Dispensar
                    .state('dispensar.home',{
                        url:'/inicio',
                        component: 'dispensarHomeComponent'
                    })
                    .state('dispensar.videoLlamada',{
                        url:'/video-llamada',
                        component: 'videoLlamadaComponent',
                        params:{
                          pageReturn: 'dispensar.home'
                        }
                    })
                    .state('dispensar.accesoTarjeta',{
                        url:'/acceso',
                        component: 'accesoTarjetaComponent'
                    })
                    .state('dispensar.mensajeError',{
                        url:'/error/:id',
                        component: 'mensajeErrorComponent'
                    })
                    .state('dispensar.medicamentos',{
                        url:'/medicamentos/:id',
                        component: 'medicamentosComponent'
                    })
                    .state('dispensar.transacion',{
                        url:'/transacion',
                        component: 'transacionComponent'
                    })
                    .state('dispensar.videoAyuda',{
                        url:'/video-ayuda',
                        component: 'videoAyudaComponent',
                        params:{
                          pageReturn: 'dispensar.home'
                        }
                    });

            $urlRouterProvider.otherwise('gestion-citas/catalogos/agendas');

        }
})();
