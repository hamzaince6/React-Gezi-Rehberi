-- readTime sütununu nvarchar(50) olarak güncelle
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Stories' AND COLUMN_NAME = 'readTime')
BEGIN
    ALTER TABLE Stories
    ALTER COLUMN readTime nvarchar(50)
END
