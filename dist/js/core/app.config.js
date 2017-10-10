(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .constant('environment','mock') // 'mock'(para cargar json) - 'real' (para llamada al back)
        .constant('apiPaths',apiPaths());

    function apiPaths(){
    	var mock_path = 'json/'; //carpeta de archivos json
    	var real_path = 'http://10.10.4.140:8080/farmatoolsSampa-web/rest/'; //servidor back

    	return {
    		mock_path: mock_path,
    		real_path: real_path,

            getCentros:{
    		  real:{
    		      method: 'POST',
                  url: real_path + 'centro/search'
              },
              mock: 'login/centros.json'
            },
			login:{
				real:{
					method: 'POST',
                    url: real_path + 'security/login'
				},
				mock: 'login/login.json'
			},
            getPlaces:{
                real:{
                    method: 'GET',
                    url: real_path + 'securedata'
                },
                mock: 'puestos/puestos.json'
            },
            updatePlace:{
                real:{
                },
                mock: 'puestos/editar-puesto.json'
            },
            createPlace:{
                real:{
                },
                mock: 'puestos/crear-puesto.json'
            },
            createDate:{
                real:{
                },
                mock: 'citas/crear-cita.json'
            },
            deletePlace:{
                real:{
                },
                mock: 'puestos/borrar-puesto.json'
            },
            getPlaceTypes:{
                real:{
                },
                mock: 'puestos/tipos-puesto.json'
            },
            getPrestaciones:{
    		    real:{},
                mock: 'prestaciones/prestaciones.json'
            },
            getPrestacionesCustom:{
                real:{},
                mock: 'prestaciones/prestaciones-custom.json'
            },
            getDietariosLibres:{
                real: {
                    method: 'POST',
                    url: real_path + 'dietario/listarHuecos'
                },
                mock: 'citas/dietarios.json'
            },
            deletePrestacion:{
                real:{},
                mock: 'prestaciones/borrar-prestacion.json'
            },
            createPrestacion:{
                real:{},
                mock: 'prestaciones/crear-prestacion.json'
            },
            updatePrestacion:{
                real:{},
                mock: 'prestaciones/modificar-prestacion.json'
            },
            addPrestacion:{
    		    real:{},
                mock: 'prestaciones/asignar-prestacion.json'
            },
            getPrograms:{
    		    real:{},
                mock: 'prestaciones/programas.json'
            },
            getTypes:{
    		    real:{},
                mock: 'prestaciones/tipos.json'
            },
            getAgendas:{
                real:{
                    method: 'POST',
                    url: real_path + 'agenda/search'
                },
                mock: 'agendas/agendas.json'
            },
            changeAgendaState:{
                real:{
                    method: 'PUT',
                    url: real_path + 'agenda/changeState'
                },
                mock: 'agendas/cambiar-estado-agenda.json'
            },
            updateAgenda:{
                real:{},
                mock: 'agendas/modificar-agenda.json'
            },
            deleteAgenda:{
                real:{
                    method: 'DELETE',
                    url: real_path + 'agenda'
                },
                mock: 'agendas/borrar-agenda.json'
            },
            createAgenda:{
                real:{},
                mock: 'agendas/crear-agenda.json'
            },
            getHorarios:{
            real:{},
                mock: 'agendas/horarios/horarios.json'
            },
            deleteHorario:{
                real:{},
                mock: 'agendas/horarios/borrar-horario.json'
            },
            createHorario:{
                real:{},
                mock: 'agendas/horarios/crear-horario.json'
            },
            updateHorario:{
                real:{},
                mock: 'agendas/horarios/modificar-horario.json'
            },
            getHolidays:{
                real:{},
                mock: 'festivos/festivos.json'
            },
            saveHolidays:{
    		    real:{},
                mock: 'festivos/guardar-festivos.json'
            }
    	}
    }

})();
