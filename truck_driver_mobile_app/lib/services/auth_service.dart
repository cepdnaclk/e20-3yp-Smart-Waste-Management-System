import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  // final String baseUrl = 'http://3.1.102.226:8080/api/auth/authenticate';
  final String baseUrl = 'http://10.0.2.2:8080/api/auth/authenticate';
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  Future<bool> login(String id, String password) async {
    final url = Uri.parse(baseUrl); 

    try {
      final response = await http.post(
        url,
        headers: const {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': id,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);

        if (jsonResponse['success'] == true) {
          final token = jsonResponse['data']?['token'];
          if (token != null) {
            await _secureStorage.write(key: 'jwt_token', value: token);
            return true;
          }
        }

        print("Login failed: ${jsonResponse['message'] ?? 'Unknown error'}");
        return false;
      } else {
        print("HTTP error: ${response.statusCode}");
        return false;
      }
    } catch (e) {
      print("Login exception: $e");
      return false;
    }
  }

  Future<String?> getToken() async {
    return await _secureStorage.read(key: 'jwt_token');
  }

  Future<void> saveAssignedTruck(String truckId) async {
    await _secureStorage.write(key: 'assigned_truck', value: truckId);
  }

  Future<String?> getAssignedTruck() async {
    return await _secureStorage.read(key: 'assigned_truck');
  }

  Future<void> logout() async {
    await _secureStorage.deleteAll();
  }
}
