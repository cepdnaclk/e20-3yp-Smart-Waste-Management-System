import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class AuthService {
  static const FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  Future<bool> login(String username, String password) async {
    final url = Uri.parse("http://10.0.2.2:8080/api/auth/authenticate");
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final token = response.body;
      await _secureStorage.write(key: 'jwt_token', value: token);
      return true;
    } else {
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
