(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('errorPageComponent', {
            bindings: {
                config: '<'
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'components/error-page/error-page.html'
        });

    Controller.$inject = [];

    /* @ngInject */
    function Controller() {
        var vm = this;

        vm.$onInit = onInit;

        function onInit(){
            vm.message = vm.config.message;
        }

    }
})();