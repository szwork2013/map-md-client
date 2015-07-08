/**
 * Created by tiwen.wang on 4/24/2015.
 */
(function() {
    'use strict';

    angular.module('app.components').
        directive('userProfile', ['$mdTheming', 'UrlService', '$state', UserProfileDirective]);

    function UserProfileDirective($mdTheming, UrlService, $state) {
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                user: "=user",
                leave: '&?onLeave'
            },
            templateUrl: 'components/user/profile/profile.tpl.html',
            link: link
        };

        function link(scope, element, attrs) {
            $mdTheming(element);
            scope.UrlService = UrlService;

            scope.toUserPage = function(ev) {
                scope.leave(ev);
                $state.go('app.user', {name: scope.user.username});
            };
        }
    }
})();