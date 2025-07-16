import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/notification_model.dart';

class WebSocketService {
  static const String wsUrl = 'ws://10.30.7.90:8080/ws/notifications';
  static const _storage = FlutterSecureStorage();

  WebSocketChannel? _channel;
  Function(NotificationModel)? _onNotificationReceived;

  Future<void> connect() async {
    try {
      // Get username from token
      final username = await _getUsernameFromToken();

      if (username == null) {
        throw Exception('Username not found in token');
      }

      print('🔍 WebSocket connecting with username: $username');
      final uri = Uri.parse('$wsUrl?userId=$username');
      _channel = WebSocketChannel.connect(uri);

      _channel!.stream.listen(
        (message) {
          try {
            print('🔍 WebSocket received: $message');
            final data = jsonDecode(message);
            final notification = NotificationModel.fromJson(data);
            _onNotificationReceived?.call(notification);
          } catch (e) {
            print('❌ Error parsing WebSocket message: $e');
          }
        },
        onError: (error) {
          print('❌ WebSocket error: $error');
          _reconnect();
        },
        onDone: () {
          print('🔍 WebSocket connection closed');
          _reconnect();
        },
      );
    } catch (e) {
      print('❌ Failed to connect to WebSocket: $e');
    }
  }

  Future<String?> _getUsernameFromToken() async {
    try {
      final token = await _storage.read(key: 'auth_token');
      if (token == null) return null;

      final parts = token.split('.');
      if (parts.length != 3) return null;

      final payload = parts[1];
      final decoded = jsonDecode(
        utf8.decode(base64Url.decode(base64Url.normalize(payload))),
      );

      return decoded['sub'] as String?;
    } catch (e) {
      print('❌ Error extracting username from token: $e');
      return null;
    }
  }

  void _reconnect() {
    Future.delayed(const Duration(seconds: 5), () {
      connect();
    });
  }

  void setOnNotificationReceived(Function(NotificationModel) callback) {
    _onNotificationReceived = callback;
  }

  void disconnect() {
    _channel?.sink.close();
    _channel = null;
  }
}

// class WebSocketService {
//   static const String wsUrl = 'ws://10.40.19.96:8080/ws/notifications';
//   static const _storage = FlutterSecureStorage();

//   WebSocketChannel? _channel;
//   Function(NotificationModel)? _onNotificationReceived;

//   Future<void> connect() async {
//     try {
//       // Get username from JWT token
//       final username = await _getUsernameFromToken();

//       if (username == null) {
//         throw Exception('Username not found in token');
//       }

//       print('WebSocket connecting with username: $username');
//       final uri = Uri.parse(
//         '$wsUrl?userId=$username',
//       ); // Use username as userId
//       _channel = WebSocketChannel.connect(uri);

//       _channel!.stream.listen(
//         (message) {
//           try {
//             print('WebSocket received: $message');
//             final data = json.decode(message);
//             final notification = NotificationModel.fromJson(data);
//             _onNotificationReceived?.call(notification);
//           } catch (e) {
//             print('Error parsing WebSocket message: $e');
//           }
//         },
//         onError: (error) {
//           print('WebSocket error: $error');
//           _reconnect();
//         },
//         onDone: () {
//           print('WebSocket connection closed');
//           _reconnect();
//         },
//       );
//     } catch (e) {
//       print('Failed to connect to WebSocket: $e');
//     }
//   }

//   Future<String?> _getUsernameFromToken() async {
//     try {
//       final token = await _storage.read(key: 'auth_token');
//       if (token == null) return null;

//       final parts = token.split('.');
//       if (parts.length != 3) return null;

//       final payload = parts[1];
//       final decoded = json.decode(
//         utf8.decode(base64Url.decode(base64Url.normalize(payload))),
//       );

//       final username = decoded['sub'] as String?;
//       print('Extracted username from token: $username');
//       return username;
//     } catch (e) {
//       print('Error extracting username from token: $e');
//       return null;
//     }
//   }

//   void _reconnect() {
//     Future.delayed(const Duration(seconds: 5), () {
//       connect();
//     });
//   }

//   void setOnNotificationReceived(Function(NotificationModel) callback) {
//     _onNotificationReceived = callback;
//   }

//   void disconnect() {
//     _channel?.sink.close();
//     _channel = null;
//   }
// }
