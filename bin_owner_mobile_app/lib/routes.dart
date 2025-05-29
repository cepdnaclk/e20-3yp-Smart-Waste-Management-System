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
import 'package:bin_owner_mobile_app/screens/home_screen.dart';
import 'package:bin_owner_mobile_app/screens/login_screen.dart';
import 'package:bin_owner_mobile_app/screens/register_screen.dart';
import 'package:bin_owner_mobile_app/screens/problem_report_screen.dart';

class AppRoutes {
  static const String home = '/';
  static const String layout = '/layout';
  static const String binLevel = '/bin-level';

  static const String notifications = '/notifications';
  static const String calendar = '/calendar';
  static const String settings = '/settings';
  static const String login = '/login';
  static const String register = '/register';
  static const String report = '/report';

  static Map<String, WidgetBuilder> routes = {
    // home: (context) => const MainLayout(),
    home: (context) => const HomePage(),
    layout: (context) => const MainLayout(),
    binLevel: (context) => const BinLevelScreen(),

    notifications: (context) => const NotificationScreen(),
    calendar: (context) => const CollectionCalendarScreen(),
    settings: (context) => const SettingsScreen(),
    login: (context) => const LoginScreen(),
    register: (context) => const RegisterScreen(),
    report: (context) => const ProblemReportScreen(),
  };
}
