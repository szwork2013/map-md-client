/**
 * Created by tiwen.wang on 6/14/2015.
 */
(function () {
    'use strict';

    angular.module('app.photos', [
        'app',
        'app.photos.all',
        'app.photos.albums',
        'app.photos.album'])
        .config(['$urlRouterProvider', '$stateProvider',
            function ($urlRouterProvider, $stateProvider) {
                $urlRouterProvider
                    .when('/photos', '/photos/all');
                $stateProvider
                    .state('app.photos', {
                        abstract: true,
                        url: '/photos',
                        templateUrl: 'photos/photos.tpl.html',
                        controller: 'PhotosCtrl',
                        resolve: {}
                    })
                ;
            }])
        .controller('PhotosCtrl', ['$scope', '$state', '$log', '$mmdPhotoDialog', '$mdDialog', PhotosCtrl])
    ;

    function PhotosCtrl($scope, $state, $log, $mmdPhotoDialog, $mdDialog) {
        var self = this;

        $scope.linkItems = [
            {name: '全部', state: 'app.photos.all'},
            {name: '相册', state: 'app.photos.albums'}
        ];

        //$scope.$watch('menuSelectedIndex', function(current, old) {
        //    if(old!==undefined && current!==undefined) {
        //        $state.go($scope.linkItems[current].state);
        //    }
        //});
        self.state = '';
        $scope.selectPage = function(page) {
            if(self.state && self.state != page.state) {
                self.state = page.state;
                $state.go(page.state, page.params);
            }
        };

        $scope.setPage = function(state, name, params) {
            self.state = state;
            if(state == "app.photos.all") {
                $scope.menuSelectedIndex = 0;
            }else if(state == "app.photos.albums") {
                $scope.menuSelectedIndex = 1;
            }else if(state == "app.photos.album") {
                $scope.linkItems[2] = {
                    name: name,
                    state: state,
                    params: params
                };
                $scope.menuSelectedIndex = 2;
            }
        };

        $scope.displayPhoto = function($event, photo) {
            $mmdPhotoDialog.show($event, {id: photo.id});
        };

        $scope.showConfirm = function(ev, title, content) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.body))
                .title(title)
                .content(content)
                .ariaLabel('confirm dialog')
                .ok('确认')
                .cancel('取消')
                .targetEvent(ev);
            return $mdDialog.show(confirm);
        };

        $scope.showSelectPrompt = function(ev) {
            return $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('提示')
                    .content('请选中图片')
                    .ariaLabel('选中提示')
                    .ok('去选!')
                    .targetEvent(ev)
            );
        };
    }
})();