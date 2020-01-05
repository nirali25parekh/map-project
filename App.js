import React from 'react';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator, TextInput, Button, KeyboardAvoidingView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';


class App extends React.Component {

  _isMounted = false

  state = {
    currentLocation: null,
    search: '',
    searchLocation: null,
  }

  LONGITUDE_DELTA = 0.02;
  LATITUDE_DELTA = 0.02;

  componentDidMount = () => {
    this._isMounted = true
    this._getLocationAsync()
    // console.log(this.state.currentLocation.coords)
  }


  _updateSearch = search => {
    //console.warn('changes')
    this.setState({ search });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.error('perms not granted')
      return
    }
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      this.setState({ currentLocation });
      //console.warn("current location" + this.state.currentLocation.coords)
    } catch (err) {
      console.error(err)
    }
  }

  _handleSearch = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.error('perms not granted')
      return
    }
    try {
      //console.warn("search is " + this.state.search)
      let searchLocationArray = await Location.geocodeAsync(this.state.search)
      if (searchLocationArray.length >= 0) {
        let searchLocation = searchLocationArray[0]

        this.setState({ searchLocation })
        console.warn(this.state.searchLocation)
      }
    } catch (err) {
      console.error(err)
    }

  }

  render() {
    if (!this.state.currentLocation)
      return (<View style={styles.container}>
        <ActivityIndicator
          size="large" color="#0000ff"
        />
      </View>)

    return (

      <KeyboardAvoidingView
        behavior='height'
        keyboardVerticalOffset='-260'
        style={styles.container}>
        <View style={styles.horizontal}>
          <TextInput
            style={styles.searchBarStyle}
            placeholder="Search for a place here..."
            onChangeText={this._updateSearch}
            value={this.state.search}
          />
          <Button title="Search"
            onPress={this._handleSearch} />
        </View>
        < MapView
          region={this.state.searchLocation ? {
            latitude: this.state.searchLocation.latitude,
            longitude: this.state.searchLocation.longitude,
            latitudeDelta: this.LATITUDE_DELTA,
            longitudeDelta: this.LONGITUDE_DELTA,
          } : {
            latitude: this.state.currentLocation.coords.latitude,
              longitude: this.state.currentLocation.coords.longitude,
              latitudeDelta: this.LATITUDE_DELTA,
              longitudeDelta: this.LONGITUDE_DELTA,
            }}
          style={styles.mapStyle}
          loadingEnabled={true}
          showsCompass={true}
        >
          <Marker coordinate={this.state.currentLocation.coords}
            title='You are here'
            pinColor="red" />

          <View>
            {this.state.searchLocation ? <Marker coordinate={this.state.searchLocation}
              title={this.state.search}
              pinColor='orange'
              centerOffset={{ x: 100, y: 100 }} /> : <View />}
          </View>

        </ MapView>
      </KeyboardAvoidingView>
    )


  }
  componentWillUnmount() {
    this._isMounted = false;
  }
};

const styles = StyleSheet.create({
  buttonStyle: {
    margin: 10,

  },
  horizontal: {
    flexDirection: 'row',

    marginBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
  searchBarStyle: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1
  }
});

export default App;
