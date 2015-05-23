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

            var reqAnimationFrame = (function () {
                return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();

            var el = element[0];

            var START_X = 0;
            var START_Y = 0;

            var ticking = false;
            var transform;
            var timer;

            var mc = new Hammer.Manager(el);

            mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));

            mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
            mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
            mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);

            mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
            mc.add(new Hammer.Tap());

            mc.on("panstart panmove panend", onPan);
            mc.on("rotatestart rotatemove rotateend", onRotate);
            mc.on("pinchstart pinchmove", onPinch);
            //mc.on("swipe", onSwipe);
            mc.on("tap", onTap);
            mc.on("doubletap", onDoubleTap);

            mc.on("hammer.input", function(ev) {
                if(ev.isFinal) {
                    $log.debug("resetElement");
                    //resetElement();
                }
            });

            var initAngle = 0;
            function resetElement() {
                el.className = 'transition-ease-in-fast';
                START_X = 0;
                START_Y = 0;
                initAngle = 0;
                transform = {
                    translate: { x: START_X, y: START_Y },
                    scale: 1,
                    angle: 0,
                    rx: 0,
                    ry: 0,
                    rz: 0
                };

                requestElementUpdate();

                //if (log.textContent.length > 2000) {
                //    log.textContent = log.textContent.substring(0, 2000) + "...";
                //}
            }

            function updateElementTransform() {
                var value = [
                    'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
                    'scale(' + transform.scale + ', ' + transform.scale + ')',
                    'rotate3d('+ transform.rx +','+ transform.ry +','+ transform.rz +','+  transform.angle + 'deg)'
                ];

                value = value.join(" ");
                //el.textContent = value;
                el.style.webkitTransform = value;
                el.style.mozTransform = value;
                el.style.transform = value;
                ticking = false;
            }

            function requestElementUpdate() {
                if(!ticking) {
                    reqAnimationFrame(updateElementTransform);
                    ticking = true;
                }
            }

            function logEvent(str) {
                //log.insertBefore(document.createTextNode(str +"\n"), log.firstChild);
            }

            function onPan(ev) {
                if(ev.type == 'panend') {
                    START_X = START_X + ev.deltaX;
                    START_Y = START_Y + ev.deltaY;
                }else {
                    el.className = '';
                    transform.translate = {
                        x: START_X + ev.deltaX,
                        y: START_Y + ev.deltaY
                    };

                    requestElementUpdate();
                }
                logEvent(ev.type);
            }

            var initScale = 1;
            function onPinch(ev) {
                if(ev.type == 'pinchstart') {
                    element.removeClass("transition-ease-in-fast");
                    initScale = transform.scale || 1;
                }

                el.className = '';
                transform.scale = initScale * ev.scale;

                requestElementUpdate();
                logEvent(ev.type);
            }


            function onRotate(ev) {
                if(ev.type == 'rotatestart') {
                    element.removeClass("transition-ease-in-fast");
                    //initAngle = transform.angle || 0;
                }else if(ev.type == 'rotateend') {
                    element.addClass("transition-ease-in-fast");
                    if(ev.rotation > 45) {
                        transform.angle = initAngle + 90;
                    }else if(ev.rotation > 135) {
                        transform.angle = initAngle + 180;
                    }
                    initAngle = transform.angle;
                    if(initAngle == 360) {
                        initAngle = 0;
                    }
                }else {
                    el.className = '';
                    transform.rz = 1;
                    transform.angle = initAngle + ev.rotation;
                }

                requestElementUpdate();

                logEvent(ev.type);
            }

            function onSwipe(ev) {
                var angle = 50;
                transform.ry = (ev.direction & Hammer.DIRECTION_HORIZONTAL) ? 1 : 0;
                transform.rx = (ev.direction & Hammer.DIRECTION_VERTICAL) ? 1 : 0;
                transform.angle = (ev.direction & (Hammer.DIRECTION_RIGHT | Hammer.DIRECTION_UP)) ? angle : -angle;

                clearTimeout(timer);
                timer = setTimeout(function () {
                    resetElement();
                }, 300);
                requestElementUpdate();
                logEvent(ev.type);
            }

            function onTap(ev) {
                //transform.rx = 1;
                //transform.angle = 25;
                //clearTimeout(timer);
                //timer = setTimeout(function () {
                //    resetElement();
                //}, 200);
                //requestElementUpdate();
                logEvent(ev.type);
            }

            function onDoubleTap(ev) {
                transform.rx = 1;
                if(transform.scale >= 2) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        resetElement();
                    }, 200);
                }else {
                    transform.scale = transform.scale + 1;
                }
                requestElementUpdate();
                logEvent(ev.type);
            }

            resetElement();
        }
    }

})();