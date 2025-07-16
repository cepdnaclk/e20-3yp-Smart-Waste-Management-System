// lib/services/maintenance_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:bin_owner_mobile_app/config.dart';
import '../models/maintenance_request_model.dart';

class MaintenanceService {
  static const _storage = FlutterSecureStorage();

  // Submit maintenance request
  static Future<bool> submitMaintenanceRequest(
    MaintenanceRequest request,
  ) async {
    try {
      final token = await _storage.read(key: 'auth_token');
      final url = Uri.parse('$baseUrl/maintenance-requests');

      print('🔧 Submitting maintenance request to: $url');
      print('🔧 Request data: ${jsonEncode(request.toJson())}');

      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode(request.toJson()),
      );

      print('🔧 Response status: ${response.statusCode}');
      print('🔧 Response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      } else {
        throw Exception(
          'Failed to submit maintenance request: ${response.body}',
        );
      }
    } catch (e) {
      print('❌ Error submitting maintenance request: $e');
      throw Exception('Failed to submit maintenance request: $e');
    }
  }

  // Get maintenance requests for user
  static Future<List<MaintenanceRequest>> getMyRequests() async {
    try {
      final token = await _storage.read(key: 'auth_token');
      final url = Uri.parse('$baseUrl/maintenance-requests/my-requests');

      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['data'] != null) {
          List<dynamic> requestsData = data['data'];
          return requestsData
              .map((json) => MaintenanceRequest.fromJson(json))
              .toList();
        }
      }
      throw Exception('Failed to fetch maintenance requests');
    } catch (e) {
      print('❌ Error fetching maintenance requests: $e');
      throw Exception('Failed to fetch maintenance requests: $e');
    }
  }
}
