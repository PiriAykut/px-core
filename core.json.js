/*
    core.json
    20.08.2022
    Piri AYKUT - piriaykut@gmail.com
    https://www.linkedin.com/in/piri-aykut-ba395b70/
 */
export class CoreJSON {
    filter(arr, field, value, operator, logicaloperator) {
        if (arr == undefined || arr == null || arr.length == 0) {
            return [];
        }

        var rv = null;
        var arrCriteria = [];

        if (operator === undefined || operator == null) {
            operator = '==';
        }

        if (logicaloperator === undefined || logicaloperator == null) {
            logicaloperator = '&&';
        }

        if (!Array.isArray(field) && !Array.isArray(value)) {
            if (field !== "") {
                arrCriteria.push([field, value, (!Array.isArray(logicaloperator) ? logicaloperator : logicaloperator[0])]);
            }
        } else if (!Array.isArray(field) && Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
                arrCriteria.push([field, value[i], (!Array.isArray(logicaloperator) ? logicaloperator : logicaloperator[i])]);
            }
        } else if (Array.isArray(field) && Array.isArray(value)) {
            for (var i = 0; i < field.length; i++) {
                arrCriteria.push([field[i], value[i], (!Array.isArray(logicaloperator) ? logicaloperator : logicaloperator[i])]);
            }
        }



        if (arrCriteria.length > 0 && arr !== undefined && arr !== null && arr.length > 0) {
            rv = arr.arrfilter(field, value, operator, logicaloperator);


            // var kriter = "";
            // var status = true;

            // for (var i = 0; i < arrCriteria.length; i++) {
            //     let _vl = null;

            //     for (const [key, value] of Object.entries(i)) {
            //         if (arrCriteria[i][0] == key) _vl = value;
            //     }
            //     status = _vl !== undefined;

            //     if (!status) {
            //         core.u.alert('Uyarı', 'Filtre için gönderilen alan dizi içerisinde mevcut değil!<br/><br/><b>Alan Adı : </b>' + arrCriteria[i][0], 'error');
            //         return null;
            //     }

            //     // kriter += (kriter !== "" ? " && " : "") +
            //     // '(' +
            //     // '   ($.type(i).toString() == "object" && ' + (arrCriteria[i][1] == null ? 'i.' + arrCriteria[i][0] + operator + 'null' : 'i.' + arrCriteria[i][0] + '!==null && i.' + arrCriteria[i][0] + '.toString() ' + operator + ' "' + arrCriteria[i][1] + '"') + ') || ' +
            //     // '   ($.type(i).toString() == "object" && ' + (arrCriteria[i][1] == null ? '0=0' : 'i.' + arrCriteria[i][0] + '!==null && i.' + arrCriteria[i][0] + '.toString().indexOf("' + arrCriteria[i][1] + '") > -1') + ') || ' +
            //     // '   ($.type(n).toString() == "object" && ' + (arrCriteria[i][1] == null ? 'n.' + arrCriteria[i][0] + operator + 'null' : 'n.' + arrCriteria[i][0] + '!==null && n.' + arrCriteria[i][0] + '.toString() ' + operator + '"' + arrCriteria[i][1] + '"') + ') || ' +
            //     // '   ($.type(n).toString() == "object" && ' + (arrCriteria[i][1] == null ? '0=0' : 'n.' + arrCriteria[i][0] + '!==null && n.' + arrCriteria[i][0] + '.toString().indexOf("' + arrCriteria[i][1] + '") > -1') + ') ' +
            //     // ')';

            //     kriter += (kriter !== "" ? " " + arrCriteria[i][2] + " " : "") +
            //         '(($.type(i).toString() == "object" && ' + (arrCriteria[i][1] == null ? 'i.' + arrCriteria[i][0] + operator + 'null' : 'i.' + arrCriteria[i][0] + '!==null && i.' + arrCriteria[i][0] + '.toString() ' + operator + ' "' + arrCriteria[i][1] + '"') + ') || ' +
            //         ' ($.type(n).toString() == "object" && ' + (arrCriteria[i][1] == null ? 'n.' + arrCriteria[i][0] + operator + 'null' : 'n.' + arrCriteria[i][0] + '!==null && n.' + arrCriteria[i][0] + '.toString() ' + operator + '"' + arrCriteria[i][1] + '"') + '))';
            // }

            // e_v_a_l('rv = arr.filter(function (i, n) { return (' + kriter + ')});');
        }
        return rv;
    };
    sort(jsondata, prop, asc) {
        if (asc === undefined || asc === null) {
            asc = true;
        }
        if (jsondata === undefined || jsondata === null || jsondata.length === 0) {
            return jsondata;
        } else {
            return jsondata.sort(function (a, b) {
                if (asc) {
                    return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
                } else {
                    return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
                }
            });
        }
    };

    remove(jsondata, field, value, callback, operator) {
        if (operator === undefined || operator == null) {
            operator = '==';
        }

        var arrCriteria = [];
        if (Array.isArray(field) === false) {
            if (field !== "") {
                arrCriteria.push([field, value]);
            }
        } else {
            for (var i = 0; i < field.length; i++) {
                arrCriteria.push([field[i], value[i]]);
            }
        }

        var isOk = false;
        // var kriter = "";

        // for (var i = 0; i < arrCriteria.length; i++) {
        //     kriter += (kriter != "" ? " && " : "") + 'item.' + arrCriteria[i][0] + operator + '"' + arrCriteria[i][1] + '"';
        // }

        jsondata.find(function (item, indx) {
            if (item != undefined && item != null) {
                //e_v_a_l('isOk = ' + kriter + ';');
                for (const [key, value] of Object.entries(item)) {
                    if (arrCriteria[i][0] == key) _vl = value;
                }

                switch (operator.trim()) {
                    case "==":
                    case "===":
                        isOk = (_vl.toString() == arrCriteria[i][1]);
                        break;
                    case "!=":
                    case "!==":
                        isOk = (_vl.toString() != arrCriteria[i][1]);
                        break;
                }

                if (isOk) {
                    jsondata.splice(indx, 1);
                }
            } else {
                if (callback != undefined)
                    callback();
            }
        });
    };

    /*
    Array.from(new Set(e.obj.muayene.map(s => s.ICD10_ID))).map(ICD10_ID => { return {ICD10_ID: ICD10_ID, AD: e.obj.muayene.find(s => s.ICD10_ID === ICD10_ID).AD}; });
    */
    distinct(_jsondata, _valueArr, _criteriaField) {
        //core.property de
        return _jsondata.distinct(_valueArr, _criteriaField);
    };

}