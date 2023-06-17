// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserAccount _$UserAccountFromJson(Map<String, dynamic> json) => UserAccount(
      id: json['id'] as int,
      name: json['name'] as String,
      email: json['email'] as String,
      bio: json['bio'] as String,
      pfp: json['pfp'] as String,
    );

Map<String, dynamic> _$UserAccountToJson(UserAccount instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'bio': instance.bio,
      'pfp': instance.pfp,
    };

Message _$MessageFromJson(Map<String, dynamic> json) => Message(
      id: json['id'] as int,
      user: UserAccount.fromJson(json['user'] as Map<String, dynamic>),
      message: json['message'] as String,
      time: DateTime.parse(json['time'] as String),
    );

Map<String, dynamic> _$MessageToJson(Message instance) => <String, dynamic>{
      'id': instance.id,
      'user': instance.user,
      'message': instance.message,
      'time': instance.time.toIso8601String(),
    };

ChatroomSettings _$ChatroomSettingsFromJson(Map<String, dynamic> json) =>
    ChatroomSettings(
      title: json['title'] as String,
      thumbnail: json['thumbnail'] as String,
      description: json['description'] as String,
      isToxicityFiltered: json['isToxicityFiltered'] as bool,
      isPublic: json['isPublic'] as bool,
    );

Map<String, dynamic> _$ChatroomSettingsToJson(ChatroomSettings instance) =>
    <String, dynamic>{
      'title': instance.title,
      'thumbnail': instance.thumbnail,
      'description': instance.description,
      'isToxicityFiltered': instance.isToxicityFiltered,
      'isPublic': instance.isPublic,
    };

ChatroomInfo _$ChatroomInfoFromJson(Map<String, dynamic> json) => ChatroomInfo(
      id: json['id'] as int,
      owner: UserAccount.fromJson(json['owner'] as Map<String, dynamic>),
      settings:
          ChatroomSettings.fromJson(json['settings'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$ChatroomInfoToJson(ChatroomInfo instance) =>
    <String, dynamic>{
      'id': instance.id,
      'owner': instance.owner,
      'settings': instance.settings,
    };

Chatroom _$ChatroomFromJson(Map<String, dynamic> json) => Chatroom(
      id: json['id'] as int,
      owner: UserAccount.fromJson(json['owner'] as Map<String, dynamic>),
      members: (json['members'] as List<dynamic>)
          .map((e) => UserAccount.fromJson(e as Map<String, dynamic>))
          .toList(),
      invite: json['invite'] as String,
      settings:
          ChatroomSettings.fromJson(json['settings'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$ChatroomToJson(Chatroom instance) => <String, dynamic>{
      'id': instance.id,
      'owner': instance.owner,
      'members': instance.members,
      'settings': instance.settings,
      'invite': instance.invite,
    };
