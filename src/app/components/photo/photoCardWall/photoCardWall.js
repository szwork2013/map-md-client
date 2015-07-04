/**
 * Created by tiwen.wang on 4/22/2015.
 */
(function() {
    'use strict';

    var LOG_TAG = "[Photo-card-wall] ";

    /**
     * @ngdoc module
     * @name app.components.photo.photoCardWall
     */

    angular.module('app.components.photo.photoCardWall', [])
        .directive('mmdPhotoCardWall', ['$mdTheming', '$window', '$log', '$timeout', MmdPhotoCardWall])
    ;

    function MmdPhotoCardWall($mdTheming, $window, $log, $timeout) {

        var defaultOptions = {
            // the ideal height you want your images to be
            'targetHeight': 400,
            // how quickly you want images to fade in once ready can be in ms, "slow" or "fast"
            'fadeSpeed': "fast",
            // how the resized block should be displayed. inline-block by default so that it doesn't break the row
            'display': "inline-block",
            // which effect you want to use for revealing the images (note CSS3 browsers only),
            'effect': 'default',
            // effect delays can either be applied per row to give the impression of descending appearance
            // or horizontally, so more like a flock of birds changing direction
            'direction': 'vertical',
            // Sometimes there is just one image on the last row and it gets blown up to a huge size to fit the
            // parent div width. To stop this behaviour, set this to true
            'allowPartialLastRow': false,
            // 是否使用imagesLoaded插件
            'imagesLoaded': false,
            // 延迟计算事件（等待ng-repeat完成）
            'delayTime': 500
        };

        return {
            restrict: 'EA',
            link: link,
            scope: {
                options: "=mmdWallOptions"
            }
        };

        function link (scope, element, attrs) {
            $mdTheming(element);

            var options = {};

            angular.extend(options, defaultOptions, scope.options);

            // 图片容器大小变化时更新布局
            scope.$watch(function () {
                return element.innerWidth && element.innerWidth();
            }, function () {
                updateWall();
            });

            // 浏览器窗口大小变化时更新布局
            angular.element($window).bind("resize", function (e) {
                updateWall();
            });

            // 收到指定事件时更新布局
            scope.$on('mmd-photo-wall-resize', function (e) {
                updateWall();
            });

            attrs.$observe('photoContainerFluidTargetHeight', function (height) {
                if(height && options.targetHeight != height) {
                    options.targetHeight = height;
                    updateWall();
                }
            });

            var updatePromise;
            function updateWall() {
                //$log.debug("collage images");

                $timeout.cancel(updatePromise);
                updatePromise = $timeout(function () {
                    if (options.imagesLoaded && $window.imagesLoaded) {
                        var imgLoad = $window.imagesLoaded && $window.imagesLoaded(element);
                        imgLoad.on('always', function (e) {
                            $log.debug(LOG_TAG + "image load 布局");
                            collage();
                            $timeout(function () {
                                scope.$apply(function () {
                                });
                            }, options.delayTime);
                        });
                    } else {
                        //$log.debug(LOG_TAG + "直接布局");
                        collage();
                    }
                }, options.delayTime);
            }

            // Here we apply the actual CollagePlus plugin
            function collage() {
                element.removeWhitespace().collagePlus(options);
                scope.$emit("mmd-photo-fluid-resized");
            }
        }
    }

})();