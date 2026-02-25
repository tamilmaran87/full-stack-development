IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'PaymentDB')
BEGIN
    CREATE DATABASE PaymentDB;
END
GO

USE PaymentDB;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Accounts')
BEGIN
    CREATE TABLE Accounts (
        AccountId INT IDENTITY(1,1) PRIMARY KEY,
        AccountName VARCHAR(50) NOT NULL,
        AccountType VARCHAR(20) NOT NULL 
            CHECK (AccountType IN ('USER','MERCHANT')),
        Balance DECIMAL(12,2) NOT NULL 
            CHECK (Balance >= 0)
    );
END
GO

IF NOT EXISTS (SELECT * FROM Accounts)
BEGIN
    INSERT INTO Accounts (AccountName, AccountType, Balance) VALUES
    ('Kumar', 'USER', 5000.00),
    ('Anita', 'USER', 2500.00),
    ('AmazonStore', 'MERCHANT', 10000.00),
    ('FlipkartStore', 'MERCHANT', 8000.00);
END
GO

SELECT * FROM Accounts;

DECLARE @UserId INT = 1;        -- Paying User (Kumar)
DECLARE @MerchantId INT = 3;    -- Merchant (AmazonStore)
DECLARE @Amount DECIMAL(12,2) = 1200.00;

BEGIN TRY
    BEGIN TRANSACTION;

    -- 1. Check sufficient balance
    IF (SELECT Balance 
        FROM Accounts 
        WHERE AccountId = @UserId AND AccountType = 'USER') < @Amount
    BEGIN
        RAISERROR('Insufficient balance in user account.', 16, 1);
    END

    -- 2. Deduct amount from user
    UPDATE Accounts
    SET Balance = Balance - @Amount
    WHERE AccountId = @UserId AND AccountType = 'USER';

    IF @@ROWCOUNT <> 1
    BEGIN
        RAISERROR('User account update failed.', 16, 1);
    END

    -- 3. Credit amount to merchant
    UPDATE Accounts
    SET Balance = Balance + @Amount
    WHERE AccountId = @MerchantId AND AccountType = 'MERCHANT';

    IF @@ROWCOUNT <> 1
    BEGIN
        RAISERROR('Merchant account update failed.', 16, 1);
    END

    COMMIT TRANSACTION;
    PRINT 'Payment Successful. Transaction COMMITTED.';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    PRINT 'Payment Failed. Transaction ROLLED BACK.';
    PRINT ERROR_MESSAGE();
END CATCH;
GO

SELECT * FROM Accounts;

DECLARE @Amount DECIMAL(12,2) = 90000.00;
