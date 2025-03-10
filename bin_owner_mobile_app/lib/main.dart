import 'package:bin_owner_mobile_app/routes.dart';
import 'package:flutter/material.dart';

import './theme/theme.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GreenPulse',
      theme: customTheme,
      home: MyHomePage(title: "Home Page"),
      initialRoute: AppRoutes.home,
      routes: AppRoutes.routes,
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: Colors.black, title: Text(widget.title)),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, AppRoutes.binLevel);
              },
              child: Text("Bin Status Page"),
            ),
          ],
        ),
      ),
    );
  }
}
