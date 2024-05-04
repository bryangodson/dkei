import { View, Text, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function CusButt({iconName,handlePress,color,size,stylingTxt,text,disabled,styling}) {
  return (
      <TouchableOpacity onPress={handlePress} style={[styling, {opacity:disabled&&0.3,}]} disabled={disabled}> 
    
        <MaterialCommunityIcons name={iconName} color={color} size={ size} />
          <Text style={stylingTxt}>
          {text}
          </Text>
       
        </TouchableOpacity>
  )
}