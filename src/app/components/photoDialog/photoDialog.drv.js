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
        .factory('$mmdPhotoDialog', ['$mdDialog', '$log', '$filter', 'Photos', 'Users',
            MmdPhotoDialogProvider]);

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
                controller: ['$scope', '$mdDialog', '$PhotoLocateDialog', 'Authenticate', 'photo', PhotoDialogController],
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
         * @param $PhotoLocateDialog
         * @param photo
         * @constructor
         */
        function PhotoDialogController($scope, $mdDialog, $PhotoLocateDialog, Authenticate, photo) {

            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };

            $scope.onloaded = function(e) {
                $scope.photo.imageLoaded = true;
            };

            // 根据照片ID获取详细信息
            Photos.get(photo.id).then(function(photo) {
                $log.debug("get photo title = " + photo.title);
                $scope.photo = photo;
                $scope.user = photo.user;

                Authenticate.isMy($scope.photo).then(function(res) {
                    $scope.isMy = res;
                });

                //if(photo.user_id > 0) {
                //    // 获取照片作者信息
                //    Users.getUser(photo.user_id).then(function(user) {
                //
                //    });
                //}

                // 获取照片相机信息
                photo.getCameraInfo().then(function(cameraInfo) {
                    setCameraInfos(photo, cameraInfo);
                });

                // 获取照片评论
                //photo.getComments().then(function(comments) {
                //    $scope.comments = comments;
                //});
            });

            $scope.comments = [];
            $scope.commentSaved = function(comment) {
                $scope.comments.push(comment);
            };

            $scope.locate = function(ev) {
                $PhotoLocateDialog.show(ev, $scope.photo);
            };

            $scope.$on('$state-go', function(e) {
                $scope.cancel();
            });

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