DECLARE @UserId INT = 1; -- Paying user (Kumar)
DECLARE @MerchantId INT = 3; -- Merchant (AmazonStore)
DECLARE @Amount DECIMAL(12,2) = 1200.00;
BEGIN TRY
 BEGIN TRANSACTION;
 -- 1) Check user has enough balance
 IF (SELECT Balance FROM Accounts WHERE AccountId = @UserId AND
AccountType='USER') < @Amount
 BEGIN
 RAISERROR('Insufficient balance in user account.', 16, 1);
 END
 -- 2) Deduct from user
 UPDATE Accounts
 SET Balance = Balance - @Amount
 WHERE AccountId = @UserId AND AccountType='USER';
 -- Safety check: ensure exactly 1 row updated
 IF @@ROWCOUNT <> 1
 BEGIN
 RAISERROR('User account not found / update failed.', 16, 1);
 END
 -- 3) Add to merchant
 UPDATE Accounts
 SET Balance = Balance + @Amount
 WHERE AccountId = @MerchantId AND AccountType='MERCHANT';
 -- Safety check: ensure exactly 1 row updated
 IF @@ROWCOUNT <> 1
 BEGIN
 RAISERROR('Merchant account not found / update failed.', 16, 1);
 END
