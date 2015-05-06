/**
 * Created by tiwen.wang on 4/25/2015.
 */
(function() {

    'use strict';

    angular.module('app.core.services', ['restangular'])
        .config(['RestangularProvider', function(RestangularProvider) {
            RestangularProvider.setBaseUrl('http://www.photoshows.cn/api/rest');

            // add a response intereceptor
            RestangularProvider.addResponseInterceptor(
                function(data, operation, what, url, response, deferred) {
                var extractedData;
                // .. to look for getList operations
                if (operation === "getList") {
                    // .. and handle the data and meta data
                    //extractedData = data.data.data;
                    //extractedData.meta = data.data.meta;
                    switch(what) {
                        case 'panoramio/photo':
                            extractedData = data.photos;
                            break;
                        case 'comment':
                            extractedData = data.comments;
                            break;
                        default :
                            extractedData = data;
                    }
                } else {
                    switch(what) {
                        case 'photo':
                            extractedData = data.prop;
                            break;
                        case 'openinfo':
                            if(data.open_info) {
                                extractedData = data.open_info;
                            }
                            break;
                        case 'camerainfo':
                            if(data.camera_info) {
                                extractedData = data.camera_info;
                            }
                            break;
                        case 'user':
                            extractedData = data.open_info;
                            break;
                        case 'travel':
                            extractedData = data.travel;
                            break;
                        default :
                            extractedData = data;
                    }
                }
                return extractedData;
            });
        }])
        .factory('Photos', ['Restangular', PhotoServiceFactory])
        .factory('Users', ['Restangular', UsersServiceFactory])
        .factory('Panoramios', ['Restangular', PanoramiosServiceFactory]);

    function PhotoServiceFactory(Restangular) {
        var photoService = Restangular.service('photo');
        Restangular.extendModel('photo', function(model) {
            model.getCameraInfo = function() {
                return this.one('camerainfo').get();
            };
            model.getComments = function() {
                return this.all('comment').getList();
            };
            return model;
        });
        return {
            get: getPhoto
        };

        function getPhoto(id) {
            return photoService.one(id).get();
        }
    }

    function UsersServiceFactory(Restangular) {
        var userService = Restangular.service('user');
        return {
            me: getMe,
            get: getUser

        };

        function getMe() {
            return userService.one().get();
        }

        function getUser(id) {
            return userService.one(id).one('openinfo').get();
        }
    }

    function PanoramiosServiceFactory(Restangular) {
        return Restangular.service('panoramio/photo');
    }
})();