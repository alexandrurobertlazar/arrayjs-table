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
            if (arr) {
                this.select = arr;
            } else {
                this.select = [];
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

    whereEquals(column, value) {
        return new Table(this.select.filter(obj => {
            if (obj.data[column]) {
                return obj.data[column] == value
            }
            return false
        }))
    }

    whereNotEquals(column, value) {
        return new Table(this.select.filter(obj => {
            if (obj.data[column]) {
                return obj.data[column] != value
            }
            return false
        }))
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
        const lastId = this.select?this.select[this.select.length - 1].id:-1;
        this.select.push({ id: lastId + 1, data: newRow });
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
}

module.exports = Table;