package com.example.payroll;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
public class Employee {

    @Id
    @GeneratedValue
    private Long id;

    private String firstName;
    private String lastName;
    private String description;

    @Version
    @JsonIgnore
    private Long version;

    @ManyToOne
    private Manager manager;

    private Employee() {}

    public Employee(String firstName, String lastName, String description, Manager manager) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.description = description;
        this.manager = manager;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void SetVersion(Long version) {
        this.version = version;
    }

    public Long getVersion() {
        return version;
    }

    public Manager getManager() {
        return manager;
    }

    public void setManager(Manager manager) {
        this.manager = manager;
    }
}