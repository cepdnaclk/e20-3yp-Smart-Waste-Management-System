// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import 'package:bin_owner_mobile_app/routes.dart';
// import 'package:bin_owner_mobile_app/screens/verfication_screen.dart';
// import 'package:bin_owner_mobile_app/screens/profile_form_screen.dart';
// import 'package:bin_owner_mobile_app/theme/theme.dart';
// import 'package:bin_owner_mobile_app/providers/user_provider.dart';
// import 'package:bin_owner_mobile_app/providers/bin_provider.dart';
// import 'package:bin_owner_mobile_app/screens/new_password_screen.dart';
// import 'package:bin_owner_mobile_app/screens/password_reset_verification_screen.dart';

// void main() {
//   runApp(
//     MultiProvider(
//       providers: [
//         ChangeNotifierProvider(create: (_) => BinProvider()),
//         ChangeNotifierProvider(create: (_) => UserProvider()),
//       ],
//       child: const MyApp(),
//     ),
//   );
// }

// class MyApp extends StatelessWidget {
//   const MyApp({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       title: 'GreenPulse',
//       theme: customTheme,

//       //Start with Login Page
//       initialRoute: AppRoutes.login,

//       //Named route table
//       routes: AppRoutes.routes,

//       //Dynamic routes for screens needing arguments
//       onGenerateRoute: (settings) {
//         if (settings.name == '/verify') {
//           final args = settings.arguments as Map<String, dynamic>?;
//           if (args == null ||
//               !args.containsKey('email') ||
//               !args.containsKey('token')) {
//             return MaterialPageRoute(
//               builder:
//                   (context) => const Scaffold(
//                     body: Center(
//                       child: Text('Missing verification email or token'),
//                     ),
//                   ),
//             );
//           }
//           return MaterialPageRoute(
//             builder:
//                 (context) => VerificationScreen(
//                   email: args['email'],
//                   userId: args['userId'] ?? '',
//                   token: args['token'],
//                 ),
//           );
//         } else if (settings.name == '/password-reset-verification') {
//           final args = settings.arguments as Map<String, dynamic>?;
//           if (args == null ||
//               !args.containsKey('email') ||
//               !args.containsKey('sessionToken')) {
//             return MaterialPageRoute(
//               builder:
//                   (context) => const Scaffold(
//                     body: Center(
//                       child: Text('Missing password reset verification data'),
//                     ),
//                   ),
//             );
//           }
//           return MaterialPageRoute(
//             builder:
//                 (context) => PasswordResetVerificationScreen(
//                   email: args['email'],
//                   sessionToken: args['sessionToken'],
//                 ),
//           );
//         } else if (settings.name == '/reset-password-new') {
//           final args = settings.arguments as Map<String, dynamic>?;
//           if (args == null ||
//               !args.containsKey('email') ||
//               !args.containsKey('verifiedToken')) {
//             return MaterialPageRoute(
//               builder:
//                   (context) => const Scaffold(
//                     body: Center(child: Text('Missing password reset data')),
//                   ),
//             );
//           }
//           return MaterialPageRoute(
//             builder:
//                 (context) => NewPasswordScreen(
//                   email: args['email'],
//                   verifiedToken: args['verifiedToken'],
//                 ),
//           );
//         } else if (settings.name == '/profile') {
//           final args = settings.arguments as Map<String, dynamic>;
//           return MaterialPageRoute(
//             builder: (context) => ProfileFormScreen(userId: args['userId']),
//           );
//         }
//         return null; // fallback to static routes
//       },
//     );
//   }
// }

// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import 'package:bin_owner_mobile_app/routes.dart';
// import 'package:bin_owner_mobile_app/screens/verfication_screen.dart';
// import 'package:bin_owner_mobile_app/screens/profile_form_screen.dart';
// import 'package:bin_owner_mobile_app/screens/login_screen.dart'; // ✅ Add this
// import 'package:bin_owner_mobile_app/widgets/main_layout.dart'; // ✅ Add this
// import 'package:bin_owner_mobile_app/theme/theme.dart';
// import 'package:bin_owner_mobile_app/providers/user_provider.dart';
// import 'package:bin_owner_mobile_app/providers/bin_provider.dart';
// import 'package:bin_owner_mobile_app/screens/new_password_screen.dart';
// import 'package:bin_owner_mobile_app/screens/password_reset_verification_screen.dart';
// import 'package:flutter_secure_storage/flutter_secure_storage.dart';
// import 'package:bin_owner_mobile_app/providers/auth_provider.dart';

// void main() {
//   runApp(
//     MultiProvider(
//       providers: [
//         ChangeNotifierProvider(create: (_) => BinProvider()),
//         ChangeNotifierProvider(create: (_) => UserProvider()),
//       ],
//       child: const MyApp(),
//     ),
//   );
// }

// class MyApp extends StatelessWidget {
//   const MyApp({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       title: 'GreenPulse',
//       theme: customTheme,

//       // ✅ Use AuthenticationWrapper instead of initialRoute
//       home: const AuthenticationWrapper(),

//       // Named route table
//       routes: AppRoutes.routes,

//       // Dynamic routes for screens needing arguments
//       onGenerateRoute: (settings) {
//         if (settings.name == '/verify') {
//           final args = settings.arguments as Map<String, dynamic>?;
//           if (args == null ||
//               !args.containsKey('email') ||
//               !args.containsKey('token')) {
//             return MaterialPageRoute(
//               builder:
//                   (context) => const Scaffold(
//                     body: Center(
//                       child: Text('Missing verification email or token'),
//                     ),
//                   ),
//             );
//           }
//           return MaterialPageRoute(
//             builder:
//                 (context) => VerificationScreen(
//                   email: args['email'],
//                   userId: args['userId'] ?? '',
//                   token: args['token'],
//                 ),
//           );
//         } else if (settings.name == '/password-reset-verification') {
//           final args = settings.arguments as Map<String, dynamic>?;
//           if (args == null ||
//               !args.containsKey('email') ||
//               !args.containsKey('sessionToken')) {
//             return MaterialPageRoute(
//               builder:
//                   (context) => const Scaffold(
//                     body: Center(
//                       child: Text('Missing password reset verification data'),
//                     ),
//                   ),
//             );
//           }
//           return MaterialPageRoute(
//             builder:
//                 (context) => PasswordResetVerificationScreen(
//                   email: args['email'],
//                   sessionToken: args['sessionToken'],
//                 ),
//           );
//         } else if (settings.name == '/reset-password-new') {
//           final args = settings.arguments as Map<String, dynamic>?;
//           if (args == null ||
//               !args.containsKey('email') ||
//               !args.containsKey('verifiedToken')) {
//             return MaterialPageRoute(
//               builder:
//                   (context) => const Scaffold(
//                     body: Center(child: Text('Missing password reset data')),
//                   ),
//             );
//           }
//           return MaterialPageRoute(
//             builder:
//                 (context) => NewPasswordScreen(
//                   email: args['email'],
//                   verifiedToken: args['verifiedToken'],
//                 ),
//           );
//         } else if (settings.name == '/profile') {
//           final args = settings.arguments as Map<String, dynamic>;
//           return MaterialPageRoute(
//             builder: (context) => ProfileFormScreen(userId: args['userId']),
//           );
//         }
//         // ✅ Add notification route with authentication
//         else if (settings.name == '/notifications') {
//           return MaterialPageRoute(
//             builder: (context) => const AuthenticationWrapper(),
//           );
//         }
//         return null; // fallback to static routes
//       },
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:bin_owner_mobile_app/routes.dart';
import 'package:bin_owner_mobile_app/screens/verfication_screen.dart';
import 'package:bin_owner_mobile_app/screens/profile_form_screen.dart';
import 'package:bin_owner_mobile_app/screens/login_screen.dart';
import 'package:bin_owner_mobile_app/widgets/main_layout.dart';
import 'package:bin_owner_mobile_app/theme/theme.dart';
import 'package:bin_owner_mobile_app/providers/user_provider.dart';
import 'package:bin_owner_mobile_app/providers/bin_provider.dart';
import 'package:bin_owner_mobile_app/providers/auth_provider.dart';
import 'package:bin_owner_mobile_app/screens/new_password_screen.dart';
import 'package:bin_owner_mobile_app/screens/password_reset_verification_screen.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';

