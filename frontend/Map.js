import React, { Component } from 'react';
import { Scrollview, Dimensions, StyleSheet, View, Image, ScrollView, RefreshControl} from 'react-native';
import MapView from 'react-native-maps';
import { Easing, Animated, AppRegistry, TextInput, Alert, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback,} from 'react-native';
import Polyline from '@mapbox/polyline';
import { Container, Button, Text, Modal } from 'react-native';
import axios from 'axios';
const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
const Images = [
  { uri: "https://i.imgur.com/W4ETKKQ.jpg" },
  { uri: "http://2.bp.blogspot.com/-khzexD9EDD4/VVdlJXsw4mI/AAAAAAAAXH8/KkqNY3RtJYg/s1600/parking.jpg" },
  { uri: "https://i.imgur.com/nzUxP26.jpg" },
  { uri: "https://i.imgur.com/lHVuZ7g.jpg" },
  { uri: "https://i.imgur.com/L01KF.jpg" }
]
class FadeInView extends Component {
  state = {
    fadeAnim: new Animated.Value(20),
    expanded: true,
    text:"No"
  }
  
  toggle(){
      let initialValue    = this.state.expanded? 20 : 250,
          finalValue      = this.state.expanded? 250 : 20;

      this.setState({
          expanded : !this.state.expanded
      });

      this.state.fadeAnim.setValue(initialValue);
      Animated.spring(
          this.state.fadeAnim,
          {
              toValue: finalValue
          }
      ).start();
  }
  
  render() {
    let { fadeAnim } = this.state;
    
    return (
      <Animated.View                 
        style={{
          backgroundColor: "white",
          height: fadeAnim,        
        }}
      >
            <TouchableHighlight onPress={this.toggle.bind(this)} underlayColor="white" style = {{borderTopWidth: 1, height: 20}}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Detailed View</Text>
              </View>
            </TouchableHighlight>
        {this.props.children}
      </Animated.View>
    );
  }
}

class FadeInView2 extends Component {
  state = {
    fadeAnim: new Animated.Value(20),
    expanded: true,
    text:"No"
  }
  toggle(){
      let initialValue    = this.state.expanded? 20 : 250,
          finalValue      = this.state.expanded? 250 : 20;

      this.setState({
          expanded : !this.state.expanded
      });

      this.state.fadeAnim.setValue(initialValue);
      Animated.spring(
          this.state.fadeAnim,
          {
              toValue: finalValue
          }
      ).start();
  }
  
