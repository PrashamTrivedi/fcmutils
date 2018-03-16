var key;
var token;
var topics;
var platform;
var packageName;
var currentId;

var instanceIdObject = {
    appKey: '',
    deviceToken: '',
    isFocused: false,
    toValidate: false
};


var iidResponse = {
    applicationVersion: '',
    application: '',
    platform: '',
    platformIcon: '',
    errorMessage: '',
    rel: [topicResponse]
};

var topicResponse = {
    name: '',
    addDate: ''
}
var isResponseAvailable = false;
var isDataLoading = false;
var app = new Vue({
    el: '#version',

    data: {
        version: '3'
    },


});

var instanceIdThing = new Vue({
    el: "#instanceIdFields",
    data: instanceIdObject,
    computed: {
        classObject: function () {
            console.log(this.appKey)
            console.log(this.appKey != '' || this.appKey != undefined)
            if (this.isFocused) {
                return 'is-focused'
            } else {
                if (this.toValidate) {
                    if (this.appKey == '' || this.appKey == undefined) {
                        return 'is-invalid'
                    } else if (this.deviceToken == '' || this.deviceToken == undefined) {
                        return 'is-invalid'
                    }
                } else {
                    return ''
                }
            }
        }
    }
});

var topics = new Vue({
    el: "#topics",
    data: {
        showTopics: false,
        topicNames: '',
        toVerify: false
    },
    methods: {
        subscribeTopics: function () {
            this.toVerify = true;

            console.log(instanceIdObject.appKey)
            console.log(instanceIdObject.deviceToken)
            updateTopics(this.topicNames, data => {

            }, error => {

            })
        }
    },
    computed: {
        topicsObject: function () {
            if (this.toVerify && (this.topicNames == '' || this.topicNames == undefined)) {
                return 'is-invalid'
            } else {
                return ''
            }
        }
    }
})


var notifications = new Vue({
    el: "#notificationDiv",
    data:{
        sendNotifications: false
    }
})


var visibility = new Vue({
    el: "#responseVisibility",
    data: {
        hasResponse: isResponseAvailable,
        isLoading: isDataLoading,
        application: iidResponse.application,
        platformIcon: iidResponse.platformIcon,
        applicationVersion: iidResponse.applicationVersion,
        errorMessage: '',
        topics: []
    },
    methods: {
        verifyToken: function () {
            this.isLoading = true;

            instanceIdThing.toValidate = true
            getInstanceIdInfo(instanceIdObject.deviceToken, instanceIdObject.appKey, test => {
                visibility.isLoading = false;
                if (test != undefined) {
                    console.log(test);
                    console.log(test.rel.application);
                    console.log(test.application);
                    console.log(test.applicationVersion);
                    this.hasResponse = true;
                    this.application = test.application;
                    this.platformIcon = test.platformIcon;
                    this.applicationVersion = test.applicationVersion;
                    this.topics = iidResponse.rel;
                }
                console.log(test);

            }, errorMessage => {
                this.hasResponse = false;
                console.log(errorMessage);
                visibility.isLoading = false;
                this.errorMessage = errorMessage;
            })
        },
        useTestValues: function () {
            instanceIdThing.appKey = testInstanceIdObject.appKey
            instanceIdThing.deviceToken = testInstanceIdObject.deviceToken
            instanceIdThing.isFocused = true
        },
        sendNotifications: function () {
            notifications.sendNotifications = !notifications.sendNotifications;
        },
        manageTopics: function () {
            topics.showTopics = !topics.showTopics;
        }

    }
});



Vue.component('topic-item', {
    props: ['topic'],
    template: `<li  class="mdl-list__item mdl-list__item--two-line">
            <span class="mdl-list__item-primary-content">Name: {{topic.name}}
            <span class="mdl-list__item-sub-title">Subscribed On: {{topic.addDate}}</span></span></li>`
});

//     $sendNotification.click(function () {
//         $("#txtTo").val(window.token);

//         $("#notificationDiv").show();
//     });

//     $("#updateTopics").click(function () {
//         const $txtTopics = $("#txtTopics");
//         const topics = $txtTopics.val();
//         if (topics === "") {
//             $txtTopics.prop('required', true);
//             $txtTopics.parent().addClass('is-invalid');
//         } else {
//             $txtTopics.prop('required', false);
//             $txtTopics.parent().removeClass('is-invalid');
//         }
//         componentHandler.upgradeDom();
//         if (topics !== "") {
//             updateTopics(topics);
//         }
//     });
//     $manageTopics.click(function () {

//         $("#topics").show()
//     });

//     $("#addKeyValue").click(function () {
//         addKeyValue()
//     });


//     $("#send").click(function () {
//         sendNotification();
//     });
// });


