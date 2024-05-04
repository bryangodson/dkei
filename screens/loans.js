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

const AllLoans = ({ navigation }) => {
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
        "https://www.tremmaagroservices.com/trecco/app/getSegments.php",
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
    LoanAmount,
    LoanDueDate,
    Paid,
    DateOfReqest,
    LoanId,
    status,
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("LoanDetails", {
            LoanAmount,
            LoanDueDate,
            LoanSettled: Paid,
            DateOfReqest,
            LoanId,
            status,
            link,
          });
        }}>
        <View
          style={[
            styles.loan,
            {
              backgroundColor: Paid != "YES" ? "#f8d3e070" : "#cceeff70",
            },
          ]}>
          <Image
            source={{
              uri: `https://tremmaagroservices.com/trecco/admins/client/images/${link}`,
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 15,
            }}
          />
          <View style={styles.subLoanCom}>
            <View>
              <Text style={styles.loanText}>Loan Amount</Text>
              <Text style={styles.value}>{LoanAmount}</Text>
            </View>
            <View>
              <Text
                style={[
                  styles.loanText,
                  {
                    textAlign: "right",
                    color: Paid != "YES" ? colors.sec : colors.links,
                  },
                ]}>
                Due Date
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    color: Paid != "YES" ? colors.sec : colors.links,
                  },
                ]}>
                {LoanDueDate}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: 5,
              height: 60,
              backgroundColor: Paid == "YES" ? colors.links : colors.sec,
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
        text="All Loans"
        handleArrowLeftPress={() => {
          navigation.navigate("Home");
        }}
      />
      <SegmentedControl
        tintColor={colors.white}
        values={["All Loans", "Paid Loans", "Pending Loans"]}
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
            LoanAmount={item.LoanAmount}
            LoanDueDate={item.LoanDueDate}
            Paid={item.LoanSettled}
            DateOfReqest={item.DateOfRequest}
            LoanId={item.LoanUniqueNumber}
            status={item.LoanApproved}
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
export default AllLoans;
