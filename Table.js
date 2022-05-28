class Table {
    constructor(arr) {
        if (arr && arr[0] && (arr[0].id === undefined || arr[0].data === undefined)) {
            let normArray = []
            let i = 0;
            for (const data of arr) {
                normArray.push({
                    id: i,
                    data: data
                })
                i++;
            }
            this.select = normArray;
        } else {
            if (arr !== undefined) {
                this.select = arr;
            } else {
                throw new Error('Error: An array must be passed to create the table. Try creating it using something like this: "new Table([]);"')
            }
        }
    }

    delete(target) {
        target.select.forEach(targetRow => {
            this.select = this.select.filter(obj => obj != targetRow)
        })
        return { select: this.select }
    }

    whereId(id) {
        return new Table(this.select.filter(obj => obj.id === id))
    }

    static getDataFromNestedColumns(obj, columns) {
        if (!obj || !columns) {
            throw new Error("Please check again the arguments!");
        }
        const args = columns.split('.');
        let objData = obj.data;
        for (let arg of args) {
            if (objData[arg]) {
                objData = objData[arg];
            } else {
                return false;
            }
        }
        return objData;
    }

    whereEquals(column, value) {
        return new Table(this.select.filter(obj => {
            if (Table.getDataFromNestedColumns(obj, column)) {
                return Table.getDataFromNestedColumns(obj, column) == value;
            }
            return false;
        }));
    }

    whereNotEquals(column, value) {
        return new Table(this.select.filter(obj => {
            if (Table.getDataFromNestedColumns(obj, column)) {
                return Table.getDataFromNestedColumns(obj, column) != value;
            }
            return false;
        }));
    }

    insert(columns, data) {
        let newRow = {};
        let i = 0;
        for (let col of columns) {
            if (this.select && this.select[0]) {
                if (this.select[0].data[col]) {
                    newRow[col] = data[i];
                    i++;
                } else throw new Error('Error -1: Column does not exist on table.')
            } else {
                newRow[col] = data[i];
                i++;
            }
        }
        const lastId = this.select && this.select.length !== 0?this.select[this.select.length - 1].id:-1;
        this.select?this.select.push({ id: lastId + 1, data: newRow }):this.select = [{ id: lastId + 1, data: newRow }];
    }

    update(columns, data) {
        this.select.forEach(row => {
            let i = 0;
            for (let col of columns) {
                if (row.data[col]) {
                    row.data[col] = data[i];
                } else throw new Error('Error -2: Column does not exist on a row.')
                i++;
            }
        })
    }

    updateFirst(columns, data) {
        for (const row of this.select) {
            let i = 0;
            let isColFound = false
            for (let col of columns) {
                if (row.data[col]) {
                    row.data[col] = data[i];
                    isColFound = true;
                } else throw new Error('Error -2: Column does not exist on a row.')
                i++;
            }
            if (isColFound) break;
        }
    }

    unique() {
        let uniqueItems = [];
        if (this.select) {
            for (const item of this.select) {
                if (!uniqueItems.some(i => {
                    let isUnique = true;
                    for (let [index, data] of Object.entries(i.data)) {
                        if (item.data[index] !== data) {
                            isUnique = false;
                        }
                    }
                    return isUnique;
                })) {
                    uniqueItems.push(item)
                }
            }
        }        
        return new Table(uniqueItems);
    }
}

module.exports = Table;