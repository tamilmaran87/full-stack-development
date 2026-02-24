
IF OBJECT_ID('Employees', 'U') IS NOT NULL
    DROP TABLE Employees;
GO

CREATE TABLE Employees (
    EmpID INT PRIMARY KEY,
    Name VARCHAR(100),
    Salary DECIMAL(10,2)
);
GO


IF OBJECT_ID('Audit_Logs', 'U') IS NOT NULL
    DROP TABLE Audit_Logs;
GO

CREATE TABLE Audit_Logs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    TableName VARCHAR(50),
    Action VARCHAR(10),
    OldData NVARCHAR(MAX),
    NewData NVARCHAR(MAX),
    ChangedBy VARCHAR(100) DEFAULT SYSTEM_USER,
    ChangedAt DATETIME DEFAULT GETDATE()
);
GO



IF OBJECT_ID('trg_employee_audit', 'TR') IS NOT NULL
    DROP TRIGGER trg_employee_audit;
GO

CREATE TRIGGER trg_employee_audit
ON Employees
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;



    IF EXISTS (SELECT 1 FROM inserted)
       AND NOT EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO Audit_Logs (TableName, Action, NewData)
        SELECT
            'Employees',
            'INSERT',
            (SELECT * FROM inserted FOR JSON PATH);
    END

    -- UPDATE operation
    IF EXISTS (SELECT 1 FROM inserted)
       AND EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO Audit_Logs (TableName, Action, OldData, NewData)
        SELECT
            'Employees',
            'UPDATE',
            (SELECT * FROM deleted FOR JSON PATH),
            (SELECT * FROM inserted FOR JSON PATH);
    END
END;
GO



INSERT INTO Employees VALUES (1, 'John Doe', 50000);
GO

UPDATE Employees
SET Salary = 55000
WHERE EmpID = 1;
GO



SELECT * FROM Audit_Logs;
GO



IF OBJECT_ID('Daily_Activity_Report', 'V') IS NOT NULL
    DROP VIEW Daily_Activity_Report;
GO

CREATE VIEW Daily_Activity_Report AS
SELECT
    CAST(ChangedAt AS DATE) AS LogDate,
    Action,
    COUNT(*) AS TotalChanges
FROM Audit_Logs
GROUP BY CAST(ChangedAt AS DATE), Action;
GO



SELECT * FROM Daily_Activity_Report;
GO
