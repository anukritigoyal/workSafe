import React, { Component } from 'react';
import './HRPage.scss';
import Report from '../Report/report.js';
import {ROUTES} from '../../constants';
import { Route, Switch, Redirect } from 'react-router-dom';
import FirebaseService from '../../Firebase/firebaseService';

export default class HRPage extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path={ROUTES.hrReport} component={Report}></Route>
                </Switch>
                <ReportTable></ReportTable>
            </div>
        )
    }
}

class ReportTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldRedirect: false,
            rows: [],
            selectedName: "",
            selectedDate: null,
            selectedStatus: "",
            selectedType: "",
            selectedHarasser: ""
        };
        this.firebase = new FirebaseService();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(status, name, datetime, type, description, key, harasser) {
        this.setState({
            shouldRedirect: true,
            selectedStatus: status,
            selectedDate: datetime,
            selectedName: name,
            selectedType: type,
            selectedDesc: description,
            selectedKey: key,
            selectedHarasser: harasser
        });
    };

    componentDidMount() {
        this.createRows();
    }

    handleData(currentRows) {
        this.setState({rows: currentRows});
    }

    createRows() {
        let currentRows = []
        let statuses = ["Awaiting Review", "Validated", "Mediation", "Corrective Action", "Final Investigative Report Submitted"];
        for (var j = 0; j < statuses.length; j++) {
            this.firebase.getByStatus(statuses[j]).then(
                snap => {

                    for (var i in snap) {
                        let currKey = "";
                        currKey = (Object.keys(snap[i]))[0];
                        let document = snap[i][currKey]
                        var rowid = "t1row" + document.datetime + i;
                        let currStatus = document.status;
                        let currName = document.name;
                        let currDate = document.datetime;
                        let currType = document.type;
                        let currDescription = document.description;
                        let currHarasser = document.harasser;
                        console.log(document);
                        currentRows.push(
                            <button key={rowid} onClick={() => this.handleClick(currStatus, currName, currDate, currType, currDescription, currKey, currHarasser)}>
                                <div className={"rows " + (document.reportType === "bystander" ? "bystander" : "firstHand")}>
                                    <div className="content">
                                        <div className="head">
                                            <h2> {currName} </h2>
                                            <p className={currStatus.replace(/\s+/g, '')}> {currStatus} </p>
                                        </div>
                                        <p className="date"> {currDate} </p>
                                        <p className="type"> {currType} </p>
                                    </div>
                                </div>
                            </button>
                        )
                    }
                    this.handleData(currentRows);
                }
            )
        }
    }

    render() {
        if (this.state.shouldRedirect) {
            return <Redirect push to={{
                pathname: ROUTES.hrReport,
                state: { 
                    name: this.state.selectedName,
                    status: this.state.selectedStatus,
                    date: this.state.selectedDate,
                    type: this.state.selectedType,
                    description: this.state.selectedDesc,
                    key: this.state.selectedKey,
                    harasser: this.state.selectedHarasser
                }
            }} />
        }
        return (
            <div id="table1">
                {this.state.rows}
            </div>
        );
    }
}