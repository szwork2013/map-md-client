/**
 * Created by tiwen.wang on 4/25/2015.
 */
(function() {

    'use strict';

    angular.module('app.core.services', ['restangular'])
        .config(['RestangularProvider', function(RestangularProvider) {

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
                            if(data.photos) {
                                extractedData = data.photos;
                            }else {
                                extractedData = data;
                            }
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
                        case 'comment':
                            extractedData = data.comment;
                            break;
                        default :
                            extractedData = data;
                    }
                }
                return extractedData;
            });
        }])
        .factory('Photos', ['ApiRestangular', PhotoServiceFactory])
        .factory('Users', ['ApiRestangular', UsersServiceFactory])
        .factory('Panoramios', ['ApiRestangular', PanoramiosServiceFactory])
        .factory('Comments', ['ApiRestangular', CommentsServiceFactory]);

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

        //Restangular.extendModel('user', function(model) {
        //    model.getPhotos = function(pageSize, pageNo) {
        //        return this.all('photos', pageSize+'/'+pageNo).getList();
        //    };
        //});

        return {
            me: getMe,
            get: getUser,
            getPhotos: getPhotos
        };

        function getMe() {
            return userService.one().get();
        }

        function getUser(id) {
            return userService.one(id).one('openinfo').get();
        }

        function getPhotos(id, pageSize, pageNo) {
            return userService.one(id).one('photos', pageSize).all(pageNo).getList();

        }
    }

    function PanoramiosServiceFactory(Restangular) {
        return Restangular.service('panoramio/photo');
    }

    function CommentsServiceFactory(Restangular) {
        var commentService = Restangular.service('comment');
        return {
            create: createComment
        };

        /**
         * 创建评论
         * @param comment {type: type, entity_id: id, content: content}
         * @returns {*|{}}
         */
        function createComment(comment) {
            return commentService.post(comment);
        }
    }

})();