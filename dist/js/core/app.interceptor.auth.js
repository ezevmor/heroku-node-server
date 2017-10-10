(function () {
  'use strict';

  // var token = sessionStorage.getItem('token');

  angular
    .module('gestionCitas')
    .factory('authFactory', factoryName)
    .config(provider);

  factoryName.$inject = ['$injector','$q'];
  function factoryName($injector,$q) {
    var service = {
      request: requestFn
      // response: responseFn,
      // requestErrorFn: requestErrorFn,
      // responseError: responseErrorFn
    };

    return service;

    ////////////////

    function requestFn(config) {
      //lanza el interceptor en cada peticion
      var token = 'Bearer ' + sessionStorage.getItem('token');

      if(token){
        config.headers['Authorization'] = token
      }

      return config
    }

    function responseFn(response){
      //lanza el interceptor en cada respuesta
      return response
    }

    function requestErrorFn(rejectReason){
      //lanza el interceptor en cada peticion fallida
      return $q.reject(response)
    }

    function responseErrorFn(response){
      //lanza el interceptor en cada respuesta con error
      return $q.reject(response);
    }

  }

  provider.$inject = ['$httpProvider'];
  function provider($httpProvider){
    $httpProvider.interceptors.push('authFactory');
  }

})();
