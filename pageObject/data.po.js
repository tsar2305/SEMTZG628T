const XLSX = require('xlsx');

class Data {
  readExcel(filePath, sheetName) {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet); // <-- returns array
  }
  async writeExcel(filePath, sheetName) {
            const workbook = XLSX.writeFile(filePath);
            const worksheet = workbook.Sheets[sheetName];
            return XLSX.utils.sheet_to_json(worksheet);
        }
    }


module.exports = { Data };
        
