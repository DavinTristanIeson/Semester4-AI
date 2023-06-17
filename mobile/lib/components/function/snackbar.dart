import 'package:sephiroth_mobile/helpers/constants.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

mixin SnackbarMessenger {
  void sendMessage(BuildContext context, String message){
    ScaffoldMessengerState messenger = ScaffoldMessenger.of(context);
    SchedulerBinding.instance.addPostFrameCallback((_) {
      messenger.showSnackBar(SnackBar(content: Text(message)));
    });
  }
  void sendError(BuildContext context, String message){
    ScaffoldMessengerState messenger = ScaffoldMessenger.of(context);
    SchedulerBinding.instance.addPostFrameCallback((_) {
      messenger.showSnackBar(SnackBar(
        content: Text(message,
          style: const TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          )
        ),
        backgroundColor: COLOR_ERROR_CONTAINER,
      ));
    });
  }
  void sendSuccess(BuildContext context, String message){
    ScaffoldMessengerState messenger = ScaffoldMessenger.of(context);
    SchedulerBinding.instance.addPostFrameCallback((_) {
      messenger.showSnackBar(SnackBar(
        content: Text(message,
          style: const TextStyle(
            color: COLOR_SUCCESS,
            fontWeight: FontWeight.bold,
          )
        ),
        backgroundColor: COLOR_SUCCESS_CONTAINER,
      ));
    });
  }
}