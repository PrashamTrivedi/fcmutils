var key;
var token;
var topics;
var platform;
var packageName;
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
        $("#txtTo").val(window.token)

        $("#notificationDiv").show();
    });

    $("#updateTopics").click(function() {
        var topics = $("#txtTopics").val()
        componentHandler.upgradeDom();
        updateTopics(topics);
    });
    $("#manageTopics").click(function() {

        $("#topics").show()
    });

    $("#addKeyValue").click(function() {
        addKeyValue()
    });


    $("#send").click(function() {
        sendNotification();
    });
})

function sendNotification() {
    var to = $("#txtTo").val()
    var registrationIds = $("#txtRegistrationIds").val()
    var timeToLive = parseInt($("#txtTimeToLive").val())
    var priority = parseInt($("#txtPriority").val())
    var collapseKey = $("#txtCollapseKey").val()
    var contentAvailable = $("#contentAvailable").prop('checked');
    var dryRun = $("#dryRun").prop('checked');

    var title = $("#txtTitle").val()
    var body = $("#txtBody").val()
    var sound = $("#txtSound").val()
    var badge = $("#txtBadge").val()
    var tag = $("#txtTag").val()
    var channel = $("#txtChannel").val()
    var color = $("#txtColor").val()
    var clickAction = $("#txtClickAction").val()
    var icon = $("#txtIcon").val()

    var notificationPayload = {
        'title': title,
        'body': body,
        'sound': sound,
        'badge': badge,
        'android_channel_id': channel,
        'icon': icon,
        'color': color,
        'tag': tag,
        'click_action': clickAction
    }


    var dataPayload = {};
    for (i = 0; i < currentId; i++) {
        var key = $("[id^=key" + i + "]").val()
        var value = $("[id^=val" + i + "]").val()
        dataPayload[key] = value;
    }

    var notificationData = {
        'to': to,
        'registration_ids': registrationIds,
        'collapse_key': collapseKey,
        'priority': priority,
        'content_available': contentAvailable,
        'time_to_live': timeToLive,
        'dry_run': dryRun,
        'notification': notificationPayload,
        'data': dataPayload,
        'restricted_package_name': window.packageName
    }
    console.log(notificationData)

    var settings = {
        method: "POST",
        url: "https://fcm.googleapis.com/fcm/send",
        contentType: "application/json; charset=utf-8",
        body: notificationData,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "key=" + key);
        },
        success: function(data) {
            $("#snackbarMessage").MaterialSnackbar.showSnackbar({ 'message': 'Notification Sent' });
        },
        error: function(xhr, status, error) {
            var err = xhr.responseText;

            console.log(err)
            $("#snackbarMessage").MaterialSnackbar.showSnackbar({ 'message': 'Notification Not Sent' });

        }
    }






}

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
            window.packageName = data.application
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