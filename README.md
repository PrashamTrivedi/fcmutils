# fcmutils
Repository of FCM Utils

This repository is designed as a tool to work with FCM.

Currently it checks validity of existing token and prints the output.

In near future will serve as a console to send notification if existing token is valid or not.

# [ChangeLog](changelog.md)

Functionality

## Identifying the device

Using instance id api, it identifies device frrom given token. It will also give you details about the device.

Reference : [InstanceId Server reference-Device Info](https://developers.google.com/instance-id/reference/server#get_information_about_app_instances)
*More Details coming soon*

## Managing topics

Using above apis soon, it will know topics subscribed to given device and will let you manage topics subscription and removal.



Reference : [InstanceId Server reference-Managing Topics](https://developers.google.com/instance-id/reference/server#create_relationship_maps_for_app_instances)
*This api currently supports adding topics, removing topics is not supported as of now*

## Construct and send notification

Soon, you can construct notifications using `notification` and `data` payloads and will send it to devices or topic. 


More documentations coming soon

Test it at https://www.prashamhtrivedi.in/fcmutils/