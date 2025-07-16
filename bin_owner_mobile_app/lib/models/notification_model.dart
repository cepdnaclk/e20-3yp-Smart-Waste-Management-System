// lib/models/notification_model.dart
class NotificationModel {
  final String id;
  final String type;
  final String title;
  final String message;
  final bool isRead;
  final String priority;
  final String recipientType;
  final DateTime createdAt;
  final DateTime? readAt;
  final String? binId;
  final String? maintenanceRequestId;
  final Map<String, dynamic>? metadata;

  NotificationModel({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    required this.isRead,
    required this.priority,
    required this.recipientType,
    required this.createdAt,
    this.readAt,
    this.binId,
    this.maintenanceRequestId,
    this.metadata,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'],
      type: json['type'],
      title: json['title'],
      message: json['message'],
      isRead: json['isRead'],
      priority: json['priority'],
      recipientType: json['recipientType'],
      createdAt: DateTime.parse(json['createdAt']),
      readAt: json['readAt'] != null ? DateTime.parse(json['readAt']) : null,
      binId: json['binId'],
      maintenanceRequestId: json['maintenanceRequestId'],
      metadata: json['metadata'],
    );
  }

  NotificationModel copyWith({bool? isRead, DateTime? readAt}) {
    return NotificationModel(
      id: id,
      type: type,
      title: title,
      message: message,
      isRead: isRead ?? this.isRead,
      priority: priority,
      recipientType: recipientType,
      createdAt: createdAt,
      readAt: readAt ?? this.readAt,
      binId: binId,
      maintenanceRequestId: maintenanceRequestId,
      metadata: metadata,
    );
  }
}

enum NotificationType {
  fillLevelHigh,
  collectionDate,
  binCollected,
  maintenanceRequest,
  maintenanceCompleted,
  routeUpdated,
}

enum Priority { low, medium, high, urgent }
