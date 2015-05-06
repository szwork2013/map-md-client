/**
 * Created by tiwen.wang on 4/24/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.components.photoSlider
     */
    angular.module('app.components.photoSlider', ['ngMaterial', 'angular-gestures'])
        .config(function($mdIconProvider, hammerDefaultOptsProvider) {
            $mdIconProvider
                .icon("chevron_left", "./assets/svg/navigation/ic_chevron_left_24px.svg", 24)
                .icon("chevron_right", "./assets/svg/navigation/ic_chevron_right_24px.svg", 24);

            hammerDefaultOptsProvider.set({
                multiUser: true
            });
        })
        .directive('mmdPhotoSlider', ['$mdTheming', '$timeout', '$log', mmdPhotoSliderDirective]);


    function mmdPhotoSliderDirective($mdTheming, $timeout, $log) {

        return {
            restrict: 'AE',
            replace: false,
            scope: {
                photo: '=?mmdPhoto'
            },
            link: link,
            templateUrl: 'components/photoSlider/photoSlider.tpl.html'
        };

        function link(scope, element, attrs) {
            $mdTheming(element);
            //scope.images = [
            //    {
            //        src: "557.jpg"
            //    },
            //    {
            //        src: "558.jpg"
            //    },
            //    {
            //        src: "559.jpg"
            //    },
            //    {
            //        src: "560.jpg"
            //    },
            //    {
            //        src: "562.jpg"
            //    }
            //];

            var deltaX = 0,
                paning,
                imageSize = 5,
                index = 1;

            scope.onPan = function(event) {
                if(event.type == "pan") {
                    $log.debug("pan");
                    transformElement(element.find('.slide'), deltaX+event.deltaX);
                }
            };
            scope.onPanstart = function(event) {
                if(event.type == "panstart") {
                    $log.debug("pan start");
                    paning = true;
                }
            };
            scope.onPanmove = function(event) {
                if(event.type == "panmove" && paning) {
                    $log.debug("pan move");
                    //scope.transform = "translate("+(deltaX+event.deltaX)+"px, 0)";
                    transformElement(element.find('.slide'), deltaX+event.deltaX);
                }
            };
            scope.onPanend = function(event) {
                if(event.type == "panend") {
                    $log.debug("panend");
                    deltaX = deltaX + event.deltaX;
                    paning = false;
                }
            };

            function transformElement(element, deltaX) {
                var transform = "translate("+deltaX+"px, 0)";
                element.css('transform', transform);
                element.css('-webkit-transform', transform);
                element.css('-ms-transform', transform);
            }

            //scope.next = function() {
            //
            //    index = index % imageSize + 1;
            //
            //    setImage(index);
            //};
            //
            //function setImage(index) {
            //    var right = index % imageSize + 1,
            //        left = index - 1;
            //    scope.image = scope.images[index];
            //    if(right === 1) {
            //        scope.imageRight = {};
            //    }else {
            //        scope.imageRight = scope.images[right];
            //    }
            //
            //    if(left === 0) {
            //        scope.imageLeft = {};
            //    }else {
            //        scope.imageLeft = scope.images[left];
            //    }
            //}
        }
    }


})();