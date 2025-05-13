// models/bin.dart
import 'package:flutter/material.dart';

class Bin {
  final String type;
  final String lastCollected;
  final String nextFill;
  final int fill;
  final IconData icon;
  final Color color;

  Bin({
    required this.type,
    required this.lastCollected,
    required this.nextFill,
    required this.fill,
    required this.icon,
    required this.color,
  });

  factory Bin.fromJson(Map<String, dynamic> json) {
    return Bin(
      type: json['type'],
      lastCollected: json['lastCollected'],
      nextFill: json['nextFill'],
      fill: json['fill'],
      icon: _getIconFromType(json['type']),
      color: _getColorFromType(json['type']),
    );
  }

  static IconData _getIconFromType(String type) {
    switch (type) {
      case 'Plastic':
        return Icons.recycling;
      case 'Glass':
        return Icons.clear_all;
      case 'Paper':
        return Icons.book;
      default:
        return Icons.delete;
    }
  }

  static Color _getColorFromType(String type) {
    switch (type) {
      case 'Plastic':
        return Colors.blue;
      case 'Glass':
        return Colors.green;
      case 'Paper':
        return Colors.brown;
      default:
        return Colors.grey;
    }
  }
}
