import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  final String baseUrl =
      'http://10.0.2.2:8080/api/auth/authenticate'; // Update this
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  Future<bool> login(String id, String password) async {
    final url = Uri.parse(baseUrl); // Adjust path as needed

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': id,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final jsonResponse = jsonDecode(response.body);

      if (jsonResponse['success'] == true) {
        final token = jsonResponse['data']['token'];

        // 🔐 Store token securely
        await _secureStorage.write(key: 'jwt_token', value: token);

        return true;
      } else {
        print('Login failed: ${jsonResponse['message']}');
        return false;
      }
    } else {
      print('Login error: ${response.statusCode} ${response.body}');
      return false;
    }
  }

  Future<String?> getToken() async {
    return await _secureStorage.read(key: 'jwt_token');
  }

  Future<void> logout() async {
    await _secureStorage.delete(key: 'jwt_token');
  }
}
