import * as fs from 'fs';
import * as path from 'path';
import csvParser = require('csv-parser');
import moment from 'moment';

//File for handling csv files/ data transformation for test automation

export class CsvHandler {
    private filePath: string;
    private dataMap: Map<string, string[]> = new Map();

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    async readCsv(): Promise<string[][]> {
        try {
            const content = await fs.promises.readFile(this.filePath, 'utf-8');
            return content.split('\n').map((line) => line.split(','));
        } catch (error) {
            console.error('Error reading CSV file:', error);
            return [];
        }
    }

    async writeCsv(data: string[][]): Promise<void> {
        try {
            const csvContent = data.map((row) => row.join(',')).join('\n');
            await fs.promises.writeFile(this.filePath, csvContent, 'utf-8');
        } catch (error) {
            console.error('Error writing CSV file:', error);
        }
    }

    async modifyCsvRow(rowIndex: number, columnIndex: number, newValue: string): Promise<void> {
        const data = await this.readCsv();
        if (data[rowIndex] && data[rowIndex][columnIndex] !== undefined) {
            data[rowIndex][columnIndex] = newValue;
            await this.writeCsv(data);
        }
    }

    async addRow(newRow: string[]): Promise<void> {
        const data = await this.readCsv();
        data.push(newRow);
        await this.writeCsv(data);
    }

    async deleteRow(rowIndex: number): Promise<void> {
        const data = await this.readCsv();
        if (data[rowIndex]) {
            data.splice(rowIndex, 1);
            await this.writeCsv(data);
        }
    }

    public async readCSV(): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.createReadStream(this.filePath)
              .pipe(csvParser())
              .on('data', (row) => {
                  const keys = Object.keys(row);
                  for (const key of keys) {
                      if (!this.dataMap.has(key)) {
                          this.dataMap.set(key, []);
                      }
                      this.dataMap.get(key)?.push(row[key]);
                  }
              })
              .on('end', () => {
                  resolve();
              })
              .on('error', (error) => {
                  reject(error);
              });
        });
    }

    public async modifyAndWriteToCSV(outputFileName: string, modifyColumns: string[]): Promise<void> {
        const modifiedDataMap: Map<string, string[]> = new Map();

        //Modify specified columns
        this.dataMap.forEach((values, key) => {
            if (modifyColumns.includes(key)) {
                if (key.includes('Unique_ID')) {
                    modifiedDataMap.set(
                        key,
                        values.map(() => this.getRandomNumber()),
                    );
                } else if (key === 'Date') {
                    modifiedDataMap.set(
                        key,
                        values.map(() => this.getFormattedDate()),
                    );
                } else if (key === 'Date_time') {
                    modifiedDataMap.set(
                        key,
                        values.map(() => this.getFormattedDateTime()),
                    );
                } else {
                    modifiedDataMap.set(
                        key,
                        values.map((value) => this.modifyColumn(value)),
                    );
                }
            } else {
                modifiedDataMap.set(key, values);
            }
        });
        return this.writeToCSV(outputFileName, modifiedDataMap);
    }

    public async writeToCSV(outputFileName: string, dataMap: Map<string, string[]>): Promise<void> {
        return new Promise((resolve, reject) => {
            const outputStream = fs.createWriteStream(`./fixtures/temp/${outputFileName}`);
            const headers = Array.from(dataMap.keys()).join(',') + '\n';
            outputStream.write(headers);
            for (let i = 0; i < dataMap.values().next().value.length; i++) {
                const rowValue = Array.from(dataMap.values()).map((arr) => arr[i]);
                const row = rowValue.join(',') + '\n';
                outputStream.write(row);
            }
            outputStream.end();
            outputStream.on('finish', () => {
                resolve();
            });
        });
    }

    private modifyColumn(value: string): string {
        return value.toUpperCase();
    }

    private getRandomNumber(): string {
        const randomNumber = Math.floor(Math.random() * 100000000);
        const value = randomNumber.toString();
        return value;
    }

    private getFormattedDate(): string {
        return moment().format('YYYY-MM-DD');
    }

    private getFormattedDateTime(): string {
        return moment().format('YYYY-MM-DD hh:mm:ss')
    }
}
