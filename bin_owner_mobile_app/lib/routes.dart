import 'package:bin_owner_mobile_app/main.dart';
import 'package:flutter/material.dart';
import './screens/bin_level_screen.dart';
import './screens/notification.dart';

class AppRoutes {
  static const String home = '/home';
  static const String binLevel = '/bin-level-screen';
  static const String notifications = '/notifications';

  static Map<String, WidgetBuilder> routes = {
    home: (context) => MyHomePage(title: 'Home Page'),
    binLevel: (context) => BinLevelScreen(),
    notifications: (context) => const NotificationScreen(),
  };
}
