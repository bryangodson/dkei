import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
} from "react-native";
import React, { Component } from "react";
import colors from "../assets/colors";
import SettingsComponents from "../components/settingsComponents";
import Header from "../components/header";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default class Settings extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          handleArrowLeftPress={() => {
            this.props.navigation.navigate("Home");
          }}
          text="Settings"
        />
        {
          // this is the header part.
        }
        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusBar
            barStyle="dark-content"
            animated={true}
            translucent={true}
            backgroundColor="rgba(255,255,255,0.1)"
          />
          <View>
            <Text style={styles.lightHead}>GENERAL</Text>
            <SettingsComponents
              iconName="account-circle-outline"
              title="Account"
              sub="Verify your account, verify your business registration."
            />
            {/* <SettingsComponents
              iconName="bell-outline"
              title="Notifications & Emails"
              sub="emails and newsletters."
            /> */}
            <SettingsComponents
              iconName="shield-outline"
              title="Security"
              sub="Password and security questions."
            />
          </View>
          {
            // Last part of the settings here, shalll contain report bugs and feedback.
          }
          <View>
            <Text style={styles.lightHead}>FEEDBACK</Text>
            <SettingsComponents
              iconName="bug-outline"
              title="Report Bug"
              sub="App has problems? report them here"
            />
            <SettingsComponents
              iconName="send-outline"
              title="Send Feedback"
              sub="Rate us on play store,Send us a quick feedback"
            />
          </View>
          {
            // help.
          }
          <View
            style={{
              paddingBottom: 55,
            }}>
            <Text style={styles.lightHead}>Help</Text>
            <SettingsComponents
              iconName="message-outline"
              title="Seek Help"
              sub="Chat with expert for account related problems"
            />
          </View>
          <Pressable
            onPress={() => {
              this.props.navigation.navigate("AboutApp");
            }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 85,
                flexDirection: "row",
                borderWidth: 1,
                borderColor: colors.black,
                width: 150,
                alignSelf: "center",
                padding: 10,
                borderRadius: 20,
              }}>
              <Text
                style={{
                  fontFamily: "rgl",
                  color: colors.black,
                  fontSize: colors.fontTiny,
                }}>
                {" "}
                About App
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={18}
                color={colors.black}
                style={{
                  margin: 0,
                }}
              />
            </View>
          </Pressable>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // paddingBottom: 55,
  },
  lightHead: {
    fontFamily: "bold",
    opacity: 0.6,
    marginLeft: 20,
    marginVertical: 20,
    marginBottom: 10,
    color: colors.primary,
  },
});
