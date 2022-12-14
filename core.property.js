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

Array.prototype.arrfilter = function (field, value, operator, operation) {
    var rv = null;
    var arr = this;

    var arrCriteria = [];

    if (operation === undefined) operation = " && ";

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
        var kriter = "";
        for (var i = 0; i < arrCriteria.length; i++) {
            kriter += (kriter !== "" ? operation : "") + '(($.type(i).toString() == "object" && i.' + arrCriteria[i][0] + '!==null && i.' + arrCriteria[i][0] + '.toString() ' + operator + ' "' + arrCriteria[i][1] + '") || ($.type(n).toString() == "object" && n.' + arrCriteria[i][0] + '!==null && n.' + arrCriteria[i][0] + '.toString() ' + operator + ' "' + arrCriteria[i][1] + '"))';
        }
        eval('rv = arr.filter(function (i, n) { return (' + kriter + ')});');
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

    eval('rv = Array.from(new Set(this.map(s => s.' + _criteriaField + '))).map(' + _criteriaField + ' => {return { ' + fields + ' }; }); ');

    return rv;
};