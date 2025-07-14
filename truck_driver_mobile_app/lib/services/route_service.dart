import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:truck_driver_mobile_app/models/ApiResponse.dart';
import 'package:truck_driver_mobile_app/models/AssignedRoute.dart';

class RouteService {
  final String baseUrl = 'https://localhost:8080/api/routes'; 
  Future<AssignedRoute?> getAssignedRoute(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/assigned'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final jsonBody = jsonDecode(response.body);
      final apiResponse = ApiResponse.fromJson(
        jsonBody,
        (data) => AssignedRoute.fromJson(data),
      );

      if (apiResponse.success) {
        return apiResponse.data;
      } else {
        throw Exception(apiResponse.message);
      }
    } else {
      throw Exception("Failed to load route. Status code: ${response.statusCode}");
    }
  }
}
