// lib/widgets/notification_card.dart
import 'package:flutter/material.dart';
import '../models/notification_model.dart';
import '../theme/colors.dart';

class NotificationCard extends StatelessWidget {
  final NotificationModel notification;
  final VoidCallback onTap;
  final bool isHighlighted; // ✅ Add this parameter

  const NotificationCard({
    Key? key,
    required this.notification,
    required this.onTap,
    this.isHighlighted = false, // ✅ Add this parameter with default value
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      color: _getCardColor(),
      elevation:
          isHighlighted ? 8 : 2, // ✅ Enhanced elevation for highlighted cards
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          border:
              isHighlighted // ✅ Add highlight border
                  ? Border.all(color: AppColors.primary, width: 2)
                  : null,
        ),
        child: ListTile(
          leading: Icon(
            _getNotificationIcon(notification.type),
            color: _getNotificationColor(notification.type),
            size: 24,
          ),
          title: Text(
            notification.title,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: notification.isRead ? Colors.grey[400] : Colors.white,
            ),
          ),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                notification.message,
                style: TextStyle(
                  color:
                      notification.isRead ? Colors.grey[500] : Colors.grey[300],
                ),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _formatTime(notification.createdAt),
                    style: TextStyle(
                      fontSize: 12,
                      color:
                          notification.isRead
                              ? Colors.grey[600]
                              : Colors.grey[400],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: _getPriorityColor(notification.priority),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      notification.priority,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          trailing:
              !notification.isRead
                  ? Container(
                    width: 10,
                    height: 10,
                    decoration: const BoxDecoration(
                      color: Colors.blue,
                      shape: BoxShape.circle,
                    ),
                  )
                  : null,
          onTap: onTap,
        ),
      ),
    );
  }

  Color _getCardColor() {
    if (isHighlighted) {
      return AppColors.primary.withOpacity(
        0.1,
      ); // ✅ Special color for highlighted cards
    }
    return notification.isRead ? Colors.grey[850]! : Colors.blueGrey[900]!;
  }

  IconData _getNotificationIcon(String type) {
    switch (type) {
      case 'FILL_LEVEL_HIGH':
        return Icons.delete;
      case 'MAINTENANCE_REQUEST':
        return Icons.build;
      case 'MAINTENANCE_COMPLETED':
        return Icons.done_all;
      case 'COLLECTION_DATE':
        return Icons.schedule;
      case 'BIN_COLLECTED':
        return Icons.check_circle;
      case 'ROUTE_ASSIGNED':
        return Icons.route;
      default:
        return Icons.info;
    }
  }

  Color _getNotificationColor(String type) {
    switch (type) {
      case 'FILL_LEVEL_HIGH':
        return Colors.orange;
      case 'MAINTENANCE_REQUEST':
        return Colors.blue;
      case 'MAINTENANCE_COMPLETED':
        return Colors.teal;
      case 'COLLECTION_DATE':
        return Colors.green;
      case 'BIN_COLLECTED':
        return Colors.green;
      case 'ROUTE_ASSIGNED':
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  Color _getPriorityColor(String priority) {
    switch (priority) {
      case 'URGENT':
        return Colors.red;
      case 'HIGH':
        return Colors.orange;
      case 'MEDIUM':
        return Colors.yellow[700]!;
      case 'LOW':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  String _formatTime(DateTime time) {
    final now = DateTime.now();
    final difference = now.difference(time);

    if (difference.inMinutes < 1) return 'Just now';
    if (difference.inHours < 1) return '${difference.inMinutes}m ago';
    if (difference.inDays < 1) return '${difference.inHours}h ago';
    if (difference.inDays < 7) return '${difference.inDays}d ago';
    return '${time.day}/${time.month}/${time.year}';
  }
}
