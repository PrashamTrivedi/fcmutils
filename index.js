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

var notificationPayload = {
    title: '',
    body: '',
    sound: '',
    badge: '',
    android_channel_id: '',
    tag: '',
    color: '',
    icon: '',
    click_action: ''
};

var dataPayload = {};

var notification = {
    to: '',
    collapse_key: '',
    priority: '',
    content_available: '',
    time_to_live: '',
    dry_run: false,
    notification: notificationPayload,
    data: dataPayload,
    restricted_package_name: ''

};

const dataOptions = {
    props: ['currentid'],
    name: 'dataOption',
    template: `<li class="mdl-list__item">
    <div class="mdl-list__item-primary-content">
        <div class="leftInverse mdl-textfield mdl-js-textfield mdl-textfield--floating-label" :class="keyObject"  >
            <input class="mdl-textfield__input" type="text" v-model="key" :id="'data'+currentid" autocomplete="on" @focus="changeFocus('key')" @change="addKey" >
            <label class="mdl-textfield__label" :for="'data'+currentid">Key</label>
        </div>
        <div class="rightInverse mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="margin: 0px 10px;" :class="valueObject" >
            <input class="mdl-textfield__input" type="text" v-model="value" :id="'value'+currentid" autocomplete="on" @change="addKey" @focus="changeFocus('value')">
            <label class="mdl-textfield__label" :for="'value'+currentid">Value</label>
        </div>
    </div>
</li>`,
    data: function () {
        return {
            key: '',
            value: '',
            hasKeyFocus: false,
            hasValueFocus: false
        };
    },
    methods: {
        addKey: function () {
            dataPayload[this.key] = this.value
        },
        changeFocus: function (params) {
            if (params == 'key') {
                this.hasKeyFocus = true;
            } else {
                this.hasValueFocus = true;
            }
        }
    },
    computed: {
        keyObject: function () {
            return changeClass(this.key, false, this.hasKeyFocus)
        },

        valueObject: function () {
            return changeClass(this.value, false, this.hasValueFocus)
        }
    }

};

Vue.component('data-object', dataOptions);

const topicOptions = {
    props: ['topic'],
    name: 'topic',
    template: `<li  class="mdl-list__item mdl-list__item--two-line">
            <span class="mdl-list__item-primary-content">Name: {{topic.name}}
            <span class="mdl-list__item-sub-title">Subscribed On: {{topic.addDate}}</span></span>
            <span class="mdl-list__item-secondary-action">
            <button id="sendNotification"  @click="sendNotifications(topic.name)" class="mdl-button mdl-js-button mdl-button--colored mdl-js-ripple-effect">
            Send Notification
        </button>
</span></span>
        
            </li>`,
    methods: {
        sendNotifications: function (name) {
            visibility.sendNotifications(`/to/${name}`);
        }
    }
};
Vue.component('topic-item', topicOptions);



var app = new Vue({
    el: '#version',

    data: {
        version: '3.1'
    },


});

var instanceIdThing = new Vue({
    el: "#instanceIdFields",
    data: instanceIdObject,
    computed: {
        appKeyObject: function () {
            return changeClass(this.appKey, this.toValidate, this.isFocused)
        },

        deviceTokenObject: function () {
            return changeClass(this.deviceToken, this.toValidate, this.isFocused)
        }
    }
});

function changeClass(keyToCheck, toValidate, isFocused) {
    if (isFocused == undefined) {
        isFocused = !ifStringEmpty(keyToCheck);
    }
    if (isFocused) {
        return 'is-focused';
    } else {
        if (toValidate) {
            if (ifStringEmpty(keyToCheck)) {
                return 'is-invalid'
            }
        } else {
            return ''
        }
    }
}

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

function getToNames() {
    var namesArray = []
    if (!ifStringEmpty(instanceIdObject.deviceToken)) {
        namesArray.push(instanceIdObject.deviceToken);
    }
    if (iidResponse != undefined && !isListEmpty(iidResponse.rel))
        namesArray = namesArray.concat(iidResponse.rel.filter(function (topic) {
            return topic != undefined
        }).map(function (topic) {
            return `/to/${topic.name}`
        }));
    return namesArray;
}

