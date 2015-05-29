/**
 * Created by tiwen.wang on 4/24/2015.
 */
(function() {
    'use strict';

    /**
     * @ngdoc module
     * @name app.components.photoDialog
     */
    angular.module('app.components')
        .factory('$mmdPhotoDialog', ['$mdDialog', '$log', '$filter', 'Photos', 'Users', MmdPhotoDialogProvider]);

    function MmdPhotoDialogProvider($mdDialog, $log, $filter, Photos, Users) {

        return {
            show: showPhoto
        };

        /**
         * show photo in photo dialog
         * @param ev
         * @param photo {} photo object
         */
        function showPhoto(ev, photo) {
            return $mdDialog.show({
                controller: PhotoDialogController,
                templateUrl: 'components/photoDialog/photoDialog.tpl.html',
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
         * @param photo
         * @constructor
         */
        function PhotoDialogController($scope, $mdDialog, photo) {

            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };

            // 根据照片ID获取详细信息
            Photos.get(photo.id).then(function(photo) {
                $log.debug("get photo title = " + photo.title);
                $scope.photo = photo;
                if(photo.user_id > 0) {
                    // 获取照片作者信息
                    Users.get(photo.user_id).then(function(user) {
                        $scope.user = user;
                    });
                }

                // 获取照片相机信息
                photo.getCameraInfo().then(function(cameraInfo) {
                    //$log.debug("camera info is");
                    //$log.debug(cameraInfo);
                    setCameraInfos(photo, cameraInfo);
                });

                // 获取照片评论
                photo.getComments().then(function(comments) {
                    $scope.comments = comments;
                    $log.debug("comments:");
                    angular.forEach(comments, function(value, key) {
                        $log.debug("     "+value.content);
                    });
                });
            });

            $scope.commentSaved = function(comment) {
                $scope.comments = $scope.comments || [];
                $scope.comments.push(comment);
            };

            /**
             * favorite photo
             * @param photo
             */
            $scope.favorite = function(photo) {
                if (photo.like) {
                    photo.unFavorite().then(function() {
                        photo.like = false;
                    });
                }else {
                    photo.favorite().then(function() {
                        photo.like = true;
                    });
                }
            };

            /**
             * 配置照片的属性和相机信息
             * @param photo
             * @param cameraInfo
             */
            function setCameraInfos(photo, cameraInfo) {
                $scope.cameraInfos = [];
                $scope.cameraInfos.push({
                    icon: 'action:today',
                    name: '拍摄日期',
                    value: $filter('date')(cameraInfo.date_time_original, "yyyy/MM/dd")
                });
                $scope.cameraInfos.push({
                    icon: 'image:photo_size',
                    name: '尺寸',
                    value: photo.width+"x"+photo.height
                });
                $scope.cameraInfos.push({
                    icon: 'file:name',
                    name: '文件名',
                    value: photo.file_name
                });
                $scope.cameraInfos.push({
                    icon: 'file:size',
                    name: '文件大小',
                    value: $filter('bytes')(photo.file_size, 2)
                });
                $scope.cameraInfos.push({
                    icon: 'image:camera',
                    name: '相机',
                    value: cameraInfo.model
                });
                $scope.cameraInfos.push({
                    icon: 'image:camera',
                    name: '相机品牌',
                    value: cameraInfo.make
                });
                $scope.cameraInfos.push({
                    icon: 'image:camera',
                    name: '镜头',
                    value: cameraInfo.jt
                });

                $scope.cameraInfos.push({
                    icon: 'image:camera',
                    name: '焦距',
                    value: cameraInfo.focal_length
                });

                $scope.cameraInfos.push({
                    icon: 'image:exposure',
                    name: '曝光',
                    value: cameraInfo.exposure_time
                });

                $scope.cameraInfos.push({
                    icon: 'image:flash_on',
                    name: 'F 值',
                    value: cameraInfo.fnumber
                });

                $scope.cameraInfos.push({
                    icon: 'image:iso',
                    name: 'ISO',
                    value: cameraInfo.iso
                });

                $scope.cameraInfos.push({
                    icon: 'image:flash_on',
                    name: '闪光灯',
                    value: cameraInfo.flash
                });

                $scope.cameraInfos.push({
                    icon: 'image:exposure',
                    name: '曝光偏差',
                    value: /*$filter('number')(*/cameraInfo.exposure_bias/*, 4)*/
                });

            }
        }
    }

})();