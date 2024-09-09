import msoffcrypto
import io
import pandas as pd
import sys
import openpyxl


decrypted = io.BytesIO()

with open("C:\\Users\\Operation\\Desktop\\Auddly\\nodeApp\\IST_Norma_Pendidikan.xls", "rb") as f:
    file = msoffcrypto.OfficeFile(f)
    file.load_key(password="gitpsy0001")  # Use password
    file.decrypt(decrypted)
# workbook = openpyxl.load_workbook(filename=decrypted)
# print(workbook.sheetnames)
df1 = pd.read_excel(decrypted,  sheet_name='Input')
df2 = pd.read_excel(decrypted, sheet_name='Output')
# print(df2.values)
df1.to_excel('output.xlsx')
sys.stdout.flush()