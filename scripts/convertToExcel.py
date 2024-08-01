import pymysql
from openpyxl import Workbook
from openpyxl import load_workbook

# Connect to MySQL database
connection = pymysql.connect(host='localhost',
                             user='root',
                             password='auddii98',
                             database='python_test')

# Create a new Excel workbook
wb = Workbook()
# wb.template = True
ws = wb.active

# Execute SQL query and fetch data
query = "SELECT * FROM python_connector_tb"
cursor = connection.cursor()
cursor.execute(query)
data = cursor.fetchall()

# Write data to Excel
for row_index, row_data in enumerate(data, start=1):
    for col_index, cell_data in enumerate(row_data, start=1):
        ws.cell(row=row_index, column=col_index, value=cell_data)

try:
    wb.save('output.xlsx')
except:
    print('######################################################')
    print('The file is open, please close it before trying again!')
    print('######################################################')
finally:
    # Close the connection
    connection.close()

