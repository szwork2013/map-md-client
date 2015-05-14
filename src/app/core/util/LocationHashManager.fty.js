/**
 * Created by tiwen.wang on 5/9/2015.
 */
(function() {
    'use strict';

    angular.module('app.core')
        .factory('LocationHashManager', ['$window', '$timeout', '$mmdUtil',
            function ($window, $timeout, $mmdUtil) {

                var LocationHashManager = function (scope, location) {
                    this.scope = scope;
                    this.location = location;
                    this.scope.hashStateObj = {};

                    this.stateCache = {};
                    // hash哈希状态初始化标识
                    this.initialized = false;

                    var that = this;
                    scope.$watch(function () {
                        return location.hash();
                    }, function (hash) {
                        that.initialized = true;
                        if(hash) {
                            that.scope.hashStateObj = $mmdUtil.deparam(hash);
                        }
                    });
                };

                LocationHashManager.prototype.watch = function (state, callback) {
                    var states = state.split(" ");
                    var that = this;
                    angular.forEach(states, function (state, key) {
                        that.scope.$watch("hashStateObj." + state, function (value) {
                            if (that.stateCache[state] != value) {
                                callback.apply(null, [value]);
                                that.stateCache[state] = value;
                            }
                        });
                    });
                };

                LocationHashManager.prototype.bindingWatch = function (state, callback) {
                    var states = state.split(" ");
                    var that = this;
                    var timeoutHander;
                    angular.forEach(states, function (state, key) {
                        that.scope.$watch("hashStateObj." + state, function (value) {
                            if (that.stateCache[state] != value) {
                                if (timeoutHander) {
                                    $timeout.cancel(timeoutHander);
                                }
                                timeoutHander = $timeout(function () {
                                    var params = [];
                                    angular.forEach(states, function (state, key) {
                                        params.push(that.get(state));
                                    });
                                    callback.apply(null, params);
                                }, 0);

                                that.stateCache[state] = value;
                            }
                        });
                    });
                };

                LocationHashManager.prototype.get = function (state) {
                    return this.scope.hashStateObj[state];
                };

                LocationHashManager.prototype.set = function (state, value) {
                    var that = this;
                    if (angular.isObject(state)) {
                        angular.forEach(state, function (value, name) {
                            if (value) {
                                that.stateCache[name] = value;
                            } else {
                                delete that.stateCache[name];
                            }
                        });
                    } else {
                        if (value) {
                            this.stateCache[state] = value;
                        } else {
                            delete this.stateCache[state];
                        }
                    }

                    // 状态已初始化后才能开始向location中设置hash state
                    if (this.initialized) {
                        this.location.hash($mmdUtil.param(this.stateCache));
                    }

                };

                LocationHashManager.prototype.clear = function () {
                    this.location.hash("");
                };

                return LocationHashManager;
            }])
    ;
})();