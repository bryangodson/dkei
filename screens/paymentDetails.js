import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Image,
  ScrollView,
} from "react-native";
import React, { Component } from "react";

import colors from "../assets/colors";
import Header from "../components/header";
const { width } = Dimensions.get("window");
export default class PaymentDetails extends Component {
  render() {
    const { amountPaid, code, paymentPhotoLink, dateOfPayment, status } =
      this.props.route.params;
    return (
      <View style={styles.container}>
        <Header
          text="Payment Details"
          handleArrowLeftPress={() => {
            this.props.navigation.navigate("Payments");
          }}
        />
        <StatusBar
          barStyle="dark-content"
          animated={true}
          translucent={true}
          backgroundColor="rgba(255,255,255,0.1)"
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={{
              uri: `https://tremmaagroservices.com/trecco/app/${paymentPhotoLink}`,
            }}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.txt}>Amount Paid: {amountPaid}</Text>
          <Text style={styles.txt}> Date of Payment: {dateOfPayment}</Text>
          <Text style={styles.txt}>Payment Verified: {status}</Text>
          <Text style={styles.txt}>
            Verified Bank Transaction Number: {code}
          </Text>
          {status !== "YES" && (
            <Text
              style={{
                textAlign: "center",
                color: colors.black,
                opacity: 0.5,
                fontFamily: "rgl",
                marginTop: 10,
                fontSize: colors.fontTiny,
              }}>
              NB: Your payment will be looked at by your cooperative admin very
              soon. Please wait while it is still Pending. If your payment was
              wrongfully declined,please report!
            </Text>
          )}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  image: {
    width: width - 10,
    height: 400,
    resizeMode: "cover",
    marginBottom: 10,
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  txt: {
    fontSize: colors.fontSmall,
    color: colors.black,
    alignItems: "center",
    textAlign: "center",
    fontFamily: "rgl",
    marginVertical: 10,
  },
});
