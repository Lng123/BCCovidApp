import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';



class MainStats extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reportedDate: 1,
            ha: 2,
            sex: 3,
            ageGroup: 4,
            classification: 5
        };
    }

    loadData(){
        
    }

    componentDidMount(){
        console.log("hey guys");
        axios.get("http://localhost:5000/data/").then((response) => {console.log(response.data)});
    }

    render() {
        return (
            <View>
                <View>
                    <Text>New Cases</Text>
                </View>
            </View>
        );
    }
}

export default MainStats;