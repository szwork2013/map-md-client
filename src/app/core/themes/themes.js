/**
 * Created by tiwen.wang on 5/21/2015.
 */
angular
    .module('app.core.theme', ['ngMaterial'])
    .config(function ($mdThemingProvider, $mdIconProvider) {

        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("upload", "./assets/svg/ic_cloud_upload_24px.svg", 24)
            .icon("share", "./assets/svg/share.svg", 24)
            .icon("google_plus", "./assets/svg/google_plus.svg", 512)
            .icon("hangouts", "./assets/svg/hangouts.svg", 512)
            .icon("twitter", "./assets/svg/twitter.svg", 512)
            .icon("mail", "./assets/svg/mail.svg", 512)
            .icon("phone", "./assets/svg/phone.svg", 512)
            .icon("more_vert", "./assets/svg/ic_more_vert_24px.svg", 24)
            .icon("action:favorite_outline",
            "./assets/svg/action/ic_favorite_outline_24px.svg", 24)
            .icon("action:favorite",       "./assets/svg/action/ic_favorite_24px.svg", 24)
            .icon("action:today",          "./assets/svg/action/ic_today_24px.svg", 24)
            .icon("file:size",             "./assets/svg/action/ic_description_24px.svg", 24)
            .icon("action:exit_to_app",    "./assets/svg/action/ic_exit_to_app_24px.svg", 24)
            .icon("action:done",           "./assets/svg/action/ic_done_24px.svg", 24)
            .icon("action:help",           "./assets/svg/action/ic_help_24px.svg", 24)
            .icon("action:lock",           "./assets/svg/action/ic_lock_24px.svg", 24)
            .icon("action:search",         "./assets/svg/action/ic_search_24px.svg", 24)
            .icon("action:settings",       "./assets/svg/action/ic_settings_24px.svg", 24)
            .icon("action:settings_applications", "./assets/svg/action/ic_settings_applications_24px.svg", 24)
            .icon("action:account_box",    "./assets/svg/action/ic_account_box_24px.svg", 24)
            .icon("action:account_circle",
            "./assets/svg/action/ic_account_circle_24px.svg", 24)
            .icon("maps:place",            "./assets/svg/maps/ic_place_24px.svg", 24)
            .icon("maps:map",              "./assets/svg/maps/ic_map_24px.svg", 24)
            .icon("maps:directions_walk",  "./assets/svg/maps/ic_directions_walk_24px.svg", 24)
            .icon("maps:heatmap",  "./assets/svg/image/ic_hdr_strong_24px.svg", 24)
            .icon("social:location_city",  "./assets/svg/social/ic_location_city_24px.svg", 24)
            .icon("social:person",         "./assets/svg/social/ic_person_24px.svg", 24)
            .icon("social:person_add",     "./assets/svg/social/ic_person_add_24px.svg", 24)
            .icon("social:person_outline", "./assets/svg/social/ic_person_outline_24px.svg", 24)
            .icon("image:camera",           "./assets/svg/image/ic_camera_24px.svg", 24)
            .icon("image:photo",           "./assets/svg/image/ic_photo_24px.svg", 24)
            .icon("image:photo_album",     "./assets/svg/image/ic_photo_album_24px.svg", 24)
            .icon("image:photo_library",   "./assets/svg/image/ic_photo_library_24px.svg", 24)
            .icon("image:photo_size",      "./assets/svg/image/ic_crop_5_4_24px.svg", 24)
            .icon("image:camera",          "./assets/svg/image/ic_photo_camera_24px.svg", 24)
            .icon("image:exposure",        "./assets/svg/image/ic_exposure_24px.svg", 24)
            .icon("image:flash_on",        "./assets/svg/image/ic_flash_on_24px.svg", 24)
            .icon("image:iso",             "./assets/svg/image/ic_iso_24px.svg", 24)
            .icon("file:name",             "./assets/svg/file/ic_folder_24px.svg", 24)
            .icon("file:upload",           "./assets/svg/file/ic_file_upload_24px.svg", 24)
            .icon("file:download",         "./assets/svg/file/ic_file_download_24px.svg", 24)
            .icon("file:cloud_upload",     "./assets/svg/file/ic_cloud_upload_24px.svg", 24)
            .icon("file:cloud_off",        "./assets/svg/file/ic_cloud_off_24px.svg", 24)
            .icon("communication:comment", "./assets/svg/communication/ic_comment_24px.svg", 24)
            .icon("communication:email",   "./assets/svg/communication/ic_email_24px.svg", 24)
            .icon("navigation:menu",       "./assets/svg/navigation/ic_menu_24px.svg", 24)
            .icon("navigation:close",      "./assets/svg/navigation/ic_close_24px.svg", 24)
            .icon("editor:mode_edit",      "./assets/svg/editor/ic_mode_edit_24px.svg", 24)
        ;

        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('orange');

    });