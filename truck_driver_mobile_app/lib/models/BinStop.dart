import 'package:google_maps_flutter/google_maps_flutter.dart';

class BinStop {
  final int id;
  final int stopOrder;
  final int binId;
  final LatLng location;
  final int paperLevel;
  final int plasticLevel;
  final int glassLevel;
  final String lastEmptiedAt;

  BinStop({
    required this.id,
    required this.stopOrder,
    required this.binId,
    required this.location,
    required this.paperLevel,
    required this.plasticLevel,
    required this.glassLevel,
    required this.lastEmptiedAt,
  });

  factory BinStop.fromJson(Map<String, dynamic> json) {
    final coords = json['location']['coordinates'];
    return BinStop(
      id: json['id'],
      stopOrder: json['stopOrder'],
      binId: json['binId'],
      location: LatLng(coords[1], coords[0]),
      paperLevel: json['paperLevel'],
      plasticLevel: json['plasticLevel'],
      glassLevel: json['glassLevel'],
      lastEmptiedAt: json['lastEmptiedAt'],
    );
  }
}
