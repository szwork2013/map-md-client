/**
 * Created by tiwen.wang on 4/30/2015.
 */
(function() {
    'use strict';

    angular.module('app.maps.user',
        ['ui.router'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('maps.user', {
                        abstract: true,
                        url: '/user/{id}',
                        views: {
                            '': {
                                templateUrl: 'maps/user/user.tpl.html',
                                controller: 'MapsUserCtrl'
                            }
                        },
                        resolve: {
                            userId: ['$stateParams', function($stateParams){
                                return $stateParams.id;
                            }]
                        }
                    });
            }])
        .controller('MapsUserCtrl', ['$scope', '$stateParams', '$log', 'Authenticated', MapsUserController]);

    function MapsUserController($scope, $stateParams, $log, Authenticated) {

        var userId = $stateParams.id || Authenticated.user.id;

        $log.debug("$stateParams user id is " + userId );
    }
})();