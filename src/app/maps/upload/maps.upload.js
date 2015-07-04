/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function () {
    'use strict';

    angular.module('app.maps.upload', ['ngFileUpload', 'ngSanitize', 'blueimp.fileupload'])
        .config(['$httpProvider', '$urlRouterProvider', '$stateProvider', 'fileUploadProvider',
            function ($httpProvider, $urlRouterProvider, $stateProvider, fileUploadProvider) {

                $stateProvider
                    .state('app.maps.upload', {
                        url: '/upload?album',
                        templateUrl: 'maps/upload/maps.upload.tpl.html',
                        controller: "MapsUploadCtrl as mupc",
                        resolve: {
                            albumId: ['$stateParams', function($stateParams){
                                return $stateParams.album;
                            }]
                        }
                    });

                delete $httpProvider.defaults.headers.common['X-Requested-With'];
                fileUploadProvider.defaults.redirect = window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                );

//                if (isOnGitHub) {
//                    // Demo settings:
                angular.extend(fileUploadProvider.defaults, {
//                autoUpload: false,
//                autoUpload: !window.dev,

                    // Enable image resizing, except for Android and Opera,
                    // which actually support image resizing, but fail to
                    // send Blob objects via XHR requests:
//                        disableImageResize: /Android(?!.*Chrome)|Opera/
//                            .test(window.navigator.userAgent),
                    maxFileSize: 10000000,
//                        loadImageMaxFileSize: 10000000,
//                        imageQuality: 2000000,
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
//                        disableImageResize: /Android(?!.*Chrome)|Opera/
//                            .test(window.navigator && navigator.userAgent),
                    //previewMaxWidth: 200,
                    //previewMaxHeight: 200,
                    //previewCrop: true, // Force cropped images,
                    previewCanvas: false,

                    previewCrop: false
//                        disableImageMetaDataLoad: true,
//                        imageMinHeight: 1098,
//                        imageMaxWidth: 5000,
//                        imageMaxHeight: 2000

                });
            }])
        .controller('MapsUploadCtrl', ['$scope', '$log', '$q', '$menuBottomSheet', 'QQWebapi', 'Users', 'Albums',
            'albumId', 'Authenticate', MapsUploadCtrl])
        .controller('MapsFileUploadCtrl', ['$window', '$scope', '$log', '$q', 'fileUpload',
            '$mmdUtil', 'serverBaseUrl', MapsFileUploadCtrl])
        .controller('MapsFileUploadPhotoCtrl', ['$scope', '$log', '$q', 'Photos', '$mmdMessage', '$mmdUtil',
            MapsFileUploadPhotoCtrl])
        .controller('MapsFileUploadDestoryCtrl', ['$window', '$scope', '$log', '$q', 'Photos',
            '$mmdUtil', MapsFileUploadDestoryCtrl])
        .controller('AlbumsSelectCtrl', ['$scope', '$log', '$q', 'Users', AlbumsSelectCtrl])
    ;

    var LOG_TAG = "[Maps-Upload] ";
    var PhotoMarkableControl;

    function MapsUploadCtrl($scope, $log, $q, $menuBottomSheet, QQWebapi, Users, Albums, albumId, Authenticate) {
        var self = this;
        $scope.showBottomSheet = function($event) {
            $menuBottomSheet.show($event, [
                'app.maps.popular',
                'app.maps.cluster.my',
                'app.maps.track.upload',
                'app.helps.upload']);
        };

        if(albumId) {
            $scope.albumId = albumId;
        }

        /**
         * 获取登录用户
         */
        Authenticate.getUser().then(function(user) {
            self.user = user;
        });

        self.albumSelected = function(album) {
            $scope.album = album;
        };

        /**
         * 地图标记控件
         */
        var photoMarkableControl;
        $scope.getMap().then(function (map) {
            photoMarkableControl = new PhotoMarkableControl().addTo(map);
        });

        // markable photo on map
        var markingFile;
        $scope.markable = function (file, e) {
            $scope.getMap().then(function (map) {
                photoMarkableControl.cancel();
                if (markingFile === file) {
                    file.markable = false;
                    markingFile = null;
                    //map.editTools.stopDrawing();
                } else {
                    if (markingFile) {
                        if (!markingFile.marker) {
                            //map.editTools.stopDrawing();
                        }
                        markingFile.markable = false;
                    }
                    file.markable = true;
                    markingFile = file;
                    if (!markingFile.marker) {
                        photoMarkableControl.marking(file);
                    } else if (!e) {
                        map.setView(markingFile.marker.getLatLng());
                    }
                }
            });
        };

        $scope.removeMarker = function (file) {
            if (markingFile === file) {
                markingFile = null;
            }
            photoMarkableControl.removeMarker(file);
        };

        $scope.addMarker = function(file) {
            photoMarkableControl.addMarker(file);
        };

        /**
         * 获取和设置图片位置
         * @param file
         * @param latLng
         */
        $scope.setLocation = function setLocation(file, latLng) {
            file.setPosition([latLng.lng, latLng.lat]);
            QQWebapi.geodecoder(latLng.lat + "," + latLng.lng).then(function (res) {
                if (res.status === 0) {
                    latLng.address = res.result.address;
                    file.setPosition([latLng.lng, latLng.lat]);
                    file.setAddress(res.result.address);
                    if (res.result.pois) {
                        file.addresses = res.result.pois;
                        angular.forEach(file.addresses, function (address, key) {
                            address.display = address.address + " " + address.title;
                        });
                    }
                } else {

                }
            });
        };

        /**
         * 控制器退出时执行清空操作
         */
        $scope.$on('$destroy', function (e) {
            $scope.getMap().then(function (map) {
                map.removeControl(photoMarkableControl);
            });
        });

        PhotoMarkableControl = L.Control.Layers.extend({
            options: {
                position: 'topright',
                draw: {},
                edit: false
            },
            _marking: false,
            _marker: null,
            _markFile: null,
            initialize: function (options) {
                L.Control.Layers.prototype.initialize.call(this, options);
                this._marker = L.marker(L.latLng(0, 0));
                this._layerGroup = L.layerGroup([]);
            },
            _deferred: null,
            marking: function (file) {
                var deferred = $q.defer();
                this._markFile = file;
                if (!this._marking) {
                    this._marking = true;
                    this._marker.addTo(this._map);
                }
                this._deferred = deferred;
                return this._deferred.promise;
            },
            removeMarker: function (file) {
                var self = this;
                if (file.marker && this._map.hasLayer(file.marker)) {
                    this._map.removeLayer(file.marker);
                    self._layerGroup.removeLayer(file.marker);
                    delete file.marker;
                }
                return file;
            },
            addMarker: function(file) {
                if(!file.marker) {
                    this.createMarker(file, L.latLng(file.position[1], file.position[0]));
                }
            },
            cancel: function () {
                var self = this;
                if (self._marking) {
                    self._marker.setLatLng(L.latLng(0, 0));
                    self._map.removeLayer(self._marker);
                }
                self._marking = false;
                self._deferred = null;
            },
            onAdd: function (map) {
                var self = this;
                var container = L.Control.Layers.prototype.onAdd.call(this, map);
                map.on('mousemove', function (e) {
                    if (self._marking) {
                        self._marker.setLatLng(e.latlng);
                    }
                });
                map.on('click', function (e) {
                    if (self._marking) {
                        var marker = self.createMarker(self._markFile, e.latlng);
                        self._deferred.resolve(marker);
                        self.cancel();
                    }
                });
                self._layerGroup.addTo(map);
                self.addOverlay(self._layerGroup, "图片位置标注");
                return container;
            },
            onRemove: function () {
                var self = this;
                self._layerGroup.clearLayers();
            },
            createMarker: function (file, latlng) {
                var self = this;
                var marker = L.marker(latlng, {
                    draggable: true
                });
                marker.addTo(self._map);
                self._layerGroup.addLayer(marker);
                marker.on('dragend', function (e) {
                    $scope.setLocation(file, e.target.getLatLng());
                });
                file.marker = marker;
                $scope.setLocation(file, latlng);
                return marker;
            }
        });
    }

    /**
     * 图片上传控制器
     * @param $window
     * @param $scope
     * @param $log
     * @param $q
     * @param fileUpload
     * @param $mmdUtil
     * @param serverBaseUrl
     * @constructor
     */
    function MapsFileUploadCtrl($window, $scope, $log, $q, fileUpload, $mmdUtil, serverBaseUrl) {

        var self = this;

        self.cancel = function (index) {
            $scope.files.splice(index, 1);
        };

        self.fileSelected = function (files, e) {
            $scope.add({files: files});
        };

        self.submit = function (file) {
            file.$submit();
        };

        function getToken() {
            var token = JSON.parse($window.localStorage.getItem('accessToken'));
            if (token && token.access_token) {
                return 'Bearer ' + token.access_token;
            } else {
                return '';
            }
        }

        /**
         * 授权成功事件，更新token
         */
        $scope.$on('auth:oauthed', function() {
            $scope.options.headers.Authorization = getToken();
        });

        $scope.options = {

            autoUpload: false,

            url: serverBaseUrl+"/api/rest/photo/upload",
            headers: {
                Authorization: getToken()
            },

            submit: function(e, data) {
                $log.debug("submit "+data.files[0].name);
                data.files[0].uploading = true;
            },

            formData: function () {
                var file = this.files[0];
                var imageProps = {
                    title: file.title || '',
                    description: file.description || ''
                };
                if(file.preview&&file.preview.color) {
                    imageProps.color = file.preview.color;
                }
                var formDatas = [{
                    name: "location",
                    value: JSON.stringify(file.photo.location)
                },{
                    name: "image",
                    value: JSON.stringify(imageProps)
                }
                ];

                // 添加到相册
                if($scope.album) {
                    formDatas.push({
                        name: "album",
                        value: $scope.album.id
                    });
                }
                // 全景
                if(file.is360) {
                    formDatas.push({
                        name: "is360",
                        value: file.is360
                    });
                }
                // 标签
                formDatas.push({
                    name: "tags",
                    value: file.photo.tags
                });
                return formDatas;
            },
            done: function (e, data) {
                var file = data.files[0];

                var photo = data.result;
                extractProps(data.files[0], photo);
                file.done();
            },
            fail: function (e, data) {
                data.files[0].uploading = false;
                if (data.result) {
                    data.files[0].$cancel = function () {
                        data.files[0].$destroy();
                    };
                } else {
                    fileUpload.defaults.fail(e, data);
                }
            }
        };

        /**
         * 从server返回的图片属性中抽取信息给file
         *
         * @param file
         * @param photo
         */
        function extractProps(file, photo) {
            file.photoId = photo.id;
            file.is360 = photo.is360;

            angular.extend(file.photo, photo);

            if (!file.address) {
                $scope.$emit('photoAdd', file.photo);
            }
        }

        if (!fileUpload.defaults.autoUpload) {
            // TODO DEBUG
            $scope.options.add =
                function (e, data) {
                    if (e.isDefaultPrevented()) {
                        return false;
                    }
                    // call default add method
                    fileUpload.defaults.add(e, data);
                    // load image's gps info
                    var file = data.files[0];

                    // 读取图片的gps信息
                    loadImage.parseMetaData(file, function (data) {
                        if (data.exif) {
                            var position = [];
                            var lat = data.exif.getText('GPSLatitude');
                            if (lat && lat != "undefined") {
                                position[1] = Number(lat);
                                if (!position[1]) {
                                    position[1] = $mmdUtil.map.GPS.convert(lat);
                                }
                            }

                            var lng = data.exif.getText('GPSLongitude');
                            if (lng && lng != "undefined") {
                                position[0] = Number(lng);
                                if (!position[0]) {
                                    position[0] = $mmdUtil.map.GPS.convert(lng);
                                }
                            }
                            if(position[0] && position[1]) {
                                file.setPosition(position);
                                $scope.addMarker(file);
                            }
                        }
                    });
                };
        }
    }

    /**
     * 每行上传图片的控制器
     * @param $scope
     * @param $log
     * @param $q
     * @param Photos
     * @param $mmdMessage
     * @param $mmdUtil
     * @constructor
     */
    function MapsFileUploadPhotoCtrl($scope, $log, $q, Photos, $mmdMessage, $mmdUtil) {
        var self = this;

        var file = $scope.file;
        file.photo = {
            tags: [],
            location: {
                position: []
            }
        };
        file.setPosition = function (position) {
            return this.photo.location.position = position;
        };
        file.addresses = [];
        file.setAddress = function (address) {
            this.photo.location.address = address;
            //self.searchText = address;
        };

        self.remove = function (file) {
            $scope.removeMarker(file);
            file.$cancel();
        };

        // list of `state` value/display objects
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;

        /**
         * Search for states... use $timeout to simulate
         * remote dataservice call.
         */
        function querySearch(query) {
            return file.addresses || [];
        }

        function searchTextChange(text) {
            //$log.info('Text changed to ' + text);
            file.photo.location.address = text;
        }

        function selectedItemChange(item) {
            //$log.info('Item changed to ' + JSON.stringify(item));
            if(item) {
                file.photo.location.address = item.display;
            }
        }

        // tags
        self.tagsSearch = tagsSearch;
        self.vegetables = loadVegetables();
        self.selectedTags = [];
        /**
         * Search for vegetables.
         */
        function tagsSearch(query) {
            var results = query ? self.vegetables.filter(createFilterFor(query)) : [];
            return results;
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(vegetable) {
                return (vegetable._lowername.indexOf(lowercaseQuery) > -1) ||
                    (vegetable._lowertype.indexOf(lowercaseQuery) > -1);
            };
        }

        function loadVegetables() {
            var veggies = [
                {
                    'name': '大山',
                    'type': '自然'
                },
                {
                    'name': '大川',
                    'type': '自然'
                },
                {
                    'name': '山川',
                    'type': '自然'
                },
                {
                    'name': 'Lettuce',
                    'type': 'Composite'
                },
                {
                    'name': 'Spinach',
                    'type': 'Goosefoot'
                }
            ];
            return veggies.map(function (veg) {
                veg._lowername = veg.name.toLowerCase();
                veg._lowertype = veg.type.toLowerCase();
                return veg;
            });
        }

        /**
         * 文件上传完成回调
         */
        $scope.file.done = function() {
            $scope.fileForm.$setPristine();
            this.uploaded = true;
            $mmdMessage.success.save(this.name);
        };

        /**
         * 更新图片属性
         */
        self.update = function() {
            if($scope.file.photo && $scope.file.photo.id) {
                Photos.update($scope.file.photo.id, {
                    title: $scope.file.title,
                    description: $scope.file.description,
                    location: $scope.file.photo.location,
                    is360: angular.extend($scope.file.photo.is360, $scope.file.is360),
                    tags: $scope.file.photo.tags
                }).then(function() {
                    $scope.fileForm.$setPristine();
                    $mmdMessage.success.update();
                },function(err) {
                    $mmdMessage.fail.update(err.statusText);
                });
            }
        };
    }

    /**
     * 上传图片的销毁控制器
     * @param $window
     * @param $scope
     * @param $log
     * @param $q
     * @param Photos
     * @param $mmdUtil
     * @constructor
     */
    function MapsFileUploadDestoryCtrl($window, $scope, $log, $q, Photos, $mmdUtil) {
        var self = this;
        var file = $scope.file;

        file.$destroy = function () {
            if (this.photo.id) {
                self.destroying = true;
                Photos.remove(this.photo.id).then(function (data) {
                    $scope.removeMarker(file);
                    $scope.clear(file);
                }, function(error) {
                    self.destroying = false;
                });
            }
        };
    }

    function AlbumsSelectCtrl($scope, $log, $q, Users) {

        $scope.loadAlbums = function() {
            Users.getAlbums().then(function(albums) {

            });
        };
    }
})();