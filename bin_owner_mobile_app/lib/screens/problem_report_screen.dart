import 'package:flutter/material.dart';
import 'package:bin_owner_mobile_app/theme/colors.dart';

class ProblemReportScreen extends StatefulWidget {
  const ProblemReportScreen({super.key});

  @override
  State<ProblemReportScreen> createState() => _ProblemReportScreenState();
}

class _ProblemReportScreenState extends State<ProblemReportScreen> {
  final Map<String, bool> _issues = {
    'Sorting malfunction': false,
    'GPS not working': false,
    'Bin level monitoring not working': false,
  };

  final TextEditingController _messageController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  void _handleSubmit() async {
    final selectedIssues =
        _issues.entries
            .where((entry) => entry.value)
            .map((entry) => entry.key)
            .toList();

    final message = _messageController.text.trim();

    if (selectedIssues.isEmpty && message.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select an issue or write a message.'),
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    // TODO: Send selectedIssues and message to backend
    await Future.delayed(const Duration(seconds: 2)); // simulate delay

    setState(() => _isSubmitting = false);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Report submitted successfully!')),
    );

    // Clear form
    setState(() {
      _issues.updateAll((key, value) => false);
      _messageController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const Text(
              'Report an issue with your bin:',
              style: TextStyle(fontSize: 18, color: Colors.white70),
            ),
            const SizedBox(height: 20),
            ..._issues.entries.map((entry) {
              return CheckboxListTile(
                title: Text(
                  entry.key,
                  style: const TextStyle(color: Colors.white),
                ),
                value: entry.value,
                onChanged: (bool? value) {
                  setState(() {
                    _issues[entry.key] = value ?? false;
                  });
                },
                activeColor: Colors.green,
                checkColor: Colors.black,
                controlAffinity: ListTileControlAffinity.leading,
              );
            }).toList(),
            const SizedBox(height: 10),
            TextField(
              controller: _messageController,
              maxLines: 3,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Describe any other issue...',
                hintStyle: const TextStyle(color: Colors.white60),
                filled: true,
                fillColor: Colors.grey[850],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _handleSubmit,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: Colors.green,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child:
                    _isSubmitting
                        ? const CircularProgressIndicator(color: Colors.black)
                        : const Text(
                          'Submit Report',
                          style: TextStyle(fontSize: 16),
                        ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
