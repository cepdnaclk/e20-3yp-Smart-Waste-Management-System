import 'package:flutter/material.dart';
import 'package:truck_driver_mobile_app/screens/navigation_drawer.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Home page"),
      ),
      drawer: const MyNavigationDrawer(),
      body: Container(
        padding: const EdgeInsets.all(20),
        color: Colors.blueGrey,
        height: double.infinity,
        width: double.infinity,
        child: const Column(
          children: [
            Text(
              "Welcome user!",
              style: TextStyle(),
            )
          ],
        ),
      ),
    );
  }
}
