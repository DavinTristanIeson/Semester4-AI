
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:path_provider/path_provider.dart';
import 'package:socket_io_client/socket_io_client.dart';

import '../helpers/constants.dart';

final dio = Dio();
Socket? socket;

Future<void> setupDio() async {
  dio.options.baseUrl = API;
  final directory = await getApplicationDocumentsDirectory();
  final jar =
      PersistCookieJar(storage: FileStorage("${directory.path}/.cookies/"));
  dio.interceptors.add(CookieManager(jar));

  OptionBuilder options = OptionBuilder().setTransports(['websocket']).enableForceNew().enableReconnection();
  List<Cookie> cookies = await jar.loadForRequest(Uri.http(BACKEND_HOST));
  if (cookies.isNotEmpty){
    options.setExtraHeaders({
      "Cookie": cookies[0].toString(),
    });
  }
  socket = io(BACKEND, options.build());
}
