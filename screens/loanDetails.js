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
export default class LoanDetails extends Component {
  render() {
    const {
      LoanAmount,
      DateOfReqest,
      LoanDueDate,
      LoanSettled,
      LoanId,
      status,
      link,
    } = this.props.route.params;
    return (
      <View style={styles.container}>
        <Header
          text="Loan Details"
          handleArrowLeftPress={() => {
            this.props.navigation.navigate("AllLoans");
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
              uri: `https://tremmaagroservices.com/trecco/admins/client/images/${link}`,
            }}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.txt}>Loan Amount: {LoanAmount}</Text>
          <Text style={styles.txt}> Date of request: {DateOfReqest}</Text>
          <Text style={styles.txt}> Loan Due Date: {LoanDueDate}</Text>
          <Text style={styles.txt}> Loan settled ? : {LoanSettled}</Text>

          <Text style={styles.txt}>Loan Aproved ?: {status}</Text>
          <Text style={styles.txt}>Loan Verification ID: {LoanId}</Text>
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
              NB: Your loan request is still pending approval. Please do more to
              get your loan approved early . {"\n"}...Suggested Actions....
              {"\n"}1. supplying your sales and inventory{"\n"}2. verifying your
              identity and filling al your profile data.{"\n"}3. verifying your
              business registration details
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
