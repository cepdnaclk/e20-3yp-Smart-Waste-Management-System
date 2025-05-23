// // lib/widgets/main_layout.dart
// import 'package:flutter/material.dart';
// import 'package:bin_owner_mobile_app/screens/bin_level_screen.dart';
// import 'package:bin_owner_mobile_app/screens/notification.dart';
// import 'package:bin_owner_mobile_app/screens/calendar.dart';
// import 'package:bin_owner_mobile_app/screens/settings.dart';

// class MainLayout extends StatefulWidget {
//   const MainLayout({super.key});

//   @override
//   State<MainLayout> createState() => _MainLayoutState();
// }

// class _MainLayoutState extends State<MainLayout> {
//   int _currentIndex = 0;

//   final List<Widget> _screens = [
//     const BinLevelScreen(),
//     const NotificationScreen(),
//     const CollectionCalendarScreen(),
//     const SettingsScreen(),
//   ];

//   final List<String> _titles = ['Bin Status', 'Alerts', 'Calendar', 'Settings'];

//   void _navigateTo(int index) {
//     setState(() => _currentIndex = index);
//     Navigator.pop(context); // Close the drawer
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: Text(_titles[_currentIndex])),
//       drawer: Drawer(
//         child: ListView(
//           padding: EdgeInsets.zero,
//           children: [
//             const DrawerHeader(
//               decoration: BoxDecoration(color: Colors.green),
//               child: Text(
//                 'GreenPulse',
//                 style: TextStyle(color: Colors.white, fontSize: 24),
//               ),
//             ),
//             ListTile(
//               leading: const Icon(Icons.analytics),
//               title: const Text('Bin Status'),
//               selected: _currentIndex == 0,
//               onTap: () => _navigateTo(0),
//             ),
//             ListTile(
//               leading: const Icon(Icons.notifications),
//               title: const Text('Alerts'),
//               selected: _currentIndex == 1,
//               onTap: () => _navigateTo(1),
//             ),
//             ListTile(
//               leading: const Icon(Icons.calendar_today),
//               title: const Text('Calendar'),
//               selected: _currentIndex == 2,
//               onTap: () => _navigateTo(2),
//             ),
//             ListTile(
//               leading: const Icon(Icons.settings),
//               title: const Text('Settings'),
//               selected: _currentIndex == 3,
//               onTap: () => _navigateTo(3),
//             ),
//             const Divider(),
//             ListTile(
//               leading: const Icon(Icons.logout),
//               title: const Text('Logout'),
//               onTap: () {
//                 Navigator.pop(context);
//                 Navigator.pushReplacementNamed(context, '/login');
//               },
//             ),
//           ],
//         ),
//       ),
//       body: _screens[_currentIndex],
//     );
//   }
// }

// lib/widgets/main_layout.dart
import 'package:flutter/animation.dart';
import 'package:flutter/material.dart';
import 'package:bin_owner_mobile_app/screens/bin_level_screen.dart';
import 'package:bin_owner_mobile_app/screens/notification.dart';
import 'package:bin_owner_mobile_app/screens/calendar.dart';
import 'package:bin_owner_mobile_app/screens/settings.dart';

class MainLayout extends StatefulWidget {
  const MainLayout({super.key});

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout>
    with SingleTickerProviderStateMixin {
  int _currentIndex = 0;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  final List<Widget> _screens = [
    const BinLevelScreen(),
    const NotificationScreen(),
    const CollectionCalendarScreen(),
    const SettingsScreen(),
  ];

  final List<String> _titles = ['Bin Status', 'Alerts', 'Calendar', 'Settings'];

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _navigateTo(int index) {
    setState(() {
      _currentIndex = index;
      _animationController.reset();
      _animationController.forward();
    });
    Navigator.pop(context); // Close the drawer
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_titles[_currentIndex]),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => _refreshData(),
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: Colors.green),
              child: Text(
                'GreenPulse',
                style: TextStyle(color: Colors.white, fontSize: 24),
              ),
            ),
            _buildDrawerItem(Icons.analytics, 'Bin Status', 0),
            _buildDrawerItem(Icons.notifications, 'Alerts', 1),
            _buildDrawerItem(Icons.calendar_today, 'Calendar', 2),
            _buildDrawerItem(Icons.settings, 'Settings', 3),
            const Divider(),
            _buildDrawerItem(Icons.logout, 'Logout', -1, isLogout: true),
          ],
        ),
      ),
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: _screens[_currentIndex],
      ),
    );
  }

  Widget _buildDrawerItem(
    IconData icon,
    String label,
    int index, {
    bool isLogout = false,
  }) {
    return ListTile(
      leading: Icon(icon),
      title: Text(label),
      selected: _currentIndex == index && !isLogout,
      onTap:
          isLogout
              ? () {
                Navigator.pop(context);
                Navigator.pushReplacementNamed(context, '/login');
              }
              : () => _navigateTo(index),
    );
  }

  void _refreshData() {
    // Add shimmer animation while refreshing
    _animationController.reset();
    _animationController.forward();
    // Your refresh logic here
  }
}
