import 'package:flutter/material.dart';
import 'package:truck_driver_mobile_app/screens/navigation_drawer.dart';

class NotificationPage extends StatefulWidget {
  const NotificationPage({super.key});

  @override
  State<NotificationPage> createState() => _NotificationPageState();
}

class _NotificationPageState extends State<NotificationPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Notifications"),
      ),
      drawer: const MyNavigationDrawer(),
      body: ListView.builder(
        itemCount: 5,
        itemBuilder: (BuildContext context, int index) {
          return Card(
            elevation: 3,
            color: Colors.grey[800],
            child: const ListTile(
              title: Text("First notification"),
              subtitle: Text("Very urgent"),
            ),
          );
        },
      ),
    );
  }
}
