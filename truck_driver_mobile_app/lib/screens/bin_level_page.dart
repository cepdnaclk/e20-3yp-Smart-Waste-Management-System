import 'package:flutter/material.dart';

class BinLevelPage extends StatefulWidget {
  const BinLevelPage({super.key});

  @override
  State<BinLevelPage> createState() => _BinLevelPageState();
}

class _BinLevelPageState extends State<BinLevelPage> {
  // Bin levels
  double plasticLevel = 92;
  double glassLevel = 85;
  double paperLevel = 80;

  // Collected status for bins
  bool isPlasticCollected = false;
  bool isGlassCollected = false;
  bool isPaperCollected = false;

  // Function to mark as collected
  void markAsCollected(String binType) {
    setState(() {
      if (binType == 'plastic') {
        isPlasticCollected = true;
        plasticLevel = 0;
      } else if (binType == 'glass') {
        isGlassCollected = true;
        glassLevel = 0;
      } else if (binType == 'paper') {
        isPaperCollected = true;
        paperLevel = 0;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Bin Levels"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Plastic Bin
            _buildBinLevelWidget(
              "Plastic",
              plasticLevel,
              isPlasticCollected,
              () => markAsCollected('plastic'),
            ),
            const SizedBox(height: 20),

            // Glass Bin
            _buildBinLevelWidget(
              "Glass",
              glassLevel,
              isGlassCollected,
              () => markAsCollected('glass'),
            ),
            const SizedBox(height: 20),

            // Paper Bin
            _buildBinLevelWidget(
              "Paper",
              paperLevel,
              isPaperCollected,
              () => markAsCollected('paper'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBinLevelWidget(String binName, double level, bool isCollected,
      VoidCallback onMarkCollected) {
    return Card(
      elevation: 5,
      color: Colors.blueGrey[50],
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              binName,
              style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.black),
            ),
            const SizedBox(height: 10),
            LinearProgressIndicator(
              value: level / 100,
              minHeight: 8,
              color: level > 90 ? Colors.green : Colors.orange,
              backgroundColor: Colors.grey[300],
            ),
            const SizedBox(height: 10),
            Text(
              "Fill Level: ${level.toStringAsFixed(0)}%",
              style: const TextStyle(fontSize: 16, color: Colors.black),
            ),
            const SizedBox(height: 10),
            Visibility(
              visible: level > 90 && !isCollected,
              child: ElevatedButton(
                onPressed: onMarkCollected,
                style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                        vertical: 15, horizontal: 40),
                    backgroundColor: Colors.blue,
                    elevation: 5),
                child: const Text(
                  "Mark as Collected",
                  style: TextStyle(color: Colors.white, fontSize: 18),
                ),
              ),
            ),
            if (isCollected)
              const Padding(
                padding: EdgeInsets.only(top: 10),
                child: Text(
                  "Marked as Collected",
                  style: TextStyle(
                      color: Colors.green, fontWeight: FontWeight.bold),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
