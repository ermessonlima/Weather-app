import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, FlatList, Text, View, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import WeatherInfo from '../components/WeatherInfo'
import UnitsPicker from '../components/UnitsPicker';
import ReloadIcon from '../components/ReloadIcon'
import { colors } from '../utils/index'
import WeatherDetails from '../components/WeatherDetails';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

const WEATHER_API_KEY = '32b1da3b745c42a895fcef04fab2d4d2';
const BASE_WEATHER_URL = 'https://api.opencagedata.com/geocode/v1/json?'


const arr = [{
  name: "Rio de Janeiro",
  stado: 'RJ',
  pais: 'Brazil'
},
{
  name: "Penedo",
  stado: 'AL',
  pais: 'Brazil'
}
  , {
  name: "Maceio",
  stado: 'AL',
  pais: 'Brazil'
}]

export default function App() {

  const list = useSelector((state: any) => state.notes.list)
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [unitsSystem, setUnitsSystem] = useState('metric')

  const [isNewCity, setNewCity] = useState<any>('');

 
  useEffect(() => {
    load();
  }, [unitsSystem])


  async function submit() {
    if (isNewCity == undefined || isNewCity == '') {
      return;
    }
    setCurrentWeather(null)
    setErrorMessage(null)

    try {
      const { status } = await Location.requestBackgroundPermissionsAsync();

      if (status != 'granted') {
        setErrorMessage('Acces to location is needed to run the app.');
        return
      }
      const weatherUrl = `${BASE_WEATHER_URL}q=${isNewCity}&key=${WEATHER_API_KEY}`
      const response = await fetch(weatherUrl)
      const result = await response.json()

      if (response.ok) {
        setCurrentWeather(result)
        function geraStringAleatoria(tamanho:any) {
          var stringAleatoria = '';
          var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          for (var i = 0; i < tamanho; i++) {
            stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
          }
          return stringAleatoria;
        }
       const key = geraStringAleatoria(25)
    
        dispatch({
          type: 'ADD_NOTE',
          payload: {
            key: key,
            city: result.results[0].components.city,
            state: result.results[0].components.state_code,
            country: result.results[0].components.country
          }
        })

        setCurrentWeather(result)
        setNewCity(result.results[0].components.city_district)
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  async function load() {
    setCurrentWeather(null)
    setErrorMessage(null)
    try {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      if (status != 'granted') {
        setErrorMessage('Acces to location is needed to run the app.');
        return
      }
      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      const weatherUrl = `${BASE_WEATHER_URL}q=${latitude}+${longitude}&key=${WEATHER_API_KEY}`
      const response = await fetch(weatherUrl)
      const result = await response.json()
      if (response.ok) {
  
        setCurrentWeather(result)
        function geraStringAleatoria(tamanho:any) {
          var stringAleatoria = '';
          var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          for (var i = 0; i < tamanho; i++) {
            stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
          }
          return stringAleatoria;
        }
       const key = geraStringAleatoria(25)
  
        dispatch({
          type: 'ADD_NOTE',
          payload: {
            key: key,
            city: result.results[0].components.city_district,
            state: result.results[0].components.state_code,
            country: result.results[0].components.country
          }
        })
      } else {
        setErrorMessage(result.message)
      }
    } catch (error) {
      setErrorMessage(error.message)
    }
  }


  if (currentWeather) {
    return (
      <View style={styles.container}>
        <Text style={styles.textTitle}>
          Type your location here:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Search new City"
          placeholderTextColor="#555"
          onChangeText={setNewCity}
        />
    
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={submit}
            style={styles.buttonOpacity}>
            <Text style={styles.textButton}>
              Submit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={load}
            style={styles.buttonOpacity}>
            <MaterialCommunityIcons name="crosshairs-gps" size={24} color="white" />
          </TouchableOpacity>

        </View>
        <Text style={[styles.textTitle, { fontSize: 25, fontWeight: 'bold' }]}>
          Previous Searches
        </Text>

        <FlatList
          style={{ margin: 10 }}
          data={list}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <View style={{
              flexDirection: 'row',
              backgroundColor: '#c6c6c6',
              width: '100%', height: 80,
              marginBottom: 10,
              borderRadius: 20,
              justifyContent: 'space-between',
              padding: 10,

            }}>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  backgroundColor: colors.PRIMARY_COLOR,
                  height: '80%',
                  width: 4,
                  margin: 5,
                  marginRight: 10
                }} />

                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.city}</Text>
                  <Text>{item.state}, {item.country}</Text>
                </ View>
              </ View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name="arrowright" size={30} color={colors.PRIMARY_COLOR} />

              </ View>

            </ View>


          )}
        />
      </View>
    );
  } else if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10
  },
  main: {
    justifyContent: 'center',
    flex: 1,
  },
  buttonOpacity: {
    height: 60,
    width: 130,
    backgroundColor: colors.PRIMARY_COLOR,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  textButton: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '700',
  },
  textTitle: {
    fontSize: 20,
    color: '#000',
    marginLeft: 10
  },
  input: {
    height: 60,
    backgroundColor: '#FFF',
    color: '#000',
    fontSize: 18,
    padding: Platform.OS === 'ios' ? 15 : 10,
    marginTop: 30,
    borderRadius: 7,
    margin: 10,
  }
});
