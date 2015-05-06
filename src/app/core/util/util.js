/**
 * Created by tiwen.wang on 4/23/2015.
 */
(function() {
    'use strict';

    angular.module('app.core')
        .factory('$mmdUtil', [function () {
            var r20 = /%20/g;

            function buildParams(prefix, obj, traditional, add) {
                var name;

                if (angular.isArray(obj)) {
                    // Serialize array item.
                    angular.forEach(obj, function (v, i) {
                        if (traditional || rbracket.test(prefix)) {
                            // Treat each array item as a scalar.
                            add(prefix, v);

                        } else {
                            // Item is non-scalar (array or object), encode its numeric index.
                            buildParams(prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add);
                        }
                    });

                } else if (!traditional && jQuery.type(obj) === "object") {
                    // Serialize object item.
                    for (name in obj) {
                        buildParams(prefix + "[" + name + "]", obj[ name ], traditional, add);
                    }

                } else {
                    // Serialize scalar item.
                    add(prefix, obj);
                }
            }

            var decode = decodeURIComponent;

            return {
                Array: {
                    containKeys: function(arr, prop, value) {
                        var contain = false;
                        angular.forEach(arr, function(item, key) {
                            if(item[prop] == value) {
                                contain = true;
                            }
                        });
                        return contain;
                    },
                    removeItem: function (arr, prop, value) {
                        if(arguments.length==2) {
                            value = prop;
                            prop = null;
                        }
                        var i;
                        for (i = arr.length - 1; i >= 0; i -= 1) {
                            if ((!!prop && arr[i][prop] == value) || (arr[i] == value)) {
                                arr.splice(i, 1);
                            }
                        }
                    },
                    mergeRightist: function(arrayLeft, arrayRight, key) {

                        var exist;
                        function jRight(ar, kr) {
                            if(arrayLeft[i][key] == ar[key]) {
                                exist = true;
                            }
                        }

                        function jLeft(al, kl) {
                            if(al[key] == arrayRight[i][key]) {
                                exist = true;
                            }
                        }

                        var i;
                        for (i = arrayLeft.length - 1; i >= 0; i -= 1) {
                            exist = false;
                            angular.forEach(arrayRight, jRight);
                            if(!exist) {
                                arrayLeft.splice(i, 1);
                            }
                        }

                        for (i = arrayRight.length - 1; i >= 0; i -= 1) {
                            exist = false;
                            angular.forEach(arrayLeft, jLeft);
                            if(!exist) {
                                arrayLeft.push(arrayRight[i]);
                            }
                        }

                        return arrayLeft;
                    },

                    append: function(arrayLeft, arrayRight, key) {

                        var exist = false;
                        function jLeft(al, kl) {
                            if(al[key] == arrayRight[i][key]) {
                                exist = true;
                            }
                        }
                        var i;
                        for (i = arrayRight.length - 1; i >= 0; i -= 1) {
                            exist = false;
                            angular.forEach(arrayLeft, jLeft);
                            if(!exist) {
                                arrayLeft.push(arrayRight[i]);
                            }
                        }
                        return arrayLeft;
                    }
                },

                param: function (a, traditional) {
                    var prefix,
                        s = [],
                        add = function (key, value) {
                            // If value is a function, invoke it and return its value
                            value = angular.isFunction(value) ? value() : ( value == null ? "" : value );
                            s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
                        };

                    // If an array was passed in, assume that it is an array of form elements.
                    if (angular.isArray(a) || ( a.jquery && !angular.isObject(a) )) {
                        // Serialize the form elements
                        angular.forEach(a, function () {
                            add(this.name, this.value);
                        });

                    } else {
                        // If traditional, encode the "old" way (the way 1.3.2 or older
                        // did it), otherwise encode params recursively.
                        for (prefix in a) {
                            buildParams(prefix, a[ prefix ], traditional, add);
                        }
                    }

                    // Return the resulting serialization
                    return s.join("&").replace(r20, "+");
                },

                deparam: function (params, coerce) {
                    var obj = {},
                        coerce_types = { 'true': !0, 'false': !1, 'null': null };

                    // Iterate over all name=value pairs.
                    angular.forEach(params.replace(/\+/g, ' ').split('&'), function (v, j) {
                        var param = v.split('='),
                            key = decode(param[0]),
                            val,
                            cur = obj,
                            i = 0,

                        // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
                        // into its component parts.
                            keys = key.split(']['),
                            keys_last = keys.length - 1;

                        // If the first keys part contains [ and the last ends with ], then []
                        // are correctly balanced.
                        if (/\[/.test(keys[0]) && /\]$/.test(keys[ keys_last ])) {
                            // Remove the trailing ] from the last keys part.
                            keys[ keys_last ] = keys[ keys_last ].replace(/\]$/, '');

                            // Split first keys part into two parts on the [ and add them back onto
                            // the beginning of the keys array.
                            keys = keys.shift().split('[').concat(keys);

                            keys_last = keys.length - 1;
                        } else {
                            // Basic 'foo' style key.
                            keys_last = 0;
                        }

                        // Are we dealing with a name=value pair, or just a name?
                        if (param.length === 2) {
                            val = decode(param[1]);

                            // Coerce values.
                            if (coerce) {
                                val = val && !isNaN(val) ? +val              // number
                                    : val === 'undefined' ? undefined         // undefined
                                    : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
                                    : val;                                                // string
                            }

                            if (keys_last) {
                                // Complex key, build deep object structure based on a few rules:
                                // * The 'cur' pointer starts at the object top-level.
                                // * [] = array push (n is set to array length), [n] = array if n is
                                //   numeric, otherwise object.
                                // * If at the last keys part, set the value.
                                // * For each keys part, if the current level is undefined create an
                                //   object or array based on the type of the next keys part.
                                // * Move the 'cur' pointer to the next level.
                                // * Rinse & repeat.
                                for (; i <= keys_last; i++) {
                                    key = keys[i] === '' ? cur.length : keys[i];
                                    cur =
                                        cur[key] =
                                            i < keys_last ?
                                            cur[key] || ( keys[i + 1] && isNaN(keys[i + 1]) ? {} : [] ) : val;
                                }

                            } else {
                                // Simple key, even simpler rules, since only scalars and shallow
                                // arrays are allowed.

                                if (angular.isArray(obj[key])) {
                                    // val is already an array, so push on the next value.
                                    obj[key].push(val);

                                } else if (obj[key] !== undefined) {
                                    // val isn't an array, but since a second value has been specified,
                                    // convert val into an array.
                                    obj[key] = [ obj[key], val ];

                                } else {
                                    // val is a scalar.
                                    obj[key] = val;
                                }
                            }

                        } else if (key) {
                            // No value was defined, so set something meaningful.
                            obj[key] = coerce ? undefined : '';
                        }
                    });

                    return obj;
                },

                uuid: function() {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                        return v.toString(16);
                    });
                }
            };
        }])
    ;
})();
