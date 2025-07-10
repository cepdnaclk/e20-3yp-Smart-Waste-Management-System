import 'package:flutter/material.dart';
import 'package:bin_owner_mobile_app/theme/colors.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notificationsEnabled = true;
  bool _darkModeEnabled = true;
  String _selectedLanguage = 'English';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Settings', style: TextStyle(color: Colors.white)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Profile Section
          _buildSectionHeader('Profile'),
          _buildListTile(
            title: 'Edit Profile',
            icon: Icons.person,
            onTap: _editProfile,
          ),
          _buildListTile(
            title: 'Change Password',
            icon: Icons.lock,
            onTap: _changePassword,
          ),
          const Divider(height: 40),
          // Preferences Section
          _buildSectionHeader('Preferences'),
          SwitchListTile(
            title: const Text('Dark Mode'),
            value: _darkModeEnabled,
            onChanged: (value) => setState(() => _darkModeEnabled = value),
            secondary: Icon(Icons.dark_mode, color: Colors.grey[400]),
          ),
          SwitchListTile(
            title: const Text('Notifications'),
            value: _notificationsEnabled,
            onChanged: (value) => setState(() => _notificationsEnabled = value),
            secondary: Icon(Icons.notifications, color: Colors.grey[400]),
          ),
          // _buildListTile(
          //   title: 'Language',
          //   subtitle: _selectedLanguage,
          //   icon: Icons.language,
          //   onTap: _changeLanguage,
          // ),
          const Divider(height: 40),
          // Support Section
          _buildSectionHeader('Support'),
          _buildListTile(
            title: 'Help Center',
            icon: Icons.help,
            onTap: _openHelpCenter,
          ),
          _buildListTile(
            title: 'Contact Support',
            icon: Icons.support_agent,
            onTap: _contactSupport,
          ),
          _buildListTile(
            title: 'Terms & Privacy',
            icon: Icons.privacy_tip,
            onTap: _showTerms,
          ),
          const Divider(height: 40),
          // Account Section
          _buildSectionHeader('Account'),
          _buildListTile(
            title: 'Logout',
            icon: Icons.logout,
            onTap: _confirmLogout,
            color: Colors.red,
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: Colors.grey[400],
        ),
      ),
    );
  }

  Widget _buildListTile({
    required String title,
    String? subtitle,
    required IconData icon,
    required VoidCallback onTap,
    Color? color,
  }) {
    return ListTile(
      leading: Icon(icon, color: color ?? Colors.grey[400]),
      title: Text(title, style: TextStyle(color: color ?? Colors.white)),
      subtitle: subtitle != null ? Text(subtitle) : null,
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }

  void _editProfile() {
    _showComingSoon();
  }

  void _changePassword() {
    _showComingSoon();
  }

  void _changeLanguage() {
    _showComingSoon();
  }

  void _openHelpCenter() {
    _showComingSoon();
  }

  void _contactSupport() {
    _showComingSoon();
  }

  void _showTerms() {
    _showComingSoon();
  }

  void _confirmLogout() {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Logout'),
            content: const Text('Are you sure you want to logout?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  // TODO: Implement logout logic
                  Navigator.pushReplacementNamed(context, '/login');
                },
                child: const Text(
                  'Logout',
                  style: TextStyle(color: Colors.red),
                ),
              ),
            ],
          ),
    );
  }

  void _showComingSoon() {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Feature coming soon!')));
  }
}
