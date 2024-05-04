import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./home";
import Settings from "./settings";
import Reports from "./report";
import Accounts from "./accounts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import colors from "../assets/colors";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

const Tab = createBottomTabNavigator();
export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          }

          if (route.name === "Reports") {
            iconName = "chart-bell-curve";
          }
          if (route.name === "Settings") {
            iconName = "cog-outline";
          }
          if (route.name === "Help") {
            iconName = "comment-outline";
          }
          if (route.name === "Help") {
            iconName = "comment-outline";
          }
          if (route.name === "Book Keeper") {
            iconName = "bookshelf";
          }
          return (
            <MaterialCommunityIcons
              name={iconName}
              size={(size = focused ? 25 : 20)}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: colors.sec,
        tabBarInactiveTintColor: colors.black,
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: "rgl",
          paddingBottom: 5,
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 10,
          height: 55,
          width: width - 10,
          left: 5,
          borderRadius: 40,
          backgroundColor: colors.white,
          elevation: 5,
        },
      })}
      initialRouteName="Home">
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Reports" component={Reports} />
      <Tab.Screen name="Book Keeper" component={Accounts} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
