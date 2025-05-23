import 'package:flutter/material.dart';
import 'package:truck_driver_mobile_app/screens/navigation_drawer.dart';

class NotificationPage extends StatelessWidget {
  const NotificationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Notifications"),
      ),
      drawer: const MyNavigationDrawer(),
    );
  }
}
