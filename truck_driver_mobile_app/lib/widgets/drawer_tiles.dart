import 'package:flutter/material.dart';

class DrawerTiles extends StatelessWidget {
  final String title;
  final IconData icon;
  final Widget destinationPage;
  final Color color;

  const DrawerTiles({
    required this.title,
    required this.icon,
    required this.destinationPage,
    this.color = Colors.lightGreen,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: color),
      title: Text(title, style: TextStyle(color: color)),
      onTap: () {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => destinationPage),
        );
      },
    );
  }
}
