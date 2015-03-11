'use strict';
/**
  * Bomberman module
  */
var app = angular.module('bomberman', ['ngRoute']);

/**
  * Routing to templates and controllers
  */
app.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl : 'app/components/handshake/handshake.html',
        controller  : 'HandshakeController'
    }).when('/bomberman', {
        templateUrl : 'app/components/bomberman/bomberman.html',
        controller  : 'BombermanController'
    });
});