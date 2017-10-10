(function () {
  'use strict';

  angular
    .module('gestionCitas')
    .factory('requestFactory', factoryName);

  factoryName.$inject = ['environment','apiPaths','$http','modalFactory','$state'];

  /* @ngInject */
  function factoryName(environment,apiPaths,$http,modalFactory,$state) {
    var service = {
      getRequestConfig: getRequestConfig,
      request: request
    };
    return service;

    ////////////////

    function getRequestConfig(name) {
      var requestObject = {
        method: 'GET',
        url: ''
      };

      if(environment === 'real'){
        angular.extend(requestObject,apiPaths[name][environment]);
      }else{
        requestObject.url = apiPaths.mock_path + apiPaths[name][environment];
      }

      return requestObject
    }

    function request(name,requestData,urlConcat){
        if(name !== 'login' && name !== 'getCentros' && !sessionStorage.getItem('token')){
            $state.go('login');
            throw {message:'sin token'};
        }else{
            var requestConfig = getRequestConfig(name);
            requestConfig.data = requestData;

            if(urlConcat){
                requestConfig.url = requestConfig.url + urlConcat
            };

            return $http(requestConfig)
                .then(function(response){
                    if(response.data.success){
                        return response.data.data
                    }else if(response.data.message){
                        throw {message:response.data.message}
                    }else{
                        throw {message:'error en peticion o formato de respuesta incorrecto'}
                    }
                })
                .catch(function(error){
                    if(error.status === 401){
                        return openLoginModal(name,requestData);
                    }else if(error.status === -1 || error.status === 404 ){
                        throw {message:'servicio no disponible'}
                    }else{
                        throw error
                    }
                })
        }
    }

    function openLoginModal(name,requestData){
      var modalData = {
          title: null,
          showButtons: false,
          component: 'login-component',
          preventClose: true
      };

      var modalInstance =  modalFactory.open(modalData);

      return modalInstance.result
          .then(function(){
            return request(name,requestData)
          })
          .catch(function(){
            console.log("cerrado en catch")
          })
    }

  }

})();

