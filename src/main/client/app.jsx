import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import client from './client';
import follow from './follow';
import EmployeeList from './EmployeeList';
import Employee from './Employee';
import NavBar from './NavBar';
import CreateDialog from './CreateDialog';

const root = '/api';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            employees: [],
            attributes: [],
            pageSize: 5,
            links: []
        };

    }

    loadFromServer(pageSize) {
        follow(client, root, [
            { rel: 'employees', params: { size: pageSize } }
        ]).then(employeeCollection => {
            return client({
                method: 'GET',
                path: employeeCollection.entity._links.profile.href,
                headers: { 'Accept': 'application/schema+json' }
            }).then(schema => {
                this.schema = schema.entity;
                return employeeCollection;
            });
        }).then(employeeCollection => {
            this.links = employeeCollection.entity._links;
            this.page = employeeCollection.entity.page;
            return employeeCollection.entity._embedded.employees.map(employee => {
                return client({
                    method: 'GET',
                    path: employee._links.self.href
                });
            });
        }).then(employeePromises => {
            return Promise.all(employeePromises);
        }).then(employees => {
            this.setState({
                employees: employees,
                attributes: Object.keys(this.schema.properties),
                pageSize: pageSize,
                links: this.links,
                count: this.page.totalElements,
                page: this.page.number
            });
        });
    }

    onCreate = newEmployee => {
        follow(client, root, ['employees']).then(employeeCollection => {
            return client({
                method: 'POST',
                path: employeeCollection.entity._links.self.href,
                entity: newEmployee,
                headers: { 'Content-Type': 'application/json' }
            })
        }).then(response => {
            return follow(client, root, [
                { rel: 'employees', params: { size: this.state.pageSize } }
            ]);
        }).then(response => {
            if (typeof response.entity._links.last != 'undefined') {
                this.onNavigate(response.entity._links.last.href);
            } else {
                this.onNavigate(response.entity._links.self.href);
            }
        });
    }

    onNavigate = navUri => {
        client({ method: 'GET', path: navUri }).then(employeeCollection => {
            this.links = employeeCollection.entity._links;
            this.page = employeeCollection.entity.page;
            return employeeCollection.entity._embedded.employees.map(employee => {
                return client({
                    method: 'GET',
                    path: employee._links.self.href
                });
            });
        }).then(employeePromises => {
            return Promise.all(employeePromises);
        }).then(employees => {
            this.setState({
                employees: employees,
                attributes: Object.keys(this.schema.properties),
                pageSize: this.state.pageSize,
                links: this.links,
                count: this.page.totalElements,
                page: this.page.number
            });
        });
    }

    onChangePageSize = e => {
        this.setState({ pageSize: e.target.value });
        this.loadFromServer(e.target.value);
    }

    onDelete = employee => {
        client({
            method: 'DELETE',
            path: employee.entity._links.self.href
        }).then(response => {
            this.loadFromServer(this.state.pageSize);
        })
    }

    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
    }

    render() {
        return (
            <div>
                <NavBar>
                    <CreateDialog attributes={this.state.attributes} onCreate={this.onCreate} />
                </NavBar>
                <EmployeeList 
                    employees={this.state.employees} 
                    onChangePageSize={this.onChangePageSize} 
                    onNavigate={this.onNavigate}
                    onChangePageSize={this.onChangePageSize}
                    onDelete={this.onDelete}
                    links={this.state.links}
                    pageSize={this.state.pageSize} 
                    count={this.state.count}
                    page={this.state.page}
                />
            </div>
        );
    }
}


ReactDOM.render(<App />, document.getElementById('react'));