// lib/screens/notification_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/notification_model.dart';
import '../services/notification_service.dart';
import '../services/websocket_service.dart';
import '../widgets/notification_card.dart';
import '../widgets/loading_widget.dart';
import '../theme/colors.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  List<NotificationModel> _notifications = [];
  bool _isLoading = true;
  String _error = '';
  String _selectedFilter = 'all';
  final WebSocketService _webSocketService = WebSocketService();

  @override
  void initState() {
    super.initState();
    _loadNotifications();
    _setupWebSocket();
  }

  @override
  void dispose() {
    _webSocketService.disconnect();
    super.dispose();
  }

  Future<void> _loadNotifications() async {
    try {
      setState(() {
        _isLoading = true;
        _error = '';
      });

      final response = await NotificationService.getNotifications();

      if (response.success && response.data != null) {
        setState(() {
          _notifications = response.data!;
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = response.message;
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Failed to load notifications: $e';
        _isLoading = false;
      });
    }
  }

  void _setupWebSocket() {
    _webSocketService.setOnNotificationReceived((notification) {
      setState(() {
        _notifications.insert(0, notification);
      });

      // Show local notification
      _showLocalNotification(notification);
    });
    _webSocketService.connect();
  }

  void _showLocalNotification(NotificationModel notification) {
    // Implement local notification display
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${notification.title}: ${notification.message}'),
        action: SnackBarAction(
          label: 'View',
          onPressed: () => _markAsRead(notification.id),
        ),
      ),
    );
  }

  Future<void> _markAsRead(String notificationId) async {
    try {
      await NotificationService.markAsRead(notificationId);

      setState(() {
        final index = _notifications.indexWhere((n) => n.id == notificationId);
        if (index != -1) {
          _notifications[index] = _notifications[index].copyWith(
            isRead: true,
            readAt: DateTime.now(),
          );
        }
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error marking notification as read: $e')),
      );
    }
  }

  Future<void> _markAllAsRead() async {
    try {
      await NotificationService.markAllAsRead();

      setState(() {
        _notifications =
            _notifications
                .map((n) => n.copyWith(isRead: true, readAt: DateTime.now()))
                .toList();
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('All notifications marked as read')),
      );
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error marking all as read: $e')));
    }
  }

  Future<void> _deleteNotification(String notificationId) async {
    try {
      await NotificationService.deleteNotifications([notificationId]);

      setState(() {
        _notifications.removeWhere((n) => n.id == notificationId);
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error deleting notification: $e')),
      );
    }
  }

  List<NotificationModel> get _filteredNotifications {
    switch (_selectedFilter) {
      case 'unread':
        return _notifications.where((n) => !n.isRead).toList();
      case 'read':
        return _notifications.where((n) => n.isRead).toList();
      case 'high':
        return _notifications
            .where((n) => n.priority == 'HIGH' || n.priority == 'URGENT')
            .toList();
      default:
        return _notifications;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Notifications'),
        backgroundColor: AppColors.primary,
        actions: [
          PopupMenuButton<String>(
            onSelected: (value) {
              switch (value) {
                case 'mark_all_read':
                  _markAllAsRead();
                  break;
                case 'refresh':
                  _loadNotifications();
                  break;
              }
            },
            itemBuilder:
                (context) => [
                  const PopupMenuItem(
                    value: 'mark_all_read',
                    child: Text('Mark All Read'),
                  ),
                  const PopupMenuItem(value: 'refresh', child: Text('Refresh')),
                ],
          ),
        ],
      ),
      body: Column(
        children: [
          _buildFilterBar(),
          Expanded(child: _buildNotificationList()),
        ],
      ),
    );
  }

  Widget _buildFilterBar() {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          _buildFilterChip('all', 'All'),
          const SizedBox(width: 8),
          _buildFilterChip('unread', 'Unread'),
          const SizedBox(width: 8),
          _buildFilterChip('read', 'Read'),
          const SizedBox(width: 8),
          _buildFilterChip('high', 'High Priority'),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String value, String label) {
    final isSelected = _selectedFilter == value;
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        setState(() {
          _selectedFilter = value;
        });
      },
      selectedColor: AppColors.primary.withOpacity(0.2),
      labelStyle: TextStyle(color: isSelected ? AppColors.primary : null),
    );
  }

  Widget _buildNotificationList() {
    if (_isLoading) {
      return const LoadingWidget();
    }

    if (_error.isNotEmpty) {
      return _buildErrorState();
    }

    final filteredNotifications = _filteredNotifications;

    if (filteredNotifications.isEmpty) {
      return _buildEmptyState();
    }

    return RefreshIndicator(
      onRefresh: _loadNotifications,
      child: ListView.builder(
        itemCount: filteredNotifications.length,
        itemBuilder: (context, index) {
          final notification = filteredNotifications[index];
          return Dismissible(
            key: Key(notification.id),
            direction: DismissDirection.endToStart,
            background: Container(
              alignment: Alignment.centerRight,
              padding: const EdgeInsets.only(right: 20),
              color: Colors.red,
              child: const Icon(Icons.delete, color: Colors.white),
            ),
            onDismissed: (direction) => _deleteNotification(notification.id),
            child: NotificationCard(
              notification: notification,
              onTap: () => _markAsRead(notification.id),
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.notifications_off, size: 60, color: Colors.grey[600]),
          const SizedBox(height: 20),
          const Text(
            'No notifications found',
            style: TextStyle(fontSize: 18, color: Colors.grey),
          ),
          const SizedBox(height: 10),
          ElevatedButton(
            onPressed: _loadNotifications,
            child: const Text('Refresh'),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 60, color: Colors.red[400]),
          const SizedBox(height: 20),
          Text(
            _error,
            style: const TextStyle(fontSize: 16, color: Colors.red),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: _loadNotifications,
            child: const Text('Retry'),
          ),
        ],
      ),
    );
  }
}
