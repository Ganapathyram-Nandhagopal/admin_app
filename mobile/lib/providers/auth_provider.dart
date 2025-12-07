import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  bool _isAuthenticated = false;
  bool get isAuthenticated => _isAuthenticated;

  Future<void> login(String email, String password) async {
    try {
      await _apiService.login(email, password);
      _isAuthenticated = true;
      notifyListeners();
    } catch (e) {
      _isAuthenticated = false;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> checkLoginStatus() async {
    final token = await _apiService.getToken();
    if (token != null) {
      _isAuthenticated = true;
      notifyListeners();
    }
  }
  
  Future<void> logout() async {
    await _apiService.setToken('');
    _isAuthenticated = false;
    notifyListeners();
  }
}
