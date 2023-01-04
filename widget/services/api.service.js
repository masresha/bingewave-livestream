'use strict';
(function (angular) {

	angular.module('BingewaveAngularJs')

		.factory('APIService', APIService);

	APIService.$inject = ['$rootScope', 'RequestService', '$location'];

	function APIService($rootScope, RequestService, $location) {
		var service = {};
		//AccountCtrl services
		service.get_my_videos = get_my_videos;
		service.get_my_profile = get_my_profile;
		service.unmute_all_participants = unmute_all_participants;
		service.mute_all_participants = mute_all_participants;
		service.create_event = create_event;
		service.get_all_events = get_all_events;
		service.start_stream = start_stream;
		service.stop_stream = stop_stream;
		service.start_broadcast = start_broadcast;
		service.stop_broadcast = stop_broadcast;
		service.get_chat_messages = get_chat_messages;
		service.send_chat_messages = send_chat_messages;
		service.register = register;
		service.sync_organizer = sync_organizer;
		service.set_role = set_role;
		service.get_distributor_token = get_distributor_token;
		service.create_new_organizer = create_new_organizer;
		service.get_user_status = get_user_status;
		service.make_moderator = make_moderator;

		return service;

		function make_moderator(param, callback, fallback) {
			RequestService.CallAPI3(param, 'events/' + param.event_id + '/makeModerator',
				function (result) {
					if (result) {
						callback(result);
					}
				}, fallback);
		}


		function get_user_status(param, callback, fallback) {
			RequestService.CallAPI3(param, 'events/' + param.event_id + '/getUserStatus/' +
				param.user_id,
				function (result) {
					if (result) {
						callback(result);
					}
				}, fallback, 'GET');
		}


		function create_new_organizer(param, callback, fallback) {
			RequestService.CallAPI3(param, '/organizers', function (result) {
				if (result) {
					callback(result);
				}
			}, fallback);
		}

		function get_distributor_token(param, callback, fallback) {
			RequestService.CallAPI3(param, 'auth/getDistributorAccessToken', function (result) {
				if (result) {
					callback(result);
				}
			}, fallback);
		}


		function set_role(param, callback, fallback) {
			RequestService.CallAPI3(param, '/organizers/' + param.account_id + '/setUserToRole',
				function (result) {
					if (result) {
						callback(result);
					}
				}, fallback);
		}


		function sync_organizer(param, callback, fallback) {
			RequestService.CallAPI4(param, '/auth/syncToOrganizer', function (result) {
				if (result) {
					callback(result);
				}
			}, fallback);
		}


		function get_my_videos(param, callback, fallback) {
			RequestService.CallAPI3(param, '/videos', function (result) {
				if (result) {
					callback(result);
				}
			}, fallback, 'GET');
		}


		function get_my_profile(param, callback, fallback) {
			RequestService.CallAPI4(param, 'accounts/me', function (result) {
				if (result) {
					callback(result);
				}
			}, fallback, 'GET');
		}

		function unmute_all_participants(param, callback, fallback) {
			RequestService.CallAPI3(param, 'events/' + param.event_id + '/setUserAudioUnmute',
				function (result) {
					if (result) {
						// $location.path('/register');
						callback(result);
					}
				}, fallback);
		}

		function mute_all_participants(param, callback, fallback) {
			RequestService.CallAPI3(param, 'events/' + param.event_id + '/setUserAudioMute',
				function (result) {
					if (result) {
						// $location.path('/register');
						callback(result);
					}
				}, fallback);
		}

		function send_chat_messages(param, callback, fallback) {
			RequestService.CallAPI3(param, 'events/' + param.event_id + '/messages', function (
				result) {
				if (result) {
					// $location.path('/register');
					callback(result);
				}
			}, fallback);
		}

		function get_chat_messages(param, callback, fallback) {
			RequestService.CallAPI3(param, 'events/' + param + '/messages', function (result) {
				if (result) {
					// $location.path('/register');
					callback(result);
				}
			}, fallback, 'GET');
		}

		function stop_broadcast(param, callback, fallback) {
			RequestService.CallAPI3(param, 'events/' + param + '/stopBroadcasting', function (
				result) {
				if (result) {
					// $location.path('/register');
					callback(result);
				}
			}, fallback);
		}

		function start_broadcast(param, callback, fallback) {
			RequestService.CallAPI3(param, 'events/' + param + '/startBroadcasting', function (
				result) {
				if (result) {
					// $location.path('/register');
					callback(result);
				}
			}, fallback);
		}

		function stop_stream(param, callback, fallback) {
			RequestService.CallAPI3(param, 'events/' + param + '/stopStream', function (
				result) {
				if (result) {
					// $location.path('/register');
					callback(result);
				}
			}, fallback);
		}

		function get_all_events(param, callback, fallback) {
			RequestService.CallAPI4(param, 'events', function (result) {
				if (result) {
					callback(result);
				}
			}, fallback, 'GET');
		}


		function start_stream(param, callback, fallback) {
			RequestService.CallAPI3(param, 'events/' + param + '/startStream', function (
				result) {
				if (result) {
					// $location.path('/register');
					callback(result);
				}
			}, fallback);
		}

		function create_event(param, callback, fallback) {
			RequestService.CallAPI3(param, 'events', function (result) {
				if (result) {
					// $location.path('/register');
					callback(result);
				}
			}, fallback);
		}


		//This is the register service
		function register(param, callback, fallback) {
			RequestService.CallAPI(param, 'users/signup', function (result) {
				if (result) {
					$location.path('/register');
					callback(result);
				}
			}, fallback);
		}
	}

})(window.angular);
