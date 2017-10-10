(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .factory('userFactory', factory);

    factory.$inject = [];

    /* @ngInject */
    function factory() {
        var userData = null;

        /*
        userdata = {
            id:
            centro:
        }
        */

        var service = {
            getUserData: getUserData,
            setUserData: setUserData
        };
        return service;

        ////////////////

        function getUserData(){
            if(!userData){
                var centroAux = sessionStorage.getItem('centro');
                if(centroAux){
                    userData = {
                        centro: centroAux
                    }
                }
            };
            return userData
        }

        function setUserData(data){
            sessionStorage.setItem('centro',data.centro);
            userData = data
        }
    }
})();