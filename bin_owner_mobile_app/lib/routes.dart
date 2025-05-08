import 'package:bin_owner_mobile_app/main.dart';
import 'package:flutter/material.dart';
import './screens/bin_level_screen.dart';
import './screens/login_screen.dart';

class AppRoutes {
  // Authentication
  static const String login = '/login';

  static const String home = '/home';
  static const String binLevel = '/bin-level-screen';

  static Map<String, WidgetBuilder> routes = {
    login: (context) => const LoginScreen(),

    home: (context) => MyHomePage(title: 'Home Page'),
    binLevel: (context) => BinLevelScreen(),
  };
}
