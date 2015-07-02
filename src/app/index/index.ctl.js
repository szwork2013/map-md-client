/**
 * Created by tiwen.wang on 6/30/2015.
 */
(function () {
    'use strict';

    angular.module('app.index', [
        'app'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $stateProvider
                    .state('app.index', {
                        url: '',
                        templateUrl: 'index/index.tpl.html',
                        controller: 'IndexCtrl',
                        resolve: {}
                    })
                ;
            }])
        .controller('IndexCtrl', ['$scope', '$state', '$log', '$mmdPhotoDialog', IndexCtrl])
    ;

    var LOG_TAG = "[Index] ";

    function IndexCtrl($scope, $state, $log, $mmdPhotoDialog) {

    }
})();