function sendNotification() {
    const to = $("#txtTo").val();
    let timeToLive = parseInt($("#txtTimeToLive").val());
    if (timeToLive === "" || isNaN(timeToLive)) {
        timeToLive = 2419200
    }
    let priority = parseInt($("#txtPriority").val());
    if (priority === "" || isNaN(priority)) {
        priority = 5
    }
    const collapseKey = $("#txtCollapseKey").val();
    const contentAvailable = $("#contentAvailable").prop('checked');
    const dryRun = $("#dryRun").prop('checked');

    const $txtTitle = $("#txtTitle");
    const title = $txtTitle.val();
    let notification = null;
    if (title === "") {
        $txtTitle.prop('required', true);
        $txtTitle.parent().addClass('is-invalid');
    } else {
        $txtTitle.prop('required', false);
        $txtTitle.parent().removeClass('is-invalid');
    }
    if (title !== "") {
        const body = $("#txtBody").val();
        const sound = $("#txtSound").val();
        const badge = $("#txtBadge").val();
        const tag = $("#txtTag").val();
        const channel = $("#txtChannel").val();
        const color = $("#txtColor").val();
        const clickAction = $("#txtClickAction").val();
        const icon = $("#txtIcon").val();

        const notificationPayload = {
            'title': title,
            'body': body,
            'sound': sound,
            'badge': badge,
            'android_channel_id': channel,
            'icon': icon,
            'color': color,
            'tag': tag,
            'click_action': clickAction
        };


        notification = clean(notificationPayload);

    }
    const dataPayload = {};
    for (i = 0; i <= window.currentId; i++) {
        const dataKey = $("[id^=key" + i + "]").val();
        const dataValue = $("[id^=val" + i + "]").val();
        dataPayload[dataKey] = dataValue;
    }

    const notificationData = {
        'to': to,
        'collapse_key': collapseKey,
        'priority': priority,
        'content_available': contentAvailable,
        'time_to_live': timeToLive,
        'dry_run': dryRun,
        'notification': notification,
        'data': dataPayload,
        'restricted_package_name': window.packageName
    };
    const cleanedData = clean(notificationData);
    console.log(cleanedData);
    console.log(JSON.stringify(cleanedData));
    const settings = {
        method: "POST",
        url: "https://fcm.googleapis.com/fcm/send",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(cleanedData),
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "key=" + key);
        },
        success: function (data) {
            console.log(this.url);
            console.log(this.data);
            console.log("Sent");
            document.querySelector("#snackBar").MaterialSnackbar.showSnackbar({
                'message': 'Notification Sent'
            });
        },
        error: function (xhr, status, error) {
            const err = xhr.responseText;

            console.log(err);
            document.querySelector("#snackBar").MaterialSnackbar.showSnackbar({
                'message': 'Notification Not Sent'
            });

        }
    };
    $.ajax(settings)





}

function clean(obj) {
    const propNames = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < propNames.length; i++) {
        const propName = propNames[i];
        if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "") {
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

function getInstanceIdInfo(instanceId, key, successCallback, failureCallback) {
    // window.key = key;
    // window.token = instanceId;
    iidResponse = new Object();
    iidResponse.rel = [];
    const settings = {
        method: "GET",
        url: "https://iid.googleapis.com/iid/info/" + instanceId + "?details=true",
        contentType: "application/json; charset=utf-8",
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "key=" + key);
        },
        success: function (data) {
            console.log(data);
            iidResponse.applicationVersion = data.applicationVersion;
            iidResponse.application = data.application;
            if (data.platform === "ANDROID") {
                iidResponse.platformIcon = "phone_android"
            } else if (data.platform === "IOS") {
                iidResponse.platformIcon = "phone_iphone"
            } else if (data.platform === "CHROME") {
                iidResponse.platformIcon = "laptop_chromebook"
            }
            iidResponse.platform = data.platform;
            if (data.rel !== undefined && data.rel.topics !== undefined) {
                for (const topic in data.rel.topics) {
                    topicResponse = {};
                    topicResponse.name = topic;
                    var topicDate = data.rel.topics[topic].addDate;
                    topicResponse.addDate = topicDate;
                    if (topicResponse != undefined)
                        iidResponse.rel.push(topicResponse)
                }
            }

            successCallback(iidResponse);

        },
        error: (xhr, status, error) => {
            console.log(error);
            console.log(xhr.responseText);
            const err = xhr.responseText;
            iidResponse.errorMessage = err;
            failureCallback(err)
        }
    };
    $.ajax(settings)

}

function updateTopics(topics, successFun, errorFun) {
    console.log(iidResponse);
    console.log(window.token);
    console.log(topics);

    const topicArray = topics.split(",");

    topicArray.forEach(function (topic) {
        const settings = {
            method: "POST",
            url: "https://iid.googleapis.com/iid/v1/" + instanceIdObject.deviceToken + "/rel/topics/" + topic,
            contentType: "application/json; charset=utf-8",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "key=" + instanceIdObject.appKey);
            },
            success: function (data) {
                console.log('subscribed');
                console.log(this.url);
                console.log(this.data);
                successFun(this.data)
            },
            error: function (xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                errorFun(err.error);
            }
        };
        $.ajax(settings)
    });



}