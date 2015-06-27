/**
 * Created by tiwen.wang on 6/27/2015.
 */
(function() {
    'use strict';

    angular.module('app.home.menus', [])
        .factory('$menuBottomSheet', ['$mdBottomSheet', 'Authenticate', MenuBottomSheetFactory])
        .controller('MenusBottomSheetCtrl', ['$scope', '$mdBottomSheet', '$state', 'items', MenusBottomSheetCtrl])
    ;

    function MenuBottomSheetFactory($mdBottomSheet, Authenticate) {

        var menus = {
            'app.maps.popular': {
                name: '热门图片',
                icon: 'image:photo_library',
                link: 'app.maps.popular'
            },
            'app.maps.cluster.my': {
                login: true,
                name: '我的', icon: 'social:person', link: 'app.maps.cluster.user', params:{id:''}
            },
            'app.maps.heatmap.my': {
                login: true,
                name: '我的热点', icon: 'social:person', link: 'app.maps.heatmap.user'
            },
            'app.maps.track.my': {
                login: true,
                name: '我的Track', icon: 'social:person', link: 'app.maps.track.my'
            },
            'app.maps.upload': {
                login: true,
                name: '上传图片', icon: 'image:camera', link: 'app.maps.upload'
            },
            'app.maps.track.upload': {
                login: true,
                name: '上传Track', icon: 'maps:directions_walk', link: 'app.maps.track.upload'
            },
            'app.albums.new': {
                login: true,
                name: '新建地图专辑', icon: 'maps:new_album', link: 'app.albums.new'
            },
            'app.maps.track.search': {
                name: '搜索', icon: 'action:search', link: 'app.maps.track.search'
            },
            'app.helps.upload': {
                name: 'Help', icon: 'action:help' , link: 'app.helps.upload'
            },
            'app.helps.heatmap': {
                name: 'Help', icon: 'action:help' , link: 'app.helps.heatmap'
            },
            'app.helps.track': {
                name: 'Help', icon: 'action:help' , link: 'app.helps.track'
            },
            'app.user.my': {
                login: true,
                name: '我的主页', icon: 'social:person', link: 'app.user', params: function() {
                    return {name: Authenticate.user.username};
                }
            }
        };

        return {
            show: show
        };

        function show($event, states) {
            var items = [];
            angular.forEach(states, function(state, key) {
                var item = angular.copy(menus[state]);
                if((item.login && Authenticate.login) ||
                    !item.login) {
                    if(angular.isFunction(item.params)) {
                        item.params = item.params();
                    }
                    items.push(item);
                }
            });

            return $mdBottomSheet.show({
                templateUrl: 'home/bottom-sheet-grid.tpl.html',
                controller: 'MenusBottomSheetCtrl as mbsc',
                targetEvent: $event,
                locals: {items: items}
            });
        }
    }

    function MenusBottomSheetCtrl($scope, $mdBottomSheet, $state, items) {
        $scope.items = items;
        $scope.listItemClick = function($index) {
            var clickedItem = $scope.items[$index];
            $state.go(clickedItem.link, clickedItem.params);
            $mdBottomSheet.hide(clickedItem);
        };
    }
})();