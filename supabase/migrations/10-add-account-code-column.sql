-- Add account_code column to invoices table
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS account_code VARCHAR(10);

-- Add comment for documentation
COMMENT ON COLUMN invoices.account_code IS 'Big 12 account code (e.g., 4105 for Awards, 4170 for Lodging)';

-- Update all Jostens invoices with Awards account code
UPDATE invoices 
SET account_code = '4105' 
WHERE vendor_name = 'Jostens';

-- Delete mock/test invoices
DELETE FROM invoices 
WHERE invoice_number LIKE 'AWD-%' 
   OR invoice_number LIKE 'INV-2025-%'
   OR vendor_name = 'TBD - Awards Vendor'
   OR vendor_name = 'Big 12 Conference';