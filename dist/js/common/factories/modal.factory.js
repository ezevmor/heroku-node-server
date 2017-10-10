(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .factory('modalFactory', factory);

    factory.$inject = ['$uibModal'];

    /* @ngInject */
    function factory($uibModal) {
        var service = {
            open: open,
            openError: openError,
            openInformative: openInformative,
            openConfirm: openConfirm
        };
        return service;

        ////////////////

        function open(modalData) {
        	var modalConfig = {
                component: 'modalComponent',
                backdrop: 'static',
                keyboard: false,
                size: modalData.size,
                resolve: {
                    data: function () {
                      return modalData;
                    }
                }
            };

            return $uibModal.open(modalConfig);
        }


        function openModal(title,message,type,config){
            var modalData = {
                title: title,
                message: message,
                type: type,
                showButtons: true,
                componentConfig: config
            };

            var size = null;
            if(type === 'error' || type === 'informative'){
                size = 'sm'
            }

            var modalConfig = {
                component: 'modalComponent',
                backdrop: 'static',
                keyboard: false,
                size: size,
                resolve: {
                    data: function () {
                        return modalData;
                    }
                }
            };

            return $uibModal.open(modalConfig);
        }

        function openError(title,message) {
            return openModal(title, message, 'error')
        }

        function openInformative(title,message){
            return openModal(title,message,'informative')
        }

        function openConfirm(title,message,config){
            if(config.type){
                return openModal(title, message, config.type,config)
            }else{
                return openModal(title, message, 'confirm',config)
            }
        }

    }
})();