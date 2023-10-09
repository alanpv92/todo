class ApplicationNetworkException implements Exception {
  final int statusCode;
  final String? message;
  ApplicationNetworkException(
      {required this.message, required this.statusCode});
}
