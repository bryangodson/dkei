import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Dimensions,
  TouchableOpacity,
  Switch,
} from "react-native";
import React, { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MotiView } from "moti";
import colors from "../assets/colors";
const { width } = Dimensions.get("window");
import SendFeedBack from "./sendFeedback";
import ReportBug from "./reportBug";
import { useNavigation } from "@react-navigation/native";
export default function SettingsComponents({ iconName, title, sub }) {
  const rippleColor = colors.tet;
  const rippleOverflow = false;
  const [receiveMails, setReceiveMails] = useState();
  const [rotate, setRotate] = useState(false);
  // this fuction returns all sub part components for settigns headers
  function RenderSubpart() {
    const navigation = useNavigation();

    const handleNavigation = (name) => {
      navigation.navigate(name);
    };
    // for account section
    if (title == "Account") {
      return (
        <MotiView
          from={{
            transform: [{ scale: 0 }],
          }}
          animate={{
            transform: [{ scale: 1 }],
          }}
          transition={{
            duration: 450,
            type: "spring",
          }}>
          <View style={styles.subPartCompo}>
            <View
              style={{
                backgroundColor: "#fff",
              }}>
              <Text
                style={{
                  fontFamily: "rgl",
                  fontSize: colors.fontSmall,
                  marginBottom: 10,
                  padding: 10,
                  textAlign: "center",
                  color: colors.black,
                }}>
                Verify your account details
              </Text>
              <MaterialCommunityIcons
                name="passport"
                color={colors.black}
                size={36}
                style={{
                  margin: 0,
                  padding: 0,
                  alignSelf: "center",
                }}
              />
              <Text
                style={{
                  fontFamily: "rgl",
                  fontSize: colors.fontTiny,
                  marginBottom: 10,
                  padding: 10,
                  color: colors.black,
                  textAlign: "center",
                  opacity: 0.8,
                  lineHeight: 23,
                }}>
                Submit your national ID, bearing your name to verify account.
                Please note that ID must be valied. Your id wll be scrutinized
                by our experts.
              </Text>

              <TouchableOpacity onPress={() => handleNavigation("VerifyId")}>
                <View>
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: "rgl",
                      backgroundColor: colors.sec,
                      width: "50%",
                      textAlign: "center",
                      alignSelf: "flex-end",
                      padding: 10,
                      marginVertical: 20,
                      marginRight: 20,
                      borderRadius: 30,
                    }}>
                    Get Started
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </MotiView>
      );
    }
    // for notifications
    if (title == "Notifications & Emails") {
      return (
        <MotiView
          from={{
            transform: [{ scale: 0 }],
          }}
          animate={{
            transform: [{ scale: 1 }],
          }}
          transition={{
            duration: 450,
            type: "spring",
          }}>
          <View
            style={[
              styles.subPartCompo,
              {
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginHorizontal: 20,
                borderWidth: 1,
                borderColor: colors.black,
                height: 50,
              },
            ]}>
            <Text
              style={{
                fontFamily: "rgl",
                fontSize: colors.fontSmall,

                padding: 10,

                color: colors.black,
              }}>
              Receive Emails
            </Text>

            <Switch
              trackColor={{ false: "grey", true: colors.links }}
              thumbColor={receiveMails ? colors.links : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                receiveMails ? setReceiveMails(false) : setReceiveMails(true);
              }}
              value={receiveMails}
            />
          </View>
        </MotiView>
      );
    }
    // for security
    if (title == "Security") {
      return (
        <MotiView
          from={{
            transform: [{ scale: 0 }],
          }}
          animate={{
            transform: [{ scale: 1 }],
          }}
          transition={{
            duration: 450,
            type: "spring",
          }}
          style={{
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              backgroundColor: "#fff",
            }}>
            <Text
              style={{
                fontFamily: "rgl",
                fontSize: colors.fontSmall,
                marginBottom: 10,
                padding: 10,
                textAlign: "center",
                color: colors.black,
              }}>
              Security Questions
            </Text>
            <MaterialCommunityIcons
              name="lock"
              color={colors.black}
              size={36}
              style={{
                margin: 0,
                padding: 0,
                alignSelf: "center",
              }}
            />
            <Text
              style={{
                fontFamily: "rgl",
                fontSize: colors.fontTiny,
                marginBottom: 10,
                padding: 10,
                color: colors.black,
                textAlign: "center",
                opacity: 0.8,
                lineHeight: 23,
              }}>
              Setting your security questions allows you to reset your password
              without your regular email.{" "}
            </Text>

            <TouchableOpacity
              onPress={() => handleNavigation("securityQuestions")}>
              <View>
                <Text
                  style={{
                    color: colors.black,
                    fontFamily: "rgl",
                    borderWidth: 1,
                    borderColor: colors.black,
                    width: "50%",
                    textAlign: "center",
                    alignSelf: "flex-end",
                    padding: 10,
                    marginVertical: 20,
                    marginRight: 20,
                    borderRadius: 30,
                  }}>
                  Get Started
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </MotiView>
      );
    }
    // for display
    // if (title == "Display") {
    //   return (
    //     <View>
    //       <View
    //         style={[
    //           styles.subPartCompo,
    //           {
    //             marginHorizontal: 20,
    //             justifyContent: "space-between",
    //             alignItems: "center",
    //             flexDirection: "row",
    //             borderWidth: 1,
    //             borderColor: colors.black,
    //             height: 50,
    //           },
    //         ]}>
    //         <Text
    //           style={{
    //             fontFamily: "rgl",
    //             fontSize: colors.fontSmall,
    //             padding: 10,
    //             color: colors.black,
    //           }}>
    //           App Theme
    //         </Text>

    //         <Picker
    //           selectedValue={apptheme}
    //           onValueChange={(itemValue, itemIndex) => {
    //             setAppTheme(itemValue);
    //           }}
    //           style={{
    //             width: 120,
    //           }}
    //           mode="dropdown">
    //           <Picker.Item label="Dark" value="Dark" />
    //           <Picker.Item label="Light" value="Light" />
    //           <Picker.Item
    //             label="Match system theme"
    //             value="Match system theme"
    //           />
    //         </Picker>
    //       </View>
    //     </View>
    //   );
    // }
    if (title == "Report Bug") {
      return <ReportBug type="bug" />;
    }
    if (title == "Send Feedback") {
      return <SendFeedBack />;
    }
    if (title == "Seek Help") {
      return <ReportBug type="help" />;
    }
  }

  return (
    <View>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(rippleColor, rippleOverflow)}
        onPress={() => {
          if (rotate) {
            setRotate(false);
          } else {
            setRotate(true);
          }
        }}>
        <View style={styles.compView}>
          <View style={styles.left}>
            <MaterialCommunityIcons
              name={iconName}
              color={colors.black}
              size={18}
              style={{
                margin: 0,
                padding: 0,
              }}
            />
            <View
              style={{
                justifyContent: "space-evenly",
                alignItems: "flex-start",
                flexShrink: 1,
              }}>
              <Text style={styles.text}>{title}</Text>
              <Text
                style={{
                  opacity: 0.5,
                  fontSize: colors.fontTiny,
                  color: "grey",
                  marginLeft: 10,
                  fontFamily: "rgl",
                  width: width - 100,
                }}
                numberOfLines={1}>
                {sub}
              </Text>
            </View>
          </View>
          <MotiView
            animate={{
              transform: [{ rotate: rotate ? "0deg" : "180deg" }],
            }}>
            <MaterialCommunityIcons
              name="chevron-up"
              size={18}
              color={colors.black}
              style={{
                margin: 0,
              }}
            />
          </MotiView>
        </View>
      </TouchableNativeFeedback>
      {rotate && <RenderSubpart />}
    </View>
  );
}

const styles = StyleSheet.create({
  compView: {
    width: "100%",
    paddingVertical: 10,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    flexDirection: "row",
    marginVertical: 20,
    height: 60,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  subPartCompo: {
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 30,
  },
  text: {
    marginLeft: 10,
    color: colors.black,
    fontSize: colors.fontSmall,
    fontFamily: "rgl",
    opacity: 0.8,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});
