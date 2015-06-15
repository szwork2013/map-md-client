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
                        default :
                            extractedData = data;
                    }
                }
                return extractedData;
            });
        }])
        .factory('Photos',     ['ApiRestangular', PhotoServiceFactory])
        .factory('Panoramios', ['ApiRestangular', PanoramiosServiceFactory])
        .factory('Comments',   ['ApiRestangular', CommentsServiceFactory])
        .factory('Tracks',     ['ApiRestangular', TrackServiceFactory])
        .factory('GeoJSONs',   ['ApiRestangular', GeoJSONServiceFactory])
        .factory('Albums',     ['ApiRestangular', AlbumServiceFactory])
    ;

    function PhotoServiceFactory(Restangular) {
        var photoService = Restangular.service('photo');
        Restangular.extendModel('photo', function(model) {
            model.getCameraInfo = function() {
                return this.one('camerainfo').get();
            };
            model.getComments = function() {
                return this.all('comments').getList();
            };
            model.favorite = function() {
                return this.one('like').post();
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
        return Restangular.service('panoramio');
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
            create: create,
            get: getTrack,
            search: search,
            my: my,
            remove: remove
        };

        function create(track) {
            return trackService.one().post('', track);
        }

        function getTrack(id) {
            return trackService.one(id).get();
        }

        function search(text, page, size) {
            return trackService.one().get({query: text, page: page, size: size});
        }

        function my(page, size) {
            return trackService.one().all('my').getList({page: page, size: size});
        }

        function remove(id) {
            return trackService.one(id).remove();
        }
    }

    function GeoJSONServiceFactory(Restangular) {
        var service = Restangular.service('geojson');

        return {
            create: create,
            get: getGeoJSON,
            update: update,
            search: search,
            my: my,
            remove: remove,
            isLike: isLike,
            like: like,
            unLike: unLike
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

        function search(query, page, size) {
            return service.one().get({query: query, page: page, size: size});
        }

        function my(page, size) {
            return service.one('my').get({page: page, size: size});
        }

        function remove(id) {
            return service.one(id).remove();
        }

        function isLike(id) {
            return service.one(id).one('like').get();
        }

        function like(id) {
            return service.one(id).post('like');
        }

        function unLike(id) {
            return service.one(id).one('like').remove();
        }
    }

    function AlbumServiceFactory(Restangular) {
        var service = Restangular.service('album');
        //Restangular.extendModel('album', function(model) {
        //    model.addPhotos = function (photos) {
        //        return this.post('add', photos);
        //    };
        //});
        return {
            get: get,
            create: create,
            modify: modify,
            remove: remove,
            addPhotos: addPhotos,
            removePhotos: removePhotos,
            deletePhotos: deletePhotos
        };

        function get(id) {
            return service.one(id).get();
        }

        function create(album) {
            return service.one().post('', album);
        }

        function modify(id, album) {
            return service.one(id).post('', album);
        }

        function remove(id) {
            return service.one(id).remove();
        }

        function addPhotos(id, photoIds) {
            return service.one(id).post('add', photoIds);
        }

        function removePhotos(id, photoIds) {
            return service.one(id).post('remove', photoIds);
        }

        function deletePhotos(id, photoIds) {
            return service.one(id).post('delete', photoIds);
        }
    }

})();