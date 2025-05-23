import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class Bin {
  final String type;
  final int fill;
  final Color color;
  final IconData icon;
  final String lastCollected;
  final String nextFill;

  Bin({
    required this.type,
    required this.fill,
    required this.color,
    required this.icon,
    required this.lastCollected,
    required this.nextFill,
  });

  factory Bin.fromJson(Map<String, dynamic> json) {
    // Map the backend data to your Bin model
    // You'll need to adjust this based on your actual API response
    IconData getIconForType(String type) {
      switch (type.toLowerCase()) {
        case 'plastic':
          return Icons.recycling;
        case 'paper':
          return Icons.description;
        case 'glass':
          return Icons.local_drink;
        default:
          return Icons.delete;
      }
    }

    Color getColorForType(String type) {
      switch (type.toLowerCase()) {
        case 'plastic':
          return const Color.fromARGB(255, 255, 215, 0);
        case 'paper':
          return const Color.fromARGB(255, 6, 100, 208);
        case 'glass':
          return const Color.fromARGB(255, 0, 128, 0);
        default:
          return Colors.grey;
      }
    }

    return Bin(
      type: json['type'] ?? 'Unknown',
      fill: json['fillLevel'] ?? 0,
      color: getColorForType(json['type']),
      icon: getIconForType(json['type']),
      lastCollected: json['lastCollected'] ?? 'Unknown',
      nextFill: json['nextFillEstimate'] ?? 'Unknown',
    );
  }
}

class BinService {
  final String baseUrl;

  BinService({required this.baseUrl});

  Future<List<Bin>> fetchBins() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/bins'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((binData) => Bin.fromJson(binData)).toList();
      } else {
        throw Exception('Failed to load bins: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching bins: $e');
    }
  }

  Future<Bin> fetchBinDetails(String binId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/bins/$binId'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return Bin.fromJson(data);
      } else {
        throw Exception('Failed to load bin details: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching bin details: $e');
    }
  }
}
