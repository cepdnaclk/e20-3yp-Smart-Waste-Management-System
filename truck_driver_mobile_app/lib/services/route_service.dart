import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:truck_driver_mobile_app/models/ApiResponse.dart';
import 'package:truck_driver_mobile_app/models/AssignedRoute.dart';

class RouteService {
  final String baseUrl = 'http://10.0.2.2:8080/api/routes';

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
      return apiResponse.data;
    } else {
      throw Exception('Failed to fetch route');
    }
  }

  Future<bool> startRoute(String token, int routeId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/$routeId/start'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    return response.statusCode == 200;
  }

  Future<bool> stopRoute(String token, int routeId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/$routeId/stop'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    return response.statusCode == 200;
  }

Future<bool> markBinCollected(String token, int routeId, String binId) async {
  final response = await http.post(
    Uri.parse('$baseUrl/mark-collected'),
    headers: {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    },
    body: jsonEncode({
      'routeId': routeId,
      'binId': binId,
    }),
  );

  return response.statusCode == 200;
}

}
