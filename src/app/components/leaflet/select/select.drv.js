/**
 * Created by tiwen.wang on 6/29/2015.
 */
(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name app.components.leaflet.select
     */
    angular.module('app.components.leaflet.select', [])
        .factory('$MapSelectDialog', ['$mdDialog', '$log',
            MapSelectDialogProvider]);

    var LOG_TAG = "[Map select dialog] ";

    function MapSelectDialogProvider($mdDialog, $log) {

        return {
            show: showSelector
        };

        function showSelector(ev, multiple) {
            return $mdDialog.show({
                controller: ['$scope', '$mdDialog', 'leafletData', '$timeout', '$q', 'Maps', 'multiple', MapSelectDialogController],
                templateUrl: 'components/leaflet/select/select.tpl.html',
                targetEvent: ev,
                locals: {
                    multiple: multiple
                }
            });
        }

        function MapSelectDialogController($scope, $mdDialog, leafletData, $timeout, $q, Maps, multiple) {
            var self = this;

            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };

            angular.extend($scope, {
                layers: {
                    baselayers: {},
                    overlays: {}
                }
            });

            $scope.getMap = function() {
                if(self.map) {
                    return $q.when(self.map);
                }else {
                    return leafletData.getMap('selector-map');
                }
            };
            var controlLayers = L.control.layersManager({},{},{autoZIndex: false});

            $scope.getMap().then(function(map) {
                self.map = map;
                // 由于动态产生的界面地图容器大小会变化，所以在创建后再检查容器大小是否变化
                $timeout(function () {
                    map.invalidateSize(false);
                }, 500);
                controlLayers.addTo(map);
                L.control.locate({
                    icon: "fa fa-dot-circle-o"
                }).addTo(map);
            });

            Maps.getAll().then(function(maps) {
                $scope.maps = maps;
                // init select a map
                if($scope.maps&&$scope.maps.length) {
                    $scope.mapSelected($scope.maps[0]);
                    $scope.maps[0].selected = true;
                }
            });

            $scope.mapSelected = function(map) {
                if(multiple) {
                    // ng-click在checkbox之前执行
                    if(!map.selected) {
                        $scope.selMap = map;
                        controlLayers.addMap($scope.selMap);
                    }
                }else {
                    if($scope.selMap) {
                        $scope.selMap.selected = false;
                    }
                    //map.selected = true;
                    $scope.selMap = map;
                    controlLayers.addMap($scope.selMap);
                }
            };

            $scope.save = function() {
                if(multiple) {
                    var selMaps = [];
                    angular.forEach($scope.maps, function(map, key) {
                        if(map.selected) {
                            delete map.selected;
                            selMaps.push(map);
                        }
                    });
                    $scope.answer(selMaps);
                }else {
                    delete $scope.selMap.selected;
                    $scope.answer([$scope.selMap]);
                }
            };
        }
    }
})();