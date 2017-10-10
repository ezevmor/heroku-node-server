(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('loginComponent', {
            bindings: {
                config: '<?'
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl:'login/login.html'

        });

    Controller.$inject = ['$state','$timeout','requestFactory','userFactory','modalFactory'];

    /* @ngInject */
    function Controller($state,$timeout,requestFactory,userFactory,modalFactory) {
    	var vm = this;

        vm.$onInit = onInit;
        vm.doLogin = doLogin;

        function onInit(){
            vm.showSpinner = true;
            vm.showButtonSpinner = false;
            vm.showError = false;
            vm.errorMessage = '';

            vm.username = null;
            vm.password = null;
            vm.centros = null;

            getCentros();
        }

        function getCentros(){
            requestFactory.request('getCentros',{})
                .then(function(response){
                    vm.centros = response.content
                })
                .catch(function(error){
                    vm.errorMessage = error.message;
                    vm.showError = true;
                })
                .finally(function(){
                    vm.showSpinner = false;
                })
        }

    	function doLogin(loginForm){
            loginForm.$submitted = true;

            if(loginForm.$valid){
                vm.showButtonSpinner = true;

                var requestData = {
                    username:vm.username,
                    password:vm.password
                };
                requestFactory.request('login',requestData)
                    .then(function(response){
                        sessionStorage.setItem('token',response.token);
                        userFactory.setUserData({centro:vm.centro});
                        $timeout(function(){
                            if(vm.config){
                                vm.config.ok()
                            }else{
                                $state.go('home')
                            }
                        },0);
                    })
                    .catch(function(error){
                        modalFactory.openError('Login',error.message)
                    })
                    .finally(function(){
                        vm.showButtonSpinner = false
                    })
            }

    	}
    }
})();