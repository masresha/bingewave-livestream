'use strict';

(function (angular) {
	angular.module('BingewaveAngularJs')
		.controller('BingewaveCtrl', ['$sce', '$scope', 'APIService', 'RequestService',
			'SocialDataStore', 'Modals', 'Buildfire', '$rootScope', 'Location', 'EVENTS',
			'GROUP_STATUS', 'MORE_MENU_POPUP', 'FILE_UPLOAD', '$modal', 'SocialItems', '$q',
			'$anchorScroll', '$location', '$timeout', 'Util', 'SubscribedUsersData', '$window',
			function ($sce, $scope, APIService, RequestService, SocialDataStore,
				Modals, Buildfire, $rootScope, Location, EVENTS, GROUP_STATUS,
				MORE_MENU_POPUP, FILE_UPLOAD, $modal, SocialItems, $q, $anchorScroll,
				$location, $timeout, util, SubscribedUsersData, $window) {
				var WidgetBingewave = this;
				WidgetBingewave.SocialItems = SocialItems.getInstance();
				WidgetBingewave.appTheme = null;
				WidgetBingewave.loadedPlugin = false;
				WidgetBingewave.SocialItems = SocialItems.getInstance();
				WidgetBingewave.util = util;
				$rootScope.showWidgetBingewave = true;

				$scope.show_conference = false;
				$scope.show_stream = false;
				$scope.conference_url = null;
				$scope.event_id = null;
				$scope.event = null;
				$scope.showHomeText = false;
				$scope.loaded = false;
				$scope.showNewEventTitle = false;
				$scope.newEventTitle = "";
				$scope.event = {};
				$scope.events = [];

				$scope.loading = true;
				$scope.languages = {};
				$scope.profile = {};
				$scope.pinnedPost = "";
				$scope.offset = 0;
				$scope.pageSize = 10;
				$window.BingewaveConnector.init();
				var queryParam = {
					organizer_id: RequestService.getPreferences().organizer_id,
					results_per_page: $scope.pageSize,
					order_keywords: "DESC",
					order_by: "date",
					offset: $scope.offset,
					is_private:0,
				}
				// $scope.authToken = {};
				// buildfire.userData.save(
                //     $scope.authToken,
                //     "bingeWaveAuthToken",
                //     (err, result) => {
                //         if (err) return console.error("Error while inserting your data", err);
                //         console.log("Deleted successful", result);
                //     });
				$scope.authToken = {
					token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzE1MjI4NzgsImV4cCI6MTc2MTUyMjg3OCwiaXNzIjoibG9jYWxob3N0Iiwid2lkZ2V0X3Rva2VuIjpmYWxzZSwiZGlzdHJpYnV0b3JfaWQiOiI0MWFkMzlhYS02ODJkLTRiNzUtOTI5MC00MGJkZWZkM2ZkYzgiLCJ0eXBlIjoiYWNjb3VudCIsInJlZmVyZW5jZV9pZCI6IjJlYWQ2ZmQ0LTgzY2EtNGJkZC1hYjIwLTFjOTkyZWFmZGM3NyIsInVpZCI6IjFlM2M1ZmFjLTg2YmEtNDhiZC1hMDViLWY1ZDA5MTUwYzA4MCJ9.g1b6HlGGbYpR8MLBtUGloxFumlUmNzc0Tr4Q1aBztNg"
				}
				$window.BingewaveConnector.setAuthToken($scope.authToken.token);

				
				WidgetBingewave.getDuration = function (timestamp) {
					return moment(timestamp.toString()).fromNow();
				};

				$scope.trustSrc = function (src) {
					return $sce.trustAsResourceUrl(src);
				};


				//triggered when you open an event from the list
				$scope.goToEvent = function(){
					$scope.conference_url = "https://widgets.bingewave.com/webrtc/e94352e3-f164-4bd6-8b33-6f9f03dbef66";
					//$scope.conference_url = '<bw:widget env="prod" type="webrtc" id="e94352e3-f164-4bd6-8b33-6f9f03dbef66"></bw:widget>';
					//$scope.stream_embed = $sce.trustAsHtml($scope.conference_url); 
					// setTimeout(() => {
					// 	console.log("Test I am running");
					// 	$window.BingewaveConnector.parseTags();
					// }, 1000);

				}

				const constraints = window.constraints = {
					audio: false,
					video: true
				};

				$scope.startCameraBroadcast = async function () {
					try {
						const stream = await navigator.mediaDevices.getUserMedia(constraints);
						const video = document.querySelector('video');
						const videoTracks = stream.getVideoTracks();

						console.log('Got stream with constraints:', constraints);
						console.log(`Using video device: ${videoTracks[0].label}`);
						video.srcObject = stream;

						[window.track] = stream.getVideoTracks();

					} catch (e) {
						if(e) {
							buildfire.dialog.alert({ message: "Permissions have not been granted to use your camera, ' + 'you need to allow the page access to your devices in ' + 'order for the demo to work." })
						}
					}
				}

				$scope.requestAuth = function () {
					buildfire.services.camera.requestAuthorization(null, (err, result) => {
						if (err) {
							console.log(`requestAuthorization error: ${err}`);
							buildfire.dialog.alert({ message: "requestAuthorization error " + JSON.stringify(err) });
						} else {
							buildfire.dialog.alert({ message: result });
						}
					});
				}

				$scope.isAvailable = function () {
					buildfire.services.camera.isAuthorized(null, (err, result) => {
						if (err) {
							buildfire.dialog.alert({ message: "isCameraAvailable error " + JSON.stringify(err) });
						} else {
							buildfire.dialog.alert({ message: result });
						}
					});
				}

				$scope.showMoreOptions = function (event) {
					WidgetBingewave.modalPopupWidgetBingewaveId = event.id;
					WidgetBingewave.SocialItems.authenticateUser(null, (err, user) => {
						if (err) return console.error("Getting user failed.",
							err);
						if (user) {
							Modals.showMoreOptionsModal({
								'postId': event.id,
								// 'userId': WidgetBingewave.post.userId,
								'socialItemUserId': WidgetBingewave.SocialItems.userDetails.userId,
								'languages': $scope.languages
							}).then(function (data) {
									if (data === WidgetBingewave.SocialItems
										.languages.reportEvent) {
										SocialDataStore.reportEvent({
											reportedAt: new Date(),
											reporter: WidgetBingewave.SocialItems.userDetails.email,
											reported: event,
											// reportedUserID: WidgetBingewave.post.userId,
											// text: WidgetBingewave.post.text,
											// postId: WidgetBingewave.post.id,
											wid: WidgetBingewave.SocialItems.wid
										});
									}
								},
								function (err) {
									console.log('Error in Error handler--------------------------',err);
								});
						}
					});
					$scope.$digest();
				};

				WidgetBingewave.setAppTheme = function () {
					buildfire.appearance.getAppTheme((err, obj) => {
						var elements = document.getElementsByTagName('svg');
						for (var i = 0; i < elements.length; i++) {
							elements[i].style.setProperty("fill", obj.colors
								.icons, "important");
						}
						WidgetBingewave.appTheme = obj.colors;
						WidgetBingewave.loadedPlugin = true;
					});
				}

				Buildfire.datastore.onUpdate(function (response) {
					if (response.tag === "Social") {
						WidgetBingewave.setSettings(response);
						setTimeout(function () {
							if (!response.data.appSettings.disableHomeText) {
								// var wallSVG = document.getElementById("WidgetBingewaveSvg")
								// if (wallSVG) {
								// 	wallSVG.style.setProperty("fill", WidgetBingewave.appTheme.icons, "important");
								// }
							}
						}, 100);
					}
					else if (response.tag === "languages")
						WidgetBingewave.SocialItems.formatLanguages(response);
						$scope.languages = WidgetBingewave.SocialItems.languages;
						console.log($scope.languages, WidgetBingewave.SocialItems.languages)

					   $scope.$digest();
				});

				WidgetBingewave.setSettings = function (settings) {
					// console.log("Set setting")
					WidgetBingewave.SocialItems.appSettings = settings.data && settings.data.appSettings ? settings.data.appSettings : {};
					WidgetBingewave.homeTextPermission();
					if (WidgetBingewave.SocialItems.appSettings && typeof WidgetBingewave.SocialItems.appSettings.pinnedPost !== 'undefined') {
						WidgetBingewave.pinnedPost = WidgetBingewave.SocialItems.appSettings.pinnedPost;
						pinnedPost.innerHTML = WidgetBingewave.pinnedPost;
						$scope.pinnedPost = pinnedPost.innerHTML;
					}
				}

				WidgetBingewave.homeTextPermission = function () {
					buildfire.datastore.get('Social', function (err, result) {
						if (err) {
							console.error('App settings -- ', err);
						} else {
							if (result && result.data) {
								WidgetBingewave.SocialItems.appSettings = result.data.appSettings;
								// console.log(WidgetBingewave.SocialItems);
								if (WidgetBingewave.SocialItems && WidgetBingewave.SocialItems.appSettings && WidgetBingewave.SocialItems.appSettings.disableHomeText) {
									$scope.showHomeText = false;
								} else {
									$scope.showHomeText = true;
								}
							}	
						}
						$scope.loaded = true;
                        $scope.$digest();

					});
					
				}

				WidgetBingewave.init = function () {
					WidgetBingewave.SocialItems.getSettings((err, result) => {
						if (err) return console.error(
							"Fetching settings failed.", err);
						if (result) {
							WidgetBingewave.SocialItems.items = [];
							WidgetBingewave.setSettings(result);
							WidgetBingewave.setAppTheme();
					        WidgetBingewave.homeTextPermission();
							$scope.languages = WidgetBingewave.SocialItems.languages;
							WidgetBingewave.SocialItems.authenticateUser(null, (
								err, user) => {
								if (err) return console.error(
									"Getting user failed.", err);
								if (user) {} else {
									WidgetBingewave
										.groupFollowingStatus = false;
								}
							});
						}
					});
				};

				WidgetBingewave.init();
				WidgetBingewave.formatLanguages = function (strings) {
					Object.keys(strings).forEach(e => {
						strings[e].value ? WidgetBingewave.SocialItems.languages[e] =
							strings[e].value : WidgetBingewave.SocialItems.languages[
								e] = strings[e].defaultValue;
					});
				}



				$rootScope.$on('navigatedBack', function (event, error) {
					WidgetBingewave.SocialItems.items = [];
					WidgetBingewave.SocialItems.isPrivateChat = false;
					WidgetBingewave.SocialItems.pageSize = 5;
					WidgetBingewave.SocialItems.page = 0;
					WidgetBingewave.SocialItems.wid = WidgetBingewave.SocialItems
						.mainWallID;
					WidgetBingewave.SocialItems.pluginTitle = '';
					WidgetBingewave.init();
				});

				// On Login
				Buildfire.auth.onLogin(function (user) {
					console.log("NEW USER LOGGED IN", WidgetBingewave.SocialItems
						.forcedToLogin)
					if (!WidgetBingewave.SocialItems.forcedToLogin) {
						WidgetBingewave.SocialItems.authenticateUser(user, (err,
							userData) => {
							if (err) return console.error(
								"Getting user failed.", err);
							if (userData) {
								WidgetBingewave.checkFollowingStatus();
							}
						});
					} else WidgetBingewave.SocialItems.forcedToLogin = false;
					WidgetBingewave.showUserLikes();
					if ($scope.$$phase) $scope.$digest();
				});

				// On Logout
				Buildfire.auth.onLogout(function () {
					console.log('User loggedOut from Widget Wall Page');
					buildfire.appearance.titlebar.show();
					WidgetBingewave.SocialItems.userDetails = {};
					WidgetBingewave.groupFollowingStatus = false;
					buildfire.notifications.pushNotification.unsubscribe({
						groupName: WidgetBingewave.SocialItems.wid === '' ?
							WidgetBingewave.SocialItems.context.instanceId :
							WidgetBingewave.SocialItems.wid
					}, () => {});
					WidgetBingewave.privateChatSecurity();
					$scope.$digest();
				});

			}
		])
})(window.angular);
