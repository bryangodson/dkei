import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Image,
  Pressable,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { Component } from "react";

import colors from "../assets/colors";
import Header from "../components/header";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get("window");

export default class VerifyId extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: "",
      backImage: "",
      loading: false,
    };
  }

  makePayment = async (view) => {
    // getting the payment image form the users libryry

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [3, 2],
    });
    // here the image was asuccesfullly picked ;
    if (!result.canceled) {
      // uploading the image to the cooperative union in question;
      if (view == "front") {
        this.setState({ selectedImage: result.assets[0] });
      } else {
        this.setState({ backImage: result.assets[0] });
      }
    } else {
      ToastAndroid.show("No image selected", ToastAndroid.SHORT);
    }
  };
  upload = async () => {
    this.setState({ loading: true });
    const BASE_URL =
      "https://www.tremmaagroservices.com/trecco/app/uploadIDs.php";
    const data = new FormData();
    // appending the files to the formdata object
    const email = await AsyncStorage.getItem("email");

    const fileName = this.state.selectedImage.uri.split("/").pop();
    const fileType = fileName.split(".").pop();
    data.append("image", {
      uri: this.state.selectedImage.uri,
      type: `image/${fileType}`,
      name: fileName,
    });
    data.append("image2", {
      uri: this.state.backImage.uri,
      type: `image/${fileType}`,
      name: fileName,
    });
    data.append("email", email);

    try {
      // send the file to the server
      let res = await fetch(BASE_URL, {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      // the server has returned some info here.
      if (res.ok) {
        let response = await res.json();
        // GETTING THE SERVER RESPONSE
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
        this.setState({ loading: false });
        if (response.message === "IDs uploaded sucessfully.") {
          this.setState({ backImage: "" });
          this.setState({ selectedImage: "" });
        }
      } else {
        ToastAndroid.show(
          "ERR::check your internet connection ::" + res.status,
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
      this.setState({ loading: false });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Header
          text="Verify Id"
          handleArrowLeftPress={() => {
            this.props.navigation.navigate("Settings");
          }}
        />
        <ScrollView>
          <StatusBar
            barStyle="dark-content"
            animated={true}
            translucent={true}
            backgroundColor="rgba(255,255,255,0.1)"
          />

          <View>
            <View>
              <Text style={styles.txt}>Select your national ID card</Text>
              <Text
                style={[
                  styles.txt,
                  {
                    marginTop: 0,
                  },
                ]}>
                FRONT OF YOUR ID
              </Text>
            </View>
          </View>
          <View>
            {this.state.selectedImage === "" ? (
              <Pressable
                onPress={() => {
                  this.makePayment("front");
                }}>
                <View
                  style={[
                    styles.image,
                    {
                      backgroundColor: colors.white,
                      justifyContent: "center",
                      alignItems: "center",
                      elevation: 10,
                      borderWidth: 1,
                      borderStyle: "dashed",
                    },
                  ]}>
                  <Text style={[styles.text, { color: colors.black }]}>
                    CLICK TO SELECT
                  </Text>
                </View>
              </Pressable>
            ) : (
              <View>
                <Image
                  source={{ uri: this.state.selectedImage.uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
          {/* BACK OF THE ID */}
          <View>
            <Text style={[styles.txt]}>BACK OF YOUR ID</Text>
            {this.state.backImage === "" ? (
              <Pressable
                onPress={() => {
                  this.makePayment("back");
                }}>
                <View
                  style={[
                    styles.image,
                    {
                      backgroundColor: colors.white,
                      justifyContent: "center",
                      alignItems: "center",
                      elevation: 10,
                      borderWidth: 1,
                      borderStyle: "dashed",
                    },
                  ]}>
                  <Text style={[styles.text, { color: colors.black }]}>
                    CLICK TO SELECT
                  </Text>
                </View>
              </Pressable>
            ) : (
              <View>
                <Image
                  source={{ uri: this.state.backImage.uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => {
              if (
                this.state.selectedImage === "" ||
                this.state.backImage === ""
              ) {
                ToastAndroid.show(
                  "Please select all images",
                  ToastAndroid.SHORT
                );
              } else {
                this.upload();
              }
            }}
            style={styles.pay}
            disabled={this.state.loading}>
            <View>
              {!this.state.loading ? (
                <Text style={[styles.text, { color: colors.white }]}>
                  Upload IDs{" "}
                </Text>
              ) : (
                <View style={styles.act}>
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: "rgl",
                      fontSize: colors.fontSmall,
                      marginRight: 5,
                    }}>
                    Uploading IDs. Please wait...
                  </Text>
                  <ActivityIndicator
                    animating={this.state.loading}
                    color={colors.white}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  txt: {
    fontSize: colors.fontSmall,
    lineHeight: 30,
    color: colors.black,
    opacity: 0.5,
    alignItems: "center",
    textAlign: "center",
    fontFamily: "rgl",
    marginVertical: 20,
  },
  text: {
    fontFamily: "rgl",
  },
  input: {
    width: width * 0.9,
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 13,
    marginBottom: 20,
    color: colors.black,
    borderWidth: 1,
    fontSize: colors.fontSmall,
    fontFamily: "rgl",
    textAlign: "left",
    borderColor: colors.white,
    elevation: 10,
    marginLeft: width * 0.05,
  },
  image: {
    width: width - 20,
    height: 200,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  pay: {
    width: width - 40,
    height: 50,
    backgroundColor: colors.sec,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: 20,
  },
  act: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
