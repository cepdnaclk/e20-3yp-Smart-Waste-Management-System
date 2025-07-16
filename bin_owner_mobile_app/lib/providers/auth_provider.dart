import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';

class AuthProvider with ChangeNotifier {
  static const _storage = FlutterSecureStorage();

  bool _isAuthenticated = false;
  bool _isLoading = true;
  String? _username;

  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get username => _username;

  Future<void> checkAuthStatus() async {
    try {
      print('🔍 AuthProvider - Checking auth status...');
      final token = await _storage.read(key: 'auth_token');

      if (token != null) {
        final isValid = await _validateTokenExpiration(token);

        if (isValid) {
          final username = await _extractUsernameFromToken(token);
          _isAuthenticated = username != null;
          _username = username;
          print('🔍 AuthProvider - Token found, username: $username');
        } else {
          await _storage.delete(key: 'auth_token');
          _isAuthenticated = false;
          _username = null;
          print('🔍 AuthProvider - Token expired, cleared from storage');
        }
      } else {
        _isAuthenticated = false;
        _username = null;
        print('🔍 AuthProvider - No token found');
      }

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      print('❌ AuthProvider - Auth check error: $e');
      _isAuthenticated = false;
      _username = null;
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> _validateTokenExpiration(String token) async {
    try {
      final parts = token.split('.');
      if (parts.length != 3) return false;

      final payload = parts[1];
      final decoded = jsonDecode(
        utf8.decode(base64Url.decode(base64Url.normalize(payload))),
      );

      final exp = decoded['exp'] as int?;
      if (exp == null) return false;

      final expirationTime = DateTime.fromMillisecondsSinceEpoch(exp * 1000);
      final isValid = DateTime.now().isBefore(expirationTime);

      print('🔍 AuthProvider - Token expiration check: $isValid');
      print('🔍 AuthProvider - Token expires at: $expirationTime');

      return isValid;
    } catch (e) {
      print('❌ AuthProvider - Token validation error: $e');
      return false;
    }
  }

  Future<void> login(String token) async {
    try {
      print('🔍 AuthProvider - Processing login...');
      await _storage.write(key: 'auth_token', value: token);

      final username = await _extractUsernameFromToken(token);
      _isAuthenticated = username != null;
      _username = username;
      _isLoading = false;

      print('🔍 AuthProvider - Login successful, username: $username');
      notifyListeners();
    } catch (e) {
      print('❌ AuthProvider - Login error: $e');
      _isAuthenticated = false;
      _username = null;
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    try {
      await _storage.delete(key: 'auth_token');
      _isAuthenticated = false;
      _username = null;
      print('🔍 AuthProvider - Logout successful');
      notifyListeners();
    } catch (e) {
      print('❌ AuthProvider - Logout error: $e');
    }
  }

  Future<String?> _extractUsernameFromToken(String token) async {
    try {
      final parts = token.split('.');
      if (parts.length != 3) return null;

      final payload = parts[1];
      final decoded = jsonDecode(
        utf8.decode(base64Url.decode(base64Url.normalize(payload))),
      );

      return decoded['sub'] as String?;
    } catch (e) {
      print('❌ AuthProvider - Token extraction error: $e');
      return null;
    }
  }
}
