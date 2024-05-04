import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
import Tabs from "./screens/tabs";
import Loan from "./screens/Loan";
import Onboard from "./screens/onboarding";
import Login from "./screens/login";
import AboutApp from "./screens/aboutApp";
import AddInventory from "./screens/addInventory";
import AddSales from "./screens/addSales";
import EditProfile from "./screens/editProfile";
import LoanDetails from "./screens/loanDetails";
import LoanPayment from "./screens/loanPayment";
import Payments from "./screens/payments";
import SignUp from "./screens/signUp";
import AllLoans from "./screens/loans";
import PaymentDetails from "./screens/paymentDetails";
import VerifyId from "./screens/verifyId";
import SecurityQuestions from "./screens/sec";
import Profile from "./screens/profile";

import { useFonts } from "expo-font";
export default function App() {
  // Imprting all fonts needed for the rypings
  const [fontsLoaded] = useFonts({
    bold: require("./assets/fonts/Poppins-Bold.ttf"),
    rgl: require("./assets/fonts/Poppins-Regular.ttf"),
  });
  // do not show the app as along as fonts are not finished loading

  if (!fontsLoaded) {
    return null;
  }
  // return all scrrens
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="AboutApp" component={AboutApp} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="LoanDetails" component={LoanDetails} />
        <Stack.Screen name="LoanPayment" component={LoanPayment} />
        <Stack.Screen name="Payments" component={Payments} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="AddInventory" component={AddInventory} />
        <Stack.Screen name="AddSales" component={AddSales} />
        <Stack.Screen name="Onboard" component={Onboard} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Loan" component={Loan} />
        <Stack.Screen name="VerifyId" component={VerifyId} />
        <Stack.Screen name="AllLoans" component={AllLoans} />
        <Stack.Screen name="PaymentDetails" component={PaymentDetails} />
        <Stack.Screen name="Me" component={Profile} />
        <Stack.Screen name="securityQuestions" component={SecurityQuestions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
