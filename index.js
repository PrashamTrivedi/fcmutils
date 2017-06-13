var key;
var token;
var topics;
var platform;
var currentId;

$(document).ready(function() {
    window.currentId = 1;
    $("#spinner").hide();
    $("#response").hide();
    $("#sendNotification").hide();
    $("#manageTopics").hide();
    $("#topics").hide();
    $("#topicDiv").hide();
    $("#notificationDiv").hide();

    $('#verifyTokens').click(function() {
        // Refresh all of the forecasts
        var key = $("#txtApplicationKey").val()
        var token = $("#txtToken").val()
        if (key == "") {
            key = testingApiKey
        }
        if (token == "") {
            token = testingToken
        }
        getInstanceIdInfo(token, key);
    });

    $("#sendNotification").click(function() {
        $("#notificationDiv").show();
    })

    $("#updateTopics").click(function() {
        var topics = $("#txtTopics").val()
        updateTopics(topics);
    })
    $("#manageTopics").click(function() {

        $("#topics").show()
    })

    $("#addKeyValue").click(function() {
        addKeyValue()
    })
})

function addKeyValue() {
    window.currentId += 1;
    console.log(window.currentId)
    $("#dataKeyVal").append(`<li class="mdl-list__item">
                        <div class="mdl-list__item-primary-content">
                            <div class="leftInverse mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <input class="mdl-textfield__input" type="text" id="key${window.currentId}" autocomplete="on">
                                <label class="mdl-textfield__label" for="key${window.currentId}">Key</label>
                            </div>
                            <div class="rightInverse mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="margin: 0px 10px;">
                                <input class="mdl-textfield__input" type="text" id="val${window.currentId}" autocomplete="on">
                                <label class="mdl-textfield__label" for="val${window.currentId}">Value</label>
                            </div>
                        </div>
                    </li>`);

    componentHandler.upgradeDom();
}

function getInstanceIdInfo(instanceId, key) {
    window.key = key;
    window.token = instanceId;
    $("#spinner").show();
    var settings = {
        method: "GET",
        url: "https://iid.googleapis.com/iid/info/" + instanceId + "?details=true",
        contentType: "application/json; charset=utf-8",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "key=" + key);
        },
        success: function(data) {
            console.log(data)
            $("#spinner").hide();

            if (data.platform == "ANDROID") {
                $("#platformIcon").text("phone_android")
            } else if (data.platform == "IOS") {
                $("#platformIcon").text("phone_iphone")
            } else if (data.platform == "CHROME") {
                $("#platformIcon").text("laptop_chromebook")
            }
            $('#appName').text(data.application + " Version(" + data.applicationVersion + ")")
            $("#response").show();
            $("#sendNotification").show();
            $("#manageTopics").show();
            if (data.rel != undefined && data.rel.topics != undefined) {
                $("#topicDiv").show();
                for (var topic in data.rel.topics) {
                    var topicName = topic;
                    var topicDate = data.rel.topics[topic].addDate
                    console.log(topicName)
                    console.log(topicDate)
                    $("#topicsList").append('<li id=' + topicName + ' class="mdl-list__item mdl-list__item--two-line"><span class="mdl-list__item-primary-content">Name: ' + topicName + '<span class="mdl-list__item-sub-title">' + topicDate + '</span></span></li>');
                }

            }

        },
        error: function(xhr, status, error) {
            var err = xhr.responseText;
            $("#spinner").hide();
            console.log(err)
            $("#response").text("Error in checking data, Please check console for details");
            $("#response").show();

        }
    }
    $.ajax(settings)
}

function updateTopics(topics) {
    console.log(window.key)
    console.log(window.token)
    console.log(topics)
    var settings = {
        method: "POST",
        url: "https://iid.googleapis.com/iid/v1/" + window.token + "/rel/topics/android",
        contentType: "application/json; charset=utf-8",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "key=" + key);
        },
        success: function(data) {
            getInstanceIdInfo(window.token, window.key)
        },
        error: function(xhr, status, error) {
            var err = JSON.parse(xhr.responseText);
            $("#spinner").hide();
            $("#response").text(err.error);
            console.log(err)
            $("#response").show();

        }
    }
    $.ajax(settings)
}