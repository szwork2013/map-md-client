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
                            extractedData = data;
                    }
                } else {
                    switch(what) {
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
                        //case 'user':
                        //    extractedData = data.open_info;
                        //    break;
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
        .factory('Panoramios', ['ApiRestangular', PanoramiosServiceFactory])
        .factory('Comments', ['ApiRestangular', CommentsServiceFactory])
        .factory('Tracks', ['LocalRestangular', TrackServiceFactory])
        .factory('GeoJSONs', ['ApiRestangular', GeoJSONServiceFactory])
    ;

    function PhotoServiceFactory(Restangular) {
        var photoService = Restangular.service('photo');
        Restangular.extendModel('photo', function(model) {
            model.getCameraInfo = function() {
                return this.one('camerainfo').get();
            };
            model.getComments = function() {
                return this.all('comment').getList();
            };
            model.favorite = function() {
                return this.one('like').get();
            };
            model.unFavorite = function() {
                return this.one('like').remove();
            };
            return model;
        });
        return {
            get: getPhoto,
            remove: removePhoto
        };

        function getPhoto(id) {
            return photoService.one(id).get();
        }

        function removePhoto(id) {
            return photoService.one(id).remove();
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

    function TrackServiceFactory(Restangular) {

        var trackService = Restangular.service('track');

        return {
            get: getTrack,
            search: search
        };

        function getTrack(id) {
            return trackService.one(id).get();
        }

        function search(text) {
            return trackService.one().all('tracks').getList();
        }
    }

    function GeoJSONServiceFactory(Restangular) {
        var service = Restangular.service('geojson');

        return {
            create: create,
            get: getGeoJSON,
            update: update,
            search: search
        };

        function create(geoJSON) {
            return service.post(geoJSON);
        }

        function getGeoJSON(id) {
            return service.one(id).get();
        }

        function update(geoJSON) {
            return service.one().post(geoJSON.id, geoJSON);
        }

        function search(query) {
            return service.one().get({query: query});
        }
    }

})();