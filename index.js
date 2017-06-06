$(document).ready(function () {
    $("#spinner").hide();
    $("#response").hide();
    $('#verifyTokens').click(function () {
        // Refresh all of the forecasts
        var key = $("#txtApplicationKey").val()
        var token = $("#txtToken").val()
        getInstanceIdInfo(token, key)
    });


    function getInstanceIdInfo(instanceId, key) {
        $("#spinner").show();
        var settings = {
            method: "GET",
            url: "https://iid.googleapis.com/iid/info/" + instanceId + "?details=true",
            contentType: "application/json; charset=utf-8",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "key=" + key);
            },
            success: function (data) {
                console.log(data)
                $("#spinner").hide();

                if (data.platform == "ANDROID") {
                    $("#platformIcon").text("phone_android")
                } else if (data.platform == "IOS") {
                    $("#platformIcon").text("phone_iphone")
                } else if (data.platform == "CHROME") {
                    $("#platformIcon").text("laptop_chromebook")
                }
                $('#appName').val(data.application+" Version("+data.applicationVersion+")")
                // $('#appName').attr('disabled', 'disabled');
                $("#response").show();
                // $("#response").text(JSON.stringify(data));
            },
            error: function (xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                $("#spinner").hide();
                $("#response").text(err.error);
                console.log(err)
                $("#response").show();

            }
        }
        $.ajax(settings)

        // var request = https.request(options, function (response) {
        //     response.setEncoding('utf8');
        //     response.on('data', function (chunk) {
        //         // console.log('BODY: ' + chunk);
        //         var data = JSON.parse(chunk);
        //         console.log(data);
        //         var userProperties = database.ref('userProperties/' + key);
        //         if (!data.hasOwnProperty('error')) {
        //             generateShortLink(instanceId, key);
        //         } else {
        //             userProperties.child('toDelete').set(true);
        //         }
        //     });
        //     response.on('error', function (e) {
        //         console.error(e);
        //     });
        // });
        // request.end();

    }
})