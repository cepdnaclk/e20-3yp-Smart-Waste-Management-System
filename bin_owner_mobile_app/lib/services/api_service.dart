// lib/services/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static const String baseUrl = 'http://10.30.7.90:8080/api';
  static const _storage = FlutterSecureStorage();

  static Future<String?> _getToken() async {
    return await _storage.read(key: 'auth_token');
  }

  static Future<Map<String, String>> _getHeaders() async {
    final token = await _getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  static Future<http.Response> get(String endpoint) async {
    final headers = await _getHeaders();
    final uri = Uri.parse('$baseUrl$endpoint');

    try {
      final response = await http.get(uri, headers: headers);
      return response;
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<http.Response> post(
    String endpoint,
    Map<String, dynamic> data,
  ) async {
    final headers = await _getHeaders();
    final uri = Uri.parse('$baseUrl$endpoint');

    try {
      final response = await http.post(
        uri,
        headers: headers,
        body: json.encode(data),
      );
      return response;
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<http.Response> put(
    String endpoint, [
    Map<String, dynamic>? data,
  ]) async {
    final headers = await _getHeaders();
    final uri = Uri.parse('$baseUrl$endpoint');

    try {
      final response = await http.put(
        uri,
        headers: headers,
        body: data != null ? json.encode(data) : null,
      );
      return response;
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<http.Response> delete(
    String endpoint, [
    List<String>? data,
  ]) async {
    final headers = await _getHeaders();
    final uri = Uri.parse('$baseUrl$endpoint');

    try {
      final response = await http.delete(
        uri,
        headers: headers,
        body: data != null ? json.encode(data) : null,
      );
      return response;
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }
}