import 'package:bin_owner_mobile_app/screens/problem_report_screen.dart';
import 'package:bin_owner_mobile_app/screens/notification.dart';
import 'package:bin_owner_mobile_app/screens/maintenance_requests_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => BinProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(
          create: (_) => AuthProvider(),
        ), // ✅ Add this line
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
      home: const AuthenticationWrapper(),
      routes: AppRoutes.routes,
      onGenerateRoute: (settings) {
        // ... your existing onGenerateRoute logic
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
        } else if (settings.name == '/password-reset-verification') {
          final args = settings.arguments as Map<String, dynamic>?;
          if (args == null ||
              !args.containsKey('email') ||
              !args.containsKey('sessionToken')) {
            return MaterialPageRoute(
              builder:
                  (context) => const Scaffold(
                    body: Center(
                      child: Text('Missing password reset verification data'),
                    ),
                  ),
            );
          }
          return MaterialPageRoute(
            builder:
                (context) => PasswordResetVerificationScreen(
                  email: args['email'],
                  sessionToken: args['sessionToken'],
                ),
          );
        } else if (settings.name == '/reset-password-new') {
          final args = settings.arguments as Map<String, dynamic>?;
          if (args == null ||
              !args.containsKey('email') ||
              !args.containsKey('verifiedToken')) {
            return MaterialPageRoute(
              builder:
                  (context) => const Scaffold(
                    body: Center(child: Text('Missing password reset data')),
                  ),
            );
          }
          return MaterialPageRoute(
            builder:
                (context) => NewPasswordScreen(
                  email: args['email'],
                  verifiedToken: args['verifiedToken'],
                ),
          );
        } else if (settings.name == '/profile') {
          final args = settings.arguments as Map<String, dynamic>;
          return MaterialPageRoute(
            builder: (context) => ProfileFormScreen(userId: args['userId']),
          );
        }
        //Add maintenance request routes
        else if (settings.name == '/maintenance-request') {
          final args = settings.arguments as Map<String, dynamic>?;
          return MaterialPageRoute(builder: (context) => ProblemReportScreen());
        } else if (settings.name == '/maintenance-requests') {
          return MaterialPageRoute(
            builder: (context) => const MaintenanceRequestsScreen(),
          );
        }
        //Add notification route
        else if (settings.name == '/notifications') {
          final args = settings.arguments as Map<String, dynamic>?;
          return MaterialPageRoute(
            builder:
                (context) => NotificationScreen(
                  initialFilter: args?['filter'] ?? 'all',
                  highlightNotificationId: args?['notificationId'],
                ),
          );
        }
        return null;
      },
    );
  }
}

// ✅ Updated AuthenticationWrapper to use AuthProvider
class AuthenticationWrapper extends StatefulWidget {
  const AuthenticationWrapper({Key? key}) : super(key: key);

  @override
  State<AuthenticationWrapper> createState() => _AuthenticationWrapperState();
}

class _AuthenticationWrapperState extends State<AuthenticationWrapper> {
  @override
  void initState() {
    super.initState();
    // Check auth status when app starts
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AuthProvider>().checkAuthStatus();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        if (authProvider.isLoading) {
          return const Scaffold(
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('Loading...'),
                ],
              ),
            ),
          );
        }

        print('🔍 Auth state - Authenticated: ${authProvider.isAuthenticated}');

        return authProvider.isAuthenticated
            ? const MainLayout()
            : const LoginScreen();
      },
    );
  }
}
