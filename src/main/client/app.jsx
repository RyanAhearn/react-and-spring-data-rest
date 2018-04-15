import Button from 'material-ui/Button';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import CreateDialog from './CreateDialog';
import EmployeeList from './EmployeeList';
import Login from './Login';
import NavBar from './NavBar';
import client from './client';
import follow from './follow';
import stompClient from './websocket-listener';


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
                attributes: Object.keys(this.schema.properties).filter(property => {
                    return !(this.schema.properties[property].hasOwnProperty('format') &&
                            this.schema.properties[property].format === 'uri' ||
                            this.schema.properties[property].hasOwnProperty('$ref'));    
                }),
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
            });
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
                attributes: Object.keys(this.schema.properties).filter(property => {
                    console.log(this.schema.properties[property]);
                    return !(this.schema.properties[property].hasOwnProperty('format') &&
                            this.schema.properties[property].format === 'uri' ||
                            this.schema.properties[property].hasOwnProperty('$ref'));    
                }),
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
        }).catch(error => {
            if (error.status.code === 403) {
                alert('ACCESS DENIED: You are not authorized to delete that employee');
            }
        });
    }

    onUpdate = (employee, updatedEmployee) => {
        client({
            method: 'PUT',
            path: employee.entity._links.self.href,
            entity: updatedEmployee,
            headers: {
                'Content-Type': 'application/json',
                'If-Match': employee.headers.Etag
            }
        }).catch(error => {
            if (error.status.code === 403) {
                alert('ACCESS DENIED: You are not authorized to update that employee');
            }
            if (error.status.code === 412) {
                alert('Unable to update employee.  Your copy is stale.');
            }
        });
    }

    refreshAndGoToLastPage = (message) => {
        follow(client, root, [{
            rel: 'employees',
            params: {
                size: this.state.pageSize
            }
        }]).then(response => {
            if (response.entity._links.last !== undefined) {
                this.onNavigate(response.entity._links.last.href);
            } else {
                this.onNavigate(response.entity._links.self.href);
            }
        })
    }

    refreshCurrentPage = (message) => {
        follow(client, root, [{
            rel: 'employees',
            params: {
                size: this.state.size,
                page: this.state.page
            }
        }]).then(employeeCollection => {
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
                attributes: Object.keys(this.schema.properties).filter(property => {
                    return !(this.schema.properties[property].hasOwnProperty('format') &&
                            this.schema.properties[property].format === 'uri' ||
                            this.schema.properties[property].hasOwnProperty('$ref'));    
                }),
                pageSize: this.state.pageSize,
                links: this.links,
                count: this.page.totalElements,
                page: this.page.number
            });
        });
    }

    logout = e => {
        e.preventDefault();
        client({
            method: 'POST',
            path: '/logout'
        });
    }

    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
        stompClient([
            { route: '/topic/newEmployee', callback: this.refreshAndGoToLastPage },
            { route: '/topic/updateEmployee', callback: this.refreshCurrentPage },
            { route: '/topic/deleteEmployee', callback: this.refreshCurrentPage }
        ]);
    }

    render() {
        return (
            <div>
                <NavBar>
                    <CreateDialog attributes={this.state.attributes} onCreate={this.onCreate} />
                    <form action="/logout" method="post">
                        <Button color='inherit' type='submit'>Logout</Button>
                    </form>
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
                    attributes={this.state.attributes}
                    onUpdate={this.onUpdate}
                />
            </div>
        );
    }
}


ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={App} />
            <Route path='/login' component={Login} />
        </Switch>
    </BrowserRouter>
), document.getElementById('react'));