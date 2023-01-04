app.controller('ReportsCtrl', ['$scope','ApService', function ($scope, ApService) {

    $scope.data = {};

    let searchTableHelper = null;
    buildfire.messaging.sendMessageToWidget({
        name: 'ASK_FOR_WALLID'
    });

    buildfire.messaging.onReceivedMessage = function (event) {
        if (event.name === "SEND_WALLID" || event.name === "POST_REPORTED") return loadTable(event);
    }
    loadTable({name: 'POST_REPORTED', wid: ''});
    function loadTable(event) {
        searchTableHelper = new SearchTableHelper("searchResults", 'reports_' + event.wid, searchTableConfig);
        searchTableHelper.search();
        searchTableHelper.onCommand('showText', (obj, tr) => {
            if (obj.data.text.length <= 16) return;
            buildfire.notifications.alert({
                title: "Text", message: obj.data.text,  okButton: { text: 'Ok' }
            }, function (e, data) {
                if (e) console.error(e);
                if (data) console.log(data);
            });
        });
        searchTableHelper.onRowDeleted = (obj, tr) => {
            console.log("Record Delete from reports", obj, tr);
            var eventToBeDeleted = {
                "id": obj.data.reported.id
            }

            ApService.delete_event(eventToBeDeleted, function (result) {
               console.log(result);
               buildfire.publicData.get("reports_", (err, result) => {
                if (err) return console.error("Error while retrieving your data", err);
                console.log("reports_", result.data);
                var report_index = result.data.findIndex(el => el.reported.id === obj.data.reported.id);
                result.data.splice(report_index, 1);
                console.log(result.data); 
                buildfire.publicData.save(result.data, "reports_", (err, result) => {
                    if (err) return console.error("Error while saving your data", err);
                    console.log("Data saved successfully", result);
                     $scope.$digest();
                  });
                });
            }, function (response) {
                console.log(response);
            });
        }
        searchTableHelper.onEditRow = (obj, tr) => {
            buildfire.dialog.confirm({
                message: "Are you sure you want to ban this user? This action will erase all posts and comments made by this user.",
                confirmButton: { text: "Ban", type: "danger" }
            }, (err, data) => {
                if (err) console.error(err);
                if (data)
                    banUser(obj.data);
            });
        }
    }

    function banUser(data) {
        buildfire.spinner.show();

        let searchOptions = {
            filter: { "_buildfire.index.string1": data.wid, $and: [{ "$json.userId": data.reportedUserID }] },
            pageSize: 50,
            page: 0,
            recordCount: true
        }

        let searchOptions2 = {
            filter: {
                "_buildfire.index.string1": data.wid,
                $and: [{ "$json.comments.userId": data.reportedUserID }]
            },
            pageSize: 50,
            page: 0,
            recordCount: true
        }

        buildfire.publicData.get('reports_' + data.wid, (error, result) => {
            if (error) return console.log(error);
            result.data = result.data.filter(el => el.reportedUserID !== data.reportedUserID);
            buildfire.publicData.update(result.id, result.data, 'reports_' + data.wid, () => {});
        });

        let allPosts = [], allComments = [];
        buildfire.spinner.show();
        let getComments = function () {
            function fetchComments() {
                buildfire.publicData.search(searchOptions2, 'posts', (error, postComments) => {
                    if (error) return console.log(error);
                    allComments = allComments.concat(postComments.result)
                    if (postComments.totalRecord > allComments.length) {
                        searchOptions2.page++;
                        fetchComments();
                    } else {
                        let count = 0;
                        allComments.map(comment => {
                            count++;
                            buildfire.publicData.delete(post.id, 'posts', function (error, status) {
                                if (error) return console.log(error);
                                if (count === allComments.length)
                                    buildfire.spinner.hide();
                            });
                        });
                    }
                });
            }
            fetchComments();
        }

        let getPosts = function () {
            function requestBan() {
                buildfire.messaging.sendMessageToWidget({
                    name: 'BAN_USER', reported: data.reportedUserID, wid: data.wid
                });
                loadTable({ wid: data.wid })
            }
            function fetchPosts() {
                buildfire.publicData.search(searchOptions, 'posts', (error, posts) => {
                    if (error) return console.log(error);
                    allPosts = allPosts.concat(posts.result)
                    if (posts.totalRecord > allPosts.length) {
                        searchOptions.page++;
                        fetchPosts();
                    } else {
                        let count = 0;
                        allPosts.map(post => {
                            buildfire.publicData.delete(post.id, 'posts', function (error, status) {
                                if (error) return console.log(error);
                                count++;
                                if (count === allPosts.length) {
                                    requestBan();
                                    getComments();
                                }
                            });
                        });
                    }
                });
            }
            fetchPosts();
        }
        getPosts();
    }
}]);