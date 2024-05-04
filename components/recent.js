import { Text, View ,Dimensions,Image, TouchableOpacity} from 'react-native'
import React, { Component } from 'react'
import colors from '../assets/constants';
const {width, height} =Dimensions.get('window');
export default class Recent extends Component {
  render() {
    const fontFamily='rgl';
    return (
        <TouchableOpacity>
        <View style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical:10,
            width:'100%',
            padding:10,
            flexDirection:'row',
            backgroundColor:'#fff',
          borderRadius: 10,
          elevation:20,
            height:55
        }}>
            <View style={{
                flexDirection:'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width:'70%'
            }}>
            <Image source={require('../assets/icon.png')} style={{
        width:35,
        height:30,
        borderRadius:15,
        marginRight:10,
        
            }}/>

            <View style={{
                flexDirection:'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Text style={{
                fontSize:17,
                fontFamily,
                fontWeight: 'normal',
                marginRight:10,
                opacity:0.9,
                color:colors.black
            }}>$300.00</Text>

            <Text style={{
                fontSize:15,
                fontFamily,
                fontWeight: 'normal',
                marginRight:10
            }}>made for</Text>
                <Text style={{
                    fontSize:17,
                    fontFamily,
                    fontWeight: 'normal',
                    marginLeft:5,
                    opacity: 0.9,
                    color:colors.black
                    
                }}>Trecco</Text>
                
            </View>

            </View>
            <View>
                <Text style={{
                    fontSize:12,
                    fontFamily,
                    fontWeight: 'normal',
                    
                }}>
                    -Leakage
                </Text>
            </View>
        </View>
        </TouchableOpacity>
    )
  }
}
