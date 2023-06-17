import 'dart:math';
import 'package:json_annotation/json_annotation.dart';
import 'constants.dart';

part 'model.g.dart';


@JsonSerializable()
class UserAccount {
  int id;
  String name;
  String email;
  String bio;
  String pfp;
  UserAccount({
    required this.id,
    required this.name,
    required this.email,
    required this.bio,
    required this.pfp
  });
  get pfpUrl {
    return STORAGE + pfp;
  }
  factory UserAccount.fromJson(Map<String, dynamic> json) =>
      _$UserAccountFromJson(json);
  Map<String, dynamic> toJson() => _$UserAccountToJson(this);
}

@JsonSerializable()
class Message {
  int id;
  UserAccount user;
  String message;
  DateTime time;
  Message({
    required this.id,
    required this.user,
    required this.message,
    required this.time
  });
  get waktu {
    return time.toLocal();
  }
  factory Message.fromJson(Map<String, dynamic> json) =>
      _$MessageFromJson(json);
  Map<String, dynamic> toJson() => _$MessageToJson(this);
}

class EphemeralMessage extends Message {
  static final Random _rng = Random();
  EphemeralMessage({
    required UserAccount user,
    required String message,
  }): super(id: _rng.nextInt(1 << 32), user: user, message: message, time: DateTime.now());
}

@JsonSerializable()
class ChatroomSettings {
  String title;
  String thumbnail;
  String description;
  bool isToxicityFiltered;
  bool isPublic;
  ChatroomSettings({
    required this.title,
    required this.thumbnail,
    required this.description,
    required this.isToxicityFiltered,
    required this.isPublic,
  });
  get thumbnailUrl {
    return STORAGE + thumbnail;
  }
  factory ChatroomSettings.fromJson(Map<String, dynamic> json) =>
      _$ChatroomSettingsFromJson(json);
  Map<String, dynamic> toJson() => _$ChatroomSettingsToJson(this);
}

@JsonSerializable()
class ChatroomInfo {
  // Untuk ditampilkan di halaman /home
  int id;
  UserAccount owner;
  ChatroomSettings settings;
  ChatroomInfo({
    required this.id,
    required this.owner,
    required this.settings,
  });
  factory ChatroomInfo.fromJson(Map<String, dynamic> json) =>
      _$ChatroomInfoFromJson(json);
  Map<String, dynamic> toJson() => _$ChatroomInfoToJson(this);
}

@JsonSerializable()
class Chatroom {
  int id;
  UserAccount owner;
  List<UserAccount> members;
  ChatroomSettings settings;
  String invite;
  Chatroom({
    required this.id,
    required this.owner,
    required this.members,
    required this.invite,
    required this.settings,
  });
  factory Chatroom.fromJson(Map<String, dynamic> json) =>
      _$ChatroomFromJson(json);
  Map<String, dynamic> toJson() => _$ChatroomToJson(this);
}