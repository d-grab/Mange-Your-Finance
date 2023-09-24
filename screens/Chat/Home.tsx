import React, { useState } from "react";
import axios from "axios";
import {
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Text, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
  GiftedChat,
  InputToolbar,
  Bubble,
  Message,
} from "react-native-gifted-chat";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const width = Dimensions.get("window").width;

const CHAT_GPT_API_KEY = "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";

export default function ChatHome(props: any) {
  const [messages, setMessages] = useState<any>([]);
  const avatar = useSelector((state: RootState) => state.avatar.path);
  const colorScheme = useColorScheme();

  const [replyReady, setReplyReady] = useState<boolean | null>(null);

  const sendMessage = async (message: string) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          messages: [
            {
              role: "user",
              content: `Reply this according to finance, budget, savings and other similar topics (${message})`,
            },
          ],
          model: "gpt-3.5-turbo",
        },
        {
          headers: {
            Authorization: `Bearer ${CHAT_GPT_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (err) {
      console.log(err, "api call error");
    }
  };

  const onSend = async (newMessages: any = []) => {
    setReplyReady(false);
    setMessages((prev: any) => GiftedChat.append(prev, newMessages));

    const response = await sendMessage(newMessages[0].text);
    const chatMessage = [
      {
        _id: Math.random().toString(36).substring(7),
        text: response,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "GPT-3.5-turbo",
          avatar: require("../../assets/icons/bot.png"),
        },
      },
    ];

    setMessages((prev: any) => GiftedChat.append(prev, chatMessage));
    setReplyReady(true);
  };

  const user = {
    _id: 1,
    name: "Developer",
    avatar,
  };

  const renderInputToolbar = (props: any) => {
    return <InputToolbar {...props} containerStyle={styles.input} />;
  };

  return (
    <>
      <View className="flex-row flex pt-7 justify-start items-center">
        <TouchableOpacity
          className="py-4 px-3"
          onPress={() => props.navigation.goBack()}
        >
          <Ionicons
            name="chevron-back-sharp"
            size={22}
            color={Colors[colorScheme ?? "light"].text}
          />
        </TouchableOpacity>
        <Text className="text-xl pl-3 font-bold tracking-wider text-start py-4">
          Chat
        </Text>
        <View className="pl-24 relative top-3">
          <Image
            className="rounded-full"
            style={{
              width: 35,
              height: 35,
              resizeMode: "stretch",
              left: width / 2 - 215,
              opacity: replyReady === false ? 1 : 0,
            }}
            source={require("../../assets/dots-loading.gif")}
          />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <GiftedChat
          listViewProps={{
            style: {
              backgroundColor:
                Colors[colorScheme ?? "light"].secondaryBackground,
            },
          }}
          renderBubble={(props) => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    color: "white",
                  },
                  left: {
                    color: "black",
                  },
                }}
                wrapperStyle={{
                  right: {
                    backgroundColor: Colors[colorScheme ?? "light"].tint,
                    marginVertical: 10,
                  },
                  left: { marginVertical: 10 },
                }}
              />
            );
          }}
          messages={messages}
          onSend={(message) => onSend(message)}
          onPressAvatar={() => props.navigation.navigate("Gamification")}
          renderMessage={(prop) => (
            <Message
              containerStyle={{
                left: { marginBottom: 50 },
                right: { marginBottom: 50 },
              }}
              {...prop}
            />
          )}
          user={user}
          placeholder={"Whats on your mind?"}
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
          renderInputToolbar={renderInputToolbar}
          renderSend={(prop) => {
            const { text, onSend } = prop;

            return (
              <TouchableOpacity
                onPress={() => {
                  if (text && onSend) {
                    onSend(
                      {
                        text: text.trim(),
                        user: user,
                      },
                      true
                    );
                  }
                }}
                className="px-3 py-2"
              >
                <FontAwesome
                  name="send"
                  size={24}
                  color={Colors[colorScheme ?? "light"].tint}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 20,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
});
