-- SQL Server Setup Script for student-service

-- 1. Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'studentdb')
BEGIN
    CREATE DATABASE studentdb;
END
GO

USE studentdb;
GO

-- 2. Create Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[student]') AND type in (N'U'))
BEGIN
    CREATE TABLE student (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(100),
        department VARCHAR(100)
    );
END
GO

-- 3. Insert Sample Data
INSERT INTO student (name, department) VALUES ('John', 'AI');
INSERT INTO student (name, department) VALUES ('Alice', 'DS');
GO
