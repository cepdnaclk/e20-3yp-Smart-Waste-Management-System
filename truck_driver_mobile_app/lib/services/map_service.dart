import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_polyline_points/flutter_polyline_points.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class MapService {
  static final _apiKey = dotenv.env['GOOGLE_MAPS_API_KEY'];
  static const _directionsUrl =
      'https://maps.googleapis.com/maps/api/directions/json';

  Future<List<LatLng>> getOptimizedRoute({
    required LatLng origin,
    required List<LatLng> waypoints,
  }) async {
    final waypointsStr =
        waypoints.map((w) => '${w.latitude},${w.longitude}').join('|');

    final uri = Uri.parse(
      '$_directionsUrl?origin=${origin.latitude},${origin.longitude}'
      '&destination=${origin.latitude},${origin.longitude}'
      '&waypoints=optimize:true|$waypointsStr'
      '&key=$_apiKey',
    );

    final response = await http.get(uri);
    final json = jsonDecode(response.body);

    if (json['status'] != 'OK') {
      throw Exception("Directions API error: ${json['status']}");
    }

    final List<PointLatLng> points = PolylinePoints()
        .decodePolyline(json['routes'][0]['overview_polyline']['points']);

    return points.map((e) => LatLng(e.latitude, e.longitude)).toList();
  }
}
