import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/notification_model.dart';
import '../models/api_response_model.dart';
import 'api_service.dart';

class NotificationService {
  static Future<ApiResponse<List<NotificationModel>>> getNotifications() async {
    try {
      final response = await ApiService.get('/notifications');

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        final apiResponse = ApiResponse.fromJson(
          jsonResponse,
          (data) =>
              (data as List)
                  .map((item) => NotificationModel.fromJson(item))
                  .toList(),
        );
        return apiResponse;
      } else {
        throw Exception('Failed to load notifications');
      }
    } catch (e) {
      throw Exception('Error fetching notifications: $e');
    }
  }

  static Future<ApiResponse<PaginatedResponse<NotificationModel>>>
  getFilteredNotifications({
    bool? isRead,
    String? notificationType,
    String? priority,
    int page = 0,
    int size = 20,
  }) async {
    try {
      final queryParams = <String, String>{
        'page': page.toString(),
        'size': size.toString(),
      };

      if (isRead != null) queryParams['isRead'] = isRead.toString();
      if (notificationType != null)
        queryParams['notificationType'] = notificationType;
      if (priority != null) queryParams['priority'] = priority;

      final uri = Uri.parse(
        '${ApiService.baseUrl}/notifications/filtered',
      ).replace(queryParameters: queryParams);

      final response = await ApiService.get(
        '/notifications/filtered?${uri.query}',
      );

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        final apiResponse = ApiResponse.fromJson(
          jsonResponse,
          (data) => PaginatedResponse.fromJson(
            data,
            (item) => NotificationModel.fromJson(item),
          ),
        );
        return apiResponse;
      } else {
        throw Exception('Failed to load filtered notifications');
      }
    } catch (e) {
      throw Exception('Error fetching filtered notifications: $e');
    }
  }

  static Future<ApiResponse<int>> getUnreadCount() async {
    try {
      final response = await ApiService.get('/notifications/unread-count');

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        return ApiResponse.fromJson(jsonResponse, (data) => data as int);
      } else {
        throw Exception('Failed to load unread count');
      }
    } catch (e) {
      throw Exception('Error fetching unread count: $e');
    }
  }

  static Future<ApiResponse<void>> markAsRead(String notificationId) async {
    try {
      final response = await ApiService.put(
        '/notifications/$notificationId/read',
      );

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        return ApiResponse.fromJson(jsonResponse, null);
      } else {
        throw Exception('Failed to mark notification as read');
      }
    } catch (e) {
      throw Exception('Error marking notification as read: $e');
    }
  }

  static Future<ApiResponse<void>> markAllAsRead() async {
    try {
      final response = await ApiService.put('/notifications/mark-all-read');

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        return ApiResponse.fromJson(jsonResponse, null);
      } else {
        throw Exception('Failed to mark all notifications as read');
      }
    } catch (e) {
      throw Exception('Error marking all notifications as read: $e');
    }
  }

  static Future<ApiResponse<void>> deleteNotifications(
    List<String> notificationIds,
  ) async {
    try {
      final response = await ApiService.delete(
        '/notifications/bulk-delete',
        notificationIds,
      );

      if (response.statusCode == 200) {
        final jsonResponse = json.decode(response.body);
        return ApiResponse.fromJson(jsonResponse, null);
      } else {
        throw Exception('Failed to delete notifications');
      }
    } catch (e) {
      throw Exception('Error deleting notifications: $e');
    }
  }
}
