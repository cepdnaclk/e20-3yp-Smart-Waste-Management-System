import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../models/Truck.dart';
import '../models/ApiResponse.dart';

class TruckService {
  final String baseUrl = 'http://3.1.102.226:8080/api';
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  // Get JWT token from secure storage
  Future<String?> _getToken() async {
    return await _secureStorage.read(key: 'jwt_token');
  }

  // Fetch list of trucks from backend
  Future<List<Truck>> getAllTrucks() async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('No JWT token found');
    }

    final response = await http.get(
      Uri.parse('$baseUrl/admin/trucks'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonResponse = jsonDecode(response.body);

      final apiResponse = ApiResponse<List<Truck>>.fromJson(
        jsonResponse,
        (data) => (data as List).map((e) => Truck.fromJson(e)).toList(),
      );

      if (apiResponse.success) {
        return apiResponse.data;
      } else {
        throw Exception('API error: ${apiResponse.message}');
      }
    } else {
      throw Exception('Failed to load trucks. Status code: ${response.statusCode}');
    }
  }

  // Assign a truck to the logged-in user
  Future<bool> assignTruck(String registrationNumber) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('No JWT token found');
    }

    final response = await http.post(
      Uri.parse('$baseUrl/collector/trucks/assign'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'registrationNumber': registrationNumber,
      }),
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonResponse = jsonDecode(response.body);
      if (jsonResponse['success'] == true) {
        return true;
      } else {
        throw Exception('Assignment failed: ${jsonResponse['message']}');
      }
    } else {
      throw Exception('Failed to assign truck. Status code: ${response.statusCode}');
    }
  }
}
