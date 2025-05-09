// import 'package:bin_owner_mobile_app/main.dart';
// import 'package:flutter/material.dart';
// import './screens/bin_level_screen.dart';
// import './screens/notification.dart';
// import './screens/calendar.dart';
// import './screens/settings.dart';

// class AppRoutes {
//   static const String home = '/home';
//   static const String binLevel = '/bin-level-screen';
//   static const String notifications = '/notifications';
//   static const String calendar = '/calendar';
//   static const String settings = '/settings';

//   static Map<String, WidgetBuilder> routes = {
//     home: (context) => MyHomePage(title: 'Home Page'),
//     binLevel: (context) => BinLevelScreen(),
//     notifications: (context) => const NotificationScreen(),
//     calendar: (context) => const CollectionCalendarScreen(),
//     settings: (context) => const SettingsScreen(),
//   };
// }

// lib/routes.dart
import 'package:flutter/material.dart';
import 'package:bin_owner_mobile_app/screens/bin_level_screen.dart';
import 'package:bin_owner_mobile_app/screens/notification.dart';
import 'package:bin_owner_mobile_app/screens/calendar.dart';
import 'package:bin_owner_mobile_app/screens/settings.dart';
import 'package:bin_owner_mobile_app/widgets/main_layout.dart';

class AppRoutes {
  static const String home = '/';
  static const String binLevel = '/bin-level';
  static const String notifications = '/notifications';
  static const String calendar = '/calendar';
  static const String settings = '/settings';

  static Map<String, WidgetBuilder> routes = {
    home: (context) => const MainLayout(),
    binLevel: (context) => const BinLevelScreen(),
    notifications: (context) => const NotificationScreen(),
    calendar: (context) => const CollectionCalendarScreen(),
    settings: (context) => const SettingsScreen(),
  };
}
