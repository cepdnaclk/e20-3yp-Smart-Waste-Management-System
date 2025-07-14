import 'BinStop.dart';

class AssignedRoute {
  final String routeId;
  final String status;
  final List<BinStop> stops;

  AssignedRoute({
    required this.routeId,
    required this.status,
    required this.stops,
  });

  factory AssignedRoute.fromJson(Map<String, dynamic> json) {
    final stops = (json['stops'] as List)
        .map((stopJson) => BinStop.fromJson(stopJson))
        .toList();

    return AssignedRoute(
      routeId: json['routeId'],
      status: json['status'],
      stops: stops,
    );
  }
}
