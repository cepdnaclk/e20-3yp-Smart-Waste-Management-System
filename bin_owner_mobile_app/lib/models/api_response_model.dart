class ApiResponse<T> {
  final bool success;
  final String message;
  final T? data;
  final String timestamp;

  ApiResponse({
    required this.success,
    required this.message,
    this.data,
    required this.timestamp,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? fromJsonT,
  ) {
    return ApiResponse<T>(
      success: json['success'],
      message: json['message'],
      data:
          json['data'] != null && fromJsonT != null
              ? fromJsonT(json['data'])
              : json['data'],
      timestamp: json['timestamp'],
    );
  }
}

class PaginatedResponse<T> {
  final List<T> content;
  final int totalElements;
  final int totalPages;
  final int size;
  final int number;
  final bool first;
  final bool last;
  final bool empty;

  PaginatedResponse({
    required this.content,
    required this.totalElements,
    required this.totalPages,
    required this.size,
    required this.number,
    required this.first,
    required this.last,
    required this.empty,
  });

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic) fromJsonT,
  ) {
    return PaginatedResponse<T>(
      content:
          (json['content'] as List).map((item) => fromJsonT(item)).toList(),
      totalElements: json['totalElements'],
      totalPages: json['totalPages'],
      size: json['size'],
      number: json['number'],
      first: json['first'],
      last: json['last'],
      empty: json['empty'],
    );
  }
}
