(function() {
    'use strict';

    angular
        .module('gestionCitas')
        .service('festivosService', Service);

    Service.$inject = ['requestFactory'];

    /* @ngInject */
    function Service(requestFactory) {
        this.getHolidays = getHolidays;
        this.saveHolidays = saveHolidays;

        ////////////////

        function getHolidays() {
            return requestFactory.request('getHolidays')
                .then(function(response){
                    if(response.success){
                        return response
                    }else{
                        throw response
                    }
                })
                .catch(function(error){
                    throw error.message
                })
        }

        function saveHolidays() {
            return requestFactory.request('saveHolidays')
                .then(function(response){
                    if(response.success){
                        return response
                    }else{
                        throw response
                    }
                })
                .catch(function(error){
                    throw error.message
                })
        }

    }
})();