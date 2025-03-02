import 'package:bin_owner_mobile_app/theme/colors.dart';
import 'package:flutter/material.dart';
import 'dart:ui';

class BinLevelScreen extends StatefulWidget {
  const BinLevelScreen({super.key});

  @override
  State<BinLevelScreen> createState() => _BinLevelScreenState();
}

class _BinLevelScreenState extends State<BinLevelScreen> {
  final PageController _pageController = PageController(
    viewportFraction: 0.6,
    initialPage: 1, // Start with middle bin
  );
  int _selectedBinIndex = 1; // Default to middle bin
  final List<Map<String, dynamic>> bins = [
    {
      'type': "Plastic",
      'fill': 50,
      'color': Color.fromARGB(255, 255, 215, 0),
      'icon': Icons.recycling,
      'lastCollected': "2ⁿᵈ March 2025",
      'nextFill': "5ᵗʰ March 2025",
    },
    {
      'type': "Paper",
      'fill': 40,
      'color': Color.fromARGB(255, 6, 100, 208),
      'icon': Icons.description,
      'lastCollected': "1ˢᵗ March 2025",
      'nextFill': "4ᵗʰ March 2025",
    },
    {
      'type': "Glass",
      'fill': 60,
      'color': Color.fromARGB(255, 0, 128, 0),
      'icon': Icons.local_drink,
      'lastCollected': "28ᵗʰ Feb 2025",
      'nextFill': "3ʳᵈ March 2025",
    },
  ];

  @override
  void initState() {
    super.initState();
    Future.microtask(() => setState(() {}));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: _buildAppBar(),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildBinCarousel(),
              const SizedBox(height: 15),
              _buildBinDetails(),
              const SizedBox(height: 30),
              _buildHealthStatus(),
            ],
          ),
        ),
      ),
    );
  }

  AppBar _buildAppBar() {
    return AppBar(
      backgroundColor: AppColors.background,
      elevation: 0,
      title: const Text(
        "Bin Level Monitor",
        style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
      ),
      centerTitle: true,
    );
  }

  Widget _buildBinCarousel() {
    return SizedBox(
      height: 250,
      child: PageView.builder(
        controller: _pageController,
        onPageChanged: (index) => setState(() => _selectedBinIndex = index),
        itemCount: bins.length,
        itemBuilder: (context, index) {
          return AnimatedBuilder(
            animation: _pageController,
            builder: (context, child) {
              double scaleFactor = 0.8;
              double opacity = 0.6;

              if (_pageController.position.haveDimensions) {
                final pageOffset = (_pageController.page ?? 1) - index;
                double factor = (1 - pageOffset.abs()).clamp(0.0, 1.0);

                // Smooth scaling using linear interpolation
                scaleFactor = lerpDouble(0.85, 1.0, factor)!;
                opacity = lerpDouble(0.5, 1.0, factor)!;
              }

              return Transform.scale(
                scale: scaleFactor,
                child: Opacity(
                  opacity: opacity,
                  child: _BinCard(
                    bin: bins[index],
                    isSelected: index == _selectedBinIndex,
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildBinDetails() {
    final bin = bins[_selectedBinIndex];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: Text(
            bin['type'],
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
          ),
        ),
        const SizedBox(height: 15),
        Container(
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(
            color: Colors.grey[850],
            borderRadius: BorderRadius.circular(15),
          ),
          child: Column(
            children: [
              _DetailRow(
                icon: Icons.analytics,
                title: "Fill Level",
                value: "${bin['fill']}%",
              ),
              const Divider(color: Colors.grey, height: 30),
              _DetailRow(
                icon: Icons.history,
                title: "Last Collected",
                value: bin['lastCollected'],
              ),
              const Divider(color: Colors.grey, height: 30),
              _DetailRow(
                icon: Icons.next_plan,
                title: "Next Fill Estimate",
                value: bin['nextFill'],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildHealthStatus() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: Text(
            "System Health",
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.green[400],
            ),
          ),
        ),
        const SizedBox(height: 15),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.green[900]!.withOpacity(0.2),
            borderRadius: BorderRadius.circular(15),
            border: Border.all(color: Colors.green[800]!),
          ),
          child: const Row(
            children: [
              Icon(Icons.check_circle, color: Colors.green, size: 40),
              SizedBox(width: 20),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Operational",
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.green,
                    ),
                  ),
                  Text(
                    "All systems normal",
                    style: TextStyle(color: Colors.green, fontSize: 14),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _BinCard extends StatelessWidget {
  final Map<String, dynamic> bin;
  final bool isSelected;

  const _BinCard({required this.bin, required this.isSelected});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 20),
      decoration: BoxDecoration(
        color: Colors.grey[850],
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(bin['icon'], size: 40, color: bin['color']),
          const SizedBox(height: 15),
          _buildFillIndicator(),
          const SizedBox(height: 10),
          Text(
            bin['type'],
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: bin['color'],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFillIndicator() {
    return Stack(
      alignment: Alignment.center,
      children: [
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            color: Colors.grey[800],
            shape: BoxShape.circle,
          ),
        ),
        SizedBox(
          width: 60,
          height: 60,
          child: CircularProgressIndicator(
            value: bin['fill'] / 100,
            strokeWidth: 8,
            backgroundColor: Colors.grey[700],
            color: bin['color'],
          ),
        ),
        Text(
          "${bin['fill']}%",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: bin['color'],
          ),
        ),
      ],
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;

  const _DetailRow({
    required this.icon,
    required this.title,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(icon, color: Colors.grey[400], size: 28),
          const SizedBox(width: 15),
          Expanded(
            child: Text(
              title,
              style: TextStyle(fontSize: 16, color: Colors.grey[400]),
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}
