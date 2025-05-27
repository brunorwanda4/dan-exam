DROP DATABASE IF EXISTS EPMS;

CREATE DATABASE EPMS;

USE EPMS;

CREATE TABLE
    Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password  VARCHAR(255) NOT NULL
    );

CREATE TABLE
    Department (
        id INT AUTO_INCREMENT PRIMARY KEY,
        departmentCode VARCHAR(50) NOT NULL UNIQUE,
        departmentName VARCHAR(255) NOT NULL,
        grossSalary VARCHAR(80) NOT NULL
    );

CREATE TABLE
    Employee (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employeeNumber VARCHAR(50) NOT NULL UNIQUE,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        position VARCHAR(80) NOT NULL,
        address VARCHAR(255) NOT NULL,
        telephone VARCHAR(16) NOT NULL,
        hiredDate Date DEFAULT CURRENT_DATE,
        departmentId INT NOT NULL,
        FOREIGN KEY (departmentId) REFERENCES Department (id) ON DELETE CASCADE
    );

CREATE TABLE
    Salary (
        id INT AUTO_INCREMENT PRIMARY KEY,
        totalDeduction VARCHAR(255) NOT NULL,
        netSalary VARCHAR(255) NOT NULL,
        month INT NOT NULL,
        employeeId INT NOT NULL,
        FOREIGN KEY (employeeId) REFERENCES Employee (id) ON DELETE CASCADE
    )