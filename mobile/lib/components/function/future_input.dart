import 'package:flutter/material.dart';
import 'package:sephiroth_mobile/components/function/snackbar.dart';

import '../../helpers/styles.dart';

class FutureButton extends StatefulWidget {
  final Widget child;
  final Future<void> Function()? onPressed;
  final ButtonStyle? style;
  const FutureButton({super.key, required this.child, this.onPressed, this.style});

  @override
  State<FutureButton> createState() => _FutureButtonState();
}

class _FutureButtonState extends State<FutureButton> with SnackbarMessenger {
  bool _isLoading = false;
  @override
  Widget build(BuildContext context) {
    return _isLoading
        ? ElevatedButton.icon(
            onPressed: null,
            icon: Transform.scale(
                scale: 0.5, child: const CircularProgressIndicator()),
            label: widget.child,
            style: widget.style ?? BUTTON_PRIMARY,
          )
        : ElevatedButton(
            onPressed: widget.onPressed != null ?
            () {
              setState(() => _isLoading = true);
              widget.onPressed!().onError((err, stackTrace) {
                sendError(context, err.toString());
              }).whenComplete(() => setState(() => _isLoading = false));
            } : null,
            style: widget.style ?? BUTTON_PRIMARY,
            child: Padding(
              padding: const EdgeInsets.symmetric(
                vertical: 8.0, horizontal: 16.0
                ),
              child: widget.child
            ),
          );
  }
}
