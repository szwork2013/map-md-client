/**
 * Created by tiwen.wang on 4/22/2015.
 */
describe( 'maps popular page', function() {

    var MapsPopularCtrl, $scope;

    beforeEach( module( 'app.maps.popular' ) );

    beforeEach( inject( function( $controller, $rootScope) {
        $scope = $rootScope.$new();
        MapsPopularCtrl = $controller( 'MapsPopularCtrl',
            {
                $scope: $scope
            });
    }));
    it( 'should have a dummy test', inject( function() {
        expect( MapsPopularCtrl ).toBeTruthy();

        MapsPopularCtrl.scope.photos = [
            {
                "id": 444,
                "point": {
                    "lat": 28.426824424356177,
                    "lng": 108.37297340539162,
                    "alt": 0.0,
                    "address": "贵州省铜仁市沿河土家族自治县"
                },
                "vendor": "gaode",
                "width": 2448,
                "height": 3264,
                "is360": false,
                "tags": [],
                "color": "#474141",
                "create_time": 1414417981000,
                "user_id": 11,
                "like_count": 0,
                "fav_count": 0,
                "comment_count": 0,
                "file_size": 1456981,
                "file_name": "IMG_20141027_213900.jpg",
                "file_type": "jpg",
                "date_time": 1414417140000,
                "oss_key": "444.jpg"
            },
            {
                "id": 418,
                "point": {
                    "lat": 28.674805,
                    "lng": 112.882736,
                    "address": "湖南省岳阳市湘阴县文星镇湘阴县第一中学(先锋路)"
                },
                "vendor": "gaode",
                "width": 255,
                "height": 158,
                "is360": false,
                "tags": [],
                "color": "#3A4642",
                "create_time": 1414289946000,
                "user_id": 15,
                "like_count": 0,
                "fav_count": 0,
                "comment_count": 0,
                "file_size": 7894,
                "file_name": "ZXXKCOM2008122511362135589.jpg",
                "file_type": "jpg",
                "oss_key": "418.jpg"
            },
            {
                "id": 594,
                "title": "夜色很美",
                "point": {
                    "lat": 32.01878954983436,
                    "lng": 118.78826283251169,
                    "alt": 11.0,
                    "address": "江苏省南京市秦淮区中华西门5号"
                },
                "vendor": "gaode",
                "width": 3264,
                "height": 2448,
                "is360": false,
                "tags": [],
                "color": "#110C0C",
                "create_time": 1420721126000,
                "user_id": 4,
                "travel_id": 51,
                "travel_name": "南京秦淮河",
                "like_count": 1,
                "fav_count": 0,
                "comment_count": 0,
                "file_size": 1772656,
                "file_name": "IMG_20141226_215318.jpg",
                "file_type": "jpg",
                "date_time": 1419601998000,
                "oss_key": "594.jpg"
            }
        ];
    }));
});