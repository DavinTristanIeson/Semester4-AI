import 'package:flutter/material.dart';
import 'package:sephiroth_mobile/components/function/fetch_wrapper.dart';
import 'package:sephiroth_mobile/requests/account.dart';
import 'package:sephiroth_mobile/requests/setup.dart';
import 'package:sephiroth_mobile/views/home/main.dart';
import 'package:sephiroth_mobile/views/login/main.dart';

import 'helpers/keys.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await setupDio();
  runApp(const SephirothApp());
}

class SephirothApp extends StatelessWidget {
  const SephirothApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
      ),
      home: FetchWrapper(
        key: loginKey,
        fetch: getMe,
        errorComponent: (context, _) => const LoginView(),
        builder: (context, data) => const HomeView(),
      )
    );
  }
}