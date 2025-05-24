import 'package:flutter/material.dart';

class LabeledTextField extends StatelessWidget {
  final String labelText;
  final bool isPassword;
  final TextEditingController controller;

  const LabeledTextField({
    required this.labelText,
    this.isPassword = false,
    required this.controller,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      decoration: InputDecoration(
          labelText: labelText, labelStyle: const TextStyle(fontSize: 22)),
      obscureText: isPassword,
      controller: controller,
    );
  }
}
