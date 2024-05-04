import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Keyboard,
  ToastAndroid,
  KeyboardAvoidingView,
} from "react-native";
import React, { Component } from "react";

import colors from "../assets/colors";
const { width, height } = Dimensions.get("window");
import Header from "../components/header";
import { MotiView } from "moti";
import { Picker } from "@react-native-picker/picker";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      country: "",
      region: "",
      address: "",
      businessName: "",
      phoneNumber: "",
      monthlyRevenue: "",
      subSector: "",
      bio: "",
      loading: false,
      ballWay: 0,
    };

    this.handleEdit = this.handleEdit.bind(this);
  }
  componentDidMount() {
    const getData = async () => {
      let data = await AsyncStorage.getItem("userData");
      data = JSON.parse(data);
      const {
        firstName,
        lastName,
        address,
        bio,
        phoneNumber,
        businessName,
        state,
        country,
        subSector,
        revenue,
      } = data;
      console.log(data.firstName);
      this.setState({ businessName });
      this.setState({ firstName });
      this.setState({ lastName });
      this.setState({ region: state });
      this.setState({ country });
      this.setState({ phoneNumber });
      this.setState({ address });
      this.setState({ monthlyRevenue: revenue });
      this.setState({ subSector });
      this.setState({ bio });
    };
    getData();
  }
  handleEdit = async () => {
    try {
      Keyboard.dismiss();
      const xhr = new XMLHttpRequest();
      this.setState({ loading: true });
      const email = await AsyncStorage.getItem("email");
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = xhr.responseText;
          if (response === "Profile Upadated Successfully!") {
            this.setState({ loading: false });
            ToastAndroid.show(response, ToastAndroid.SHORT);
            this.gotoLogin();
            this.setState({ businessName: "" });
            this.setState({ firstName: "" });
            this.setState({ lastName: "" });
            this.setState({ region: "" });
            this.setState({ country: "" });
            this.setState({ phoneNumber: "" });
            this.setState({ address: "" });
            this.setState({ monthlyRevenue: "" });
            this.setState({ subSector: "" });
            this.setState({ bio: "" });
          } else {
            this.setState({ loading: false });
            ToastAndroid.show(response, ToastAndroid.SHORT);
          }
        }
      };
      xhr.addEventListener("error", () => {
        ToastAndroid.show(
          "Request Failed. Please check your internet connection",
          ToastAndroid.SHORT
        );
      });
      xhr.open(
        "POST",
        "https://www.tremmaagroservices.com/trecco/app/editProfile.php",
        true
      );
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(
        `email=${email}&firstName=${this.state.firstName}&lastName=${this.state.lastName}&country=${this.state.country}&state=${this.state.region}&phoneNumber=${this.state.phoneNumber}&subSector=${this.state.subSector}&monthlyRevenue=${this.state.monthlyRevenue}&address=${this.state.address}&businessName=${this.state.businessName}&bio=${this.state.bio}`
      );
    } catch (error) {
      this.setState({ loading: false });
    } finally {
      setTimeout(() => {
        this.setState({ loading: false });
      }, 6000 * 2.5);
    }
  };
  gotoLogin = async () => {
    this.props.navigation.navigate("Login");

    const keys = ["email", "loggedIn", "sales", "userData"];
    try {
      await AsyncStorage.multiRemove(keys);
  
    } catch (e) {
      ToastAndroid.show("Sory, an error occured. Please try again");
    }
  };
  gotoProfile = async () => {
    this.props.navigation.navigate("Me");
  };
  authenticate = async () => {
    let results = await LocalAuthentication.authenticateAsync({
      cancelLabel: "Return",
      promptMessage: "Verify it's you",
    });
    if (results.success) {
      this.handleEdit();
    } else {
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          animated={true}
          translucent={true}
          backgroundColor="rgba(255,255,255,0.1)"
        />
        <Header text="Edit Profile" handleArrowLeftPress={this.gotoProfile} />
        <MotiView
          style={{
            position: "absolute",
            bottom: -height * 0.4,
            right: 40,
            width: 120,
            marginRight: width * 0.4,
            justifyContent: "space-between",
            bottom: 10,
            zIndex: 2,
            flexDirection: "row",
          }}
          from={{
            transform: [{ translateX: width - 100 }],
          }}
          animate={{
            transform: [{ translateX: 0 }],
          }}>
          <View
            style={{
              width: 120,
              height: 2,
              borderRadius: 15,
              backgroundColor: colors.sec,
              position: "absolute",
              bottom: 8,
            }}></View>
          <View
            style={{
              flexDirection: "row",
              width: 120,
              justifyContent: "space-between",
            }}>
            {/* track bar  */}
            <MotiView
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: colors.sec,
                borderWidth: 0.5,
                borderColor: colors.sec,
                position: "absolute",
                zIndex: 3,
              }}
              animate={{
                left: this.state.ballWay,
              }}></MotiView>
            <MotiView
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor:
                  this.state.ballWay > 0 ? colors.sec : colors.white,
                borderWidth: 1,
                borderColor: colors.sec,
              }}></MotiView>
            <MotiView
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor:
                  this.state.ballWay > 60 ? colors.sec : colors.white,
                borderWidth: 1,
                borderColor: colors.sec,
              }}></MotiView>
            <MotiView
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor:
                  this.state.ballWay > 100 ? colors.sec : colors.white,
                borderWidth: 1,
                borderColor: colors.sec,
              }}></MotiView>
          </View>
        </MotiView>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="center"
          scrollEventThrottle={100}
          onScroll={(event) => {
            let scroll = (this.xOffset = event.nativeEvent.contentOffset.x);

            let screen = width * 2;
            let final = (scroll / screen) * 100;
            this.setState({ ballWay: final });
          }}>
          {/* first sets of registration details */}
          <MotiView
            style={styles.container}
            from={{
              transform: [{ translateX: -width }],
            }}
            animate={{
              transform: [{ translateX: 0 }],
            }}>
            <ImageBackground
              source={require("../assets/humans.png")}
              style={{
                width,
                height,
              }}
              resizeMode="cover"
              blurRadius={40}>
              <View
                style={{
                  paddingHorizontal: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 20,
                }}>
                <Text style={styles.text}>Please provide legal data.</Text>
                <Text style={styles.txt}>Fill your personal details below</Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 30,
                  padding: 30,
                }}>
                <View>
                  <TextInput
                    style={styles.input}
                    cursorColor={colors.black}
                    placeholder="First Name..."
                    keyboardType="default"
                    onChangeText={(text) => {
                      this.setState({ firstName: text });
                    }}
                    value={this.state.firstName}
                  />
                </View>
                <View>
                  <TextInput
                    style={styles.input}
                    cursorColor={colors.black}
                    placeholder="Last Name..."
                    onChangeText={(text) => {
                      this.setState({ lastName: text });
                    }}
                    value={this.state.lastName}
                  />
                </View>
                <View>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        height: 120,
                      },
                    ]}
                    cursorColor={colors.black}
                    placeholder="Biography..."
                    multiline={true}
                    maxLength={200}
                    onChangeText={(text) => {
                      this.setState({ bio: text });
                    }}
                    value={this.state.bio}
                  />
                </View>
              </View>
            </ImageBackground>
          </MotiView>
          {/* second set of registration details */}
          <MotiView
            style={styles.container}
            from={{
              transform: [{ translateX: -width }],
            }}
            animate={{
              transform: [{ translateX: 0 }],
            }}>
            <ImageBackground
              source={require("../assets/humans.png")}
              style={{
                width,
                height,
              }}
              resizeMode="cover"
              blurRadius={40}>
              <View
                style={{
                  paddingHorizontal: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 20,
                }}>
                <Text style={styles.text}>Country and your residence</Text>
                <Text style={styles.txt}>
                  Please provide your location details
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 30,
                  padding: 30,
                }}>
                <View>
                  <TextInput
                    style={styles.input}
                    cursorColor={colors.black}
                    placeholder="Country..."
                    keyboardType="default"
                    onChangeText={(text) => {
                      this.setState({ country: text });
                    }}
                    value={this.state.country}
                  />
                </View>
                <View>
                  <TextInput
                    style={styles.input}
                    cursorColor={colors.black}
                    placeholder="State..."
                    keyboardType="default"
                    onChangeText={(text) => {
                      this.setState({ region: text });
                    }}
                    value={this.state.region}
                  />
                </View>
                <View>
                  <TextInput
                    style={styles.input}
                    cursorColor={colors.black}
                    placeholder="Your adress..."
                    onChangeText={(text) => {
                      this.setState({ address: text });
                    }}
                    value={this.state.address}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    width: width - 40,
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}></View>
              </View>
            </ImageBackground>
          </MotiView>
          {/* las set of reigstrion details  */}
          <MotiView
            style={styles.container}
            from={{
              transform: [{ translateX: -width }],
            }}
            animate={{
              transform: [{ translateX: 0 }],
            }}>
            <ImageBackground
              source={require("../assets/humans.png")}
              style={{
                width,
                height,
              }}
              resizeMode="cover"
              blurRadius={40}>
              <View
                style={{
                  paddingHorizontal: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 20,
                }}>
                <Text style={styles.text}>
                  Please provide your business information{" "}
                </Text>
                <Text style={styles.txt}>
                  please use legal names and information
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 30,
                  padding: 30,
                }}>
                <View>
                  <TextInput
                    style={styles.input}
                    cursorColor={colors.black}
                    placeholder="Business name..."
                    keyboardType="default"
                    onChangeText={(text) => {
                      this.setState({ businessName: text });
                    }}
                    value={this.state.businessName}
                  />
                </View>
                <View>
                  <TextInput
                    style={styles.input}
                    cursorColor={colors.black}
                    placeholder="Business sub-sector..."
                    keyboardType="default"
                    onChangeText={(text) => {
                      this.setState({ subSector: text });
                    }}
                    value={this.state.subSector}
                  />
                </View>

                <View
                  style={[
                    styles.subPartCompo,
                    {
                      marginHorizontal: 20,
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      height: 50,
                      width: width - 40,
                      backgroundColor: colors.white,
                    },
                  ]}>
                  <Text
                    style={{
                      fontFamily: "rgl",
                      fontSize: colors.fontSmall,
                      padding: 10,
                      color: "grey",
                      opacity: 0.8,
                    }}>
                    Monthly revenue
                  </Text>

                  <Picker
                    selectedValue={this.state.picker}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({ monthlyRevenue: itemValue });
                    }}
                    style={{
                      width: 150,
                    }}
                    mode="dropdown">
                    <Picker.Item label="1000 – 10,000" value="1000 – 10,000" />
                    <Picker.Item
                      label="10,100 – 50,000"
                      value="10,100 – 50,000"
                    />
                    <Picker.Item
                      label="50,100 – 100,000, "
                      value="50,100 – 100,000, "
                    />
                  </Picker>
                </View>
                <View>
                  <TextInput
                    style={styles.input}
                    cursorColor={colors.black}
                    placeholder="Phone number..."
                    onChangeText={(text) => {
                      this.setState({ phoneNumber: text });
                    }}
                    value={this.state.phoneNumber}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    width: width - 40,
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}>
                  <TouchableOpacity
                    onPress={this.authenticate}
                    disabled={this.state.loading}
                    style={[
                      styles.button,
                      {
                        backgroundColor: this.state.loading
                          ? "grey"
                          : colors.sec,
                        opacity: this.state.loading ? 0.5 : 1,
                      },
                    ]}>
                    {this.state.loading ? (
                      <ActivityIndicator
                        animating={this.state.loading}
                        size={30}
                        color={colors.primary}
                      />
                    ) : (
                      <Text style={styles.btnText}>Submit edditing</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.terms}>
                  <Text
                    style={[
                      styles.txt,
                      {
                        opacity: 0.4,
                      },
                    ]}>
                    You cannot not edit your cooperativ union.
                  </Text>

                  <Text
                    style={[
                      styles.txt,
                      {
                        opacity: 0.4,
                        color: colors.links,
                      },
                    ]}>
                    make sure all your datas are correct{" "}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </MotiView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width,
    height,
  },
  image: {
    width: width,
    transform: [{ scale: 0.6 }],
  },
  text: {
    fontSize: colors.fontMedium,
    fontFamily: "bold",
    color: colors.sec,
  },
  txt: {
    fontSize: colors.fontSmall,
    // lineHeight: 30,
    color: colors.black,
    marginLeft: 1,
    opacity: 0.5,
    alignItems: "center",
    fontFamily: "rgl",
  },
  input: {
    width: width * 0.9,
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 13,
    marginBottom: 10,
    color: colors.black,
    borderWidth: 1,
    fontSize: colors.fontSmall,
    fontFamily: "rgl",
    textAlign: "left",
    borderColor: colors.white,
  },
  button: {
    width: width * 0.5,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginLeft: width * 0.5 - 40,
    marginTop: 0,
  },
  btnText: {
    fontFamily: "rgl",
    color: colors.white,
  },
  terms: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  subPartCompo: {
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 30,
  },
});
