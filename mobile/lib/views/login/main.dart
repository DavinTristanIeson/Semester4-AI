import 'package:flutter/material.dart';
import 'package:sephiroth_mobile/components/function/future_input.dart';
import 'package:sephiroth_mobile/helpers/keys.dart';
import 'package:sephiroth_mobile/requests/account.dart';

class LoginView extends StatelessWidget {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: FutureButton(
        // Sebelum halaman login selesai, gunakan ini dulu
        // Ganti dengan email dan password kalian sendiri
        onPressed: () async {
          try {
            await login("davin.tristan@gmail.com", "davintristan");
            loginKey.currentState?.refetch();
          } catch (e){
            print(e);
          }
        },
        child: const Text("Login"),
      )
    );
  }
}