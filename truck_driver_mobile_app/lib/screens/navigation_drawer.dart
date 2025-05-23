import 'package:flutter/material.dart';
import 'package:truck_driver_mobile_app/screens/bin_level_page.dart';
import 'package:truck_driver_mobile_app/screens/home_page.dart';
import 'package:truck_driver_mobile_app/screens/login_screen.dart';
import 'package:truck_driver_mobile_app/screens/notification_page.dart';
import 'package:truck_driver_mobile_app/screens/report_page.dart';
import 'package:truck_driver_mobile_app/screens/route_list_page.dart';

class MyNavigationDrawer extends StatefulWidget {
  const MyNavigationDrawer({super.key});

  @override
  State<MyNavigationDrawer> createState() => _MyNavigationDrawerState();
}

class _MyNavigationDrawerState extends State<MyNavigationDrawer> {
  String vehicleId = "ABC-xxyy";

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Colors.grey[800],
      child: Container(
        padding: const EdgeInsets.only(left: 10, top: 10),
        child: Column(
          children: [
            DrawerHeader(
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: Colors.lightBlue,
                    child: Padding(
                      padding: const EdgeInsets.all(6),
                      child: ClipOval(
                        child: Image.asset(
                          'android/assets/images/garbage-truck.png',
                          color: Colors.white,
                          fit: BoxFit.cover,
                          width: 70,
                          height: 70,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 20),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        "Lorry Number",
                        style: TextStyle(color: Colors.white),
                      ),
                      Text(
                        vehicleId,
                        style: const TextStyle(color: Colors.white),
                      ),
                    ],
                  )
                ],
              ),
            ),

            // Home Page Navigation
            ListTile(
              leading: const Icon(Icons.home, color: Colors.lightGreen),
              title: const Text('Home', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const HomePage()),
                );
              },
            ),

            // Bin Status Navigation
            ListTile(
              leading: const Icon(Icons.delete, color: Colors.lightGreen),
              title: const Text('Bin Status',
                  style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const BinLevelPage()),
                );
              },
            ),

            // Notifications Navigation
            ListTile(
              leading: const Icon(Icons.mail_rounded, color: Colors.lightGreen),
              title: const Text('Notifications',
                  style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                      builder: (context) => const NotificationPage()),
                );
              },
            ),

            // Route List Navigation
            ListTile(
              leading:
                  const Icon(Icons.list_alt_rounded, color: Colors.lightGreen),
              title: const Text('Route List',
                  style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                      builder: (context) => const RouteListPage()),
                );
              },
            ),

            // Collection Map Navigation (Currently goes to HomePage, change if necessary)
            ListTile(
              leading: const Icon(Icons.map_rounded, color: Colors.lightGreen),
              title: const Text('Collection Map',
                  style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          const HomePage()), // <-- Replace with actual map page if different
                );
              },
            ),
            const SizedBox(
              height: 150,
            ),
            // Report a Problem
            ListTile(
              leading:
                  const Icon(Icons.report_problem_outlined, color: Colors.red),
              title: const Text('Report a Problem',
                  style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const ReportPage()),
                );
              },
            ),

            // Log Out
            ListTile(
              leading: const Icon(Icons.logout, color: Colors.red),
              title:
                  const Text('Log Out', style: TextStyle(color: Colors.white)),
              onTap: () {
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                  (route) => false, // Remove all previous routes
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
