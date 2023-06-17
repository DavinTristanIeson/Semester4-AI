import 'package:flutter/material.dart';

import 'constants.dart';

final BUTTON_PRIMARY = ElevatedButton.styleFrom(
  backgroundColor: COLOR_PRIMARY,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(15),
  ),
  textStyle: TEXT_IMPORTANT,
  disabledBackgroundColor: COLOR_PRIMARY_DARK,
  disabledForegroundColor: COLOR_PRIMARY_DARK,
);

final BUTTON_SECONDARY = ElevatedButton.styleFrom(
  backgroundColor: COLOR_SECONDARY,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(15),
  ),
  disabledBackgroundColor: COLOR_SECONDARY_DARK,
  disabledForegroundColor: COLOR_SECONDARY_DARK,
);

const TEXT_IMPORTANT = TextStyle(
  color: Colors.black,
  fontSize: FS_EMPHASIS,
  fontWeight: FontWeight.bold,
  fontFamily: 'Josefin Sans',
);
