import 'package:flutter/material.dart';

class MyNavigationDrawer extends StatelessWidget {
  const MyNavigationDrawer({super.key});

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
                    backgroundColor: Colors.lightBlue, // outer circle color
                    child: Padding(
                      padding:
                          const EdgeInsets.all(6), // adjust padding as needed
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
                  const SizedBox(
                    width: 20,
                  ),
                  const Text(
                    "Lorry Number",
                    style: TextStyle(color: Colors.white),
                  )
                ],
              ),
            ),
            ListTile(
              leading: const Icon(
                Icons.delete,
                color: Colors.lightGreen,
              ),
              title: const Text(
                'Bin Status',
                style: TextStyle(color: Colors.white),
              ),
              onTap: () {
                Navigator.pushNamed(context, '/dashboard');
              },
            ),
            ListTile(
              leading: const Icon(
                Icons.mail_rounded,
                color: Colors.lightGreen,
              ),
              title: const Text(
                'Notifications',
                style: TextStyle(color: Colors.white),
              ),
              onTap: () {
                Navigator.pushNamed(context, '/dashboard');
              },
            ),
            ListTile(
              leading: const Icon(
                Icons.list_alt_rounded,
                color: Colors.lightGreen,
              ),
              title: const Text(
                'Route List',
                style: TextStyle(color: Colors.white),
              ),
              onTap: () {
                Navigator.pushNamed(context, '/dashboard');
              },
            ),
            ListTile(
              leading: const Icon(
                Icons.map_rounded,
                color: Colors.lightGreen,
              ),
              title: const Text(
                'Collection Map',
                style: TextStyle(color: Colors.white),
              ),
              onTap: () {
                Navigator.pushNamed(context, '/home_page');
              },
            ),
            const SizedBox(
              height: 150,
            ),
            ListTile(
              leading: const Icon(
                Icons.logout,
                color: Colors.red,
              ),
              title: const Text(
                'Log Out',
                style: TextStyle(color: Colors.white),
              ),
              onTap: () {
                Navigator.pushNamed(context, '/login_screen');
              },
            ),
          ],
        ),
      ),
    );
  }
}
