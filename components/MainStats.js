import { StatusBar } from "expo-status-bar";
import React, { Component,useState } from "react";
import { Dimensions, StyleSheet, Text, View, Button, TouchableWithoutFeedbackBase } from "react-native";
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

class MainStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady1: false,
            isReady2: false,
            isReady3: false,
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
            lastSevenDays:[0,0,0,0,0,0,0,0,0],
            lastSevenDaysLabels:[" "," "],
            fullData:[],
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
            if(data[i].Reported_Date == today){
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
        for (let i = 0; i < dates.length; i++){
            lastSevenDaysStr += dates[i] + ": " + cases[i] + "\n";
        }
        this.setState ({newCases: lastSevenDaysStr});

        var labelsForGraph = Object.keys(casesByLastSevenDates);
        for(let i = 0;i<labelsForGraph.length;i++){
            let d = labelsForGraph[i].split('-')[2];
            labelsForGraph[i] = d;
            //console.log(d)
        }
        labelsForGraph = labelsForGraph.reverse();
        this.setState({lastSevenDaysLabels: labelsForGraph})
        this.setState({lastSevenDays : cases.reverse()});
        
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
            var females = response.data[0].count;
            var males = response.data[1].count;

            // this.setState({genderCases:JSON.stringify(response.data)})
            this.setState({genderCases: "Female Cases: " + females + "\nMale Cases: " + males })
            this.setState({ isReady3 : true })
        });
        axios
        .get("https://mainstats.herokuapp.com/regions", { withCredentials: true })
        .then((response) => {
            var regionCasesStr = "";
            for(let i = 0; i < response.data.length; i++)(
                regionCasesStr += response.data[i]._id + ": " + response.data[i].count + "\n"
            )

            this.setState({region: regionCasesStr});
            this.setState({ isReady2 : true })
            // this.setState({region:JSON.stringify(response.data)}) 
        });
        axios
        .get("https://mainstats.herokuapp.com/lastsevendays", { withCredentials: true })
        .then((response) => {
            //this.setState({ savedData: response.data });
            this.newCases(response.data);
            this.setState({ isReady1 : true })
            
        });
        
        
    }

    componentDidMount() {
        //console.log(this.state.isReady)
        //this.loadData();
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
        let start = 0;
        let end = 1;
        for (let i = 0; i < this.state.fullData.length; i++) {
            let compareDate = new Date(this.state.fullData[i].Reported_Date);
            if (compareDate < this.formatDate(startDate)) {
                start = i + 1;
            }

            if (compareDate < this.formatDate(endDate)) {
                end = i;
            }
        }
        console.log(this.state.fullData.slice(start,end))
        return this.state.fullData.slice(start,end)
    }

    
    filterDataOnDay(UserDate) {
        let StartDate = UserDate.toString();
        StartDate = new Date(StartDate);
        UserDate.setHours(0,0,0,0)
        let EndUserDate = new Date(UserDate)
        StartDate.setDate(StartDate.getDate() - 1)
        let start = 0;
        let end = 1;
        for (let i = 0; i < this.state.fullData.length; i++) {
            let compareDate = new Date(this.state.fullData[i].Reported_Date);
            if (compareDate <= UserDate) {
                start = i + 1;
            }

            if (compareDate < EndUserDate) {
                end = i;
            }
        }
        return this.state.fullData.slice(start,end+1)
    }

    dateConfirmHandler = (date) => {
        //time in milliseconds
        //var timezoneAdjustment = 28800000;
        //date.setTime(date.getTime()-timezoneAdjustment)
        if(this.state.fullData.length == 0){
         axios
             .get("https://mainstats.herokuapp.com/data", { withCredentials: true })
             .then((response) => {
                 this.setState({ savedData: response.data });
                 this.setState({ fullData: response.data });
                 var filteredDates = this.filterDataOnDay(date)
                 this.setState({dailyCases: filteredDates.length});
                 
             }).catch(error => console.error('(1) Inside error:', error))
            } else {
                var filteredDates = this.filterDataOnDay(date)
                this.setState({dailyCases: filteredDates.length});
        }
        this.setState({selectedDate: date.toString()})
        console.warn("A date has been picked: ", date);     
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
            ); }   
        return (
            <View>
                <View>
                    <Text>CASES BY GENDER</Text>
                    <Text>{this.state.genderCases}</Text>
                    <Text>CASES BY REGION</Text>
                    <Text>{this.state.region}</Text>
                    <Text>NEW CASES IN THE LAST SEVEN DAYS:</Text>
                    <Text>{this.state.newCases}</Text>
                    {/* <Text>New Cases (Seven): {this.state.lastSevenDays.toString()}</Text> */}
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