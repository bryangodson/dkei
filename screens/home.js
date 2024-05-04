import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  NativeModules,
  ToastAndroid,
  BackHandler,
  TouchableNativeFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";

// making all imports for the scrren

import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../assets/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MotiView } from "moti";

const { width, height } = Dimensions.get("window");
import { usePreventScreenCapture } from "expo-screen-capture";
const barHeight = NativeModules.StatusBarManager.HEIGHT;
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Skeleton } from "moti/skeleton";
const fontFamily = "rgl";
import * as SplashScreen from "expo-splash-screen";

const Home = ({ navigation }) => {
  // definig all states
  const rippleColor = "#cceeff70";
  const rippleOverflow = false;
  const [sheetIndex, setSheetIndex] = useState(-1);
  const bottomSheetRef = useRef(null);
  // const [name, setName] = useState("");
  const [message, setMessage] = useState([]);
  // const [link, setLink] = useState("");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingForMessages, setLoadingForMessages] = useState(true);
  const [loanData, setLoanData] = useState([]);
  const [animateRefresh, setAnimateRefresh] = useState(false);
  // this x is for counting the backhandler number of fire
  let x = 0;
  // snap points for the bottom sheet
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);
  const handleSheetChanges = useCallback((index) => {
    index < 0 && setSheetIndex(-1);
  }, []);
  // this is the backdrop of the botto sheet
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );
  // add loan button logic.
  const handleAddLoan = () => {
    let currentLoan = parseInt(loanData.loan);

    if (currentLoan > 0) {
      ToastAndroid.show(
        "Sorry, you have a loan running\nPay all loans to make onother loan request",
        ToastAndroid.SHORT
      );
    } else if (currentLoan === "") {
      ToastAndroid.show("Sorry, reload your loan amount", ToastAndroid.SHORT);
    } else {
      navigation.navigate("Loan");
    }
  };
  const getMessages = async () => {
    let email = await AsyncStorage.getItem("email");
    let user = await AsyncStorage.getItem("userData");
    user = JSON.parse(user);
    let coop = user.cooperativeUnion;

    setLoadingForMessages(true);
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4 && xhr.status === 200) {
        let response = xhr.responseText;
        setMessage(JSON.parse(response));
        setLoadingForMessages(false);
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
      "https://www.tremmaagroservices.com/trecco/app/messages.php",
      true
    );
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(`email=${email}&coop=${coop}`);
  };
  // getting all notifications here
  const handleNotiPress = async () => {
    // changing the bottom sheet position onces the bell is clieckd
    if (sheetIndex == 1) {
      setSheetIndex(-1);
    } else {
      setSheetIndex(1);
    }
    // getting email for http request parameter
    getMessages();
  };
  // getting inventpry ,loan and sales.
  const getLoan = async () => {
    try {
      setAnimateRefresh(true);
      let xhr = new XMLHttpRequest();

      let email = await AsyncStorage.getItem("email");
      xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          let response = xhr.responseText;
          response = JSON.parse(response);
          setLoanData(response);

          setAnimateRefresh(false);
          let setinvent = async () => {
            await AsyncStorage.setItem(
              "loanID",
              JSON.stringify(response.loanID)
            );
            await AsyncStorage.setItem(
              "inventory",
              JSON.stringify(response.inventory)
            );
            await AsyncStorage.setItem("sales", JSON.stringify(response.sales));
          };
          setinvent();
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
        "https://www.tremmaagroservices.com/trecco/app/getToppers.php",
        true
      );
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(`email=${email}`);
    } catch (e) {
      ToastAndroid.show(e, ToastAndroid.SHORT);
    } finally {
      setTimeout(() => {
        setAnimateRefresh(false);
      }, 6000 * 2.5);
    }
  };

  // user  data starts here
  // getting things like the current loan the inventory and the sales for this user
  let data = async () => {
    try {
      // checkging to see if the names are already stored not long ago.
      let getAsync = async () => {
        let results = await AsyncStorage.getItem("userData");
        results = JSON.parse(results);
        if (results != null) {
          setLoading(false);

          setUserData(results);
        } else {
          const XHR = new XMLHttpRequest();
          let email = await AsyncStorage.getItem("email");

          XHR.addEventListener("readystatechange", () => {
            if (XHR.readyState === 4 && XHR.status === 200) {
              let user = XHR.responseText;
              user = JSON.parse(user);
              // setName(user.firstName + " " + user.lastName);
              setUserData(user);
              AsyncStorage.setItem("userData", JSON.stringify(user));
              setLoading(false);
            }
          });
          XHR.addEventListener("error", () => {
            ToastAndroid.show(
              "Request Failed. Please check your internet connection",
              ToastAndroid.SHORT
            );
          });
          XHR.open(
            "POST",
            "https://www.tremmaagroservices.com/trecco/app/getName.php",
            true
          );
          XHR.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
          XHR.send(`email=${email}`);
        }
      };
      getAsync();
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 6000 * 2.5);
    }
  };
  // these are refresh functions
  const refreshLoan = () => {
    getLoan();
  };

  // this is thie notifications component;
  const renderItem = ({ item }) => (
    <View style={styles.container2}>
      <Image
        style={[
          styles.image,
          {
            alignSelf: "flex-start",
            borderWidth: 1,
            borderColor: colors.black,
          },
        ]}
        source={{
          uri: `https://tremmaagroservices.com/trecco/admins/client/images/${item.senderImage}`,
        }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.senderName}</Text>
        <Text style={styles.text}>{item.message}</Text>
        <Text style={[styles.text]}>{item.date}</Text>
      </View>
    </View>
  );

  // this function makes's sure no one can screenshot the app details
  // usePreventScreenCapture();
  // thes functions will run as soon as the app loads
  useEffect(() => {
    // this will register a background press fo the instrument

    const registerBackPress = () => {
      BackHandler.addEventListener("hardwareBackPress", () => {
        x++;
        if (x == 2) {
          BackHandler.exitApp();
          x = 0;
        } else {
          ToastAndroid.show("Press again to exit", ToastAndroid.SHORT);
        }
        setTimeout(() => (x = 0), 1500);
        return true;
      });
    };
    // calling all http requests need at this time.
    registerBackPress();
    data();
    getLoan();
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 200);
  }, []);
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
        {loadingForMessages ? (
          <ActivityIndicator
            animating={loadingForMessages}
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
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          animated={true}
          translucent={true}
          backgroundColor="rgba(255,255,255,0.1)"
        />

        <LinearGradient
          colors={[
            colors.black,
            colors.primary,
            colors.black,
            colors.primary,
            colors.black,
          ]}
          start={{ x: 2, y: 1 }}
          end={{
            x: 0,
            y: 0,
          }}>
          <BlurView
            intensity={10}
            style={{
              borderRadius: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}>
            <View
              style={{
                width,
                paddingHorizontal: 20,
                alignItems: "flex-start",
                // backgroundColor: colors.primary,
                paddingTop: barHeight + 10,
                height: height * 0.3,
              }}>
              <View style={styles.head}>
                {userData.profilePictureLink !== "" ? (
                  <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(
                      rippleColor,
                      rippleOverflow
                    )}
                    onPress={() => {
                      navigation.navigate("Me");
                    }}>
                    <Image
                      source={{
                        uri: `https://tremmaagroservices.com/trecco/admins/client/images/${userData.profilePictureLink}`,
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        borderColor: colors.white,
                        borderWidth: 2,
                      }}
                    />
                  </TouchableNativeFeedback>
                ) : (
                  <Skeleton
                    width={40}
                    height={40}
                    colorMode="light"
                    delay={100}
                    radius="round"
                  />
                )}
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple(
                    rippleColor,
                    rippleOverflow
                  )}
                  onPress={handleNotiPress}>
                  <MotiView
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 12,
                      backgroundColor: colors.white,
                      borderRadius: 30,
                    }}
                    from={{
                      transform: [{ translateX: -200 }],
                    }}
                    animate={{
                      transform: [{ translateX: 0 }],
                    }}
                    transition={{
                      duration: 450,
                      type: "spring",
                    }}>
                    <MaterialCommunityIcons
                      name="bell-outline"
                      size={18}
                      color={colors.sec}
                    />
                  </MotiView>
                </TouchableNativeFeedback>
              </View>
              <MotiView
                from={{
                  transform: [{ translateY: -500 }],
                  opacity: 0,
                }}
                animate={{
                  transform: [{ translateY: 0 }],
                  opacity: 1,
                }}
                transition={{
                  duration: 500,
                }}
                style={{
                  marginTop: 5,
                }}>
                <Text
                  style={{
                    fontSize: colors.fontSmall,
                    color: "#fff",
                    opacity: 0.6,
                    fontFamily,
                  }}>
                  Welcome back,
                </Text>
                {!loading ? (
                  <Text
                    style={{
                      fontSize: colors.fontMedium,
                      marginTop: -5,
                      color: "#fff",
                      opacity: 1,
                      fontFamily: "rgl",
                      textAlign: "left",
                    }}>
                    {userData.firstName + " " + userData.lastName}
                  </Text>
                ) : (
                  <Skeleton
                    width={200}
                    height={20}
                    colorMode="light"
                    delay={100}
                  />
                )}
              </MotiView>
            </View>
          </BlurView>
        </LinearGradient>
        <MotiView
          from={{
            transform: [{ translateY: 500 }],
            opacity: 0,
          }}
          animate={{
            transform: [{ translateY: 0 }],
            opacity: 1,
          }}
          transition={{
            duration: 500,
          }}
          style={{
            width: width - 40,
            backgroundColor: colors.white,
            elevation: 5,
            alignSelf: "center",
            marginTop: -height * 0.08,
            borderRadius: 10,
            padding: 10,
            paddingHorizontal: 20,
            justifyContent: "space-evenly",
            height: 230,
            overflow: "hidden",
          }}>
          <View>
            <TouchableOpacity
              onPress={refreshLoan}
              style={{
                backgroundColor: colors.black,
                width: 30,
                height: 30,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: -10,
                right: -10,
              }}>
              <MaterialCommunityIcons
                name="refresh"
                color={colors.white}
                size={18}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{
                fontSize: colors.fontTiny,
                opacity: 0.5,
                fontWeight: "500",
                fontFamily,
              }}>
              {parseInt(loanData.loan) > 0 ? loanData.status : "Running Loan"}
            </Text>
            <Text
              style={{
                fontSize: colors.fontBigExtra,
                fontWeight: "500",
                fontFamily: "bold",
                color: "rgba(20,50,85,0.8)",
              }}>
              {!animateRefresh ? (
                "$" + loanData.loan
              ) : (
                <ActivityIndicator
                  color={colors.primary}
                  animating={animateRefresh}
                />
              )}
            </Text>
          </View>
          <View>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}>
              <Text
                style={{
                  fontSize: colors.fontTiny,
                  opacity: 0.5,
                  fontWeight: "500",
                  fontFamily,
                }}>
                Payment Due
              </Text>
              <Text
                style={{
                  fontSize: colors.fontTiny,
                  opacity: 0.5,
                  fontWeight: "500",
                  fontFamily,
                  color: colors.primary,
                }}>
                {loanData.date}
              </Text>
            </View>
          </View>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
              rippleColor,
              rippleOverflow
            )}
            onPress={() => {
              navigation.navigate("LoanPayment");
            }}>
            <View>
              <Text
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: 15,
                  fontSize: colors.fontSmall,
                  fontFamily,
                  backgroundColor: colors.sec,
                  color: colors.white,
                  borderRadius: 10,
                }}>
                Make Payment
              </Text>
            </View>
          </TouchableNativeFeedback>
        </MotiView>
        {/* buttons for loans and transactions */}
        <View
          style={{
            justifyContent: "space-between",
            width: width - 20,
            flexDirection: "row",
          }}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
              rippleColor,
              rippleOverflow
            )}
            onPress={() => {
              navigation.navigate("AllLoans");
            }}>
            <View style={styles.actionButton}>
              <Text
                style={{
                  fontSize: colors.fontSmall,
                  fontFamily,
                  color: colors.black,
                }}>
                All Loans
              </Text>
            </View>
          </TouchableNativeFeedback>
          {/* second button */}
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
              rippleColor,
              rippleOverflow
            )}
            onPress={() => {
              navigation.navigate("Payments");
            }}>
            <View style={styles.actionButton}>
              <Text
                style={{
                  fontSize: colors.fontSmall,
                  fontFamily,
                  color: colors.black,
                }}>
                Transactions
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple(
            rippleColor,
            rippleOverflow
          )}
          onPress={handleAddLoan}>
          <View style={styles.plus}>
            <MaterialCommunityIcons
              name="plus"
              color={colors.white}
              size={35}
              iconStyle={{
                margin: 0,
              }}
            />
          </View>
        </TouchableNativeFeedback>
        <BottomSheet
          ref={bottomSheetRef}
          index={sheetIndex}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          onChange={handleSheetChanges}
          animatedIndex={1}
          opacity={0.5}
          animatedPosition={1}
          enableTouchThrough={true}
          overDragResistanceFactor={15}
          enablePanDownToClose={true}
          backgroundStyle={styles.background}>
          <View>
            <Text style={styles.noti}>Notifications</Text>
          </View>
          <BottomSheetFlatList
            data={message}
            keyExtractor={(_, index) => index}
            renderItem={renderItem}
            ListEmptyComponent={EmptyComponent}
            refreshing={false}
            onRefresh={() => {
              getMessages();
            }}
          />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  head: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  btn: {
    width: "45%",
    height: 80,
    backgroundColor: colors.sec,
    borderRadius: 6,
    padding: 15,
    justifyContent: "flex-end",
    flexDirection: "row-reverse",
    alignItems: "center",
    overflow: "hidden",
  },
  txt: {
    fontSize: colors.fontSmall,
    color: colors.white,
    fontFamily,
    marginLeft: 3,
  },
  icon: {
    marginRight: 5,
    backgroundColor: colors.black,
    padding: 5,
    borderRadius: 40,
  },
  plus: {
    width: 60,
    justifyContent: "space-evenly",
    height: 60,
    position: "absolute",
    right: 10,
    bottom: 80,
    alignItems: "center",
    backgroundColor: colors.sec,
    borderRadius: 30,
    elevation: 5,
    flexDirection: "row-reverse",
    opacity: 0.8,
  },
  background: {
    backgroundColor: colors.white,
  },
  noti: {
    fontSize: colors.fontSmall,
    fontFamily,
    color: colors.black,
    marginLeft: 10,
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: width - 20,
    alignSelf: "center",
    borderBottomColor: colors.black,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: colors.fontTiny,
    marginBottom: 3,
    color: colors.black,
    fontFamily: "rgl",
  },
  text: {
    fontSize: colors.fontSmall,
    color: colors.black,
    fontFamily,
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    width: (width - 20) / 2.5,
    backgroundColor: "#fff",
    marginLeft: 20,
    marginVertical: 30,
    height: 100,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black,
  },
});
export default Home;
