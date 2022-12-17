describe('Unit : Controller - WidgetScannerCtrl', function () {

// load the controller's module
    var WidgetScannerCtrl, scope, Modals, SocialDataStore, $timeout,$q,Buildfire,rootScope;

    beforeEach(module('BingewaveAngularJs'));

    beforeEach(module('BingewaveAngularJs', function ($provide) {
        $provide.service('Buildfire', function () {
            this.datastore = jasmine.createSpyObj('datastore', ['get', 'onUpdate','onRefresh']);
            this.imageLib = jasmine.createSpyObj('imageLib', ['cropImage']);
            this.imageLib.cropImage.and.callFake(function (url,options) {
               return 'abc.png';
            });
            this.auth = jasmine.createSpyObj('auth', ['getCurrentUser', 'login','onLogin','onLogout']);
            this.navigation = jasmine.createSpyObj('navigation', ['get', 'onUpdate']);
            this.messaging = jasmine.createSpyObj('messaging', ['get', 'onUpdate','sendMessageToControl']);
            this.history =  jasmine.createSpyObj('history', ['pop', 'push', 'onPop']);
            this.getContext=function(){};

        });
    }));


   /* beforeEach(inject(function ($controller, _$rootScope_, _Modals_, _SocialDataStore_, _$timeout_,_$q_,Buildfire) {
            scope = _$rootScope_.$new();
            Modals = _Modals_;
            SocialDataStore = _SocialDataStore_;
            $timeout = _$timeout_;
            $q = _$q_;
            WidgetScannerCtrl = $controller('WidgetScannerCtrl', {
                $scope: scope,
                Modals: Modals,
                SocialDataStore: SocialDataStore,
                Buildfire :_Buildfire_
            });
        })
    );*/

    beforeEach(inject(function ($controller, _$rootScope_, Location,SocialItems,_Modals_, _SocialDataStore_, _$timeout_,_$q_,_Buildfire_) {
        Buildfire = _Buildfire_;
        SocialDataStore = jasmine.createSpyObj('SocialDataStore', ['deletePost', 'onUpdate','getUserSettings','saveUserSettings']);;
        Location1 = Location;
        SocialItem =SocialItems;
        scope = _$rootScope_.$new();
        rootScope= _$rootScope_;
        Modals = _Modals_;
        $timeout = _$timeout_;
        $q = _$q_;

        WidgetScannerCtrl = $controller('WidgetScannerCtrl', {
            $scope: scope,
            Modals: Modals,
            SocialDataStore: SocialDataStore,
            Buildfire :_Buildfire_
        });


    }));

    describe('Units: units should be Defined', function () {
        it('it should pass if WidgetScannerCtrl is defined', function () {
            expect(WidgetScannerCtrl).not.toBeUndefined();
        });
        it('it should pass if Modals is defined', function () {
            expect(Modals).not.toBeUndefined();
        });
    });


    describe('WidgetScanner.getFollowingStatus', function () {

        it('it should pass if getFollowingStatus is called', function () {

            WidgetScannerCtrl.getFollowingStatus();

        });
    });


    describe('WidgetScanner.createPost', function () {

        var spy1;
       beforeEach((function () {

           WidgetScannerCtrl.SocialItems.userDetails.userToken='';
           WidgetScannerCtrl.SocialItems.parentThreadId='sasas';
           WidgetScannerCtrl.SocialItems.userDetails.userId='sasas';
           WidgetScannerCtrl.SocialItems.socialAppId='sasas';
           WidgetScannerCtrl.waitAPICompletion = true;
           WidgetScannerCtrl.picFile={};

            Buildfire.auth.getCurrentUser.and.callFake(function (callback) {

             callback(null,null);
                Buildfire.auth.login.and.callFake(function (callback) {


                    callback(null, {});
                });

            });
        }));

        it('it should pass if it calls SocialDataStore.createPost if WidgetScanner.picFile is truthy', function () {
            WidgetScannerCtrl.SocialItems.userDetails.userToken='';
            WidgetScannerCtrl.SocialItems.parentThreadId='sasas';
            WidgetScannerCtrl.SocialItems.userDetails.userId='sasas';
            WidgetScannerCtrl.SocialItems.socialAppId='sasas';
            WidgetScannerCtrl.waitAPICompletion = true;
            WidgetScannerCtrl.picFile={};
            WidgetScannerCtrl.createPost();

        });

    });

    describe('WidgetScanner.likeThread', function () {

        var spy1;
        beforeEach(inject(function () {
            spy1 = spyOn(SocialDataStore,'addThreadLike').and.callFake(function () {

                var deferred = $q.defer();
                deferred.resolve({});
                console.log('abc');
                return deferred.promise;
            });

        }));

        xit('it should pass', function () {
            var a = {likesCount:9};
            WidgetScannerCtrl.likeThread(a,{});
            expect(a.likesCount).toEqual(10);
            //expect(spy1).not.toHaveBeenCalled();
        });
    });

    describe('WidgetScanner.seeMore', function () {

        it('it should pass if it sets seeMore to true for the post', function () {
            var a = {seeMore:false};
            WidgetScannerCtrl.seeMore(a,{});
            expect(a.seeMore).toBeTruthy();
        });
    });

    describe('WidgetScanner.getPosts', function () {

        it('it should pass if it sets seeMore to true for the post', function () {
            var a = {seeMore:false};
            WidgetScannerCtrl.seeMore(a,{});
            expect(a.seeMore).toBeTruthy();
        });
    });


    describe('WidgetScanner.getUserName', function () {


        it('it should pass if it calls SocialDataStore.getUserName is called', function () {
            WidgetScannerCtrl.picFile = 'a';
            WidgetScannerCtrl.getUserName();

        });


    });

    describe('WidgetScanner.getUserImage', function () {


        it('it should pass if it calls SocialDataStore.getUserImage is called', function () {
            WidgetScannerCtrl.picFile = 'a';
            WidgetScannerCtrl.getUserImage();

        });


    });

    describe('WidgetScanner.showMoreOptions', function () {


        it('it should pass if it calls SocialDataStore.showMoreOptions is called', function () {
            WidgetScannerCtrl.picFile = 'a';
            WidgetScannerCtrl.showMoreOptions('asasasa');

        });


    });

    describe('WidgetScanner.likeThread', function () {
        it('it should pass if it calls SocialDataStore.likeThread is called', function () {
            WidgetScannerCtrl.picFile = 'a';
            WidgetScannerCtrl.likeThread('asasasa','user');

        });
    });

    describe('WidgetScanner.goInToThread', function () {
        it('it should pass if it calls SocialDataStore.likeThread is called', function () {
            WidgetScannerCtrl.picFile = 'a';
            WidgetScannerCtrl.goInToThread('asasasa');

        });
    });

    describe('WidgetScanner.isLikedByLoggedInUser', function () {
        it('it should pass if it calls SocialDataStore.likeThread is called', function () {
            WidgetScannerCtrl.picFile = 'a';
            WidgetScannerCtrl.isUserLikeActive('asasasa');

        });
    });

    describe('WidgetScanner.uploadImage', function () {
        it('it should pass if it calls WidgetScanner.uploadImage is called', function () {
          //  WidgetScannerCtrl.picFile = 'a';
            WidgetScannerCtrl.uploadImage({});

        });
    });

    describe('WidgetScanner.cancelImageSelect ', function () {
        it('it should pass if it calls WidgetScanner.cancelImageSelect is called', function () {
            //  WidgetScannerCtrl.picFile = 'a';
            WidgetScannerCtrl.cancelImageSelect();
            $timeout.flush();
        });
    });

    describe('WidgetScanner.updateLikesData', function () {
        it('it should pass if it calls SocialDataStore.likeThread is called', function () {
            WidgetScannerCtrl.picFile = 'a';
            WidgetScannerCtrl.updateLikesData('asasasa','online');

        });
    });

    describe('WidgetScanner.getDuration', function () {
        it('it should pass if it calls WidgetScanner.getDuration is called', function () {
            WidgetScannerCtrl.picFile = 'a';
            WidgetScannerCtrl.getDuration('1212121212');

        });
    });


    describe('WidgetScanner.deletePost', function () {
        beforeEach(function(){

            var response={
                data:{
                    result:{

                    }
                }
            };

            SocialDataStore.deletePost.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(response);
                return deferred.promise;
            });

            Buildfire.messaging.sendMessageToControl.and.callFake(function () {

            });
        })
        it('it should pass if it calls SocialDataStore.deletePost is called', function () {
            WidgetScannerCtrl.picFile = 'a';
            WidgetScannerCtrl.deletePost('asasasa');
            scope.$digest();

        });
    });

    describe('scope.emit COMMENT_ADDED', function () {
        beforeEach(function(){


            SocialDataStore.saveUserSettings.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });

        })
        it('it should pass if it calls scope.emit is called', function () {
            rootScope.$emit('COMMENT_ADDED');

        });
    });

    describe('scope.emit COMMENT_LIKED', function () {
        beforeEach(function(){


            SocialDataStore.saveUserSettings.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });

        })
        it('it should pass if it calls scope.emit is called', function () {
            rootScope.$emit('COMMENT_LIKED');

        });
    });

    describe('scope.emit COMMENT_UNLIKED', function () {
        beforeEach(function(){


            SocialDataStore.saveUserSettings.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });

        })
        it('it should pass if it calls scope.emit is called', function () {
            rootScope.$emit('COMMENT_UNLIKED');

        });
    });

    describe('scope.emit POST_LIKED', function () {
        beforeEach(function(){


            SocialDataStore.saveUserSettings.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });

        })
        it('it should pass if it calls scope.emit is called', function () {
            rootScope.$emit('POST_LIKED',{_id:'12313'});

        });
    });

    describe('scope.emit POST_UNLIKED', function () {
        beforeEach(function(){


            SocialDataStore.saveUserSettings.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });

        })
        it('it should pass if it calls scope.emit is called', function () {
            rootScope.$emit('POST_UNLIKED',{_id:'12313'});

        });
    });



});