/**
 * Created by tiwen.wang on 6/19/2015.
 */
(function () {
    'use strict';

    angular.module('app.albums.new', ['app.albums'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {

                $stateProvider
                    .state('app.albums.new', {
                        url: '/new?group',
                        templateUrl: 'albums/new/new.tpl.html',
                        controller: 'AlbumsNewCtrl as anc',
                        resolve: {
                            groupId: ['$stateParams', function($stateParams){
                                return $stateParams.group;
                            }]
                        }
                    })
                ;
            }])
        .controller('AlbumsNewCtrl', ['$scope', '$state', '$log', '$mmdMessage', 'Albums', 'groupId', AlbumsNewCtrl])
    ;

    function AlbumsNewCtrl($scope, $state, $log, $mmdMessage, Albums, groupId) {
        var self = this;
        self.step = 1;

        if(groupId) {
            self.album = {
                type: "Base",
                user: {
                    id: groupId
                }
            };
        }

        self.types = [
            {code: "Base", name: "基本图片专辑"},
            {code: "FeatureCollection", name: "标记地图"}
        ];

        self.save = function(e) {
            Albums.create(self.album).then(function(album) {
                self.album = album;
                $mmdMessage.success.create();
                $scope.albumNewForm.$setPristine();
                self.step = 2;
            },function(err) {
                $mmdMessage.fail.create(err.statusText);
            });
        };
    }
})();