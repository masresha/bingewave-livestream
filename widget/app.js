'use strict';

(function (angular, buildfire) {
    angular.module('BingewaveAngularJs', ['ngRoute', 'ngAnimate', 'socialModals', 'BingewaveAngularJsPluginFilters','ui.bootstrap'])
        .config(['$sceDelegateProvider','$routeProvider', '$compileProvider', '$httpProvider', function ($sceDelegateProvider, $routeProvider, $compileProvider, $httpProvider) {
           
            /**
             * To make href urls safe on mobile
             */
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile|file):/);


            $routeProvider
                
                .when('/bingewave', {
                    templateUrl: 'templates/bingewave.html',
                    controller: 'BingewaveCtrl'
                })
           
                .otherwise({ redirectTo: '/bingewave' });
            // $sceDelegateProvider.resourceUrlWhitelist([
            //     "https://widgets.bingewave.com/**"
            // ]);
            var interceptor = ['$q', function ($q) {

                return {

                    request: function (config) {
                        if (!config.silent && config.url.indexOf('threadLikes') == -1 && config.url.indexOf('thread/add') == -1 && config.url.indexOf('Image/upload') == -1) {
                            //buildfire.spinner.show();
                        }
                        return config;
                    },
                    response: function (response) {
                        buildfire.spinner.hide();
                        return response;
                    },
                    responseError: function (rejection) {
                        buildfire.spinner.hide();
                        return $q.reject(rejection);
                    }
                };
            }];

            $httpProvider.interceptors.push(interceptor);
        }])
        .run(['$location', '$rootScope', 'Location', 'Buildfire', function ($location, $rootScope, Location, Buildfire) {
            //  var goBack = buildfire.navigation.onBackButtonClick;

            // buildfire.navigation.onBackButtonClick = function () {
            //     buildfire.history.get({
            //         pluginBreadcrumbsOnly: true
            //     }, function (err, result) {
            //         console.log("BACK BUTTON CLICK", result)
            //         if(!result.length) return goBack();
            //         if(result[result.length-1].options.isPrivateChat) {
            //             console.log("PRIVATE CHAT BACK BUTTON")
            //             result.map(item => buildfire.history.pop());
            //             $rootScope.showThread = true;
            //             $location.path('/');
            //             $rootScope.$broadcast("navigatedBack");
            //             //location.reload();
            //         }
            //         else {
            //              if(result[0].label === 'thread' || result[0].label === 'members') {
            //                 $rootScope.showThread = true;
            //                 $location.path('/');
            //                 $rootScope.$digest();
            //                 buildfire.history.pop();
            //             } 
            //         }
            //     });
            // }
        }])
        .directive('copyToClipboard', function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    elem.click(function () {
                        if (attrs.copyToClipboard) {
                            var $temp_input = $("<input>");
                            $("body").append($temp_input);
                            $temp_input.val(attrs.copyToClipboard).select();
                            document.execCommand("copy");
                            $temp_input.remove();
                        }
                    });
                }
            };
        })
        .directive('ngCompare', function () {
            return {
            require: 'ngModel',
            link: function (scope, currentEl, attrs, ctrl) {
            var comparefield = document.getElementsByName(attrs.ngCompare)[0]; //getting first element
            var compareEl = angular.element(comparefield);
           
            //current field key up
            currentEl.on('keyup', function () {
            if (compareEl.val() != "") {
            var isMatch = currentEl.val() === compareEl.val();
            ctrl.$setValidity('compare', isMatch);
            scope.$digest();
            }
            });
           
            //Element to compare field key up
            compareEl.on('keyup', function () {
            if (currentEl.val() != "") {
            var isMatch = currentEl.val() === compareEl.val();
            ctrl.$setValidity('compare', isMatch);
            scope.$digest();
            }
            });
            }
            }
        })
        .directive('handlePhoneSubmit', function () {
            return function (scope, element, attr) {
                var textFields = $(element).children('textarea[name="text"]');
                $(element).submit(function () {
                    console.log('form was submitted');
                    textFields.blur();
                });
            };
        })
        .directive('noScroll', function ($document) {
            return {
              restrict: 'A',
              link: function ($scope, $element, $attr) {
        
                $document.on('touchmove', function (e) {
                  e.preventDefault();
                });
              }
            }
          })
        .filter('getUserImage', ['Buildfire', function (Buildfire) {
            filter.$stateful = true;
            function filter(usersData, userId) {
                var userImageUrl = '';
                usersData.some(function (userData) {
                    if (userData.userObject._id == userId) {
                        if (userData.userObject.imageUrl) {
                            userImageUrl = userData.userObject.imageUrl;
                        } else {
                            userImageUrl = '';
                        }
                        return true;
                    }
                });
                return userImageUrl;
            }
            return filter;
        }])
        .directive("loadImage", function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.attr("src", "../../../styles/media/holder-" + attrs.loadImage + ".gif");

                    if (attrs.imgType && attrs.imgType.toLowerCase() == 'local') {
                        replaceImg(attrs.finalSrc);
                        return;
                    }

                    attrs.$observe('finalSrc', function () {
                        var _img = attrs.finalSrc;

                        if (attrs.cropType == 'resize') {
                            buildfire.imageLib.local.resizeImage(_img, {
                                width: attrs.cropWidth,
                                height: attrs.cropHeight
                            }, function (err, imgUrl) {
                                _img = imgUrl;
                                replaceImg(_img);
                            });
                        } else {
                            buildfire.imageLib.local.cropImage(_img, {
                                width: attrs.cropWidth,
                                height: attrs.cropHeight
                            }, function (err, imgUrl) {
                                _img = imgUrl;
                                replaceImg(_img);
                            });
                        }
                    });

                    function replaceImg(finalSrc) {
                        var elem = $("<img>");
                        elem[0].onload = function () {
                            element.attr("src", finalSrc);
                            elem.remove();
                        };
                        elem.attr("src", finalSrc);
                    }
                }
            };
        })
        .directive('onTouchend', [function () {
            return function (scope, element, attr) {
                element.on('touchend', function (event) {
                    scope.$apply(function () {
                        scope.$eval(attr.onTouchend);
                    });
                });
            };
        }]);
})(window.angular, window.buildfire);