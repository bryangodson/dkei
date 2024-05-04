import {
  View,
  Text,
  FlatList,
  Dimensions,
  NativeModules,
  StatusBar,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
} from "react-native";
import { Component } from "react";
import colors from "../assets/colors";
const { width, height } = Dimensions.get("window");
const barHeight = NativeModules.StatusBarManager.HEIGHT;
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MotiView } from "moti";
import CusButt from "../components/cusButt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

export default class Onboard extends Component {
  constructor(props) {
    super(props);
    this.handleViewableItemsChanged =
      this.handleViewableItemsChanged.bind(this);
    this.viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
    this.state = {
      pageIndex: 0,
    };
  }

  handleViewableItemsChanged(info) {
    this.setState({ pageIndex: info.changed[0].index });
  }
  _done = () => {
    try {
      const setData = async () => {
        await AsyncStorage.setItem("firstOpen", "false");
        this.props.navigation.navigate("Login");
      };
      setData();
    } catch (error) {
      console.log(error);
    }
  };
  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1500);
  }

  render() {
    const data = [
      {
        id: 1,
        title: "Welcome to trecco",
        subtitle:
          "A place to make your argo venture a success. we can help you build your business in no time, hop on and let us go",
        icon: require("../assets/humans1.png"),
      },
      {
        id: 2,
        title: "Get live reports on your inventory",
        subtitle:
          "See how much you have left,and all other data, related to your agro produce right on your device.\n Hurray!",
        icon: require("../assets/humans2.png"),
      },
      {
        id: 3,
        title: "we know you need funding",
        subtitle:
          "Numerous cooperatives are ready to receive your application, \n Just browse from  a list and sign up.",
        icon: require("../assets/humans3.png"),
      },
    ];

    const RenderItem = ({ title, subtitle, image }) => {
      return (
        <ImageBackground source={image} resizeMode="cover" blurRadius={50}>
          <MotiView
            style={styles.item}
            from={{
              transform: [{ translateX: -width }],
              opacity: 0,
            }}
            animate={{
              transform: [{ translateX: 0 }],
              opacity: 1,
            }}
            transition={{
              duration: 500,
            }}>
            <View style={styles.items}>
              <Image
                source={image}
                resizeMode="cover"
                style={{
                  width: width * 0.8,
                  height: width * 0.9,
                }}
              />
              <View
                style={{
                  width,
                  padding: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
            </View>
          </MotiView>
        </ImageBackground>
      );
    };

    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.white}
          translucent={true}
        />
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <RenderItem
              title={item.title}
              subtitle={item.subtitle}
              image={item.icon}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="start"
          onViewableItemsChanged={this.handleViewableItemsChanged}
          viewabilityConfig={this.viewabilityConfig}
          ref={(ref) => {
            this.flatListRef = ref;
          }}
        />
        <View style={styles.pag}>
          <MotiView
            style={styles.dots}
            from={{
              width: 8,

              backgroundColor: colors.black,
            }}
            animate={{
              width: this.state.pageIndex === 0 ? 35 : 8,
              backgroundColor:
                this.state.pageIndex === 0 ? colors.sec : colors.black,
            }}
            transition={{
              duration: 450,
              type: "spring",
            }}></MotiView>
          <MotiView
            style={styles.dots}
            from={{ width: 8, backgroundColor: colors.black }}
            animate={{
              width: this.state.pageIndex === 1 ? 35 : 8,
              backgroundColor:
                this.state.pageIndex === 1 ? colors.sec : colors.black,
            }}
            transition={{
              duration: 450,
              type: "spring",
            }}></MotiView>
          <MotiView
            style={styles.dots}
            from={{ width: 8, backgroundColor: colors.black }}
            animate={{
              width: this.state.pageIndex === 2 ? 35 : 8,
              backgroundColor:
                this.state.pageIndex === 2 ? colors.sec : colors.black,
            }}
            transition={{
              duration: 450,
              type: "spring",
            }}></MotiView>
        </View>
        {this.state.pageIndex !== 2 && (
          <View style={styles.skip}>
            <Pressable
              onPress={() => {
                this._done();
              }}>
              <MaterialCommunityIcons
                name="close"
                size={23}
                color={colors.sec}
              />
            </Pressable>
          </View>
        )}
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            padding: 30,
            flexDirection: "row",
            width,
            position: "absolute",
            bottom: 0,
            height: 50,
          }}>
          <CusButt
            text="Previous"
            styling={styles.but}
            stylingTxt={styles.btnTxt}
            disabled={this.state.pageIndex === 0 && true}
            handlePress={
              (scrollToItem = () => {
                this.flatListRef.scrollToIndex({
                  animated: true,
                  index: this.state.pageIndex - 1,
                });
              })
            }
          />

          <CusButt
            text={this.state.pageIndex === 2 ? "Done" : "Next"}
            styling={styles.but}
            stylingTxt={styles.btnTxt}
            handlePress={
              (scrollToItem = () => {
                this.state.pageIndex !== 2 &&
                  this.flatListRef.scrollToIndex({
                    animated: true,
                    index:
                      this.state.pageIndex !== 2 && this.state.pageIndex + 1,
                  });
                this.state.pageIndex === 2 && this._done();
              })
            }
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingTop: barHeight,
  },
  item: {
    width,
    height,
  },
  items: {
    width,
    height,
    justifyContent: "center",
    padding: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "bold",
    marginBottom: 20,
    textAlign: "center",
    // alignSelf:'flex-start'
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "rgl",
    lineHeight: 30,
    textAlign: "center",
  },
  pag: {
    width: 60,
    height: 30,
    position: "absolute",
    top: barHeight + 10,
    left: 30,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  dots: {
    width: 8,
    height: 5,
    borderRadius: 4,
    backgroundColor: colors.black,
  },
  skip: {
    position: "absolute",
    right: 30,
    top: barHeight + 10,
    padding: 5,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  but: {
    width: width * 0.3,
    height: 40,
    backgroundColor: colors.sec,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTxt: {
    color: colors.white,
    fontFamily: "rgl",
    height: 40,
  },
});
