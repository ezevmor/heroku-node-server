(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('homeComponent', {
            bindings: {

            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'home/home.html'
        });

    Controller.$inject = ['$state','userFactory','$location'];

    /* @ngInject */
    function Controller($state,userFactory,$location) {
    	var vm = this;

    	vm.$onInit = onInit;

        function onInit(){
            var userData = userFactory.getUserData();
            if(!userData){
                $state.go('login')
            }else if($location.path() === '/gestion-citas'){
                $state.go('home.catalogos.agendas')
            }
        }
    }
})();