  render() {
    let { fadeAnim } = this.state;
    
    return (
      <Animated.View                 
        style={{
          top: 0,
          backgroundColor: "white",
          height: fadeAnim,        
        }}
      >
            <TouchableHighlight onPress={this.toggle.bind(this)} underlayColor="white" style = {{borderTopWidth: 1, height: "auto"}}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Driveway Settings</Text>
              </View>
            </TouchableHighlight>
        {this.props.children}
      </Animated.View>
    );
  }
}

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type:"hourly",
      modalVisible:false,
      modalVisible2: false,
      latitude: 43.7860579,
      longitude: -79.349437,
      error:null,
      coords: [],
      selected: 0,
      radius: 15,
      fadeAnim: new Animated.Value(20),
      expanded: true,
      springValue: new Animated.Value(0.5),
      selectMarkers: [],
      modalVisible: false,
      hourly:false,
      daily:false,
      monthly:false,
      hourly: "3",
      daily: "40",
      monthly:"300",
      description: "Luxury Hamilton driveway.",
      markers: [
        {
                  uniqueId : 1,
                  coordinate: {
                    latitude: 43.25088,
                    longitude: -79.91908,
                  },
                  title: "Best Driveway",
                  description: "This is 10/10 driveway",
                  price:0,
                  selected: false,
                  image: Images[0],
                  rate: {
                    hourly: 1,
                    daily: 4,
                    monthly:20,
                  }
        },
        {
                  uniqueId : 2,
                  coordinate : {
                    latitude: 43.2620348,
                    longitude: -79.930182,
                  },
                  title: "Mac Parking Lot",
                  description: "Why would anyone park here",
                  price:0,
                  selected: false,
                  image: Images[1],
                  rate: {
                    hourly: 100,
                    daily: 400,
                    monthly:2000,
                  }

        },
        {
                  uniqueId : 3,
                  coordinate: {
                    latitude: 43.6944823,
                    longitude: -79.4599204,
                  },
                  title: "Meh",
                  description: "It sorta counts",
                  price:0,
                  selected: false,
                  image: Images[2],
                  rate: {
                    hourly: 10,
                    daily: 40,
                    monthly:200,
                  }
                },
        {
                  uniqueId : 4,
                  coordinate : {
                    latitude: 43.6922662,
                    longitude: -79.4867893,
                  },
                  title: "yikes",
                  description: "it broke",
                  price:0,
                  selected: false,
                  image: Images[3],
                  rate: {
                    hourly: 10,
                    daily: 40,
                    monthly:200,
                  }
        },
        {
                  uniqueId : 5,
                  coordinate : {
                    latitude: 43.6487793,
                    longitude: -79.4007719,
                  },
                  title: "doggo",
                  description: "This is 10/10 dog, 0/10 for parking",
                  price:0,
                  selected: false,
                  image: Images[4],
                  rate: {
                    hourly: 10,
                    daily: 40,
                    monthly:200,
                  }
        }
      ]
    }
  }
  setModalVisible(visible) {
    this.setState({
      modalVisible:visible,
    })
  }
  setModalVisible2(visible) {
    this.setState({
      modalVisible2:visible,
    })
  }
  componentWillMount() {
    this.index = 0;
    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
       (position) => {
         this.setState({
           latitude: position.coords.latitude,
           longitude: position.coords.longitude,
           error: null,
         });
       },
       (error) => this.setState({ error: error.message }),
       { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
     );

   }

   handleRadius = (text) => {
    this.setState({radius: text})
  }

   _onPressButton(){
     if(this.state.modalVisible) {
      var coord = this.state.latitude.toString() + ', ' + this.state.longitude.toString()
      var dest = this.state.selectMarkers[0].latitude.toString() + ', ' + this.state.selectMarkers[0].longitude.toString()
      console.log(coord)
      this.getDirections(coord, dest);
      this.setModalVisible(false);
      Alert.alert('You have successfully reserved '+ this.state.markers[this.state.selected].title + "at a(n) " + this.state.type + " rate.");
     } else {
      this.setModalVisible(true);
     }
   }
   _onPressButton2(){
    if(this.state.modalVisible2) {
     var coord = this.state.latitude.toString() + ', ' + this.state.longitude.toString()
     var dest = this.state.selectMarkers[0].latitude.toString() + ', ' + this.state.selectMarkers[0].longitude.toString()
     console.log(coord)
     this.getDirections(coord, dest);
     this.setModalVisible(false);
     Alert.alert('You have successfully reserved '+ this.state.markers[this.state.selected].title + "at a(n) " + this.state.type + " rate.");
    } else {
     this.setModalVisible2(true);
    }
  }
   _onPressRateButton(rate){
      var coord = this.state.latitude.toString() + ', ' + this.state.longitude.toString()
      var dest = this.state.selectMarkers[0].latitude.toString() + ', ' + this.state.selectMarkers[0].longitude.toString()
      console.log(coord)
      this.getDirections(coord, dest);
     this.setState({type: rate});
     this.setModalVisible(false);
     Alert.alert('You have successfully reserved '+ this.state.markers[this.state.selected].title + " at a(n) " + rate + " rate of " + this.state.markers[this.state.selected].rate.hourly+ ".00.");

   }
   _onPressEditButton(rate, description) {
     this.setState({
       rate: rate,
       description: description,
     });
     this.setModalVisible2(false);
   }
   async getDirections(startLoc, destinationLoc) {
    try {
        let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=AIzaSyDBkFlNkBDZO78HHjofbA9-B91p2hHRFoA
        `)
        let respJson = await resp.json();
        console.log(respJson);
        //let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
        let points = Polyline.decode("at`gGjgwfNMzFKt@RDxABbIFr@GtBKp@@Pl@b@t@FbA?JFHJDV@fCENAdBGl@e@~@MZEvAFl@Vf@VVVLf@P@jANdFJlD?vADhBFHBn@PhPFpEjEk@JGl@cEdAiI");
        let coords = points.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        })
        this.setState({coords: coords})
        console.log(coords);
        this.forceUpdate();
        return coords;
    } catch(error) {
        return error
    }
  }
  fetchValues() {
  fetch('https://87c9f479.ngrok.io/spots?lat=43.6586789&lon=-79.3791235')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .then(obj => {
      this.state.markers = []
        for(var i=0; i < obj.length; i++) {
          this.state.markers.push(
              {
                  uniqueId : obj[i].id,
                  coordinate: {
                    latitude: obj[i].latitude,
                    longitude: obj[i].longitude,
                  },
                  title: obj[i].title,
                  description: obj[i].description,
                  price: obj[i].price,
                  selected: false,
                  image: obj[i].image,
                  rate: obj[i].rate,
              }
            )
        }
        this.forceUpdate();
        console.log(this.state.markers)
    })
    .catch((error) => {
      console.error(error);
    });
}
   springAnimation = () => {
    Animated.spring(this.state.springValue, {
      toValue: 4,
      friction: 1
    }).start();
   }
   animateTo(coordinate, index){
    if(this.state.selectMarkers.length == 0) {
      this.state.selectMarkers.push(coordinate);
    } else {
      this.state.selectMarkers.pop();
      this.state.selectMarkers.push(coordinate);
    }
    this.springAnimation();
    for(var i = 0; i < this.state.markers.length; i++){
      this.state.markers[i].selected = false;
      if(i == index){
        this.state.markers[i].selected = true;
        this.state.selected = i;
      }
    }
    this.map.animateToCoordinate(coordinate, 1000);
    this.forceUpdate();
   }
   _onCancelButton() {
     this.setModalVisible(false);
   }
   _onCancelButton2() {
     this.setModalVisible2(false);
   }
  render() {
    console.disableYellowBox = true;
    var latitude = this.state.latitude;
    var longitude = this.state.longitude;
    var _mapView: MapView
    var markers = this.state.markers || [];
    var selectMarkers = this.state.selectMarkers || [];
    return (
        <View style={styles.container}>
          <Modal
          animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('You have successfully reserved.');
            }}>
            <View
              style={{
                alignContent: "center",
                top: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}>
              <View style={
              { 
                backgroundColor: "white",
              }
              }>
                <Text>Press save to save changes:</Text>
                <Button title="Hourly" onPress={this._onPressRateButton.bind(this,"hourly")}></Button>
                <Button title="Daily" onPress={this._onPressRateButton.bind(this,"daily")}></Button>
                <Button title="Monthly" onPress={this._onPressRateButton.bind(this,"monthly")}></Button>
                <Button title="Cancel" onPress={this._onCancelButton.bind(this)}></Button>
              </View>
            </View>
        </Modal>
        <Modal
          animationType="fade"
            transparent={true}
            visible={this.state.modalVisible2}
            onRequestClose={() => {
              Alert.alert('You have successfully reserved.');
            }}>
            <View
              style={{
                alignContent: "center",
                top: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}>
              <View style={
              { 
                backgroundColor: "white",
              }
              }>
                <Text>Choose the rate to reserve:</Text>
                <TextInput
                  style={{height: 40, borderColor: 'black', borderWidth: 1}}
                  onChangeText={(hourly) => this.setState({hourly})}
                  value={this.state.hourly}
                />
                <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(daily) => this.setState({daily})}
                  value={this.state.daily}
                />
                <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(monthly) => this.setState({monthly})}
                  value={this.state.monthly}
                />
                <TextInput
                  style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(description) => this.setState({description})}
                  value={this.state.description}
                />
                <Button title="Save" onPress={this._onCancelButton2.bind(this)}></Button>
              </View>
            </View>
        </Modal>
        <MapView style={styles.map}
          ref={map => {this.map = map}}
          initialRegion={{
            latitude:43.26321,
            longitude:-79.9197863,
            latitudeDelta: 0.2,
            longitudeDelta:0.2,
          }}
          showsUserLocation = {true}
        >

          {markers.map((marker, index) => {
          return (
              <MapView.Marker key={index} coordinate={marker.coordinate}>
                <View style={styles.markerWrap}>
                  <Animated.View 
                  style={[styles.ring, 
            { transform: [{ scale: this.state.springValue }]}]}/>
                  <View style={styles.marker} />
                </View>
              </MapView.Marker>
            );
        })}  

          {selectMarkers.map((marker, index) => {
          return (
              <MapView.Marker key={index} coordinate={marker}
              ref={marker => (this.marker = marker)}
                onRegionChangeComplete={() => this.marker.showCallout()}>
              </MapView.Marker>
            );
        })}  
        <MapView.Polyline 
            coordinates={this.state.coords}
            strokeWidth={2}
            strokeColor="red"/>

        </MapView>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {markers.map((marker, index) => (
            <TouchableOpacity style={styles.card} key={index} onPress = {() => this.animateTo(this.state.markers[index].coordinate, index)}>
              <Image
                source={marker.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
                <Text numberOfLines={2} style={styles.cardDescription}>
                  {marker.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
        
        <FadeInView 
          ref={component => this._mainMenu = component}
        > 
          <View style = {styles.description}>
            <Image
                source={this.state.markers[this.state.selected].image}
                style={styles.cardImage}
                resizeMode="cover"
              />
            <View style={styles.texts}>
              <Text> Prices: </Text>
              <Text>  Hourly: {this.state.markers[this.state.selected].rate.hourly}.00 $</Text>
              <Text>  Daily: {this.state.markers[this.state.selected].rate.daily}.00 $</Text>
              <Text>  Monthly: {this.state.markers[this.state.selected].rate.monthly}.00 $</Text>
              <Text> Description: {this.state.markers[this.state.selected].description} </Text>
              <Button
                  onPress={this._onPressButton.bind(this)}
                  title= "Reserve">
                <View style={{width: 150, height: 100, backgroundColor: 'red'}}>
                  <Text style={{margin: 30}}>Button</Text>
                </View>
              </Button>
            </View>
          </View>
        </FadeInView>
        <FadeInView2>
          <View style = {styles.description}>
            <Image
                source={{uri:"https://shademaster.com/luxury-landscapes/photo/xlarge/173"}}
                style={styles.cardImage}
                resizeMode="cover"
              />
            <View style={styles.texts}>
              <Text> Prices: </Text>
              <Text>  Hourly: {this.state.hourly}.00 $</Text>
              <Text>  Daily: {this.state.daily}.00 $</Text>
              <Text>  Monthly: {this.state.monthly}.00 $</Text>
              <Text> Description: {this.state.description} </Text>
              <Button
                  onPress={this._onPressButton2.bind(this)}
                  title= "Edit Driveway">
                <View style={{width: 150, height: 100, backgroundColor: 'red'}}>
                  <Text style={{margin: 30}}>Button</Text>
                </View>
              </Button>
            </View>
          </View>
        </FadeInView2>
      </View>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'flex-end',
    flexDirection: 'column',
    flex: 1
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  text: { 
    backgroundColor:'rgba(0,0,0,0.4)', 
    width: 300,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    color: 'white',
  },
  nav: {
    position: 'absolute', 
    top: 0, 
    width: "100%",
    padding: 30, 
    backgroundColor: 'rgba(0,0,0,1)',    
  },
  scrollView: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 2,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    height: 50,
    width: 50,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(61,137,229, 0.9)",
  },
  ring: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(61,137,229, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(61,137,229, 0.5)",
  },

  description: {
    display: "flex", 
    width: "100%",
    height: "100%",
    padding: 10,
    flexDirection: "row",
  },
  boardImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignSelf: "center",
    flexGrow: 2,
    padding: 10,
  },
  texts: {
    flex:1,
    width: "100%",
    height: "100%",
    padding: 10,
  },
  button: {
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    width: "100%"
    
  },
});