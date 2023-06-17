import 'package:dio/dio.dart';
import 'package:sephiroth_mobile/requests/setup.dart';

import '../helpers/constants.dart';

const String ACCOUNT_ROUTE = "$API/accounts";

Future<int> getMe() async {
  const String route = "$ACCOUNT_ROUTE/me";
  final Response res = await dio.get(route);
  return res.data["id"];
}

Future<void> login(String email, String password) async {
  const String route = "$ACCOUNT_ROUTE/login";
  try {
    await dio.post(route, data: <String, String>{
      "email": email,
      "password": password,
    });
  } on DioException catch (e) {
    if (e.response?.statusCode == 401) {
      throw Exception("Email atau password salah!");
    } else {
      throw Exception("Gagal masuk ke akun. Mohon dicoba pada waktu lain.");
    }
  }
}
