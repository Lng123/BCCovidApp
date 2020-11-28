import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import axios from "axios";

class MainStats extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            savedData: {},
            reportedDate: 1,
            ha: 2,
            sex: 3,
            ageGroup: 4,
            classification: 5,
        };
    }

    loadData() { 
        console.log("loadData()");
        axios
            .get("http://localhost:5000/data/", { withCredentials: true })
            .then((response) => {
                //console.log(response.data);
                this.setState({savedData : response.data});
                console.log("setState")
                console.log(this.state.savedData);
                this.searchInData()
            });
    }

    componentDidMount() {
      this.loadData();
    }

    searchInData(){
      console.log("searchInData()");
      console.log(this.state.savedData)
      this.setState({
        reportedDate : this.state.savedData[0].Reported_Date,
        ha: this.state.savedData[0].HA,
        sex: this.state.savedData[0].Sex,
        ageGroup: this.state.savedData[0].Age_Group,
        classification: this.state.savedData[0].Classification_Reported
      })
    }


    render() {
        return (
            <View>
                <View>
                    <Text>{this.state.reportedDate}</Text>
                    <Text>{this.state.ha}</Text>
                    <Text>{this.state.sex}</Text>
                    <Text>{this.state.ageGroup}</Text>
                    <Text>{this.state.classification}</Text>
                </View>
            </View>
        );
    }
}

export default MainStats;