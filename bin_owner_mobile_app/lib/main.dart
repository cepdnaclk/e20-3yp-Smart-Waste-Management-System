import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:bin_owner_mobile_app/routes.dart';
import 'package:bin_owner_mobile_app/screens/verfication_screen.dart';
import 'package:bin_owner_mobile_app/screens/profile_form_screen.dart';
import 'package:bin_owner_mobile_app/theme/theme.dart';
import 'package:bin_owner_mobile_app/providers/user_provider.dart';
import 'package:bin_owner_mobile_app/providers/bin_provider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => BinProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GreenPulse',
      theme: customTheme,

      // 👇 Start with Login Page
      initialRoute: AppRoutes.login,

      // 👇 Named route table
      routes: AppRoutes.routes,

      // 👇 Dynamic routes for screens needing arguments
      onGenerateRoute: (settings) {
        if (settings.name == '/verify') {
          final args = settings.arguments as Map<String, dynamic>?;
          if (args == null ||
              !args.containsKey('email') ||
              !args.containsKey('token')) {
            return MaterialPageRoute(
              builder:
                  (context) => const Scaffold(
                    body: Center(
                      child: Text('Missing verification email or token'),
                    ),
                  ),
            );
          }
          return MaterialPageRoute(
            builder:
                (context) => VerificationScreen(
                  email: args['email'],
                  userId: args['userId'] ?? '',
                  token: args['token'],
                ),
          );
        } else if (settings.name == '/profile') {
          final args = settings.arguments as Map<String, dynamic>;
          return MaterialPageRoute(
            builder: (context) => ProfileFormScreen(userId: args['userId']),
          );
        }
        return null; // fallback to static routes
      },
    );
  }
}
