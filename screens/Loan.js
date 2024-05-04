import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  ToastAndroid,
  TouchableNativeFeedback,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import colors from "../assets/colors";
import Header from "../components/header";
import Slider from "@react-native-community/slider";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
export default Loan = ({ navigation }) => {
  const rippleColor = colors.primary;
  const rippleOverflow = false;
  const [value, setValue] = useState(100);
  const [debt, setDebt] = useState("");
  const [sendingLoan, setSendingLoan] = useState(false);
  const [data, setData] = useState("Submit Loan Request");
  const [po, setPo] = useState(0);

  const cal = (x) => {
    let Po = parseInt(x);
    setPo(Po);
    let r = 0.13;
    let res = Po * (1 + r);
    res = res.toLocaleString();
    setDebt(res);
  };
  const sendLoan = async () => {
    try {
      setSendingLoan(true);
      let xhr = new XMLHttpRequest();
      let email = await AsyncStorage.getItem("email");
      let Union = await AsyncStorage.getItem("userData");
      Union = JSON.parse(Union);
      let coop = Union.cooperativeUnion;
      xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let response = xhr.responseText;
          console.log(response);
          setData(response);
          setSendingLoan(false);
        }
      });
      const date = new Date();
      futureDate = new Date(
        date.setDate(date.getDate() + 30)
      ).toLocaleDateString();
      xhr.open(
        "POST",
        "https://www.tremmaagroservices.com/trecco/app/sendLoan.php",
        true
      );
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(
        `email=${email}&po=${po}&coop=${coop}&dueDate=${futureDate}&loan=${debt}`
      );
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    cal(100);
  }, []);

  const authenticate = async () => {
    let results = await LocalAuthentication.authenticateAsync({
      cancelLabel: "Return",
      promptMessage: "Verify it's you",
    });
    if (results.success) {
      sendLoan();
    } else {
    }
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: colors.white,
      }}>
      <StatusBar
        barStyle="dark-content"
        animated={true}
        translucent={true}
        backgroundColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.container}>
        <Header
          handleArrowLeftPress={() => {
            navigation.navigate("Home");
          }}
          text="Request Loan"
          styles={{
            backgroundColor: colors.primary,
          }}
        />
        <View style={styles.view}>
          <Text style={styles.introTxt}>Select the amount from the slider</Text>
          <View style={styles.texts}>
            <View>
              <Text style={styles.txt}>Min. Amount</Text>
            </View>
            <View>
              <Text style={styles.txt}>Max. Amount</Text>
            </View>
          </View>
          <View style={styles.texts}>
            <View>
              <Text style={styles.amounts}>$100.00</Text>
            </View>
            <View>
              <Text style={styles.amounts}>$50,000.00</Text>
            </View>
          </View>

          <Slider
            style={{
              width: width - 20,
              height: 50,
              alignSelf: "center",
              marginTop: 30,
              backgroundColor: colors.white,
            }}
            minimumValue={100}
            maximumValue={50000}
            thumbTintColor={colors.black}
            minimumTrackTintColor={colors.black}
            maximumTrackTintColor={colors.black}
            onValueChange={(val) => {
              val = Math.ceil(val);
              val = val.toString();
              setValue(val);
              cal(val);
            }}
            value={parseInt(value)}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: colors.white,
            height: 60,
            alignSelf: "flex-end",
          }}>
          <TextInput
            style={styles.number}
            onChangeText={(text) => {
              let vl = parseInt(text);
              if (vl > 50000) {
                ToastAndroid.show(
                  "Sorry, amount cannot exceed $50,000.00",
                  ToastAndroid.SHORT
                );
                text = "50000";
              }
              if (vl < 100 || vl == "") {
                ToastAndroid.show(
                  "Sorry,  miminum amount is $100.00",
                  ToastAndroid.SHORT
                );
                text = "100";
              }

              setValue(text);
              cal(parseInt(text));
            }}
            value={`${value}`}
            inputMode="numeric"
            minimumValue={100}
            cursorColor={colors.black}
          />
        </View>
        <View
          style={{
            width: "100%",
            padding: 20,
          }}>
          <Text style={styles.text}>
            Principal : ${parseInt(value).toLocaleString()}
          </Text>
          <Text style={styles.text}>Interest rate : 13%</Text>
          <Text style={styles.text}>
            Total amount payable : $
            {
              //    parseInt(this.state.value+0.13*this.state.value)
              debt.toLocaleString()
            }
          </Text>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
              rippleColor,
              rippleOverflow
            )}
            onPress={() => {
              authenticate();
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.black,
                padding: 10,
                marginTop: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 30,
              }}>
              {!sendingLoan ? (
                <Text
                  style={{
                    textAlign: "center",
                    color: colors.black,
                    fontSize: colors.fontSmall,
                    fontFamily: "rgl",
                  }}>
                  {data}
                </Text>
              ) : (
                <ActivityIndicator
                  color={colors.primary}
                  animating={sendingLoan}
                />
              )}
            </View>
          </TouchableNativeFeedback>
          <Text
            style={{
              fontSize: colors.fontTiny,
              fontFamily: "rgl",
              textAlign: "center",
              marginTop: 30,
              color: colors.black,
              opacity: 0.5,
            }}>
            Your Loan request will be sent to your cooperative for approval.
            Your id and passport photos will be too. Trecco does not share your
            identity with anyone else
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    padding: 20,
  },
  texts: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  introTxt: {
    fontFamily: "rgl",
    color: colors.black,
    fontSize: colors.fontSmall,
    marginBottom: 10,
  },
  txt: {
    fontFamily: "rgl",
    color: colors.black,
    fontSize: colors.fontSmall,
    lineHeight: 20,
  },
  amounts: {
    fontFamily: "rgl",
    color: colors.black,
    fontSize: colors.fontSmall,
  },
  number: {
    color: colors.black,
    fontSize: colors.fontBigExtra,
    fontFamily: "rgl",
    textAlign: "center",
    padding: 10,
    width: width - 40,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 30,
    marginRight: 20,
    height: 60,
  },
  text: {
    fontSize: colors.fontSmall,
    fontFamily: "rgl",
    color: colors.black,
    margin: 5,
    padding: 15,
  },
});
