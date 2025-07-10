import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';

class VerificationScreen extends StatefulWidget {
  final String userId;
  final String email;
  final String token; // The JWT token you need to pass

  const VerificationScreen({
    Key? key,
    required this.userId,
    required this.email,
    required this.token,
  }) : super(key: key);

  @override
  _VerificationScreenState createState() => _VerificationScreenState();
}

class _VerificationScreenState extends State<VerificationScreen> {
  final TextEditingController _codeController = TextEditingController();
  bool _isLoading = false;

  Future<void> _verifyCode() async {
    final code = _codeController.text.trim();
    if (code.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please enter the verification code')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    final url = Uri.parse(
      'http://10.30.9.93:8080/api/email-verification/verify',
    );

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${widget.token}', // <-- Bearer token here
        },
        // body: jsonEncode({'userId': widget.userId, 'code': code}),
        body: jsonEncode({'pin': code}),
      );

      setState(() {
        _isLoading = false;
      });

      if (response.statusCode == 200) {
        // Verification successful
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Verification successful!')));

        // Navigate to login or home page
        Navigator.pushNamedAndRemoveUntil(context, '/layout', (route) => false);
      } else {
        final responseData = jsonDecode(response.body);
        final errorMessage = responseData['message'] ?? 'Verification failed';
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(errorMessage)));
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Email Verification')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text('Enter the verification code sent to ${widget.email}'),
            const SizedBox(height: 16),
            TextField(
              controller: _codeController,
              decoration: InputDecoration(
                labelText: 'Verification Code',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            _isLoading
                ? CircularProgressIndicator()
                : ElevatedButton(onPressed: _verifyCode, child: Text('Verify')),
          ],
        ),
      ),
    );
  }
}
