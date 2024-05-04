import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  NativeModules,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Image,
  StatusBar,
  ImageBackground,
} from "react-native";
import React, { Component } from "react";
import colors from "../assets/colors";
import Header from "../components/header.js";
import ProfileCompo from "../components/profileCompo";
const { width, height } = Dimensions.get("window");
const barHeight = NativeModules.StatusBarManager.HEIGHT;
import AsyncStorage from "@react-native-async-storage/async-storage";
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: [],
    };
  }
  componentDidMount() {
    let getData = async () => {
      let results = await AsyncStorage.getItem("userData");
      if (results != null) {
        results = JSON.parse(results);
        this.setState({ userInfo: results });
      }
    };
    getData();
  }
  edit = () => {
    this.props.navigation.navigate("EditProfile");
  };
  logOut = async () => {
    const keys = ["email", "loggedIn", "sales", "userData"];
    try {
      await AsyncStorage.multiRemove(keys);
      this.props.navigation.navigate("Login");
    } catch (e) {
      ToastAndroid.show("Sory, an error occured. Please try again");
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Header
          handleArrowLeftPress={() => {
            this.props.navigation.navigate("Home");
          }}
          text="Profile"
          styles={{
            backgroundColor: colors.primary,
          }}
        />
        <StatusBar
          barStyle="dark-content"
          animated={true}
          translucent={true}
          backgroundColor="rgba(255,255,255,0.1)"
        />
        <ImageBackground
          source={require("../assets/humans.png")}
          style={{
            width,
            height,
          }}
          resizeMode="cover"
          blurRadius={40}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                padding: 0,

                width,
                marginTop: 100,
              }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width,
                  padding: 10,
                }}>
                <Image
                  source={{
                    uri: `https://tremmaagroservices.com/trecco/admins/client/images/${this.state.userInfo.profilePictureLink}`,
                  }}
                  style={{
                    width: width - 20,
                    height: 200,
                    marginTop: -80,
                    borderRadius: 15,
                  }}
                />
                <View
                  style={{
                    marginLeft: 10,
                    marginTop: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: colors.fontMedium,
                      fontFamily: "rgl",
                      color: colors.black,
                      textAlign: "center",
                    }}>
                    {this.state.userInfo.firstName}{" "}
                    {this.state.userInfo.lastName}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "rgl",
                      fontSize: colors.fontSmall,
                      opacity: 0.8,
                      color: colors.black,
                      textAlign: "center",
                    }}>
                    {this.state.userInfo.email}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                marginBottom: 80,
              }}>
              <ProfileCompo
                icon="bio"
                title="Biography"
                value={this.state.userInfo.bio}
              />
              <ProfileCompo
                icon="human"
                value={this.state.userInfo.cooperativeUnion}
                title="Coperative"
              />
              <ProfileCompo
                icon="globe-model"
                value={this.state.userInfo.country}
                title="Country"
              />
              <ProfileCompo
                icon="human-capacity-decrease"
                value={this.state.userInfo.state}
                title="State"
              />
              <ProfileCompo
                icon="city"
                value={this.state.userInfo.address}
                title="Address"
              />

              <ProfileCompo
                icon="phone"
                value={this.state.userInfo.phoneNumber}
                title="Phone Number "
              />
              <ProfileCompo
                icon="cash"
                value={this.state.userInfo.revenue}
                title="Monthly revenue"
              />
              <ProfileCompo
                icon="briefcase"
                value={this.state.userInfo.businessName}
                title="Business name"
              />
              <ProfileCompo
                icon="briefcase-download"
                value={this.state.userInfo.subSector}
                title="Business sub-sector "
              />
              <TouchableOpacity onPress={this.edit}>
                <View
                  style={{
                    width: width - 40,
                    height: 50,
                    backgroundColor: colors.white,
                    marginHorizontal: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "grey",
                    marginBottom: 20,
                    marginTop: 30,
                  }}>
                  <Text
                    style={{
                      fontFamily: "rgl",
                      fontSize: colors.fontMedium,
                      color: colors.sec,
                    }}>
                    Edit Profile
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.logOut}>
                <View
                  style={{
                    width: width - 40,
                    height: 50,
                    backgroundColor: colors.sec,
                    marginHorizontal: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                    marginBottom: 60,
                  }}>
                  <Text
                    style={{
                      fontFamily: "rgl",
                      fontSize: colors.fontMedium,
                      color: colors.white,
                    }}>
                    Log Out
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: barHeight,
    flexDirection: "row",
    height: 80,
    width,
    borderRadius: 20,
    alignItems: "center",
  },
});
