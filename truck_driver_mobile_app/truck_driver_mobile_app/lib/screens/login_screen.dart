import 'package:flutter/material.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Green Pulse"),
      ),
      body: Container(
        padding: const EdgeInsets.all(20),
        height: double.infinity,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Image.asset(
              "android/assets/images/logo_v1_white.png",
            ),
            const Text(
              "Log In",
              style: TextStyle(fontSize: 45, fontWeight: FontWeight.bold),
            ),
            const SizedBox(
              height: 30,
            ),
            Form(
                child: Column(
              children: [
                TextFormField(
                  decoration: const InputDecoration(
                      labelText: "Vehicle ID",
                      labelStyle: TextStyle(fontSize: 22)),
                ),
                TextFormField(
                  decoration: const InputDecoration(
                      labelText: "Password",
                      labelStyle: TextStyle(fontSize: 22)),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    MaterialButton(
                      onPressed: () {},
                      child: const Text("Forgot Password?"),
                    ),
                  ],
                ),
                const SizedBox(
                  height: 40,
                ),
                MaterialButton(
                  onPressed: () {},
                  color: Colors.lightGreen,
                  textColor: Colors.white,
                  padding:
                      const EdgeInsets.symmetric(vertical: 10, horizontal: 100),
                  shape: const RoundedRectangleBorder(
                      borderRadius: BorderRadius.all(Radius.circular(15))),
                  child: const Text(
                    "Log In",
                    style: TextStyle(fontSize: 28),
                  ),
                )
              ],
            ))
          ],
        ),
      ),
    );
  }
}
