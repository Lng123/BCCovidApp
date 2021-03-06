import { StatusBar } from "expo-status-bar";
import React, { Component, useState } from "react";
import { Dimensions, StyleSheet, Text, View, Button, TouchableWithoutFeedbackBase, RecyclerViewBackedScrollViewComponent } from "react-native";
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
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';


// global variables for breakpoints in data
// first breakpoint: 30,000 or so cases from start of data to November 30, 2020.
// next projected breakpoint: 60,000 cases by end of 2020.
const firstDataBreakpoint = new Date("2020-11-30");
const dataArchive = require('../backend/data-archive.json');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#ffffff"
    },
    title: {
        marginTop: 16,
        paddingVertical: 8,
        color: "#20232a",
        fontSize: 18,
        fontWeight: "bold"
    }
});

class MainStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady1: false,
            isReady2: false,
            isReady3: false,
            isReady4: false,
            isReady5: false,
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
            dailyCases: 0,
            selectedDate: 0,
            lastSevenDays: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            lastSevenDaysLabels: [" ", " "],
            latestSegmentData: [],
            archivedSegmentData: dataArchive
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

    // returns an cases of the last seven days, from yesterday to one week ago.
    last7Days() {
        var result = [];
        for (var i = 1; i < 8; i++) {
            var d = new Date();
            d.setDate(d.getDate() - i);
            result.push(this.formatDate(d));
        }

        return (result.join(','));
    }

    // function to get the cases per day for the last seven days
    newCases(data) {
        var casesByLastSevenDates = {};
        var lastSevenDaysStr = "";
        var today = new Date()
        today = this.formatDate(today);
        for (let i = data.length - 1; i > 0; i--) {
            if (data[i].Reported_Date == today) {
                continue;
            }
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

        var cases = Object.values(casesByLastSevenDates);
        var dates = Object.keys(casesByLastSevenDates);

        // Creates a string of the cases in the last seven days.
        for (let i = 0; i < dates.length; i++) {
            lastSevenDaysStr += dates[i] + ": " + cases[i] + "\n";
        }
        this.setState({ newCases: lastSevenDaysStr });

        var labelsForGraph = Object.keys(casesByLastSevenDates);
        for (let i = 0; i < labelsForGraph.length; i++) {
            let d = labelsForGraph[i].split('-')[2];
            labelsForGraph[i] = d;
            //console.log(d)
        }
        labelsForGraph = labelsForGraph.reverse();
        this.setState({ lastSevenDaysLabels: labelsForGraph })
        this.setState({ lastSevenDays: cases.reverse() });

        // this.setState({ newCases: JSON.stringify(casesByLastSevenDates) });
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
        console.log(genderCount)
        this.setState({ genderCases: JSON.stringify(genderCount) });
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
        //console.log(haCount)
    }

    loadData() {
        //console.log("loadData()");
        axios
            .get("https://mainstats.herokuapp.com/gender", { withCredentials: true })
            .then((response) => {
                var females = response.data[1].count;
                
                var males = response.data[2].count;
                for (let i = 0; i < response.data.length; i++){
                    if (response.data[i]._id == "M"){
                        males = response.data[i].count
                    }
                    if (response.data[i]._id == "F"){
                        females = response.data[i].count
                    }
                }

                // this.setState({genderCases:JSON.stringify(response.data)})
                this.setState({ genderCases: "Female Cases: " + females + "\nMale Cases: " + males })
                this.setState({ isReady3: true })
            });
        axios
            .get("https://mainstats.herokuapp.com/regions", { withCredentials: true })
            .then((response) => {
                var regionCasesStr = "";
                for (let i = 0; i < response.data.length; i++)(
                    regionCasesStr += response.data[i]._id + ": " + response.data[i].count + "\n"
                )

                this.setState({ region: regionCasesStr });
                this.setState({ isReady2: true })
                // this.setState({region:JSON.stringify(response.data)}) 
            });
        axios
            .get("https://mainstats.herokuapp.com/lastsevendays", { withCredentials: true })
            .then((response) => {
                //this.setState({ savedData: response.data });
                this.newCases(response.data);
                this.setState({ isReady1: true })

            });
        if (!this.state.latestSegmentData.length) {
            axios
                .get("https://mainstats.herokuapp.com/data", { withCredentials: true })
                .then((response) => {
                    console.warn("Called to heroku for the current data.");
                    this.setState({
                        isReady4: true,
                        savedData: response.data,
                        latestSegmentData: response.data
                    });
                });
            // .catch(error => console.error('(1) Inside error:', error));
        }


    }

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

    // data can be latestSegmentData or archivedSegmentData
    filterDataOnDay(UserDate, segmentData) {
        let date = UserDate.toString();
        date = new Date(date);
        date.setHours(0, 0, 0, 0);
        let EndUserDate = new Date(date);
        date.setDate(date.getDate() - 1);
        let start = 0;
        let end = 1;
        for (let i = 0; i < segmentData.length; i++) {
            let compareDate = new Date(segmentData[i].Reported_Date);
            if (compareDate <= date) {
                start = i + 1;
            }

            if (compareDate < EndUserDate) {
                end = i;
            }
        }
        return segmentData.slice(start, end + 1)
    }

    dateConfirmHandler = (date) => {
        //time in milliseconds
        var dateSelected = date;
        // var timezoneAdjustment = 28800000;
        // console.warn("Selected date: ", dateSelected);
        // dateSelected.setTime(dateSelected.getTime() - timezoneAdjustment);
        // console.warn("After adjustment: ", dateSelected);
        if (dateSelected > firstDataBreakpoint) {
            var filteredDates = this.filterDataOnDay(dateSelected, this.state.latestSegmentData)
            this.setState({ dailyCases: filteredDates.length });
        } else {
            var filteredDates = this.filterDataOnDay(dateSelected, this.state.archivedSegmentData);
            this.setState({ dailyCases: filteredDates.length });
        }
        this.setState({ selectedDate: dateSelected.toString() });
        console.warn("A date has been picked: ", dateSelected);
        this.setState({ isDatePickerVisible: false });
    }

    render() {
        //console.log(this.state.isReady)
        if (!this.state.isReady1 || !this.state.isReady2 || !this.state.isReady3) {
            return (
                <View>
                    <AppLoading
                        startAsync={this.loadData()}
                        onFinish={() => this.setState({ isReady: true })}
                        onError={console.warn}
                    />
                    <View>
                        <Text>Data is loading in, please wait</Text>
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>CASES BY GENDER</Text>
                    <Text>{this.state.genderCases}</Text>
                    <Text style={styles.title}>CASES BY REGION</Text>
                    <Text>{this.state.region}</Text>
                    <Text style={styles.title}>NEW CASES IN THE LAST SEVEN DAYS</Text>
                    <Text>{this.state.newCases}</Text>
                </View>
                <View>
                    <Button title="Show Date Picker" onPress={() => this.setState({ isDatePickerVisible: true })} />
                    <DateTimePickerModal
                        isVisible={this.state.isDatePickerVisible}
                        mode="date"
                        onConfirm={this.dateConfirmHandler}
                        onCancel={() => this.setState({ isDatePickerVisible: false })}
                    />
                    <Text>{this.state.dailyCases}</Text>
                    <Text>{this.state.selectedDate}</Text>
                </View>
                <View>

                    <LineChart
                        data={{
                            labels: this.state.lastSevenDaysLabels,
                            datasets: [
                                {
                                    data: this.state.lastSevenDays
                                }
                            ]
                        }}
                        width={Dimensions.get("window").width * 0.8} // from react-native
                        height={200}
                        yAxisLabel=""
                        yAxisSuffix=""
                        yAxisInterval={10} // optional, defaults to 1
                        fromZero={true}
                        chartConfig={{
                            backgroundColor: "#FFFFFF",
                            backgroundGradientFrom: "#FFFFFF",
                            backgroundGradientTo: "#FFFFFF",
                            decimalPlaces: 0, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#ffa726"
                            }
                        }}
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