


$(document).ready(function () {
    $('#verifyTokens').click(function () {
        // Refresh all of the forecasts
        var key = $("#txtApplicationKey").val()
        var token = $("#txtToken").val()
         getInstanceIdInfo(token, key)
    });


    function getInstanceIdInfo(instanceId, key) {

        var settings = {
            method: "GET",
            url: "https://iid.googleapis.com/iid/info/" + instanceId + "?details=true",
            contentType: "application/json; charset=utf-8",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Key=" + key);
            },
            success: function (data) {
                console.log(data)
                $("#response").text(data);
            },
            error: function (xhr, status, error) {
                var err = JSON.parse(xhr.responseText);
                $("#response").text(err.error);
                console.log(err)

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
