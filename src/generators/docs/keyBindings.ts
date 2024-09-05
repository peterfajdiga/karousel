function formatComment(comment: string | undefined) {
    return comment === undefined ? "" : ` (${comment})`;
}

function printCols(...columns: (string[] | string)[]) {
    const nCols = columns.length;
    if (nCols === 0) {
        return;
    }

    let nRows = Math.min(...columns.filter(
        (column: string[] | string) => column instanceof Array
    ).map(
        (column: string[] | string) => column.length
    ));
    if (nRows === Infinity) {
        // we only have single string columns
        nRows = 1;
    }

    const colWidths = columns.map(
        (column: string[] | string) => {
            if (column instanceof Array) {
                return Math.max(...column.map(
                    (cell: string) => cell.length
                ))
            } else {
                return column.length;
            }
        }
    );

    function getCell(col: number, row: number) {
        const column = columns[col];
        const cell = column instanceof Array ? column[row] : column;
        if (col < nCols-1) {
            return cell.padEnd(colWidths[col]);
        } else {
            return cell;
        }
    }

    for (let row = 0; row < nRows; row++) {
        let line = "";
        for (let col = 0; col < nCols; col++) {
            line += getCell(col, row);
        }
        console.log(line);
    }
}

const empty: any = {};
const keyBindings = getKeyBindings(empty, empty);
const numKeyBindings = getNumKeyBindings(empty, empty);
