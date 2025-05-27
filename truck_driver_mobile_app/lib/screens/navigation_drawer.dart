import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:truck_driver_mobile_app/providers/user_provider.dart';
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
    final String? username = Provider.of<UserProvider>(context).username;
    return Drawer(
      backgroundColor: const Color(0xFF1E1E1E),
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 20,
              bottom: 20,
            ),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.3),
            ),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(3),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.lightGreen.withOpacity(0.5),
                            width: 2,
                          ),
                        ),
                        child: CircleAvatar(
                          radius: 35,
                          backgroundColor: Colors.lightGreen.withOpacity(0.2),
                          child: Padding(
                            padding: const EdgeInsets.all(8),
                            child: Image.asset(
                              'android/assets/images/garbage-truck.png',
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              username!,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.lightGreen.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(
                                    Icons.local_shipping_outlined,
                                    size: 16,
                                    color: Colors.lightGreen,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    vehicleId,
                                    style: const TextStyle(
                                      color: Colors.lightGreen,
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 8),
              children: const [
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                  child: Text(
                    'MAIN MENU',
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                DrawerTiles(
                  title: "Home",
                  icon: Icons.home_rounded,
                  destinationPage: HomePage(),
                ),
                DrawerTiles(
                  title: "Bin Status",
                  icon: Icons.delete_rounded,
                  destinationPage: BinLevelPage(),
                ),
                DrawerTiles(
                  title: "Notifications",
                  icon: Icons.notifications_outlined,
                  destinationPage: NotificationPage(),
                ),
                DrawerTiles(
                  title: "Route List",
                  icon: Icons.route_rounded,
                  destinationPage: RouteListPage(),
                ),
                DrawerTiles(
                  title: "Collection Map",
                  icon: Icons.map_rounded,
                  destinationPage: HomePage(),
                ),
                Divider(
                  color: Colors.grey,
                  height: 40,
                  indent: 24,
                  endIndent: 24,
                ),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                  child: Text(
                    'SUPPORT',
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                DrawerTiles(
                  title: "Report a Problem",
                  icon: Icons.report_problem_outlined,
                  destinationPage: ReportPage(),
                  color: Colors.orange,
                ),
                SizedBox(height: 8),
                DrawerTiles(
                  title: "Log Out",
                  icon: Icons.logout_rounded,
                  destinationPage: LoginScreen(),
                  color: Colors.red,
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              'Version 1.0.0',
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
