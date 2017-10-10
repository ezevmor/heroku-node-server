(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .component('modalComponent', {
            bindings: {
            	resolve: '<',
            	close: '&',
            	dismiss: '&'
            },
            controller: Controller,
            controllerAs: 'vm',
            templateUrl: 'components/modal/modal.html'

        });

    Controller.$inject = ['$scope','$compile','$element','$timeout','requestFactory'];

    /* @ngInject */
    function Controller($scope,$compile,$element,$timeout,requestFactory) {
    	var vm = this;

    	vm.$onInit = onInit;
    	vm.okModalButton = okModalButton;
    	vm.cancelModalButton = cancelModalButton;

    	function onInit(){
			vm.title = vm.resolve.data.title;
			vm.showButtons = vm.resolve.data.showButtons;
			vm.showCloseButton = false;
			vm.type = vm.resolve.data.type;
			vm.message = vm.resolve.data.message;

			if(vm.resolve.data.componentConfig){
                vm.resolve.data.componentConfig.ok = okModalButton;
                vm.resolve.data.componentConfig.cancel = cancelModalButton;
                vm.resolve.data.componentConfig.failLoadComponent = onFailLoadChildComponent;
			}else{
				vm.resolve.data.componentConfig = {
					ok: okModalButton,
					cancel: cancelModalButton,
                    failLoadComponent: onFailLoadChildComponent
				}
			}

			if(!vm.resolve.data.type){
				var htmlComponentName = vm.resolve.data.component;
				var composedHtmlArray = ['<',htmlComponentName,' config="vm.resolve.data.componentConfig">','</',htmlComponentName,'>'];
				var elem = angular.element(composedHtmlArray.join(''));
				$compile(elem)($scope);
				var result = $element[0].querySelector('#modal-body');
				angular.element(result).append(elem)
			}
    	}

    	function okModalButton(response){
            if(vm.resolve.data.componentConfig && vm.resolve.data.componentConfig.onConfirm){
            	//onConfirm es una funcion que se pasa desde el componente padre y que la modal lanza para saber
				//cuando cerrarse (cuando la funcion ha obtenido algun resultado)
                vm.disableForm = true;
                executeFunction(vm.resolve.data.componentConfig.onConfirm,vm.resolve.data.componentConfig.onConfirmData);
			}else{
                vm.close({$value:response});
			}
    	}

    	function executeFunction(confirm,data){
    		var promise = null;
            if(typeof confirm === 'string'){
            	promise = requestFactory.request(confirm,data)
			}else{
            	promise = confirm(data)
			}
			promise
                .then(function(){
                    vm.close();
                    return true
                })
                .catch(function(error){
                    vm.dismiss({$value:error})
                })
                .finally(function(){
                    vm.disableForm = false;
                })
		}

    	function cancelModalButton(response){
    		//tambien se podria implementar un onCancel para el boton cancelar
			vm.dismiss({$value:response});
    	}

    	function onFailLoadChildComponent(){
            vm.showCloseButton = true;
		}
    	
    }
})();