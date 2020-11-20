import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import axios from "axios";

class MainStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportedDate: 1,
            ha: 2,
            sex: 3,
            ageGroup: 4,
            classification: 5,
        };
    }

    loadData() { }

    componentDidMount() {
        console.log("hey guys");
        axios
            .get("http://localhost:5000/data/", { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                this.setState({
                    reportedDate: response.data[0].Reported_Date,
                    ha: response.data[0].HA,
                    sex: response.data[0].Sex,
                    ageGroup: response.data[0].Age_Group,
                    classification: response.data[0].Classification_Reported
                });
            });
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