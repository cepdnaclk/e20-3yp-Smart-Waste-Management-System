import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:truck_driver_mobile_app/models/TruckAssignmentRequest.dart';

import '../models/Truck.dart';
import '../models/ApiResponse.dart';

class TruckService {
  // final String baseUrl = 'http://3.1.102.226:8080/api/admin/trucks';
  // final String collectorBaseUrl = 'http://3.1.102.226:8080/api/collector/trucks';
  final String baseUrl = 'http://10.0.2.2:8080/api/admin/trucks';
  final String collectorBaseUrl = 'http://10.0.2.2:8080/api/collector/trucks';
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
      Uri.parse(baseUrl),
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
        return apiResponse.data
            .where((truck) => truck.status == 'AVAILABLE')
            .toList();
      } else {
        throw Exception('API error: ${apiResponse.message}');
      }
    } else {
      throw Exception(
          'Failed to load trucks. Status code: ${response.statusCode}');
    }
  }

  // Assign a truck
  Future<bool> assignTruck(TruckAssignmentRequest request) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('No JWT token found');
    }

    final response = await http.post(
      Uri.parse('$collectorBaseUrl/assign'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(request.toJson()),
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonResponse = jsonDecode(response.body);
      if (jsonResponse['success'] == true) {
        return true;
      } else {
        throw Exception('Assignment failed: ${jsonResponse['message']}');
      }
    } else {
      throw Exception(
          'Failed to assign truck. Status code: ${response.statusCode}');
    }
  }

  // Handover a truck
  Future<bool> handOverTruck(TruckAssignmentRequest request) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('No JWT token found');
    }

    final response = await http.post(
      Uri.parse('$collectorBaseUrl/handover'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(request.toJson()),
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonResponse = jsonDecode(response.body);
      return jsonResponse['success'] == true;
    } else {
      throw Exception(
          'Failed to hand over truck. Status code: ${response.statusCode}');
    }
  }
}
