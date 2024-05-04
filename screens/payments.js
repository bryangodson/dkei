import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
  StatusBar,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../assets/colors";
import Header from "../components/header";
const { width } = Dimensions.get("window");
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MotiView } from "moti";

const Payments = ({ navigation }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [link, setLink] = useState("");
  const [LOAN, setLoans] = useState([]);
  const [animateLoanRefresh, setAnimateLoanRefresh] = useState(false);
  // getting data for all loans and paid loans

  let getSegments = async (index) => {
    try {
      // checkging to see if the names are already stored not long ago.

      let results = await AsyncStorage.getItem("userData");
      results = JSON.parse(results);
      if (results != null) {
        setLink(results.profilePictureLink);
      }

      if (index == undefined) {
        index = 0;
      }
      let email = await AsyncStorage.getItem("email");
      setAnimateLoanRefresh(true);
      let xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          let response = xhr.responseText;
          response = JSON.parse(response);
          setLoans(response);
          setAnimateLoanRefresh(false);
        }
      });
      xhr.open(
        "POST",
        "https://www.tremmaagroservices.com/trecco/app/getAllPayments.php",
        true
      );

      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(`email=${email}&index=${index}`);
    } catch (e) {
      ToastAndroid.show(e, ToastAndroid.SHORT);
    }
  };

  const onRefreshListOfLoans = () => {
    getSegments(selectedIndex);
  };

  // this is the loan item component for the segments
  const LoanItem = ({
    amountPaid,
    dateOfPayment,
    paymentVerifiedByCooperativeAdmin,
    LoanUniqueNumber,
    paymentPhotoLink,
    VerifiedBankTransactionNumber,
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("PaymentDetails", {
            id: LoanUniqueNumber,
            code: VerifiedBankTransactionNumber,
            amountPaid,
            paymentPhotoLink,
            dateOfPayment,
            status: paymentVerifiedByCooperativeAdmin,
          });
        }}>
        <View
          style={[
            styles.loan,
            {
              backgroundColor:
                paymentVerifiedByCooperativeAdmin != "YES"
                  ? "#f8d3e070"
                  : "#cceeff70",
            },
          ]}>
          <Image
            source={{
              uri: `https://tremmaagroservices.com/trecco/app/${paymentPhotoLink}`,
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 15,
            }}
          />
          <View style={styles.subLoanCom}>
            <View>
              <Text style={styles.loanText}>Amount Paid</Text>
              <Text style={styles.value}>{amountPaid}</Text>
            </View>
            <View>
              <Text
                style={[
                  styles.loanText,
                  {
                    textAlign: "right",
                    color:
                      paymentVerifiedByCooperativeAdmin != "YES"
                        ? colors.sec
                        : colors.links,
                  },
                ]}>
                Date paid
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      paymentVerifiedByCooperativeAdmin != "YES"
                        ? colors.sec
                        : colors.links,
                  },
                ]}>
                {dateOfPayment}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: 5,
              height: 60,
              backgroundColor:
                paymentVerifiedByCooperativeAdmin == "YES"
                  ? colors.links
                  : colors.sec,
              position: "absolute",
              right: 0,
            }}></View>
        </View>
      </TouchableOpacity>
    );
  };

  // showing this component when the data returned by the people is false
  const EmptyComponent = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width,
          height: 100,
        }}>
        {animateLoanRefresh ? (
          <ActivityIndicator
            animating={animateLoanRefresh}
            color={colors.primary}
          />
        ) : (
          <Text
            style={{
              fontSize: colors.fontSmall,
              fontFamily: "rgl",
              color: colors.black,
              opacity: 0.6,
            }}>
            Sorry no data found...
          </Text>
        )}
      </View>
    );
  };
  useEffect(() => {
    getSegments(selectedIndex);
  }, []);
  return (
    <MotiView
      style={styles.container}
      from={{
        transform: [{ scale: 0 }],
        opacity: 0,
      }}
      animate={{
        transform: [{ scale: 1 }],
        opacity: 1,
      }}
      transition={{
        duration: 450,
        type: "spring",
      }}>
      <StatusBar
        barStyle="dark-content"
        animated={true}
        translucent={true}
        backgroundColor="rgba(255,255,255,0.1)"
      />
      <Header
        text="All Transactions"
        handleArrowLeftPress={() => {
          navigation.navigate("Home");
        }}
      />
      <SegmentedControl
        tintColor={colors.white}
        values={["Approved", "Declined", "Pending"]}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          getSegments(event.nativeEvent.selectedSegmentIndex);
          setLoans([]);
        }}
        backgroundColor="rgba(20,50,85,0.4)"
        fontStyle={{
          color: colors.white,
          fontSize: colors.fontSmall,
          fontFamily: "rgl",
        }}
        activeFontStyle={{
          color: colors.black,
          fontWeight: 600,
        }}
        style={{
          height: 40,
          width: width - 20,
          marginHorizontal: 10,
          marginVertical: 30,
        }}
      />

      <FlatList
        data={LOAN}
        renderItem={({ item }) => (
          <LoanItem
            amountPaid={item.amountPaid}
            dateOfPayment={item.dateOfPayment}
            paymentVerifiedByCooperativeAdmin={
              item.paymentVerifiedByCooperativeAdmin
            }
            LoanUniqueNumber={item.LoanUniqueNumber}
            paymentPhotoLink={item.paymentPhotoLink}
            VerifiedBankTransactionNumber={item.VerifiedBankTransactionNumber}
          />
        )}
        keyExtractor={(item) => item.id}
        decelerationRate="normal"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={animateLoanRefresh}
            onRefresh={onRefreshListOfLoans}
            colors={[colors.primary, colors.black]}
          />
        }
        contentContainerStyle={{
          paddingBottom: 70,
        }}
        ListEmptyComponent={EmptyComponent}
        ListFooterComponent={() => {
          return (
            LOAN.length > 0 && (
              <View>
                <Text
                  style={{
                    fontSize: colors.fontSmall,
                    color: colors.black,
                    opacity: 0.6,
                    textAlign: "center",
                    width,
                    fontFamily: "rgl",
                  }}>
                  End of list...
                </Text>
              </View>
            )
          );
        }}
      />
    </MotiView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  value: {
    fontFamily: "rgl",
    color: colors.black,
    fontSize: colors.fontMedium,
  },
  subLoanCom: {
    flexDirection: "row",
    width: width - 100,
    justifyContent: "space-between",
    alignItems: "center",
  },
  loanText: {
    fontSize: colors.fontSmall,
    fontFamily: "rgl",
    color: colors.black,
    opacity: 0.6,
  },
  loan: {
    flexDirection: "row",
    width: width - 20,
    marginLeft: 10,
    marginVertical: 15,
    justifyContent: "space-between",
    padding: 5,
    alignItems: "center",
    borderRadius: 10,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    height: 70,
    paddingRight: 20,
  },
});
export default Payments;
