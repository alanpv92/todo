import 'package:application/exceptions/network.dart';
import 'package:dartz/dartz.dart';

typedef ApplicationNetworkResponse
    = Either<ApplicationNetworkException, Map<String, dynamic>>;

abstract class ApplicationNetworkInterface {
  Future<ApplicationNetworkResponse> get(
      {required String path, Map<String, dynamic> data = const {}});
  Future<ApplicationNetworkResponse> post(
      {required String path, Map<String, dynamic> data = const {}});
  Future<ApplicationNetworkResponse> update(
      {required String path, Map<String, dynamic> data = const {}});
  Future<ApplicationNetworkResponse> delete(
      {required String path, Map<String, dynamic> data = const {}});
}
