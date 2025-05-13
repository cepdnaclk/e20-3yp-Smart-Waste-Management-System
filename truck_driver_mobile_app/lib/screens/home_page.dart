import 'package:flutter/material.dart';
import 'package:truck_driver_mobile_app/screens/bin_level_page.dart';
import 'package:truck_driver_mobile_app/screens/navigation_drawer.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    // var loc = [];
    return Scaffold(
      appBar: AppBar(
        title: const Text("Home page"),
      ),
      drawer: const MyNavigationDrawer(),
      body: Container(
        padding: const EdgeInsets.all(20),
        color: Colors.black26,
        height: double.infinity,
        width: double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            const Text(
              "Welcome user!",
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            ),
            const SizedBox(
              height: 35,
            ),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.grey.shade700, Colors.grey.shade800],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(15)),
              child: const Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Assigned Route",
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Center(
                    child: Text(
                      "Route",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        fontSize: 24,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(
              height: 50,
            ),
            Container(
              height: 300,
              width: double.infinity,
              color: Colors.green,
            ),
            ElevatedButton(
                onPressed: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const BinLevelPage(),
                      ));
                },
                child: const Text("Next location"))
          ],
        ),
      ),
    );
  }
}
