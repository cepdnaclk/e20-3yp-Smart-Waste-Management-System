import 'BinStop.dart';

class AssignedRoute {
  final int routeId;
  final String routeStatus;
  final String? routeStartTime;
  final String? routeEndTime;
  final List<BinStop> stops;

  AssignedRoute({
    required this.routeId,
    required this.routeStatus,
    this.routeStartTime,
    this.routeEndTime,
    required this.stops,
  });

  factory AssignedRoute.fromJson(Map<String, dynamic> json) {
    return AssignedRoute(
      routeId: json['routeId'],
      routeStatus: json['routeStatus'],
      routeStartTime: json['routeStartTime'],
      routeEndTime: json['routeEndTime'],
      stops: (json['stops'] as List)
          .map((stopJson) => BinStop.fromJson(stopJson))
          .toList(),
    );
  }
}

