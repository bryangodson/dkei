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
  KeyboardAvoidingView,
  ToastAndroid,
} from "react-native";
import React, { Component } from "react";

import colors from "../assets/colors";
const { width, height } = Dimensions.get("window");
import Header from "../components/header";
import { MotiView } from "moti";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class AddSales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: "",
      description: "",
      unitPrice: "",
      quantityInStock: "",
      amountSold: "",
      productCode: "",
      loading: false,
      ballWay: 0,
      userInfo: "",
    };

    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd = async () => {
    try {
      Keyboard.dismiss();
      const xhr = new XMLHttpRequest();
      this.setState({ loading: true });
      let email = await AsyncStorage.getItem("email");
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = xhr.responseText;
          if (response === "Sales data added successfully!") {
            this.setState({ loading: false });

            ToastAndroid.show(response, ToastAndroid.SHORT);
            this.goBack();
            this.setState({ itemName: "" });
            this.setState({ unitPrice: "" });
            this.setState({ description: "" });
            this.setState({ productCode: "" });
            this.setState({ amountSold: "" });
            this.setState({ quantityInStock: "" });
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
        "https://www.tremmaagroservices.com/trecco/app/addReport.php",
        true
      );
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(
        `email=${email}&productName=${this.state.itemName}&price=${this.state.unitPrice}&description=${this.state.description}&quantity=${this.state.quantityInStock}&productCode=${this.state.productCode}&amount=${this.state.amountSold}`
      );
    } catch (error) {
      this.setState({ loading: false });
    } finally {
      setTimeout(() => {
        this.setState({ loading: false });
      }, 6000 * 2.5);
    }
  };
  goBack = () => {
    this.props.navigation.navigate("Reports");
  };
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
  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="height">
          <StatusBar
            barStyle="dark-content"
            animated={true}
            translucent={true}
            backgroundColor="rgba(255,255,255,0.1)"
          />
          <Header text="Add Sales" handleArrowLeftPress={this.goBack} />
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
                  <Text style={styles.text}>
                    Let's keep track of your sales
                  </Text>
                  <Text style={styles.txt}>
                    Fill in the form with the appropriate details
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
                      placeholder="Product code..."
                      onChangeText={(text) => {
                        this.setState({ productCode: text });
                      }}
                      value={this.state.productCode}
                    />
                  </View>
                  <View>
                    <TextInput
                      style={styles.input}
                      cursorColor={colors.black}
                      placeholder="Product Name..."
                      onChangeText={(text) => {
                        this.setState({ itemName: text });
                      }}
                      value={this.state.itemName}
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
              <StatusBar
                barStyle="dark-content"
                animated={true}
                translucent={true}
                backgroundColor={colors.white}
              />
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
                  <Text style={styles.text}>You are almost done</Text>
                  <Text style={styles.txt}>
                    Your inventory details are necessary for loan approval
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
                      style={[
                        styles.input,
                        {
                          height: 100,
                        },
                      ]}
                      multiline={true}
                      maxLength={200}
                      cursorColor={colors.black}
                      placeholder="Description..."
                      onChangeText={(text) => {
                        this.setState({ description: text });
                      }}
                      value={this.state.description}
                    />
                  </View>
                  <View>
                    <TextInput
                      style={styles.input}
                      cursorColor={colors.black}
                      placeholder="Quantity In Stock"
                      keyboardType="number-pad"
                      onChangeText={(text) => {
                        this.setState({ quantityInStock: text });
                      }}
                      value={this.state.quantityInStock}
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
                  <Text style={styles.text}>Last step to finish</Text>
                  <Text style={styles.txt}>
                    Please provide the last details.
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
                      placeholder="Unit Price..."
                      onChangeText={(text) => {
                        this.setState({ unitPrice: text });
                      }}
                      value={this.state.unitPrice}
                    />
                  </View>
                  <View>
                    <TextInput
                      style={styles.input}
                      cursorColor={colors.black}
                      placeholder="Amount Sold..."
                      keyboardType="number-pad"
                      onChangeText={(text) => {
                        this.setState({ amountSold: text });
                      }}
                      value={this.state.amountSold}
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
                      onPress={this.handleAdd}
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
                        <Text style={styles.btnText}>Add Sale</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </MotiView>
          </ScrollView>
        </KeyboardAvoidingView>
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
    textAlign: "center",
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
    elevation: 6,
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
});
