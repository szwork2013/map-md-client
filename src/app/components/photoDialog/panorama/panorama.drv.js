/**
 * Created by tiwen.wang on 6/27/2015.
 */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.components.panorama
     */
    angular.module('app.components.panorama', ['ngMaterial'])
        .directive('panorama', ['$mdTheming', '$rootScope', '$log', '$q', '$imageRequest', panoramaDirective]);

    function panoramaDirective($mdTheming, $rootScope, $log, $q, $imageRequest) {

        function link(scope, element, attrs) {
            $mdTheming(element);
            var corsproxyCtx = 'http://www.photoshows.cn:9292/static.photoshows.cn';
            var photosphere = null;

            scope.$watch('photo', function (photo) {
                if (photo) {
                    var photo360Src = corsproxyCtx + '/' + scope.photo.oss_key + '@0e_2000w_1000h.jpg';
                    $imageRequest.get(photo360Src).then(function() {
                            create(photo360Src);
                            scope.onloaded();
                        },function(err){
                            $log.debug(err);
                        },
                        function(progress) {
                            $rootScope.safeApply(scope, function() {
                                scope.progress = progress;
                            });
                        });
                }
            });

            function create(src) {
                photosphere = new Photosphere(src)
                    .setEXIF({
                        "full_width": attrs.ponmPhotoWidth,
                        "full_height": attrs.ponmPhotoHeight,
                        "crop_width": attrs.ponmPhotoWidth,
                        "crop_height": attrs.ponmPhotoHeight,
                        "x": 0,
                        "y": 0
                    });
                photosphere.loadPhotosphere(element)
                    .then(function () {
                        //$animate.addClass(loading, "ponm-hide");
                    });
            }
        }

        function Photosphere(image, maxSize) {
            this.image = image;
            this.maxSize = maxSize;// || gl.getParameter(gl.MAX_TEXTURE_SIZE);
            //this.worker = new Worker("worker.js");
        }

        Photosphere.prototype.loadPhotosphere = function (holder) {
            holder.innerHTML = "wait...";

            this.defer = $q.defer();

            this.holder = holder;

            if (this.canUseCanvas()) {
                var self = this;
                this.canDoWebGL();
                this.loadEXIF(function () {
                    self.cropImage();
                });
            } else {
                // this is the ugly scroll backup.
                // for silly people on a really old browser!
                holder.innerHTML = "<div style='width:100%;height:100%;overflow-x:scroll;overflow-y:hidden'><div style='margin: 10px; background: #ddd; opacity: 0.6; width: 300px; height: 20px; padding: 4px; position: relative'>If you upgrade to a better browser this is 3D!</div><img style='height:100%;margin-top: -48px' src='" + this.image + "' /></div>";
            }

            return this.defer.promise;
        };

        Photosphere.prototype.canUseCanvas = function () {
            // return false; // debugging! i don't have a non-supporting browser :$
            // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas.js

            var elem = document.createElement('canvas');
            var ctx = elem.getContext && elem.getContext('2d');
            return !!ctx;
        };

        Photosphere.prototype.cropImage = function () {
            var self = this;
            var img = null;
            // if have crop or resize
            if (self.exif && ((self.exif['crop_width'] != self.exif['full_width']) || (self.maxSize && (self.maxSize < self.exif['full_width'] || self.maxSize < self.exif['full_height'])))) {
                if (this.image instanceof Image) {
//                        this.image.crossOrigin = "anonymous"; //"Anonymous";
                    self.start3D(resize(this.image));
                } else {
                    img = new Image();
                    img.crossOrigin = "anonymous";
                    img.onload = function () {
                        self.start3D(resize(img));
                    };
                    img.src = this.image;
                }
            } else {
                if (this.image instanceof Image) {
//                        this.image.crossOrigin = "anonymous"; //"Anonymous";
                    self.start3D(resize(this.image));
                } else {
                    img = new Image();
                    img.crossOrigin = "anonymous";
                    img.onload = function () {
                        self.start3D(img);
                    };
                    img.src = this.image;
                }
            }

            function resize(img) {
                var canvas = document.createElement('canvas');
                canvas.width = self.exif['full_width'];
                canvas.height = self.exif['full_height'];

                if (self.maxSize !== undefined) {
                    // Now check the size (too big and it'll fail)
                    // http://snipplr.com/view/753/create-a-thumbnail-maintaining-aspect-ratio-using-gd/
                    if (self.maxSize < canvas.width || self.maxSize < canvas.height) {
                        var wRatio = self.maxSize / canvas.width;
                        var hRatio = self.maxSize / canvas.height;
                        if ((wRatio * canvas.height) < self.maxSize) {
                            // Horizontal
                            canvas.height = Math.ceil(wRatio * canvas.height);
                            canvas.width = self.maxSize;
                        } else { // Vertical
                            canvas.width = Math.ceil(hRatio * canvas.width);
                            canvas.height = self.maxSize;
                        }
                    }
                }

                var context = canvas.getContext("2d");

                context.fillStyle = "#000";
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img,
                    (self.exif['x'] / self.exif['full_width']) * canvas.width,
                    (self.exif['y'] / self.exif['full_height']) * canvas.height,
                    (self.exif['crop_width'] / self.exif['full_width']) * canvas.width,
                    (self.exif['crop_height'] / self.exif['full_height']) * canvas.height
                );
                return canvas.toDataURL("image/png");
            }
        };

        Photosphere.prototype.canDoWebGL = function () {
            // Modified mini-Modernizr
            // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/webgl-extensions.js
            var canvas, ctx, exts;
            if (this.isCanDoWebGL === undefined) {
                try {
                    canvas = document.createElement('canvas');
                    ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                    exts = ctx.getSupportedExtensions();

                    this.maxSize = ctx.getParameter(ctx.MAX_TEXTURE_SIZE);
                } catch (e) {
                    return false;
                }
                this.isCanDoWebGL = !!ctx;
            }
            return this.isCanDoWebGL;
        };

        Photosphere.prototype.start3D = function (image) {
            if (window['THREE'] === undefined) {
                alert("Please make sure three.js is loaded");
            }

            // Start Three.JS rendering
            this.target = new THREE.Vector3();
            this.lat = 0;
            this.lon = 90;
            this.onMouseDownMouseX = 0,
                this.onMouseDownMouseY = 0,
                this.isUserInteracting = false,
                this.onMouseDownLon = 0,
                this.onMouseDownLat = 0;

            this.camera = new THREE.PerspectiveCamera(75, (parseInt(this.holder.innerWidth(), 0) / parseInt(this.holder.innerHeight(), 0)), 1, 1100);
            this.scene = new THREE.Scene();
            var mesh = new THREE.Mesh(new THREE.SphereGeometry(200, 20, 40), this.loadTexture(image));
            mesh.scale.x = -1;
            this.scene.add(mesh);

            // Check for WebGL
//                console.log(this.canDoWebGL());
            if (this.canDoWebGL()) {
                // This is for nice browsers + computers
                try {
                    this.renderer = new THREE.WebGLRenderer();
//                        this.maxSize = this.renderer.context.getParameter(this.renderer.context.MAX_TEXTURE_SIZE);
                } catch (e) {
                    this.renderer = new THREE.CanvasRenderer();
                }
            } else {
                this.renderer = new THREE.CanvasRenderer();
            }

            this.renderer.setSize(parseInt(this.holder.innerWidth(), 0), parseInt(this.holder.innerHeight(), 0));
            this.holder.innerHTML = "";
            this.holder.append(this.renderer.domElement);

            this.defer.resolve();

            var self = this;
            this.renderer.domElement.addEventListener('touchstart', function (event) {
                self.onDocumentTouchStart(event, self);
            }, false);
            this.renderer.domElement.addEventListener('touchmove', function (event) {
                self.onDocumentTouchMove(event, self);
            }, false);
            this.renderer.domElement.addEventListener('mousedown', function (event) {
                self.onDocumentMouseDown(event, self);
            }, false);

            // 第三种做法：用单独的插件
            //jQuery(this.renderer.domElement).mousewheel(function (event) {
            //    self.onMouseWheel(event, self);
            //});
            // 第二种做法：event参数不同 不好取事件参数
//                var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x
//                if (this.renderer.domElement.attachEvent) //if IE (and Opera depending on user setting)
//                    this.renderer.domElement.attachEvent("on"+mousewheelevt, function(event){self.onMouseWheel(event, self); });
//                else if (this.renderer.domElement.addEventListener) //WC3 browsers
//                    this.renderer.domElement.addEventListener(mousewheelevt, function(event){self.onMouseWheel(event, self); }, false);
            // 第一种做法：仅chrome支持
//                this.renderer.domElement.addEventListener( 'mousewheel', function(event){self.onMouseWheel(event, self); }, false );

            document.addEventListener('mousemove', function (event) {
                self.onDocumentMouseMove(event, self);
            }, false);
            document.addEventListener('mouseup', function (event) {
                self.onDocumentMouseUp(event, self);
            }, false);

            this.restart();
        };

        Photosphere.prototype.restart = function () {
            this.resetTimer(this);
            var self = this;
            this.stopTimer = setTimeout(function () {
                self.stop();
            }, 3000);
        };

        Photosphere.prototype.stop = function () {
            if (this.timer !== undefined) {
                clearTimeout(this.timer);
            }
            if (this.interval !== undefined) {
                clearInterval(this.interval);
            }
            if (this.stopTimer !== undefined) {
                clearTimeout(this.stopTimer);
            }
        };

        Photosphere.prototype.startMoving = function () {
            var self = this;
            this.interval = setInterval(function () {
                self.lon = self.lon - 0.1;

                if (-3 < self.lat && self.lat < 3) {
                }
                else if (self.lat > 10) {
                    self.lat -= 0.1;
                }
                else if (self.lat > 0) {
                    self.lat -= 0.04;
                }
                else if (self.lat < 0 && self.lat > 10) {
                    self.lat += 0.1;
                }
                else if (self.lat < 0) {
                    self.lat += 0.04;
                }

                self.render();
            }, 10);
        };

        Photosphere.prototype.resetTimer = function (self, t) {
            if (self.timer !== undefined) {
                clearTimeout(self.timer);
            }
            if (self.interval !== undefined) {
                clearInterval(self.interval);
            }

            self.startMoving();

//                self.timer = setTimeout(function(){
//                    self.startMoving();
//                }, t);
        };

        Photosphere.prototype.onWindowResize = function (self) {
            self = self || this;
            self.camera.aspect = parseInt(self.holder.innerWidth(), 0) / parseInt(self.holder.innerHeight(), 0);
            self.camera.updateProjectionMatrix();

            self.renderer.setSize(parseInt(self.holder.innerWidth(), 0), parseInt(self.holder.innerHeight(), 0));

            self.render();

        };

        Photosphere.prototype.onMouseWheel = function (event, self) {

            var proposed = self.camera.fov - (event.wheelDeltaY || event.detail || event.deltaY) * 3;
            if (proposed > 10 && proposed < 100) {
                self.camera.fov = proposed;
                self.camera.updateProjectionMatrix();

                self.render();

                event.preventDefault();
            }

        };

        Photosphere.prototype.onDocumentMouseDown = function (event, self) {

            event.preventDefault();

            self.isUserInteracting = true;

            self.onPointerDownPointerX = event.clientX;
            self.onPointerDownPointerY = event.clientY;

            self.onPointerDownLon = self.lon;
            self.onPointerDownLat = self.lat;

            self.stop();
        };

        Photosphere.prototype.onDocumentMouseMove = function (event, self) {

            if (self.isUserInteracting) {

                self.lon = ( self.onPointerDownPointerX - event.clientX ) * 0.1 + self.onPointerDownLon;
                self.lat = ( event.clientY - self.onPointerDownPointerY ) * 0.1 + self.onPointerDownLat;
                self.render();

                self.stop();
//                    self.resetTimer(self, 9000);

            }

        };

        Photosphere.prototype.onDocumentTouchStart = function (event, self) {

            if (event.touches.length == 1) {

                event.preventDefault();

                self.onPointerDownPointerX = event.touches[0].pageX;
                self.onPointerDownPointerY = event.touches[0].pageY;

                self.onPointerDownLon = self.lon;
                self.onPointerDownLat = self.lat;

            }

        };

        Photosphere.prototype.onDocumentTouchMove = function (event, self) {

            if (event.touches.length == 1) {

                event.preventDefault();

                self.lon = ( self.onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + self.onPointerDownLon;
                self.lat = ( event.touches[0].pageY - self.onPointerDownPointerY ) * 0.1 + self.onPointerDownLat;

                self.render();

                self.stop();
//                    self.resetTimer(self, 9000);

            }

        };

        Photosphere.prototype.onDocumentMouseUp = function (event, self) {

            self.isUserInteracting = false;
            self.render();

        };

        Photosphere.prototype.loadTexture = function (path) {
            var texture = new THREE.Texture();
            var material = new THREE.MeshBasicMaterial({map: texture, overdraw: true});
            var self = this;
            if (path instanceof Image) {
                texture.needsUpdate = true;
                material.map.image = path;

                setTimeout(function () {
                    self.render();
                }, 100);
            } else {
                texture.needsUpdate = true;
                THREE.ImageUtils.crossOrigin = "anonymous";
                material.map = THREE.ImageUtils.loadTexture(path);
                setTimeout(function () {
                    self.render();
                }, 100);
//                    var image = new Image();
//                    image.onload = function () {
//                        texture.needsUpdate = true;
//                        material.map.image = this;
//                        setTimeout(function(){ self.render(); }, 100);
//                    };
//                    image.src = path;
            }
            return material;
        };

        Photosphere.prototype.render = function () {
            this.lat = Math.max(-85, Math.min(85, this.lat));
            var phi = ( 90 - this.lat ) * Math.PI / 180,
                theta = this.lon * Math.PI / 180;

            this.target.x = 500 * Math.sin(phi) * Math.cos(theta);
            this.target.y = 500 * Math.cos(phi);
            this.target.z = 500 * Math.sin(phi) * Math.sin(theta);

            this.camera.lookAt(this.target);

            this.renderer.render(this.scene, this.camera);
        };

        Photosphere.prototype.setEXIF = function (data) {
            this.exif = data;
            return this;
        };

        Photosphere.prototype.loadEXIF = function (callback) {
            if (this.exif !== undefined) {
                callback();
                return;
            }
            var self = this;
            this.loadBinary(function (data) {
                var xmpEnd = "</x:xmpmeta>";
                var xmpp = data.substring(data.indexOf("<x:xmpmeta"), data.indexOf(xmpEnd) + xmpEnd.length);

                var getAttr = function (attr) {
                    var x = xmpp.indexOf(attr + '="') + attr.length + 2;
                    return xmpp.substring(x, xmpp.indexOf('"', x));
                };

                self.exif = {
                    "full_width": getAttr("GPano:FullPanoWidthPixels"),
                    "full_height": getAttr("GPano:FullPanoHeightPixels"),
                    "crop_width": getAttr("GPano:CroppedAreaImageWidthPixels"),
                    "crop_height": getAttr("GPano:CroppedAreaImageHeightPixels"),
                    "x": getAttr("GPano:CroppedAreaLeftPixels"),
                    "y": getAttr("GPano:CroppedAreaTopPixels")
                };
                console.log(self.exif);
                callback();
            });
        };

        return {
            restrict: 'AE',
            replace: false,
            scope: {
                photo: '=',
                progress: '=?',
                onloaded: '=?'
            },
            link: link,
            templateUrl: 'components/photoDialog/panorama/panorama.tpl.html'
        };
    }
})();