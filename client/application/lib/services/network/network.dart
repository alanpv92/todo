import 'dart:developer';

import 'package:application/exceptions/network.dart';
import 'package:application/interfaces/network.dart';
import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';

class ApplicationNetworkService implements ApplicationNetworkInterface {
  final Dio dio;
  ApplicationNetworkService({required this.dio});

  @override
  Future<ApplicationNetworkResponse> delete(
      {required String path, Map<String, dynamic> data = const {}}) {
    // TODO: implement delete
    throw UnimplementedError();
  }

  @override
  Future<ApplicationNetworkResponse> get(
      {required String path, Map<String, dynamic> data = const {}}) async {
    try {
      final responseData = await dio.get(path, data: data);
    
      return right({});
    } catch (e) {
      return left(ApplicationNetworkException(message: 'aaa', statusCode: 401));
    }
  }

  @override
  Future<ApplicationNetworkResponse> post(
      {required String path, Map<String, dynamic> data = const {}}) async {
    try {
      final responseData = await dio.post(path, data: data);
      log(responseData.data);
      return right({});
    } catch (e) {
      return left(ApplicationNetworkException(message: 'aaa', statusCode: 401));
    }
  }

  @override
  Future<ApplicationNetworkResponse> update(
      {required String path, Map<String, dynamic> data = const {}}) {
    // TODO: implement update
    throw UnimplementedError();
  }
}
