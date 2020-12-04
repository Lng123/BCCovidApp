import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View, Button, TouchableWithoutFeedbackBase } from "react-native";
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

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
            isDatePickerVisible: false,
            totalCases: 1,
            recovered: 1,
            deaths: 0,
            genderCases: "",
            region: "",
            newCases: "",
            lastSevenDays:[]
        };
    }

    // pass in the number of cases
    totalCases(data) {
        this.setState({ totalCases: data.length });
    }

    // got dis baby from stack overflowwwwwwwwww thank you adeneo
    formatDate(date) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        date = yyyy + '-' + mm + '-' + dd;
        return date
    }

    // returns an array of the last five days
    last7Days() {
        var result = [];
        for (var i = 0; i < 7; i++) {
            var d = new Date();
            d.setDate(d.getDate() - i);
            result.push(this.formatDate(d));
        }

        return (result.join(','));
    }

    // function to get the cases per day for the last five days
    newCases(data) {
        var casesByLastSevenDates = {};
        // console.log(this.last5Days());
        for (let i = data.length - 1; i > 0; i--) {
            if (this.last7Days().includes(data[i].Reported_Date)) {
                if (casesByLastSevenDates[data[i].Reported_Date] == null) {
                    casesByLastSevenDates[data[i].Reported_Date] = 1;
                } else {
                    casesByLastSevenDates[data[i].Reported_Date]++;
                }
            } else {
                break;
            }
        }
        var array = Object.values(casesByLastSevenDates);
        this.setState({lastSevenDays : array});
        console.log(array);
        this.setState({ newCases: JSON.stringify(casesByLastSevenDates) });
        //console.log("Cases in last seven dates: " + casesByLastSevenDates);
    }

    casesByGender(data) {
        var males = 0;
        var females = 0;
        var genderCount = {};
        for (let i = 0; i < data.length; i++) {
            if (genderCount[data[i].Sex] == null) {
                genderCount[data[i].Sex] = 1;
            } else {
                genderCount[data[i].Sex]++;
            }
        }
        this.setState({ genderCases: JSON.stringify(genderCount) });
        console.log(genderCount);
    }

    casesByRegion(data) {
        //var fraser, vancouverCoastal, interior, northern, outOfCanada = 0;
        let haCount = {}
        for (let i = 0; i < data.length; i++) {
            if (haCount[data[i].HA] == null) {
                haCount[data[i].HA] = 1;
            } else {
                haCount[data[i].HA]++;
            }
        }
        this.setState({ region: JSON.stringify(haCount) });
        console.log(haCount)
    }

    loadData() {
        console.log("loadData()");
        axios
            .get("https://mainstats.herokuapp.com/data", { withCredentials: true })
            .then((response) => {
                //console.log(response.data);
                this.setState({ savedData: response.data });
                //console.log("setState");
                //console.log(this.state.savedData);
                this.searchInData();
                this.filterData();
                this.casesByGender(this.state.savedData);
                this.casesByRegion(this.state.savedData);
                this.newCases(this.state.savedData);
            });
    }

    componentDidMount() {
        this.loadData();
    }
    /*componentDidUpdate(){
        this.filterData();
      }*/

    searchInData() {
        //console.log("searchInData()");
        //console.log(this.state.savedData);
        this.setState({
            reportedDate: this.state.savedData[0].Reported_Date,
            ha: this.state.savedData[0].HA,
            sex: this.state.savedData[0].Sex,
            ageGroup: this.state.savedData[0].Age_Group,
            classification: this.state.savedData[0].Classification_Reported,
        });
    }

    filterData(startDate, endDate) {
        let a = new Date(2020, 1, 10);
        let b = new Date(2020, 2, 10);
        let start = 0;
        let end = 1;
        for (let i = 0; i < this.state.savedData.length; i++) {
            let compareDate = new Date(this.state.savedData[i].Reported_Date);
            if (compareDate < a) {
                start = i + 1;
            }

            if (compareDate < b) {
                end = i;
            }
        }
/*
        for (let k = start; k < end; k++) {
            console.log(this.state.savedData[k].Reported_Date);
        }*/
    }

    dateConfirmHandler = (date) => {
        console.warn("A date has been picked: ", date);
        this.setState({ isDatePickerVisible: false });
    }

    render() {
        return (
            <View>
                <View>
                    <Text>Cases By Gender: {this.state.genderCases}</Text>
                    <Text>Region Cases: {this.state.region}</Text>
                    <Text>New Cases (Today): {this.state.newCases}</Text>
                    <Text>New Cases (Seven): {this.state.lastSevenDays.toString()}</Text>
                </View>
                <View>
                    <Button title="Show Date Picker" onPress={() => this.setState({ isDatePickerVisible: true })} />
                    <DateTimePickerModal
                        isVisible={this.state.isDatePickerVisible}
                        mode="date"
                        onConfirm={this.dateConfirmHandler}
                        onCancel={() => this.setState({ isDatePickerVisible: false })}
                    />
                </View>
                <View>
               
                <LineChart
                    data={{
                        labels: ["5 days ago", "4 days ago", "3 days ago", "2 days ago", "1 days ago", "Today"],
                        datasets: [
                            {
                                data: [
                                    this.state.lastSevenDays[5],
                                    this.state.lastSevenDays[4],
                                    this.state.lastSevenDays[3],
                                    this.state.lastSevenDays[2],
                                    this.state.lastSevenDays[1],
                                    this.state.lastSevenDays[0]
                                ]
                            }
                        ]
                    }}
                    width={1000} // from react-native
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix=""
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View>
            </View >
        );
    }
}

export default MainStats;