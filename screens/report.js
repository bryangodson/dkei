import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  Dimensions,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import React, { useEffect, useRef, useState } from "react";
import { MotiView } from "moti";
import colors from "../assets/colors";
import Header from "../components/header";
const { width, height } = Dimensions.get("window");
import { LineChart } from "react-native-chart-kit";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
let page = 1;

const Reports = ({ navigation }) => {
  const [sales, setSales] = useState();
  const [inventory, setInventory] = useState();
  const [data, setData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [fresh, setFresh] = useState(false);

  const [graphData, setGraphData] = useState([0, 0, 0, 0, 0, 0, 0]);
  let totalPages = Math.ceil(sales / 7);
  let showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  let next = () => {
    if (page >= totalPages) {
      showToast("Max. data reached, Please click previous");
    } else {
      page++;
      getGraphData(page);
    }
  };
  let pre = () => {
    if (page <= 1) {
      showToast("Min. data reached, Please click next");
    } else {
      page--;

      getGraphData(page);
    }
  };
  const getGraphData = async (num = 1) => {
    setFresh(true);
    const xhr = new XMLHttpRequest();
    try {
      let email = await AsyncStorage.getItem("email");
      let arr = [];
      xhr.addEventListener("readystatechange", () => {
        if (xhr.status == 200 && xhr.readyState == 4) {
          let res = xhr.responseText;
          res = JSON.parse(res);
          for (let i = 0; i < res.length; i++) {
            arr.push(res[i].amount);
          }
          if (res.length < 7) {
            let actuallLength = res.length;
            let reminder = 7 - actuallLength;
            for (let i = 0; i < reminder; i++) {
              arr.push(0);
            }
          }

          setFresh(false);
          setGraphData(arr);
        }
      });
      xhr.addEventListener("error", () => {
        ToastAndroid.show(
          "Request Failed. Please check your internet connection",
          ToastAndroid.SHORT
        );
      });
      xhr.open(
        "POST",
        "https://www.tremmaagroservices.com/trecco/app/graph.php",
        true
      );
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(`email=${email}&page=${num}`);
    } catch (e) {
      console.log(e);
    }
  };
  const getsales = async () => {
    const xhr = new XMLHttpRequest();

    try {
      let email = await AsyncStorage.getItem("email");
      setFresh(false);
      xhr.addEventListener("readystatechange", () => {
        if (xhr.status == 200 && xhr.readyState == 4) {
          let res = xhr.responseText;
          res = JSON.parse(res);
          setSalesData(res);
          setFresh(false);
        }
      });
      xhr.addEventListener("error", () => {
        ToastAndroid.show(
          "Request Failed. Please check your internet connection",
          ToastAndroid.SHORT
        );
      });
      xhr.open(
        "POST",
        "https://www.tremmaagroservices.com/trecco/app/getSales.php",
        true
      );
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(`email=${email}`);
    } catch (e) {
      console.log(e);
    }
  };
  const getinventory = async () => {
    const xhr = new XMLHttpRequest();
    try {
      setFresh(false);
      let email = await AsyncStorage.getItem("email");
      xhr.addEventListener("readystatechange", () => {
        if (xhr.status == 200 && xhr.readyState == 4) {
          let response = xhr.responseText;
          response = JSON.parse(response);
          setData(response);
          setFresh(false);
        }
      });
      xhr.addEventListener("error", () => {
        ToastAndroid.show(
          "Request Failed. Please check your internet connection",
          ToastAndroid.SHORT
        );
      });
      xhr.open(
        "POST",
        "https://www.tremmaagroservices.com/trecco/app/getInventory.php",
        true
      );
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(`email=${email}`);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const getData = async () => {
      try {
        let sale = await AsyncStorage.getItem("sales");
        let invent = await AsyncStorage.getItem("inventory");
        setSales(sale);
        setInventory(invent);
      } catch (e) {
        console.log(e);
      }
    };
    getData();
    getinventory();
    getsales();
    getGraphData();
  }, []);
  const refresh = () => {
    getinventory();
    getsales();
  };

  return (
    <View style={styles.container}>
      <Header
        handleArrowLeftPress={() => {
          navigation.navigate("Home");
        }}
        text="Reports"
      />
      <StatusBar
        barStyle="dark-content"
        animated={true}
        translucent={true}
        backgroundColor="rgba(255,255,255,0.1)"
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={fresh}
            colors={[colors.black, colors.primary]}
            onRefresh={() => {
              refresh();
            }}
          />
        }>
        <MotiView
          style={styles.chart}
          from={{
            transform: [{ translateY: -500 }],
            opacity: 0,
          }}
          animate={{
            transform: [{ translateY: 0 }],
            opacity: 1,
          }}
          transition={{
            duration: 1000,
          }}>
          <Text
            style={[
              styles.chartText,
              {
                marginLeft: width * 0.05,
              },
            ]}>
            Your Sales line
          </Text>
          <LineChart
            data={{
              labels: ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  data: graphData,
                },
              ],
            }}
            width={width * 0.9}
            height={240}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundGradientFrom: colors.sec,
              backgroundGradientTo: colors.black,
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

              propsForDots: {
                r: "5",
                strokeWidth: "1",
                stroke: colors.primary,
              },
            }}
            bezier
            style={{
              marginTop: 5,
              borderRadius: 10,
            }}
          />
        </MotiView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: width * 0.9,
            marginLeft: width * 0.05,
            marginBottom: 20,
          }}>
          <TouchableOpacity onPress={pre}>
            <Text
              style={{
                fontFamily: "rgl",
                color: colors.black,
                padding: 6,
              }}>
              Previous
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={next}>
            <Text
              style={{
                fontFamily: "rgl",
                color: colors.black,
                padding: 6,
              }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inventory}>
          <MotiView
            style={styles.inventoryCard}
            from={{
              transform: [{ translateY: 300 }],
              opacity: 0,
            }}
            animate={{
              transform: [{ translateY: 0 }],
              opacity: 1,
            }}
            transition={{
              duration: 500,
            }}>
            <View
              style={{
                padding: 8,
                width: "100%",
                // height: 30,
                backgroundColor: colors.white,
                borderRadius: 5,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <MaterialCommunityIcons
                name="database"
                color={colors.black}
                size={18}
              />
              <Text
                style={{
                  fontFamily: "bold",
                  fontSize: colors.fontBig,
                  color: colors.black,
                }}>
                {inventory}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontFamily: "rgl",
                  fontSize: colors.fontMedium,
                  color: colors.white,
                }}>
                Total inventory
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AddInventory");
              }}>
              <View
                style={{
                  padding: 5,
                  width: "100%",
                  // height: 30,
                  backgroundColor: colors.white,
                  borderRadius: 5,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}>
                <Text
                  style={{
                    fontFamily: "rgl",
                    fontSize: colors.fontTiny,
                  }}>
                  New item
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  color={colors.black}
                  size={16}
                />
              </View>
            </TouchableOpacity>
          </MotiView>

          <MotiView
            style={styles.inventoryCard}
            from={{
              transform: [{ translateY: -300 }],
              opacity: 0,
            }}
            animate={{
              transform: [{ translateY: 0 }],
              opacity: 1,
            }}
            transition={{
              duration: 500,
            }}>
            <View
              style={{
                padding: 8,
                width: "100%",
                // height: 30,
                backgroundColor: colors.white,
                borderRadius: 5,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <MaterialCommunityIcons
                name="finance"
                color={colors.black}
                size={18}
              />
              <Text
                style={{
                  fontFamily: "bold",
                  fontSize: colors.fontBig,
                  color: colors.black,
                }}>
                {sales}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontFamily: "rgl",
                  fontSize: colors.fontMedium,
                  color: colors.white,
                }}>
                Total sales
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AddSales");
              }}>
              <View
                style={{
                  padding: 5,
                  width: "100%",
                  // height: 30,
                  backgroundColor: colors.white,
                  borderRadius: 5,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}>
                <Text
                  style={{
                    fontFamily: "rgl",
                    fontSize: colors.fontTiny,
                  }}>
                  New Item
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  color={colors.black}
                  size={18}
                />
              </View>
            </TouchableOpacity>
          </MotiView>
        </View>
        <View
          style={{
            width,
            padding: 30,
          }}>
          <Text style={styles.chartText}>Your Inventory</Text>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View
            style={{
              padding: 10,
            }}>
            <View style={styles.row}>
              <Text style={[styles.cell, { fontFamily: "bold" }]}>
                Item Name
              </Text>
              <Text style={[styles.cell, { fontFamily: "bold" }]}>
                Description
              </Text>
              <Text style={[styles.cell, { fontFamily: "bold" }]}>
                Unit Price
              </Text>
              <Text style={[styles.cell, { fontFamily: "bold" }]}>
                Vendor Name
              </Text>
              <Text style={[styles.cell, { fontFamily: "bold" }]}>
                Quantity In Stock
              </Text>
              <Text style={[styles.cell, { fontFamily: "bold" }]}>
                Total Value
              </Text>
              <Text style={[styles.cell, { fontFamily: "bold" }]}>
                Reorders(Time/Days)
              </Text>
              <Text style={[styles.cell, { fontFamily: "bold" }]}>
                Quantity In Reorders
              </Text>
              <Text style={[styles.cell, { fontFamily: "bold" }]}>
                Discontinued?
              </Text>
            </View>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.cell}>{item.itemName}</Text>
                  <Text style={styles.cell}>{item.itemDescription}</Text>
                  <Text style={styles.cell}>{item.unitPrice}</Text>
                  <Text style={styles.cell}>{item.vendorName}</Text>
                  <Text style={styles.cell}>{item.quantityInStock}</Text>
                  <Text style={styles.cell}>{item.totalValue}</Text>
                  <Text style={styles.cell}>{item.reorders}</Text>
                  <Text style={styles.cell}>{item.quantityInReorder}</Text>
                  <Text style={styles.cell}>{item.discontinued}</Text>
                </View>
              )}
            />
          </View>
        </ScrollView>
        <View
          style={{
            width,
            padding: 30,
          }}>
          <Text style={styles.chartText}>Your Sales</Text>
        </View>
        <View
          style={{
            paddingBottom: 85,
          }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                padding: 10,
              }}>
              <View style={styles.row}>
                <Text style={[styles.cell, { fontFamily: "bold" }]}>
                  Product Code
                </Text>
                <Text style={[styles.cell, { fontFamily: "bold" }]}>
                  Product Name
                </Text>
                <Text style={[styles.cell, { fontFamily: "bold" }]}>
                  Description
                </Text>
                <Text style={[styles.cell, { fontFamily: "bold" }]}>
                  Quantity
                </Text>
                <Text style={[styles.cell, { fontFamily: "bold" }]}>Price</Text>
                <Text style={[styles.cell, { fontFamily: "bold" }]}>
                  Amount
                </Text>
              </View>
              <FlatList
                data={salesData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.row}>
                    <Text style={styles.cell}>{item.productCode}</Text>
                    <Text style={styles.cell}>{item.productName}</Text>
                    <Text style={styles.cell}>{item.productDescription}</Text>
                    <Text style={styles.cell}>{item.quantity}</Text>
                    <Text style={styles.cell}>{item.price}</Text>
                    <Text style={styles.cell}>{item.amount}</Text>
                  </View>
                )}
              />
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  chart: {
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
    elevation: 5,
  },
  background: {
    backgroundColor: colors.white,
  },
  chartText: {
    fontFamily: "bold",
    color: colors.black,
    alignSelf: "flex-start",
    fontSize: colors.fontBig,
  },
  inventory: {
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  inventoryCard: {
    width: width * 0.4,
    height: 180,
    borderRadius: 10,
    backgroundColor: colors.sec,
    padding: 20,
    marginBottom: 30,
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
  },

  row: {
    flexDirection: "row",
    backgroundColor: colors.white,
    elevation: 5,
    minHeight: 50,
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
    width: 150,
    fontFamily: "rgl",
    fontSize: colors.fontSmall,
    color: colors.black,
  },
  salesForm: {
    width,
    height: 0.8 * height,
    backgroundColor: colors.white,
    position: "absolute",
    bottom: -0.9 * height,
    left: 0,
    elevation: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  input: {
    width: width * 0.9,
    height: 50,
    backgroundColor: "#fff",
    elevation: 5,
    borderRadius: 10,
    padding: 13,
    marginBottom: 30,
    color: colors.black,
    borderWidth: 1,
    fontSize: colors.fontSmall,
    fontFamily: "rgl",
    textAlign: "left",
    borderColor: colors.white,
  },
});
export default Reports;
