/**
 * Created by tiwen.wang on 6/26/2015.
 */
(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name app.components.photoLocateDialog
     */
    angular.module('app.components')
        .factory('$PhotoLocateDialog', ['$mdDialog', '$log', '$filter', 'Photos', 'Users',
            MmdPhotoLocateDialogProvider]);

    var LOG_TAG = "[Photo locate dialog] ";

    function MmdPhotoLocateDialogProvider($mdDialog, $log, $filter, Photos, Users) {

        return {
            show: showLocate
        };

        /**
         * show photo in photo dialog
         * @param ev
         * @param photo {} photo object
         */
        function showLocate(ev, photo) {
            return $mdDialog.show({
                controller: ['$scope', '$mdDialog', '$timeout', '$q', 'leafletData',
                    '$mmdLeafletUtil', '$mmdMessage', 'QQWebapi', 'Photos',
                    'photo', PhotoDialogController],
                templateUrl: 'components/photoDialog/locateDialog/locateDialog.tpl.html',
                targetEvent: ev,
                locals: {
                    photo: photo
                }
            });
        }

        /**
         *
         * @param $scope
         * @param $mdDialog
         * @param $timeout
         * @param $q
         * @param leafletData
         * @param $mmdLeafletUtil
         * @param $mmdMessage
         * @param QQWebapi
         * @param Photos
         * @param photo
         * @constructor
         */
        function PhotoDialogController($scope, $mdDialog, $timeout, $q, leafletData,
                                       $mmdLeafletUtil, $mmdMessage, QQWebapi,
                                       Photos, photo) {
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

            // TODO
            photo.location = photo.location||{};
            photo.location.position = photo.location.position||[0,0];
            if(photo.location.position.length<2){
                photo.location.position = [0,0];
            }

            angular.extend($scope, {
                layers: {
                    baselayers: {},
                    overlays: {}
                }
            });
            var controlLayers = L.control.layersManager({},{},{autoZIndex: false});

            var marker = $mmdLeafletUtil.photoMarker(photo, null, {draggable: true});
            marker.on('dragend', function (e) {
                $scope.setLocation(e.target.getLatLng());
            });

            leafletData.getMap('locate-map').then(function(map) {
                self.map = map;
                // 由于动态产生的界面地图容器大小会变化，所以在创建后再检查容器大小是否变化
                $timeout(function () {
                    map.invalidateSize(false);
                }, 500);
                controlLayers.addTo(map);
                L.control.locate({
                    icon: "fa fa-dot-circle-o"
                }).addTo(map);

                marker.addTo(map);
                map.setView(marker.getLatLng(), 18);
            });

            controlLayers.addMap({
                id: '1',
                name: 'WorldImagery',
                baseLayer: 'Esri.WorldImagery'
            });
            //mapBaseLayer = "MapBox.Streets";
            //controlLayers.setBaseLayer(mapBaseLayer, mapBaseLayer);
            //mapBaseLayer = "AMap.Satellite";
            //controlLayers.setBaseLayer(mapBaseLayer, mapBaseLayer);
            //mapBaseLayer = "AMap.Base";
            //controlLayers.setBaseLayer(mapBaseLayer, mapBaseLayer);

            $scope.searchText = photo.location.address;
            $scope.addresses = [];
            $scope.location = {};
            $scope.setLocation = function(latLng) {
                $scope.location = latLng;
                QQWebapi.geodecoder(latLng.lat + "," + latLng.lng).then(function (res) {
                    if (res.status === 0) {
                        $scope.location.address = res.result.address;
                        if (res.result.pois) {
                            $scope.addresses = res.result.pois;
                            angular.forEach($scope.addresses, function (address, key) {
                                address.display = address.address + " " + address.title;
                            });
                        }
                    } else {

                    }
                });
            };

            $scope.getMap = function() {
                if(self.map) {
                    return $q.when(self.map);
                }else {
                    return leafletData.getMap('main-map');
                }
            };

            $scope.save = function() {
                var location = {};
                if($scope.location) {
                    location.position = [$scope.location.lng, $scope.location.lat];
                }
                if($scope.location.address) {
                    location.address = $scope.location.address;
                }
                Photos.updateLocation(photo.id, location).then(function(photo) {
                    $mmdMessage.success.update();
                },function(err) {
                    $mmdMessage.fail.update(err.statusText);
                });
            };

            // list of `state` value/display objects
            $scope.querySearch = querySearch;
            $scope.selectedItemChange = selectedItemChange;
            $scope.searchTextChange = searchTextChange;

            /**
             * Search for states... use $timeout to simulate
             * remote dataservice call.
             */
            function querySearch(query) {
                $scope.location.address = query;
                return $scope.addresses || [];
            }

            function searchTextChange(text) {
                $log.debug(LOG_TAG+'Text changed to ' + text);
                $scope.location.address = text;
            }

            function selectedItemChange(item) {
                $log.debug(LOG_TAG+'Item changed to ' + JSON.stringify(item));
                if(item) {
                    $scope.location.address = item.display;
                }
            }
        }
    }
})();