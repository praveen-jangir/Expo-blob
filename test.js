import React, { Component } from 'react';

import { StyleSheet, Text, View, PixelRatio, TouchableOpacity, Image, TextInput, Alert } from 'react-native';

import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default class Project extends Component {

  constructor() {

    super();

    this.state = {

      ImageSource: null,

      data: null,

      Image_TAG: ''

    }
  }

getPermissionAsync = async () => {
    // Camera roll Permission 
    if (Platform.OS === 'android') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA,Permissions.AUDIO_RECORDING
);
    this.setState({ hasPermission: status === 'granted' });
  }

  handleCameraType=()=>{
    const { cameraType } = this.state

    this.setState({cameraType:
      cameraType === Camera.Constants.Type.back
      ? Camera.Constants.Type.front
      : Camera.Constants.Type.back
    })
  }

  pickImage = async () => {
    let response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,allowsEditing: true,
      aspect: [1,1],
      quality: 1,


    });
    if (!response.cancelled) {
       console.log(response.uri);
        this.setState({

          ImageSource: response.uri,
          data: response.data

        });
      }
  }

  uploadImageToServer = async () => {
   const response = await fetch(this.state.ImageSource);
    const blob = await response.blob();
    var reader = new FileReader();
    reader.onload = () => {

      var InsertAPI = 'http://11993fb0a6aa.ngrok.io/Server/upload.php';
      console.log(reader.result);
            var Data={img:reader.result};
            var headers={
            'Accept':'application/json',
            'Content-Type':'application.json'
            }
            fetch(InsertAPI,{
                method:'POST',
                headers:headers,
                body:JSON.stringify(Data),
            }).then((response)=>response.json()).then((response)=>{
                console.log(response)
            })
            .catch(err=>{
                console.log(err);
                
            })  
}
reader.readAsDataURL(blob);
            }

  render() {
    return (
      <View style={styles.container}>

        <TouchableOpacity onPress={this.pickImage.bind(this)}>

          <View style={styles.ImageContainer}>

            {this.state.ImageSource === null ? <Text>Select a Photo</Text> :
              <Image style={styles.ImageContainer} source={{uri:this.state.ImageSource}} />
            }

          </View>

        </TouchableOpacity>


        <TextInput

          placeholder="Enter Image Name "

          onChangeText={data => this.setState({ Image_TAG: data })}

          underlineColorAndroid='transparent'

          style={styles.TextInputStyle}
        />


        <TouchableOpacity onPress={this.uploadImageToServer} activeOpacity={0.6} style={styles.button} >

          <Text style={styles.TextStyle}> UPLOAD IMAGE TO SERVER </Text>

        </TouchableOpacity>

      </View>
    );
  }

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingTop: 20
  },

  ImageContainer: {
    borderRadius: 10,
    width: 250,
    height: 250,
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CDDC39',

  },

  TextInputStyle: {

    textAlign: 'center',
    height: 40,
    width: '80%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#028b53',
    marginTop: 20
  },

  button: {

    width: '80%',
    backgroundColor: '#00BCD4',
    borderRadius: 7,
    marginTop: 20
  },

  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    padding: 10
  }

});