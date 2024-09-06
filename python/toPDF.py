from spire.xls import *
from spire.xls.common import *

# Create a Workbook object
workbook = Workbook()

# Load an Excel document
workbook.LoadFromFile("C:\\Users\\Administrator\\Desktop\\Input.xlsx")

# Get a specific worksheet (index starts at zero)
sheet = workbook.Worksheets[0]

# Convert the worksheet to PDF file
sheet.SaveToPdf("output/WorksheetToPdf.pdf")

# Dispose resources
workbook.Dispose()