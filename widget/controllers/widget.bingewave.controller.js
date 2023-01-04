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
				$scope.show_conference = false;
				$scope.show_stream = false;
				$scope.conference_url = null;
				$scope.stream_url = null;
				$scope.stream_id = null;
				$scope.event_id = null;
				$scope.event = null;
				$scope.stream_started = false;
				$scope.broadcast_started = false;
				$scope.show_chats = false;
				$scope.messages = [];
				WidgetBingewave.SocialItems = SocialItems.getInstance();
				$scope.showHomeText = false;
				$scope.loaded = false;
				$scope.mute = true;
				$scope.unmute = false;
				$scope.showNewEventTitle = false;
				$scope.newEventTitle = "";
				$scope.event = {};
				$scope.events = [];
				$scope.my_videos = [];
				WidgetBingewave.appTheme = null;
				WidgetBingewave.loadedPlugin = false;
				WidgetBingewave.SocialItems = SocialItems.getInstance();
				WidgetBingewave.util = util;
				$rootScope.showWidgetBingewave = true;
				$scope.loading = true;
				$scope.home_text = "B home";
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
					// type: "7"
				}
				// $scope.authToken = {};
				// buildfire.userData.save(
                //     $scope.authToken,
                //     "bingeWaveAuthToken",
                //     (err, result) => {
                //         if (err) return console.error("Error while inserting your data", err);
                //         console.log("Deleted successful", result);
                //     });
				buildfire.userData.get("bingeWaveAuthToken", (err, result) => {
					if (err) return console.error("Error while retrieving your bingeWaveAuthToken", err);
					console.log("bingeWaveAuthToken", result.data);
					if(angular.equals(result.data, {})){
						buildfire.auth.getCurrentUser((err, user) => {
							if (err) return console.error(err);
							console.log(user);
								// if (err) return console.error("Error while retrieving your data",err);
								if (angular.equals(RequestService.getPreferences(), {})) {
									console.log("your organizer account isn't set up");
									buildfire.dialog.alert({
										message: "Your organizer account isn't set up!",
									  });
									  $scope.loading = false;
								}else{
									console.log("bingeWaveConfig From my service",RequestService.getPreferences());
									$scope.organizerInfo = {
										organizer_id: '',
										auth_token: ''
									}
									$scope.organizerInfo.organizer_id = RequestService.getPreferences().organizer_id;
									$scope.organizerInfo.auth_token = RequestService.getPreferences().auth_token;
									var dataSyncOrganizer = {
										"first_name": user.firstName,
										"last_name": user.lastName,
										"email": user.email,
										"organizer_id": $scope.organizerInfo.organizer_id,
										"auth_token": $scope.organizerInfo.auth_token
									}
									var dataSetRole = {
										"account_id": $scope.organizerInfo.organizer_id,
										"role": "is_member"
									}
									console.log(dataSyncOrganizer)
									APIService.sync_organizer(dataSyncOrganizer,function (res) {
												setTimeout(function () {
														console.log("user token should be here " + res.data.auth_token);
														$scope.authToken = {
																token: res.data.data.auth_token
															};
														buildfire.userData.save($scope.authToken,"bingeWaveAuthToken",(err,result) => {
																	if (err)
																		return console.error("Error while saving auth token",err);
																	console.log("Insert successful",result);
																	APIService.get_all_events(queryParam,function (result) {
																				$scope.events = result.data.data;
																				console.log($scope.events)
																				$scope.loading = false;
																			},function (response) {
																				console.log(response);
																			}
																		);
																	// $scope.authToken = resp.data.auth_token;
																	// $window.BingewaveConnector.init({auth_token : result.data.data.auth_token });
																}
															);
													},3000);
	
												APIService.set_role(dataSetRole,function (result) {
															console.log(result.data)
														},function (response) {
															console.log(response)
														});
											},
											function (response) {
												console.log(response)
									});
								}
						});
						
					}else{
						console.log(result.data);
						$scope.authToken = result.data;
						queryParam.auth_token = $scope.authToken.token;
						APIService.get_all_events(queryParam, function (result) {
							$scope.events = result.data.data;
							console.log($scope.events)
							$scope.loading = false;
							$window.BingewaveConnector.setAuthToken($scope.authToken.token);
							var profile_token = {
								auth_token: $scope.authToken.token
							}
							APIService.get_my_profile(profile_token, function (result) {
								$scope.profile = result.data.data;
								console.log($scope.profile)
							}, function (response) {
								console.log(response)
							});
					   }, function (response) {
						   console.log(response);
					   
					   });
						//$window.BingewaveConnector.init({auth_token : result.data.token});
					} 
				  });


				$scope.showMore = function(){
					$scope.loading = true;
					$scope.offset = $scope.offset + 5;
					var queryParam = {
						organizer_id: RequestService.getPreferences().organizer_id,
						results_per_page: $scope.pageSize,
						order_keywords: "DESC",
						order_by: "date",
						offset: $scope.offset,
						is_private:0
					}
					queryParam.auth_token = $scope.authToken.token;
					APIService.get_all_events(queryParam, function (result) {
						$scope.events = result.data.data;
						$scope.loading = false;
				   }, function (response) {
					   console.log(response)
				   });
				}
				
				WidgetBingewave.getDuration = function (timestamp) {
					return moment(timestamp.toString()).fromNow();
				};

				// buildfire.datastore.get('Social', function (err, result) {
				// 	if (err) {
				// 		console.error('App settings -- ', err);
				// 	} else {
				// 		if (result && result.data) {
				// 			WidgetBingewave.SocialItems.appSettings = result.data.appSettings;
				// 			console.log(WidgetBingewave.SocialItems);
				// 			if (WidgetBingewave.SocialItems && WidgetBingewave.SocialItems.appSettings && WidgetBingewave.SocialItems.appSettings.disableHomeText) {
				// 				WidgetBingewave.showHomeText = false;
				// 			} else {
				// 				WidgetBingewave.showHomeText = true;
				// 			}
				// 			console.log(WidgetBingewave.showHomeText)
				// 		}	
				// 	}
				// });
				$scope.copyText = function () {
					const options = { text: 'Meeting Link Copied' };
					buildfire.components.toast.showToastMessage(options, () => { });
				}

				$scope.home = function () {
					$scope.show_conference = false;
					$scope.show_stream = false;
					$scope.conference_url = null;
					$scope.stream_url = null;
					queryParam.auth_token = $scope.authToken.token;
					APIService.get_all_events(queryParam, function (result) {
						 $scope.events = result.data.data;
						 $scope.loading = false;
	
					}, function (response) {
						console.log(response);
					
					});
					Location.go('#/bingewave');
				}
			
				$scope.trustSrc = function (src) {
					return $sce.trustAsResourceUrl(src);
				};

				$scope.createEventTitle = function(){
					$scope.showNewEventTitle = true;
					$scope.getMyVideo();
				}

				$scope.createEvent = function () {
					if($scope.event.private_event === 'true'){
						$scope.event.private_event = true
					}else{
						$scope.event.private_event = false
					}
					// if($scope.event.type === "1"){
					// 	var event = {
					// 		type: $scope.event.type,
					// 		organizer_id: RequestService.getPreferences().organizer_id,
					// 		template_id: RequestService.getPreferences().template_id,
					// 		event_title: $scope.event.event_title,
					// 		event_description: $scope.event.event_description,
					// 		video_id: $scope.event.video_id,
					// 		private_event: $scope.event.private_event,
					// 		requested_date_1: $scope.event.requested_date_1,
					// 		is_virtual_event: true
					// 	}
					// }else if($scope.event.type === "5"){
					// 	var event = {
					// 		type: $scope.event.type,
					// 		organizer_id: RequestService.getPreferences().organizer_id,
					// 		template_id: RequestService.getPreferences().template_id,
					// 		event_title: $scope.event.event_title,
					// 		event_description: $scope.event.event_description,
					// 		requested_date_1: $scope.event.requested_date_1,
					// 		private_event: $scope.event.private_event,

					// 	}
					// }else {
						var event = {
							type: "7",
							organizer_id: RequestService.getPreferences().organizer_id,
							template_id: RequestService.getPreferences().template_id,
							event_title: $scope.event.event_title,
							event_description: $scope.event.event_description,
							private_event: $scope.event.private_event,
							requested_date_1: $scope.event.requested_date_1,
							auth_token: $scope.authToken.token
					    }

					APIService.create_event(event, function (result) {
						if (result.data.status === 'success') {
							$scope.showNewEventTitle = false;
							console.log(result, event.type);

							var moderator_data = {
								account_id: $scope.profile.id,
								event_id: result.data.data.id
							}
							APIService.make_moderator(moderator_data, function (result) {
								console.log("make moderator data" + result);
							}, function (response) {
								console.log(response)
							});

							if(event.type === "7"){
								$scope.show_stream = true;
								$scope.show_conference = false;
								$scope.stream_id = result.data.data.id;
								$scope.event_id = result.data.data.id;
								$scope.stream_url = result.data.data.embed_livestream;
								$scope.stream_embed = $sce.trustAsHtml($scope.stream_url);
								// $window.BingewaveConnector.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzAyNTEzNDgsImV4cCI6MTc2MDI1MTM0OCwiaXNzIjoibG9jYWxob3N0IiwicmVmZXJlbmNlX2lkIjoiM2E4MDE2ZWItMjNkNC00Mzk1LTkyZTItMjgzNmJiM2I5Y2MxIiwidHlwZSI6ImRpc3RyaWJ1dG9yIiwiZGlkIjoiOThlYjVjYjMtMmQ3My00ODYwLWE5M2UtMDQxMTQ0NWY3YjBkIn0.xe0GEyyPaIOqs3AUB2xcpsX8M-aoOnmGciBdEfdghEU");
								setTimeout(() => {
									console.log("Test I am running");
									$window.BingewaveConnector.parseTags();
								}, 1000)
								//$scope.stream_url = "https://widgets.bingewave.com/stream/" + result.data.data.id + "?elementid=" + result.data.data.id + ":59&amp;env=prod"
							}else{
								$scope.show_conference = true;
								$scope.show_stream = false;
								$scope.conference_url = result.data.data.webview_video_chat;
								$scope.event_id = result.data.data.id;
							}						
						}
					}, function (response) {
						$scope.show_conference = false;
						console.log(response)
					});
				}
				$scope.closeNewEvent = function() {
					$scope.showNewEventTitle = false;
				}
				$scope.goToEvent = function(event){
					$scope.is_moderator = false;
					$scope.is_participant = false;
					$scope.is_panelist = false;

					var info = {
						user_id: $scope.profile.id,
						event_id: event.id
					}
					APIService.get_user_status(info, function (result) {
						console.log(result)
						if(result.data.data.is_moderator === "1"){
							$scope.is_moderator = true;
							$scope.is_participant = false;
							$scope.is_panelist = false;
						}else if(result.data.data.is_panelist === "1"){
							$scope.is_moderator = false;
							$scope.is_participant = false;
							$scope.is_panelist = true;
						}else if(result.data.data.is_participant === "1"){
							$scope.is_moderator = false;
							$scope.is_participant = true;
							$scope.is_panelist = false;
						}
						console.log($scope.is_moderator + "is_moderator")
						console.log($scope.is_participant + "is_participant")
						console.log($scope.is_panelist + "is_panelist")
						$scope.event = event;
						$scope.showNewEventTitle = false;
						$scope.event_id = event.id;
						// $scope.selected_event = '<bw:widget env="prod" type="webrtc" id="55d817ee-bb48-455f-a7a8-819af04681fa"></bw:widget>';
						console.log(event.type)
						if(event.type === "1" || event.pre_recorded_contents.length > 0 || event.pre_recorded_content){
							console.log("event is stream")
							console.log(event.pre_recorded_content)
							console.log(event.pre_recorded_contents.length)
							console.log(event.type);
							$scope.show_stream = true;
							$scope.show_conference = false;
							$scope.stream_id = event.id;
							if($scope.is_moderator){
								$scope.stream_url = event.embed_video_chat;
							}else{
								$scope.stream_url = event.embed_broadcast;
							}
							//$scope.stream_url = "https://widgets.bingewave.com/stream/" + $scope.event_id + "?elementid=" + $scope.event_id + ":59&amp;env=prod"
							$scope.stream_embed = $sce.trustAsHtml($scope.stream_url);
							// $window.BingewaveConnector.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzAyNTEzNDgsImV4cCI6MTc2MDI1MTM0OCwiaXNzIjoibG9jYWxob3N0IiwicmVmZXJlbmNlX2lkIjoiM2E4MDE2ZWItMjNkNC00Mzk1LTkyZTItMjgzNmJiM2I5Y2MxIiwidHlwZSI6ImRpc3RyaWJ1dG9yIiwiZGlkIjoiOThlYjVjYjMtMmQ3My00ODYwLWE5M2UtMDQxMTQ0NWY3YjBkIn0.xe0GEyyPaIOqs3AUB2xcpsX8M-aoOnmGciBdEfdghEU");
							setTimeout(() => {
								console.log("Test I am running");
								$window.BingewaveConnector.parseTags();
							}, 1000)
						}else{
							console.log("event is not stream")
							$scope.show_conference = true;
							$scope.show_stream = false;
							//$scope.conference_url = event.webview_video_chat;
							if($scope.is_moderator){
								$scope.conference_url = event.embed_video_chat;
								console.log("is moderatot")
							}else{
								console.log("is not moderatot")
								$scope.conference_url = event.embed_broadcast;
							}
							$scope.stream_embed = $sce.trustAsHtml($scope.conference_url); 
							// $window.BingewaveConnector.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzAyNTEzNDgsImV4cCI6MTc2MDI1MTM0OCwiaXNzIjoibG9jYWxob3N0IiwicmVmZXJlbmNlX2lkIjoiM2E4MDE2ZWItMjNkNC00Mzk1LTkyZTItMjgzNmJiM2I5Y2MxIiwidHlwZSI6ImRpc3RyaWJ1dG9yIiwiZGlkIjoiOThlYjVjYjMtMmQ3My00ODYwLWE5M2UtMDQxMTQ0NWY3YjBkIn0.xe0GEyyPaIOqs3AUB2xcpsX8M-aoOnmGciBdEfdghEU");
							setTimeout(() => {
								console.log("Test I am running");
								$window.BingewaveConnector.parseTags();
							}, 1000);
						}
				   }, function (response) {
					   console.log(response)
				   });


				}

				$scope.getMyVideo = function () {
					var eventsss = {
						organizer_id: RequestService.getPreferences().organizer_id,
						creator_id: $scope.profile.id,
					}
					APIService.get_my_videos(eventsss, function (result) {
						$scope.my_videos = result.data.data
					}, function (response) {
						// $scope.show_conference = false;
						console.log(response)
					});

				}

				$scope.muteAll = function () {
					var event = {
						event_id: $scope.event_id,
						role: "participant"
					}
					APIService.mute_all_participants(event, function (result) {
					}, function (response) {
						$scope.show_conference = false;
						console.log(response)
					});

				}

				$scope.unMuteAll = function () {
					var event = {
						event_id: $scope.event_id,
						role: "participant"
					}
					APIService.unmute_all_participants(event, function (result) {
					}, function (response) {
						$scope.show_conference = false;
						console.log(response)
					});

				}

				$scope.getChats = function () {
					APIService.get_chat_messages($scope.event_id, function (
						result) {
						if (result.data.status === 'success') {
							$scope.messages = result.data.data;
							$scope.show_chats = true;
						}
					}, function (response) {
						// $scope.show_conference = false;

						console.log(response)
					});
				}

				$scope.sendChat = function () {
					var message = {
						message: $scope.user.message,
						event_id: $scope.event_id
					}
					APIService.send_chat_messages(message, function (
					result) {
						$scope.getChats();
					}, function (response) {
						console.log(response)
					});
				}

				$scope.startBroadcast = function () {
					APIService.start_broadcast($scope.event_id, function (
						result) {
						if (result.data.status === 'success') {
							$scope.broadcast_started = true;
						}
					}, function (response) {
						console.log(response)
					});
				}

				$scope.stopBroadcast = function () {
					APIService.stop_broadcast($scope.event_id, function (
						result) {
						if (result.data.status === 'success') {
							$scope.broadcast_started = false;
						}
					}, function (response) {
						console.log(response)
					});
				}

				$scope.startStream = function () {
					APIService.start_stream($scope.event_id, function (
						result) {
						if (result.data.status === 'success') {
							$scope.stream_started = true;
						}
					}, function (response) {
						// $scope.show_conference = false;

						console.log(response)
					});
				}

				$scope.stopStream = function () {
					APIService.stop_stream($scope.event_id, function (
					result) {
						if (result.data.status === 'success') {
							$scope.stream_started = false;
						}
					}, function (response) {
						// $scope.show_conference = false;

						console.log(response)
					});
				}

				$scope.getAllEvents = function () {
					queryParam.auth_token = $scope.authToken.token;
					APIService.get_all_events(queryParam, function (
						result) {
						// if (result.data.status === 'success') {
						// 	$scope.messages = result.data.data;
						// 	// console.log($scope.messages);
						// 	$scope.show_chats = true;
						// }
					}, function (response) {
						// $scope.show_conference = false;

						console.log(response)
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