function isListEmpty(list) {
    return (list == undefined && list.length == 0);
}

var notifications = new Vue({
    el: "#notificationDiv",
    data: {
        sendNotification: false,
        notificationTo: "",
        timeToLive: 2419200,
        priority: 5,
        collapseKey: "",
        contentAvailable: false,
        dryRun: false,
        sendNotificationPayload: false,
        title: '',
        body: '',
        sound: '',
        badge: '',
        channelId: '',
        tag: '',
        color: '',
        androidIcon: '',
        clickAction: '',
        currentItems: 1,
        dataKey: [],
        dataValues: [],
        validateTitle: false

    },
    methods: {
        prepareAndSendNotification: function () {
            notification.to = this.notificationTo;
            notification.collapse_key = this.collapseKey;
            notification.priority = this.priority;
            notification.time_to_live = this.timeToLive;
            notification.dry_run = this.dryRun;

            this.validateTitle = this.sendNotificationPayload
            if (this.sendNotificationPayload && !ifStringEmpty(this.title)) {

                notificationPayload.title = this.title;
                notificationPayload.body = this.body;
                notificationPayload.sound = this.sound;
                notificationPayload.badge = this.badge;
                notificationPayload.icon = this.androidIcon;
                notificationPayload.color = this.color;
                notificationPayload.android_channel_id = this.channelId;
                notificationPayload.click_action = this.clickAction;

                notification.notification = clean(notificationPayload);
                notification.data = dataPayload;

                sendNotificationObject(clean(notification))
            } else if (!this.sendNotificationPayload) {

                notification.data = dataPayload;

                sendNotificationObject(clean(notification))
            }
        },
        addDataObject: function () {
            this.currentItems += 1;
        }
    },
    computed: {
        toObject: function () {
            return changeClass(this.notificationTo, this.sendNotification, undefined)
        },
        titleObject: function () {
            return changeClass(this.title, this.validateTitle, undefined)
        }
    }
});

function ifStringEmpty(string) {
    return string == '' || string == undefined || string == null || string == 'null'
}


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

            instanceIdThing.toValidate = true
            if (ifStringEmpty(instanceIdObject.deviceToken) || ifStringEmpty(instanceIdObject.appKey)) {

            } else {
                this.isLoading = true;

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
            }
        },
        useTestValues: function () {
            instanceIdThing.appKey = testInstanceIdObject.appKey
            instanceIdThing.deviceToken = testInstanceIdObject.deviceToken
            instanceIdThing.isFocused = true
        },
        sendNotifications: function (name) {
            if (ifStringEmpty(name)) {
                name = instanceIdObject.deviceToken;
            }
            notifications.notificationTo = name;
            console.log(notifications.notificationTo);
            notifications.sendNotification = !notifications.sendNotification;
        },
        manageTopics: function () {
            topics.showTopics = !topics.showTopics;
        }

    }
});



function sendNotificationObject(cleanedData, key) {
    const settings = {
        method: "POST",
        url: "https://fcm.googleapis.com/fcm/send",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(cleanedData),
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "key=" + instanceIdObject.appKey);
        },
        success: function (data) {
            console.log(this.url);
            console.log(this.data);
            console.log("Sent");
            if (data.failure >= 0) {
                console.log(data);
                document.querySelector("#snackBar").MaterialSnackbar.showSnackbar({
                    'message': 'Notification Not Sent,Reason '+data.results[0]["error"]
                });
            } else {

                document.querySelector("#snackBar").MaterialSnackbar.showSnackbar({
                    'message': 'Notification Sent'
                });
            }
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
        // if (typeof obj[propName] == "object") {
        //     clean(obj[propName]);
        // }
        if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "") {
            delete obj[propName];
        }
    }
    return obj;
}

function getInstanceIdInfo(instanceId, key, successCallback, failureCallback) {
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

    const topicArray = topics.split(",").map(function (topic) {
        return topic.trim()
    });

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