/* 
    core.datatable
    20.08.2022
    Piri AYKUT - piriaykut@gmail.com
    https://www.linkedin.com/in/piri-aykut-ba395b70/
 */
export class CoreDatatable {
    constructor(_tableid) {
        if (_tableid != undefined) {
            this._table = new $.fn.dataTable.Api(_tableid);
        }

        this.languageparam = null;
    }

    count() {
        return this._table.rows().count();
    }
    data(_rowindex) {
        let dt = this._table.row(_rowindex).data();

        if (dt === undefined) {
            return null;
        } else {
            return dt;
        }
    }
    selected() {
        return this._table.row({ selected: true }).data();
    }
    refresh() {
        this._table.row({ selected: true }).draw();
        return true;
    }
    filter(_colindex, _searchtext) {
        this._table.column(_colindex).search(_searchtext).draw();
        return true;
    }


}