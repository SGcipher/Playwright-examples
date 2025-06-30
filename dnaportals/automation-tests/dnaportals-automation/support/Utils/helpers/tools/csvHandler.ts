import * as fs from 'fs';
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
            throw new Error(`Failed to read CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async writeCsv(data: string[][]): Promise<void> {
        try {
            const csvContent = data.map((row) => row.join(',')).join('\n');
            await fs.promises.writeFile(this.filePath, csvContent, 'utf-8');
        } catch (error) {
            throw new Error(`Failed to write CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
            const readStream = fs.createReadStream(this.filePath);
            const parser = csvParser();
            
            readStream
              .pipe(parser)
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
                  reject(new Error(`Failed to parse CSV: ${error.message}`));
              });

            // Ensure proper cleanup
            readStream.on('error', (error) => {
                reject(new Error(`Failed to read CSV file: ${error.message}`));
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
            
            outputStream.on('error', (error) => {
                reject(new Error(`Failed to write CSV file: ${error.message}`));
            });

            outputStream.on('finish', () => {
                resolve();
            });

            try {
                const headers = Array.from(dataMap.keys()).join(',') + '\n';
                outputStream.write(headers);
                
                const firstValue = dataMap.values().next().value;
                if (firstValue) {
                    for (let i = 0; i < firstValue.length; i++) {
                        const rowValue = Array.from(dataMap.values()).map((arr) => arr[i]);
                        const row = rowValue.join(',') + '\n';
                        outputStream.write(row);
                    }
                }
                
                outputStream.end();
            } catch (error) {
                outputStream.destroy();
                reject(new Error(`Failed to process CSV data: ${error instanceof Error ? error.message : 'Unknown error'}`));
            }
        });
    }

    private modifyColumn(value: string): string {
        return value.toUpperCase();
    }

    private getRandomNumber(): string {
        const randomNumber = Math.floor(Math.random() * 100000000);
        return randomNumber.toString();
    }

    private getFormattedDate(): string {
        return moment().format('YYYY-MM-DD');
    }

    private getFormattedDateTime(): string {
        return moment().format('YYYY-MM-DD hh:mm:ss');
    }
}
