(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('spinnerPageComponent', {
            bindings: {
                config: '<'
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'components/spinner-page/spinner-page.html'
        });

    Controller.$inject = [];

    /* @ngInject */
    function Controller() {
        var vm = this;

        vm.$onInit = onInit;

        function onInit(){}
    }
})();