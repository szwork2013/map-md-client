/**
 * Created by tiwen.wang on 4/25/2015.
 */
(function() {

    'use strict';

    angular.module('app.core.services', ['restangular', 'LocalStorageModule'])
        .config(['RestangularProvider', function(RestangularProvider) {

            // add a response intereceptor
            //RestangularProvider.addResponseInterceptor(
            //    function(data, operation, what, url, response, deferred) {
            //    var extractedData;
            //    // .. to look for getList operations
            //    if (operation === "getList") {
            //        // .. and handle the data and meta data
            //        //extractedData = data.data.data;
            //        //extractedData.meta = data.data.meta;
            //        switch(what) {
            //            default :
            //                extractedData = data;
            //        }
            //    } else {
            //        switch(what) {
            //            case 'openinfo':
            //                if(data.open_info) {
            //                    extractedData = data.open_info;
            //                }
            //                break;
            //            case 'camerainfo':
            //                if(data.camera_info) {
            //                    extractedData = data.camera_info;
            //                }
            //                break;
            //            default :
            //                extractedData = data;
            //        }
            //    }
            //    return extractedData;
            //});
        }])
        .factory('Photos',     ['ApiRestangular', PhotoServiceFactory])
        .factory('Panoramios', ['ApiRestangular', PanoramiosServiceFactory])
        .factory('Comments',   ['ApiRestangular', CommentsServiceFactory])
        .factory('Tracks',     ['ApiRestangular', TrackServiceFactory])
        .factory('GeoJSONs',   ['ApiRestangular', GeoJSONServiceFactory])
        .factory('Albums',     ['ApiRestangular', AlbumServiceFactory])
        .factory('Groups',     ['ApiRestangular', GroupServiceFactory])
        .factory('Covers',     ['ApiRestangular', CoverServiceFactory])
        .factory('Likes',      ['ApiRestangular', LikeServiceFactory])
        .factory('Maps',       ['ApiRestangular', MapServiceFactory])
        .factory('Search',     ['ApiRestangular', SearchServiceFactory])
    ;

    function PhotoServiceFactory(Restangular) {
        var service = Restangular.service('photo');
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
            remove: removePhoto,
            update: update,
            updateLocation: updateLocation
        };

        function getPhoto(id) {
            return service.one(id).get();
        }

        function removePhoto(id) {
            return service.one(id).remove();
        }

        function update(id, properties) {
            return service.one(id).post('properties', properties);
        }

        function updateLocation(id, location) {
            return service.one(id).post('location', location);
        }
    }

    function PanoramiosServiceFactory(Restangular) {
        return Restangular.service('panoramio');
    }

    function CommentsServiceFactory(Restangular) {
        var service = Restangular.service('comment');
        return {
            create: createComment,
            get: getComments
        };

        /**
         * 创建评论
         * @param comment {type: type, entity_id: id, content: content}
         * @returns {*|{}}
         */
        function createComment(comment) {
            return service.post(comment);
        }

        /**
         * 获取实体的评论
         * @param type 评论的实体类型
         * @param id   评论的实体ID
         * @param pageNo   评论的实体ID
         * @param id   评论的实体ID
         * @returns Array[Comment{}] comments list
         */
        function getComments(type, id, pageNo, pageSize) {
            return service.one().all('').getList({
                type: type,
                id: id,
                pageNo: pageNo,
                pageSize: pageSize});
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
            getBy: getBy,
            create: create,
            modify: modify,
            remove: remove,
            setCover: setCover,
            addPhotos: addPhotos,
            removePhotos: removePhotos,
            deletePhotos: deletePhotos,
            modifyFC: modifyFC,
            removeFeature: removeFeature
        };

        function get(id) {
            return service.one(id).get();
        }

        function getBy(username, name) {
            return service.one().get({username: username, name: name});
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

        function setCover(id, cover) {
            return service.one(id).post('cover', cover);
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

        function modifyFC(id, fc) {
            return service.one(id).post('fc', fc);
        }

        function removeFeature(id, featureId) {
            return service.one(id).one('fc', featureId).remove();
        }
    }

    function GroupServiceFactory(Restangular) {
        var service = Restangular.service('group');

        return {
            get: get,
            getByName: getByName,
            create: create,
            isMember: isMember,
            applyJoin: applyJoin,
            //getAlbums: getAlbums,
            saveAvatar: saveAvatar,
            remove: remove
            //modify: modify,
            //remove: remove,
            //addPhotos: addPhotos,
            //removePhotos: removePhotos,
            //deletePhotos: deletePhotos
        };

        function get(id) {
            return service.one(id).get();
        }

        function getByName(name) {
            return service.one().get({name: name});
        }

        function create(group) {
            return service.one().post('', group);
        }

        function isMember(id, userId) {
            return service.one(id).one('members', userId).get();
        }

        function applyJoin(id) {
            return service.one(id).post('join');
        }

        //function getAlbums(id, pageNo, pageSize) {
        //    return service.one(id).all('albums').getList({pageNo: pageNo, pageSize: pageSize});
        //}

        function saveAvatar(id, imageId) {
            return service.one(id).one('avatar').post(imageId);
        }

        function remove(id) {
            return service.one(id).remove();
        }
    }

    function CoverServiceFactory(Restangular) {
        var service = Restangular.service('cover');

        return {
            uploadAvatar: uploadAvatar
        };

        function uploadAvatar(data) {
            var boundary = Math.random().toString().substr(2);
            var multipart = "";

            multipart += "--" + boundary +
                "\r\nContent-Disposition: form-data; name=" +
                "\"type\"" + "\r\n\r\n" + "AVATAR" + "\r\n";

            multipart += "--" + boundary +
                "\r\nContent-Disposition: form-data; name=" +
                "\"file\"" + '; filename="cover.png"' +
                "\r\nContent-type: application/octet-stream" +
                "\r\n\r\n" + data + "\r\n";

            multipart += "--" + boundary + "--\r\n";

            return service.one().post('', multipart, {}, {
                "Content-Type": "multipart/form-data; charset=utf-8; boundary=" + boundary
            });
        }
    }

    function LikeServiceFactory(Restangular) {
        var service = Restangular.service('like');

        return {
            like: like,
            unLike: unLike,
            isLike: isLike
        };

        function like(type, id) {
            return service.one().post('', {type: type, id: id});
        }

        function unLike(type, id) {
            return service.one().remove({type: type, id: id});
        }

        function isLike(type, id) {
            return service.one().get({type: type, id: id});
        }
    }

    function MapServiceFactory(Restangular) {
        var service = Restangular.service('map');

        return {
            getAll: getAll,
            update: update,
            create: create,
            remove: remove
        };

        function getAll() {
            return service.one().all('').getList();
        }

        function update(map) {
            return service.one(map.id).post('', map);
        }

        function create(map) {
            return service.post(map);
        }

        function remove(id) {
            return service.one(id).remove();
        }
    }

    function SearchServiceFactory(Restangular) {
        var service = Restangular.service('search');

        return {
            photo: searchPhoto,
            album: searchAlbum,
            user:  searchUser,
            group: searchGroup
        };

        function searchPhoto(keyword, pageNo, pageSize) {
            return service.one().all('photo').getList({
                keyword: keyword,
                pageNo: pageNo,
                pageSize: pageSize
            });
        }

        function searchAlbum(keyword, pageNo, pageSize) {
            return service.one().all('album').getList({
                keyword: keyword,
                pageNo: pageNo,
                pageSize: pageSize
            });
        }

        function searchUser(keyword, pageNo, pageSize) {
            return service.one().all('user').getList({
                keyword: keyword,
                pageNo: pageNo,
                pageSize: pageSize
            });
        }

        function searchGroup(keyword, pageNo, pageSize) {
            return service.one().all('group').getList({
                keyword: keyword,
                pageNo: pageNo,
                pageSize: pageSize
            });
        }
    }

})();