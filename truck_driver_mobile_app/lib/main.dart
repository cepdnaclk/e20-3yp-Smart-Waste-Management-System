import 'package:flutter/material.dart';
import 'package:truck_driver_mobile_app/screens/login_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
          colorSchemeSeed: Colors.greenAccent, brightness: Brightness.dark),
      home: const LoginScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
