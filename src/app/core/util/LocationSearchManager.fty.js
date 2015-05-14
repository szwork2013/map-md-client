/**
 * Created by tiwen.wang on 5/9/2015.
 */
(function() {
    'use strict';

    angular.module('app.core')
        .factory('LocationSearchManager', ['$window', '$timeout', '$mmdUtil',
            function ($window, $timeout, $mmdUtil) {

                var LocationSearchManager = function (scope, location) {
                    this.scope = scope;
                    this.location = location;
                    this.scope.stateObj = {};

                    this.stateCache = {};
                    // search状态初始化标识
                    this.initialized = false;

                    var that = this;
                    scope.$watch(function () {
                        return location.search();
                    }, function (search) {
                        that.initialized = true;
                        that.scope.stateObj = search;
                    });
                };

                LocationSearchManager.prototype.watch = function (state, callback) {
                    var states = state.split(" ");
                    var that = this;
                    angular.forEach(states, function (state, key) {
                        that.scope.$watch("stateObj." + state, function (value) {
                            if (that.stateCache[state] != value) {
                                callback.apply(null, [value]);
                                that.stateCache[state] = value;
                            }
                        });
                    });
                };

                LocationSearchManager.prototype.bindingWatch = function (state, callback) {
                    var states = state.split(" ");
                    var that = this;
                    var timeoutHander;
                    angular.forEach(states, function (state, key) {
                        that.scope.$watch("stateObj." + state, function (value) {
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

                LocationSearchManager.prototype.get = function (state) {
                    return this.scope.stateObj[state];
                };

                LocationSearchManager.prototype.set = function (state, value) {
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

                    // 状态已初始化后才能开始向location中设置search state
                    if (this.initialized) {
                        this.location.search($mmdUtil.param(this.stateCache));
                    }

                };

                LocationSearchManager.prototype.clear = function () {
                    this.location.search("");
                };

                return LocationSearchManager;
            }])
    ;
})();