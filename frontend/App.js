import React, { Component } from 'react';
import { Scrollview, Dimensions, StyleSheet, Text, View, Image, ScrollView, RefreshControl} from 'react-native';
import MapView from 'react-native-maps';
import { Easing, Animated, AppRegistry, TextInput, Button, Alert, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback,} from 'react-native';

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
const Images = [
  { uri: "https://i.imgur.com/W4ETKKQ.jpg" },
  { uri: "https://i.imgur.com/YjPo3PR.jpg" },
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
            <TouchableHighlight onPress={this.toggle.bind(this)} underlayColor="white">
              <View style={styles.button}>
                <Text style={styles.buttonText}>More Info</Text>
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
      latitude: null,
      longitude: null,
      error:null,
      selected: 0,
      radius: 15,
      fadeAnim: new Animated.Value(20),
      expanded: true,
      springValue: new Animated.Value(0.5),
      selectMarkers: [],
      markers: [
        {
                  uniqueId : 1,
                  coordinate: {
                    latitude: 43.7860579,
                    longitude: -79.349437,
                  },
                  title: "Best Place",
                  description: "This is 10/10 driveway",
                  price:0,
                  selected: false,
                  image: Images[0],
        },
        {
                  uniqueId : 2,
                  coordinate : {
                    latitude: 43.6950552,
                    longitude: -79.4183759,
                  },
                  title: "Second Best Place",
                  description: "This is 8/10 driveway",
                  price:0,
                  selected: false,
                  image: Images[1],


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
                  image: Images[2],        },
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
        }
      ]
    }
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
    console.log("MOVE");
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
  render() {
    console.disableYellowBox = true;
    var latitude = this.state.latitude;
    var longitude = this.state.longitude;
    var _mapView: MapView
    var markers = this.state.markers || [];
    var selectMarkers = this.state.selectMarkers || [];
    return (
      
      <View style={styles.container}>
        
        <MapView style={styles.map}
          ref={map => {this.map = map}}
          initialRegion={{
            latitude:latitude,
            longitude:longitude,
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

        <TouchableNativeFeedback
          onPress={this._onPressButton}
          background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={{width: 150, height: 100, backgroundColor: 'red'}}>
          <Text style={{margin: 30}}>Button</Text>
        </View>
      </TouchableNativeFeedback>
        </Animated.ScrollView>
        <View style = {styles.nav}>
          <View style = {{flexDirection: 'row'}}>
            <View>
              <TextInput
                style={styles.text}
                placeholder="Find parking spots a max distance away..."
                returnKeyLabel = {"next"}
                onChangeText={this.handleLocation}
              />
            </View>
            <Button 
              style = {{flex: 0, width: 20}}
              onPress={() => this.move(this.state.location, this.state.destination)}
              title="Go!"
              color="#841584"
            />
          </View>
        </View>
        <FadeInView 
          ref={component => this._mainMenu = component}
        > 
          <View style = {styles.description}>
            <Image
                source={this.state.markers[this.state.selected].image}
                style={styles.boardImage}
                resizeMode="cover"
              />
            <View style={styles.texts}>
              <Text> Price: {this.state.markers[this.state.selected].price} </Text>
              <Text> Description: {this.state.markers[this.state.selected].description} </Text>
            </View>
          </View>
        </FadeInView>
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
    bottom: 30,
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
    flexDirection: "row",
  },
  boardImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignSelf: "center",
    flexGrow: 2,
  },
  texts: {
    flex:1,
    width: "100%",
    height: "100%", 
    flexGrow: 2,
  }
});