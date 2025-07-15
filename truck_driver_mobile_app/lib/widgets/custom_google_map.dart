import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';
import 'package:truck_driver_mobile_app/models/BinStop.dart';

class CustomGoogleMap extends StatefulWidget {
  final List<BinStop> binStops;
  final Function(int stopId)? onMarkerTap;

  const CustomGoogleMap({
    Key? key,
    required this.binStops,
    this.onMarkerTap,
  }) : super(key: key);

  @override
  State<CustomGoogleMap> createState() => _CustomGoogleMapState();
}

class _CustomGoogleMapState extends State<CustomGoogleMap> {
  final Completer<GoogleMapController> _controller = Completer();
  LocationData? _currentLocation;
  final Location _location = Location();
  Set<Marker> _markers = {};

  @override
  void initState() {
    super.initState();
    _fetchLocationAndMarkers();
  }

  Future<void> _fetchLocationAndMarkers() async {
    _currentLocation = await _location.getLocation();
    _setMarkers();
  }

  void _setMarkers() {
    final markers = <Marker>{};

    // Collector location
    if (_currentLocation != null) {
      markers.add(
        Marker(
          markerId: const MarkerId("collector"),
          position: LatLng(_currentLocation!.latitude!, _currentLocation!.longitude!),
          infoWindow: const InfoWindow(title: "You (Collector)"),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueBlue),
        ),
      );
    }

    // Bin markers
    for (final bin in widget.binStops) {
      markers.add(
        Marker(
          markerId: MarkerId("bin-${bin.id}"),
          position: LatLng(bin.latitude, bin.longitude),
          infoWindow: InfoWindow(title: "Bin ${bin.binId}"),
          onTap: () {
            if (widget.onMarkerTap != null) {
              widget.onMarkerTap!(bin.id);
            }
          },
        ),
      );
    }

    setState(() {
      _markers = markers;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_currentLocation == null) {
      return const Center(child: CircularProgressIndicator());
    }

    return GoogleMap(
      initialCameraPosition: CameraPosition(
        target: LatLng(_currentLocation!.latitude!, _currentLocation!.longitude!),
        zoom: 14,
      ),
      onMapCreated: (controller) => _controller.complete(controller),
      markers: _markers,
      myLocationEnabled: true,
      myLocationButtonEnabled: true,
    );
  }
}
