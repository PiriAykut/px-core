/* 
    core.property
    20.08.2022
    Piri AYKUT - piriaykut@gmail.com
    https://www.linkedin.com/in/piri-aykut-ba395b70/
 */

jQuery.fn.tagName = function () {
    return this.prop("tagName");
};

String.prototype.toFirstUpperLastLower = function () {
    //    if((typeof this)!=='string')
    //        return this;
    var s = this.split(" ");
    var rv = "";
    for (var i = 0; i < s.length; i++) {
        rv += (rv != "" ? " " : "") + s[i].charAt(0).toTrUpperCase() + s[i].slice(1).toTrLowerCase();
    }

    return rv;
};

String.prototype.toFirstUpperCase = function () {
    //     if((typeof this)!=='string')
    //        return this;>
    return this.charAt(0).toTrUpperCase() + this.slice(1);
};

String.prototype.toFirstLowerCase = function () {
    //     if((typeof this)!=='string')
    //        return this;
    return this.charAt(0).toTrLowerCase() + this.slice(1);
};

String.prototype.toTrUpperCase = function () {
    //     if((typeof this)!=='string')
    //        return this;
    var str = [];
    for (var i = 0; i < this.length; i++) {
        var ch = this.charCodeAt(i);
        var c = this.charAt(i);
        if (ch === 105) str.push('İ');
        else if (ch === 305) str.push('I');
        else if (ch === 287) str.push('Ğ');
        else if (ch === 252) str.push('Ü');
        else if (ch === 351) str.push('Ş');
        else if (ch === 246) str.push('Ö');
        else if (ch === 231) str.push('Ç');
        else if (ch === 601) str.push('Ə');
        else if (ch >= 97 && ch <= 122)
            str.push(c.toUpperCase());
        else
            str.push(c);
    }
    return str.join('');
};

String.prototype.toTrLowerCase = function () {
    //     if((typeof this)!=='string')
    //        return this;
    var str = [];
    for (var i = 0; i < this.length; i++) {
        var ch = this.charCodeAt(i);
        var c = this.charAt(i);

        if (ch === 304) str.push('i');
        else if (ch === 73) str.push('ı');
        else if (ch === 286) str.push('ğ');
        else if (ch === 220) str.push('ü');
        else if (ch === 350) str.push('ş');
        else if (ch === 214) str.push('ö');
        else if (ch === 199) str.push('ç');
        else if (ch === 399) str.push('ə');
        else if (ch >= 65 && ch <= 90)
            str.push(c.toLowerCase());
        else
            str.push(c);
    }
    return str.join('');
};
String.prototype.replaceAll = function (search, replacement) {
    //     if((typeof this)!=='string')
    //      
    //          return this;
    var target = this;
    return target.split(search).join(replacement);
};

Array.prototype.removeValue = function (name, value) {
    var oldLen = this.length;

    var array = this.arrfilter(name, value, '!==');

    this.length = 0; //clear original array
    this.push.apply(this, array); //push all elements except the one we want to delete

    return (oldLen > this.length); //true or false
}

Array.prototype.arrfilter = function (field, value, operator, logicaloperator) {
    var rv = null;
    var arr = this;

    var arrCriteria = [];

    if (logicaloperator === undefined) logicaloperator = " && ";

    if (operator === undefined || operator == null) {
        operator = '===';
    }

    if (Array.isArray(field) === false) {

        if (field !== "") {
            arrCriteria.push([field, value]);
        }
    }
    else {
        for (var i = 0; i < field.length; i++) {
            arrCriteria.push([field[i], value[i]]);
        }
    }
    if (arrCriteria.length > 0 && arr !== undefined && arr !== null && arr.length > 0) {
        rv = arr.filter(function (i, n) {
            let _status = false;
            for (var i = 0; i < arrCriteria.length; i++) {
                let _i_status = false;
                let _vl = null;

                if ($.type(i).toString() == "object") {
                    for (const [key, value] of Object.entries(i)) {
                        if (arrCriteria[i][0] == key) _vl = value;
                    }
                } else if ($.type(n).toString() == "object") {
                    for (const [key, value] of Object.entries(n)) {
                        if (arrCriteria[i][0] == key) _vl = value;
                    }
                }

                _i_status = _vl != null;
                if (_i_status) {
                    switch (operator.trim()) {
                        case "==":
                        case "===":
                            _i_status = (_vl.toString() == arrCriteria[i][1]);
                            break;
                        case "!=":
                        case "!==":
                            _i_status = (_vl.toString() != arrCriteria[i][1]);
                            break;
                    }
                }

                if (logicaloperator.trim() == "&&") {
                    _status = _i_status;

                    if (!_status) return false;
                } else {
                    if (_status) return true;
                }
            }

            return _status;
        });

        // var kriter = "";
        // for (var i = 0; i < arrCriteria.length; i++) {
        //     kriter += (kriter !== "" ? logicaloperator : "") + '(($.type(i).toString() == "object" && i.' + arrCriteria[i][0] + '!==null && i.' + arrCriteria[i][0] + '.toString() ' + operator + ' "' + arrCriteria[i][1] + '") || ($.type(n).toString() == "object" && n.' + arrCriteria[i][0] + '!==null && n.' + arrCriteria[i][0] + '.toString() ' + operator + ' "' + arrCriteria[i][1] + '"))';
        // }
        // e_v_a_l('rv = arr.filter(function (i, n) { return (' + kriter + ')});');
    }
    return rv;
}
Array.prototype.exist = function (field, value) {
    var flt = this.arrfilter(field, value, '===');
    return (flt != undefined && flt != null && flt.length > 0);
}

Array.prototype.arrsort = function (prop, asc) {
    if (asc === undefined || asc === null) {
        asc = true;
    }

    if (this === undefined || this === null || this.length === 0) {
        return this;
    }
    else {
        return this.sort(function (a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            }
            else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });
    }
};

Array.prototype.remove = function (field, value, callback, operator) {
    core.j.remove(this, field, value, callback, operator);
};

Array.prototype.distinct = function (_valueArr, _criteriaField) {
    /* 
    Array.from(new Set(e.obj.muayene.map(s => s.ICD10_ID))).map(ICD10_ID => { return {ICD10_ID: ICD10_ID, AD: e.obj.muayene.find(s => s.ICD10_ID === ICD10_ID).AD}; }); 
    */
    let fields = '';
    if (!$.isArray(_valueArr)) {
        _valueArr = [_valueArr];
    }

    for (let i = 0; i < _valueArr.length; i++) {
        fields += (fields != '' ? ',' : '');
        if (_valueArr[i] === _criteriaField) {
            fields += _valueArr[i] + ': ' + _valueArr[i];
        } else {
            fields += _valueArr[i] + ': this.find(s => s.' + _criteriaField + ' === ' + _criteriaField + ').' + _valueArr[i];
        }
    }

    let rv = null;

    // e_v_a_l('rv = Array.from(new Set(this.map(s => s.' + _criteriaField + '))).map(' + _criteriaField + ' => {return { ' + fields + ' }; }); ');

    return rv;
};

String.prototype.isNumeric = function () {
    let str = this.toString();

    if (typeof str != "string") return false;

    return !isNaN(str) && !isNaN(parseFloat(str));
};

Object.prototype.serializeObject = function () {
    var unindexed_array = this.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
};