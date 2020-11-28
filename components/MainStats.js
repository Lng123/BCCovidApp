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
                console.log("1 state  saved data")
                console.log(this.state.savedData);
                console.log("2 state  saved data")
            }).then(this.searchInData());
    }

    componentDidMount() {
      this.loadData();
        /*console.log("hey guys");
        axios
            .get("http://localhost:5000/data/", { withCredentials: true })
            .then((response) => {
                //console.log(response.data);
                this.setState({savedData : response.data}).catch((error)=>{
                  console.log(error);
               });;
            }).then(this.searchInData());*/
        
    }

    searchInData(){
      console.log("3 searchInData()");
      console.log(this.state.savedData)
      /*this.setState({
        reportedDate : savedData[0].Reported_Date,
        ha: savedData[0].HA,
        sex: savedData[0].Sex,
        ageGroup: savedData[0].Age_Group,
        classification: savedData[0].Classification_Reported
      })*/
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