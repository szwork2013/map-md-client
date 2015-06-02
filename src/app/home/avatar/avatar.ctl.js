/**
 * Created by tiwen.wang on 6/2/2015.
 */
(function() {
    'use strict';

    angular.module('app.home.avatar', [])
        .factory("fileReader", ['$q', function ($q) {
            var onLoad = function (reader, deferred, Sscope) {
                return function () {
                    Sscope.$apply(function () {
                        deferred.resolve(reader.result);
                    });
                };
            };
            var onError = function (reader, deferred, Sscope) {
                return function () {
                    Sscope.$apply(function () {
                        deferred.reject(reader.result);
                    });
                };
            };
            var onProgress = function (reader, Sscope) {
                return function (event) {
                    Sscope.$broadcast(
                        "fileProgress",
                        { total: event.total,
                          loaded: event.loaded
                        }
                    );
                };
            };
            var getReader = function (deferred, Sscope) {
                var reader = new FileReader();
                reader.onload = onLoad(reader, deferred, Sscope);
                reader.onerror = onError(reader, deferred, Sscope);
                reader.onprogress = onProgress(reader, Sscope);
                return reader;
            };
            var readAsDataURL = function (file, Sscope) {
                var deferred = $q.defer();
                var reader = getReader(deferred, Sscope);
                reader.readAsDataURL(file);
                return deferred.promise;
            };
            return { readAsDataUrl: readAsDataURL };
        }])
        .directive('imgCropped', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                scope: {
                    'src': '@',
                    'cropped': '=?cropped'
                },
                templateUrl: 'home/avatar/imgCropped.tpl.html',
                link: function (scope, element, attr) {

                    scope.cropped = scope.cropped || angular.noop;

                    var boxWidth = 500;
                    var boxHeight = 420;

                    var croppedContainer = element.find(".cropped-container"),
                        croppedPreview   = element.find(".cropped-preview");
                    var myImg;
                    var preview;

                    var clear = function () {
                        croppedContainer.empty();
                        croppedPreview.empty();
                    };
                    scope.$watch('src', function (nv) {
                        clear();
                        if (nv) {
                            myImg = angular.element( "<img>" );
                            preview = angular.element( '<img ng-src="{{previewUrl}}" class="cropped-img">' );
                            myImg.attr('src', nv);
                            croppedContainer.append(myImg);
                            croppedPreview.append(preview);

                            $timeout(function() {
                                boxWidth = croppedContainer.innerWidth();
                                boxHeight = croppedContainer.innerHeight();
                                $(myImg).Jcrop({
                                    trackDocument: true,
                                    bgFade: true,
                                    boxWidth: boxWidth,
                                    boxHeight: boxHeight,
                                    minSize: [16, 16],
                                    onSelect: updatePreview,
                                    aspectRatio: 1
                                });
                            });
                        }
                    });

                    function updatePreview(coords) {
                        var image = myImg[0];
                        var imageWidth = image.width;
                        var imageHeight = image.height;
                        var width = $(image).width();
                        var height = $(image).height();
                        var sx = coords.x * imageWidth / width,
                            sy = coords.y * imageHeight / height,
                            swidth = coords.w * imageWidth / width,
                            sheight = coords.h * imageHeight / height;

                        var canvas = document.createElement('canvas');
                        canvas.width = 100;
                        canvas.height = 100;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(image, sx, sy, swidth, sheight, 0, 0, 100, 100);
                        scope.previewUrl = canvas.toDataURL("image/png");
                        preview.attr('src', scope.previewUrl);
                        scope.cropped(scope.previewUrl);
                    }

                    scope.$on('$destroy', clear);
                }
            };
        }])
    .controller('AvatarUploadCtrl',
        ['$scope', '$log', '$mdDialog', '$sce', 'fileReader', 'Users', '$mmdMessage',
            AvatarUploadController]);

    var LOG_TAG = "Avatar-Upload: ";
    function AvatarUploadController($scope, $log, $mdDialog, $sce, fileReader, Users, $mmdMessage) {

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        $scope.fileSelected = function (files, ev) {
            if(files.length) {
                fileReader.readAsDataUrl(files[0], $scope).then(function (result) {
                    $scope.imageUrl = $sce.trustAsResourceUrl(result);
                });
            }
        };

        var avatarData;
        $scope.cropped = function(data) {
            avatarData = data;
            $log.debug(LOG_TAG + 'avatar data length = ' + data.length);
        };

        $scope.submit = function () {
            if(!avatarData) {
                return;
            }
            $scope.saving = true;
            Users.uploadAvatar(avatarData).then(function (res) {
                $scope.saving = false;
                $log.debug(LOG_TAG + 'avatar uploaded!');
                $mmdMessage.showMessage("头像上传成功！");
                $scope.answer(res);
            }, function() {
                $scope.saving = false;
            });
        };
    }
})();