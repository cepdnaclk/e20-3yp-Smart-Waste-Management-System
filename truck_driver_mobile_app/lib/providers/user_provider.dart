import 'package:flutter/material.dart';

class UserProvider with ChangeNotifier {
  String? _username;
  String? _truckId;

  String? get username => _username;
  String? get truckId => _truckId;

  void login(String username) {
    _username = username;
    notifyListeners();
  }

  void assignTruck(String truckId) {
    _truckId = truckId;
    notifyListeners();
  }

  void logout() {
    _username = '';
    _truckId = '';
    notifyListeners();
  }
}
