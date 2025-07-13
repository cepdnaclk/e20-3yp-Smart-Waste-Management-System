import 'package:flutter/material.dart';

class UserProvider with ChangeNotifier {
  String? _username;
  String? _truckId;
  bool _isLoggedIn = false;
  String? _registrationNumber;

  String? get username => _username;
  String? get truckId => _truckId;
  bool get isLoggedIn => _isLoggedIn;
  String? get registrationNumber => _registrationNumber;

  void login(String username) {
    _username = username;
    _isLoggedIn = true;
    notifyListeners();
  }

  void assignTruck(String truckId) {
    _truckId = truckId;
    _registrationNumber = registrationNumber; 
    notifyListeners();
  }
  void clearAssignedTruck() {
    _truckId = null;
    notifyListeners();
  }
  void logout() {
    _username = '';
    _truckId = '';
    _isLoggedIn = false;
    notifyListeners();
  }
}
