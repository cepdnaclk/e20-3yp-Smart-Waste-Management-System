import 'package:flutter/material.dart';
import 'package:truck_driver_mobile_app/widgets/drawer_tiles.dart';
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
            const DrawerTiles(
              title: "Home",
              icon: Icons.home,
              destinationPage: HomePage(),
            ),

            // Bin Status Navigation
            const DrawerTiles(
              title: "Bin Status",
              icon: Icons.delete_rounded,
              destinationPage: BinLevelPage(),
            ),

            // Notifications Navigation
            const DrawerTiles(
                title: "Notifications",
                icon: Icons.mail_outline,
                destinationPage: NotificationPage()),

            // Route List Navigation
            const DrawerTiles(
                title: "Route List",
                icon: Icons.list,
                destinationPage: RouteListPage()),

            // Collection Map Navigation
            const DrawerTiles(
                title: "Collection Map",
                icon: Icons.map_outlined,
                destinationPage: HomePage()),
            const SizedBox(
              height: 150,
            ),
            // Report a Problem
            const DrawerTiles(
              title: "Report a Problem",
              icon: Icons.report_gmailerrorred,
              destinationPage: ReportPage(),
              color: Colors.red,
            ),

            // Log Out
            const DrawerTiles(
              title: "Log Out",
              icon: Icons.logout_outlined,
              destinationPage: LoginScreen(),
              color: Colors.red,
            ),
          ],
        ),
      ),
    );
  }
}
