var key;
var token;
var topics;
var platform;
var packageName;
var currentId;

$(document).ready(function() {
    window.currentId = 1;
    var $spinner = $("#spinner");
    var $sendNotification = $("#sendNotification");
    var $manageTopics = $("#manageTopics");

    $spinner.hide();
    $("#response").hide();
    $sendNotification.hide();
    $manageTopics.hide();
    $("#topics").hide();
    $("#topicDiv").hide();
    $("#notificationDiv").hide();

    $('#verifyTokens').click(function() {
        // Refresh all of the forecasts
        const $txtApplicationKey = $("#txtApplicationKey");
        const $txtToken = $("#txtToken");

        const key = $txtApplicationKey.val();
        const token = $txtToken.val();
        if (key == "") {
            $txtApplicationKey.prop('required', true);
            $txtApplicationKey.parent().addClass('is-invalid');
        } else {
            $txtApplicationKey.prop('required', false);
            $txtApplicationKey.parent().removeClass('is-invalid');
        }
        if (token == "") {
            $txtToken.prop('required', true);
            $txtToken.parent().addClass('is-invalid');
        } else {
            $txtToken.prop('required', false);
            $txtToken.parent().removeClass('is-invalid');
        }

        if (token != "" && key != "") {
            getInstanceIdInfo(token, key);
        }
    });

    $sendNotification.click(function () {
        $("#txtTo").val(window.token)

        $("#notificationDiv").show();
    });

    $("#updateTopics").click(function() {
        const $txtTopics = $("#txtTopics");
        const topics = $txtTopics.val();
        if (topics == "") {
            $txtTopics.prop('required', true);
            $txtTopics.parent().addClass('is-invalid');
        } else {
            $txtTopics.prop('required', false);
            $txtTopics.parent().removeClass('is-invalid');
        }
        componentHandler.upgradeDom();
        if (topics != "") {
            updateTopics(topics);
        }
    });
    $manageTopics.click(function () {

        $("#topics").show()
    });

    $("#addKeyValue").click(function() {
        addKeyValue()
    });


    $("#send").click(function() {
        sendNotification();
    });
});

function sendNotification() {
    const to = $("#txtTo").val();
    let timeToLive = parseInt($("#txtTimeToLive").val());
    if (timeToLive == "" || isNaN(timeToLive)) {
        timeToLive = 2419200
    }
    let priority = parseInt($("#txtPriority").val());
    if (priority == "" || isNaN(priority)) {
        priority = 5
    }
    const collapseKey = $("#txtCollapseKey").val();
    const contentAvailable = $("#contentAvailable").prop('checked');
    const dryRun = $("#dryRun").prop('checked');

    const $txtTitle = $("#txtTitle");
    const title = $txtTitle.val();
    if (title == "") {
        $txtTitle.prop('required', true);
        $txtTitle.parent().addClass('is-invalid');
    } else {
        $txtTitle.prop('required', false);
        $txtTitle.parent().removeClass('is-invalid');
    }
    if (title != "") {
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
            var dataKey = $("[id^=key" + i + "]").val()
            var dataValue = $("[id^=val" + i + "]").val()
            dataPayload[dataKey] = dataValue;
        }

        var notificationData = {
            'to': to,
            'collapse_key': collapseKey,
            'priority': priority,
            'content_available': contentAvailable,
            'time_to_live': timeToLive,
            'dry_run': dryRun,
            'notification': clean(notificationPayload),
            'data': dataPayload,
            'restricted_package_name': window.packageName
        }
        var cleanedData = clean(notificationData)
        console.log(cleanedData)
        console.log(JSON.stringify(cleanedData))
        var settings = {
            method: "POST",
            url: "https://fcm.googleapis.com/fcm/send",
            data: JSON.stringify(cleanedData),
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "key=" + key);
            },
            success: function(data) {
                console.log(this.url);
                console.log(this.data);
                console.log("Sent");
                document.querySelector("#snackBar").MaterialSnackbar.showSnackbar({ 'message': 'Notification Sent' });
            },
            error: function(xhr, status, error) {
                var err = xhr.responseText;

                console.log(err)
                document.querySelector("#snackBar").MaterialSnackbar.showSnackbar({ 'message': 'Notification Not Sent' });

            }
        }
        $.ajax(settings)
    }





}

function clean(obj) {
    var propNames = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < propNames.length; i++) {
        var propName = propNames[i];
        if (obj[propName] === null || obj[propName] === undefined || obj[propName] == "") {
            delete obj[propName];
        }
    }
    return obj;
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
    const settings = {
        method: "GET",
        url: "https://iid.googleapis.com/iid/info/" + instanceId + "?details=true",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "key=" + key);
        },
        success: function (data) {
            console.log(data);
            console.log(this.url);
            console.log(this.data);
            $("#spinner").hide();

            if (data.platform == "ANDROID") {
                $("#platformIcon").text("phone_android")
            } else if (data.platform == "IOS") {
                $("#platformIcon").text("phone_iphone")
            } else if (data.platform == "CHROME") {
                $("#platformIcon").text("laptop_chromebook")
            }
            window.packageName = data.application
            var $response = $("#response");
            $response.show();

            $('#appName').text(data.application + " Version(" + data.applicationVersion + ")")
            $("#sendNotification").show();
            $("#manageTopics").show();
            if (data.rel != undefined && data.rel.topics != undefined) {
                $("#topicDiv").show();
                const $topicsList = $("#topicsList");
                $topicsList.empty();
                for (const topic in data.rel.topics) {
                    const topicName = topic;
                    var topicDate = data.rel.topics[topic].addDate
                    console.log(topicName);
                    console.log(topicDate);
                    $topicsList.append(`<li id=${topicName} class="mdl-list__item mdl-list__item--two-line">
                    <span class="mdl-list__item-primary-content">Name: ${topicName}
                    <span class="mdl-list__item-sub-title">Subscribed On: ${topicDate}</span></span></li>`);
                }

            }

        },
        error: (xhr, status, error) => {
            const err = xhr.responseText;
            $("#spinner").hide();
            console.log(err);
            const $response = $("#response");
            $('#appName').text("Error in checking data, Please check console for details");
            $response.show();

        }
    };
    $.ajax(settings)

}

function updateTopics(topics) {
    console.log(window.key);
    console.log(window.token);
    console.log(topics);

    const topicArray = topics.split(",");

    topicArray.forEach(function(topic) {
        const settings = {
            method: "POST",
            url: "https://iid.googleapis.com/iid/v1/" + window.token + "/rel/topics/" + topic,
            contentType: "application/json; charset=utf-8",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "key=" + key);
            },
            success: function (data) {
                console.log('subscribed');
                console.log(this.url);
                console.log(this.data);
            },
            error: function (xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                $("#spinner").hide();
                $("#response").text(err.error);
                console.log(err)
                $("#response").show();

            }
        };
        $.ajax(settings)
    });



}