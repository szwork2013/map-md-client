/**
 * Created by tiwen.wang on 5/21/2015.
 */
(function () {
    'use strict';

    var LOG_TAG = "Drv-search: ";

    angular.module('app.components.search', ['angular-gestures'])
        .directive('mmdSearch', ['$mdTheming', '$q', '$log', '$state', 'QQWebapi', 'OSMWS',
            mmdSearchDirective]);

    var GeoSearchControl;

    function mmdSearchDirective($mdTheming, $q, $log, $state, QQWebapi, OSMWS) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                getMap: '=?'
            },
            link: link,
            templateUrl: 'components/search/search.tpl.html'
        };

        function link(scope, element, attrs) {
            $mdTheming(element);

            var geoSearchControl;
                scope.loc = 2;
            scope.getMap().then(function(map) {
                if(map) {
                    $log.debug(LOG_TAG + "got map");
                }
                geoSearchControl = new GeoSearchControl();
                geoSearchControl.addTo(map);
            });

            var defaultItems = [{
                    search: true, // 表示此item用来转向搜索页面
                    display_name: "搜索图片 ",
                    state: 'app.maps.search.photo'
                },
                {
                    search: true,
                    display_name: "搜索专辑 ",
                    state: 'app.maps.search.album'
                },
                {
                    search: true,
                    display_name: "搜索用户/组 ",
                    state: 'app.maps.search.user'
                }];

            scope.geoSearch = function(text) {
                var deferred = $q.defer();
                if(text && text.length) {
                    if(text.length > 1) {
                        if(scope.loc == 1) {
                            QQWebapi.suggestion(text).then(function(res) {
                                if(res.status === 0) {
                                    deferred.resolve(decodeQQSuggestion(res.data));
                                }else {
                                    deferred.resolve([]);
                                }

                                //if(scope.ress.length) {
                                //    scope.locate(scope.ress[0]);
                                //}else {
                                //    scope.message = "未查到结果";
                                //}
                                //$log.debug(LOG_TAG + " got results for " + text);
                            }, function() {
                                deferred.resolve([]);
                            });
                            //QQWebapi.geocoder(text).then(function(res) {
                            //    $log.debug(LOG_TAG + " results:");
                            //    $log.debug(res);
                            //
                            //    if(res.result) {
                            //        scope.ress = decodeQQ(res.result);
                            //        deferred.resolve(scope.ress);
                            //    }
                            //
                            //    if(scope.ress.length) {
                            //        scope.locate(scope.ress[0]);
                            //    }else {
                            //        scope.message = "未查到结果";
                            //    }
                            //    $log.debug(LOG_TAG + " got results for " + text);
                            //}, function() {
                            //    deferred.resolve([]);
                            //});
                        }else {
                            OSMWS.geocoder(text).then(function(res) {
                                scope.ress = decodeOSM(res);
                                deferred.resolve(getSearchItems(scope.ress, text));
                                if(scope.ress.length) {
                                    //scope.locate(scope.ress[0]);
                                }else {
                                    scope.message = "未查到结果";
                                }
                                $log.debug(LOG_TAG + " got results for " + text);
                            }, function() {
                                deferred.resolve(getSearchItems([], text));
                            });
                        }
                    }else {
                        deferred.resolve(getSearchItems([], text));
                    }
                }else {
                    deferred.resolve([]);
                }
                return deferred.promise;
            };

            function getSearchItems(items, keyword) {
                var searchItems = angular.copy(defaultItems);
                angular.forEach(searchItems, function(item, key) {
                    item.display_name = item.display_name + keyword;
                    item.searchText = keyword;
                    item.keyword = keyword;
                });
                return searchItems.concat(items);
            }

            scope.selectedItemChange = function(item) {
                if(item) {
                    if(item.search) {
                        $state.go(item.state, {keyword: item.keyword});
                    }else {
                        geoSearchControl.locate(item);
                    }
                }
            };

            scope.searchTextChange = function(text) {
                if(!text) {
                    geoSearchControl.reset();
                }
            };

            scope.locate = function(res) {
                geoSearchControl.locate(res);
            };

            function decodeQQSuggestion(data) {
                angular.forEach(data, function(value, key) {
                    value.display_name = value.province + value.city + value.district + " " + value.title;
                    value.searchText = value.display_name;
                });
                return data;
            }

            function decodeQQ(result) {
                var locations = [];
                var name = result.address_components.province +
                    result.address_components.city +
                    result.address_components.district +
                    result.address_components.street +
                    result.address_components.street_number;

                var location = {
                    location: result.location,
                    display_name: name,
                    address: result.address_components
                };

                locations.push(location);
                return locations;
            }

            function decodeOSM(result) {
                angular.forEach(result, function(location, key) {
                    location.location = {
                        lat: location.lat,
                        lng: location.lon
                    };
                    location.searchText = location.display_name;
                });
                return result;
            }
        }
    }

    GeoSearchControl = function() {};

    angular.extend(GeoSearchControl.prototype, {
        _marker: null,
        locate: function(result) {
            if(!this._marker) {
                this._marker = L.marker(result.location);
            }else {
                this._marker.setLatLng(L.latLng(result.location));
            }

            if(!this._map.hasLayer(this.marker)) {
                this._marker.addTo(this._map);
            }
            if(result.boundingbox) {
                this._map.fitBounds([[result.boundingbox[0], result.boundingbox[2]],
                    [result.boundingbox[1], result.boundingbox[3]]]);
            }else {
                this._map.setView(this._marker.getLatLng());
            }
        },
        addTo: function(map) {
            this._map = map;
        },
        remove: function() {
            this._map.removeLayer(this._marker);
            this._map = null;
        },
        reset: function() {
            if(this._marker && this._map.hasLayer(this._marker)) {
                this._map.removeLayer(this._marker);
            }
        }
    });
})();