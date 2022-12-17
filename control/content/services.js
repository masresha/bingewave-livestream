(function (angular, buildfire, location) {
    'use strict';
    //created mediaCenterWidget module
    var settings, appId;
    var Settings = {
        setSettings: function (newSettings) {
            settings = newSettings;
        },
        setAppId: function (newId) {
            appId = newId;
        },
        getSetting: function () {
            return settings;
        },
        getAppId: function () {
            return appId;
        }
    };
    angular
        .module('placesServices', ['placesContentEnums'])
       
        .factory("RequestsService", ['$http', '$rootScope,', function ($http, $rootScope,) {
            var APIUrl = 'https://bw.bingewave.com/';
            return {
            
                getAPIUrl: function() {
                    return APIUrl;
                }
            }
        }]);

})(window.angular, window.buildfire, window.location);
