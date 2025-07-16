import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:bin_owner_mobile_app/config.dart';

class BinStatusWebSocketService {
  final Function(Map<String, dynamic>) onStatusUpdate;
  WebSocketChannel? _channel;
  bool _isConnecting = false;

  BinStatusWebSocketService({required this.onStatusUpdate});

  Future<void> connect(String username) async {
    if (_isConnecting || (_channel != null && _channel!.closeCode == null)) {
      print('WebSocket is already connecting or connected.');
      return;
    }
    _isConnecting = true;

    // Use the /ws/bin-status endpoint
    final uri = Uri.parse('$wsBaseUrl/bin-status?username=$username');
    print('🔌 Connecting to Bin Status WebSocket: $uri');

    try {
      _channel = WebSocketChannel.connect(uri);
      _isConnecting = false;

      _channel!.stream.listen(
        (message) {
          try {
            final data = json.decode(message) as Map<String, dynamic>;
            // Pass the data to the callback function
            onStatusUpdate(data);
          } catch (e) {
            print('❌ Error parsing WebSocket message: $e');
          }
        },
        onError: (error) {
          print('❌ WebSocket error: $error');
          _reconnect(username);
        },
        onDone: () {
          print('🚪 WebSocket connection closed.');
          _reconnect(username);
        },
      );
    } catch (e) {
      print('❌ Failed to connect to WebSocket: $e');
      _isConnecting = false;
      _reconnect(username);
    }
  }

  void _reconnect(String username) {
    if (_isConnecting) return;
    print('Attempting to reconnect in 5 seconds...');
    Future.delayed(const Duration(seconds: 5), () => connect(username));
  }

  void disconnect() {
    _channel?.sink.close();
  }
}
