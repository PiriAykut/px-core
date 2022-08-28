/*
    core.utilities
    20.08.2022
    Piri AYKUT - piriaykut@gmail.com
    https://www.linkedin.com/in/piri-aykut-ba395b70/
 */

window.dd = function (_vl) {
    console.log(_vl);
}

setTimeout(() => {
    if (typeof t != "function") {
        function t(_text) {
            return _text;
        }
    }
}, 2000);

export class CoreUtilities {

    constructor() {
        this.titleBR = "&#013;";

        this.rooturl = "";
        this.cdnurl = "";

        this.modalop = this.modaloptions();
        this.modaloptions = this.modaloptions();

        this.decimalChr = parseFloat((parseInt(1) / parseInt(2))).toString().replace("0", "").replace("5", "");
        this.tousendChr = (this.decimalChr == "." ? "," : ".");

        this.error_image_log_data = [];
        this.error_image_log_data_timeout = null;

        setTimeout(() => {
            try {
                $.datetimepicker.setLocale('tr');
            } catch (err) {
            }

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
        }, 500);
    }

    validate_object(_name, _message, _controlValue = "", _owner = null) {
        let _obj = null;
        if (_owner != null) {
            _obj = $("[name='" + _name + "']", _owner);
        } else {
            _obj = $("[name='" + _name + "']");
        }

        let _tagName = $(_obj).tagName();
        if (_tagName == "SELECT") {
            if ($(_obj).val() == _controlValue) {
                core.u.alert(t("Uyarı"), _message, "warning", function () {
                    setTimeout(() => {
                        $(_obj).focus();
                    }, 500);
                });
                return false;
            }
        } else {
            if ($(_obj).val().trim() == _controlValue) {
                core.u.alert(t("Uyarı"), _message, "warning", function () {
                    setTimeout(() => {
                        $(_obj).focus();
                    }, 500);
                });
                return false;
            }

            if (_name == "mail") {
                if (!core.u.validateEmail($(_obj).val().trim())) {
                    core.u.alert(t("Uyarı"), t("E-Posta Adresiniz hatalı!") + "<br/>" + t("Lütfen kontrol edip tekrar deneyin."), "warning", function () {
                        setTimeout(() => {
                            $(_obj).focus();
                        }, 500);
                    });
                    return false;
                }
            }
            if (_name == "pass" || _name == "password") { // || _obj.attr("type") == "password"
                let _passvl = $(_obj).val().trim();
                if (!core.u.validatePassword(_passvl)) {
                    core.u.alert(t("Uyarı"), t("Şifreniz hem harf, hem rakamlardan ve en az 5(beş) karakter oluşmalıdır!"), "warning", function () {
                        setTimeout(() => {
                            $(_obj).focus();
                        }, 500);
                    });
                    return false;
                }
            }

        }


        return true;
    }

    round(num) {
        num = parseFloat(num.toString().replace(",", "."));
        num = Math.round(num * 100) / 100;

        if (num == 0) {
            num = "0.00";
        }

        return num;
    }
    isnulltext(_text) {
        return _text != null ? _text : "";
    }
    get_sel_data(_item) {
        let data = $(_item).parents("[data-el]").attr("data-el");
        data = JSON.parse(decodeURIComponent(escape(atob(data))));
        return data;
    }

    image_resize(_file, _width, _height, _callback, _oranti = true, _quality = 0.6) {
        var FR = new FileReader();

        FR.addEventListener("load", function (e) {

            var img = new Image();
            img.setAttribute('crossorigin', 'anonymous');
            img.src = e.target.result;

            img.onload = function () {
                let org_width = img.width;
                let org_height = img.height;

                if (org_height > _height) {
                    let fark = Math.round((org_height - _height) * (100 / org_height)) / 100;
                    _width = Math.round(org_width - (org_width * fark));
                } else {
                    let fark = Math.round((org_width - _width) * (100 / org_width)) / 100;
                    _height = Math.round(org_height - (org_height * fark));
                }

                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = _width;
                canvas.height = _height;

                ctx.drawImage(img, 0, 0, _width, _height);

                let base64 = canvas.toDataURL("image/jpeg", _quality);

                if (_callback != undefined) {
                    _callback(base64);
                }

                img = null;
                canvas = null;
                ctx = null;
            };
        });

        FR.readAsDataURL(_file);
    }


    calcBaseSizeKB(base64String) {
        let basestr = base64String.split(',');

        if (basestr.length > 1) {
            base64String = basestr[1];
        } else {
            base64String = basestr[0];
        }

        let padding, inBytes, base64StringLength;
        if (base64String.endsWith("==")) padding = 2;
        else if (base64String.endsWith("=")) padding = 1;
        else padding = 0;

        base64StringLength = base64String.length;
        //console.log(base64StringLength)
        inBytes = (base64StringLength / 4) * 3 - padding;
        //console.log(inBytes);
        this.kbytes = inBytes / 1000;
        return this.kbytes;
    }

    disabled(_idorclass, _text) {
        if ($(_idorclass).length > 0) {
            if (_text == false) {
                let _html = $(_idorclass).attr("data-oldhtml");
                $(_idorclass).removeAttr("disabled").removeAttr("data-oldhtml").html(_html);
            } else {
                let _html = $(_idorclass).html();
                $(_idorclass).attr("disabled", "true").attr("data-oldhtml", _html).html(_text == "" ? "..." : _text);
            }
        }
    }
    getDataTableLang() {
        let languageDataTable = {
            "sDecimal": ",",
            "sEmptyTable": "Tabloda herhangi bir veri mevcut değil!",
            "sInfo": "_TOTAL_ kayıttan _START_ - _END_ arasındaki kayıtlar gösteriliyor.",
            "sInfoEmpty": "Kayıt yok",
            "sInfoFiltered": "(_MAX_ kayıt içerisinden bulunan)",
            "sInfoPostFix": "",
            "sInfoThousands": ".",
            "sLengthMenu": "Sayfada _MENU_ kayıt göster",
            "sLoadingRecords": "Yükleniyor...",
            "sProcessing": "İşleniyor...",
            "sSearch": "Ara:",
            "sZeroRecords": "Eşleşen kayıt bulunamadı!",
            "oPaginate": {
                "sFirst": "İlk",
                "sLast": "Son",
                "sNext": "Sonraki",
                "sPrevious": "Önceki"
            },
            "oAria": {
                "sSortAscending": ": artan sütun sıralamasını aktifleştir",
                "sSortDescending": ": azalan sütun sıralamasını aktifleştir"
            },
            "select": {
                "rows": {
                    "_": "%d kayıt seçildi",
                    "0": "",
                    "1": "1 kayıt seçildi"
                }
            }
        };
        return languageDataTable;
    }

    modaloptions() {
        return { backdrop: 'static', keyboard: false };
    }

    image_error_attr(_type = null) {
        if (_type == null) _type = "image";

        switch (_type) {
            case "user":
                return 'this.onerror=null; $(this).attr(\'data-error-image\', this.src); this.src=\'/images/default-user.jpg\';';
            case "image":
            default:
                return 'this.onerror=null; $(this).attr(\'data-error-image\', this.src); this.src=\'/images/default-image.jpg\';';
        }
    }
    error_image(img, defaultimg) {
        $(img).onerror = null;

        let _url = window.location.href;
        let _src = $(img).attr("src");

        $(img).attr("src", defaultimg);
        $(img).removeAttr("onerror");

        let control = this.error_image_log_data.filter(function (e) { return e.url == _url && e.src == _src });
        if (control.length == 0) {
            this.error_image_log_data.push({ url: _url, src: _src });
            if (this.error_image_log_data_timeout != null) {
                clearTimeout(this.error_image_log_data_timeout);
            }

            let self = this;
            setTimeout(function () {
                self.save_error_image_log();
            }, 1500);
        }
    }
    save_error_image_log() {
        if (this.error_image_log_data.length == 0) return;
        let _param = { data: this.error_image_log_data };
        core.run("image_error_save", _param, function (e) { });
        this.error_image_log_data = [];
    }
    table_message(_tableid, _status, _spinner, _text) {
        let _color = "";
        let _fontsize = "15px";
        switch (_status) {
            case 'info':
                _color = '#4dabf7';
                break;
            case 'error':
                //_color = '#f74d4d';
                _fontsize = "17px";
                break;
            case 'warning':
                _color = '#ff8f1b';
                break;
        }

        if (_spinner == true) {
            _text = '<i class="fas fa-spin fa-spinner mr-3"></i> ' + _text;
        }

        let colspan = $("thead tr th", $(_tableid)).length;
        if (colspan == 0)
            colspan = $("thead tr td", $(_tableid)).length;

        $("tbody", $(_tableid)).html('<tr><td colspan="' + colspan + '" class="text-center p-5" style="font-size: ' + _fontsize + '; ' + (_color != '' ? 'color:' + _color : '') + '">' + _text + '</td></tr>');
    }

    spinStart(_selector, text) {
        this.el = $(_selector);

        if (this.el.length > 0) {
            this.beforeText = $(this.el).html();

            let loadingText = this.el.attr("loading-text");

            if (loadingText === undefined) {
                // (text == null) ? text = 'Gönderiliyor...':'';
                loadingText = text;
            }
            var appText = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" style="width:14px;height:14px"></span> ' + loadingText;
            this.el.html(appText).attr("disabled", "disabled");
        } else {
            console.log(_selector + 'bulunamadı!');
        }
    }

    spinStop() {
        this.el.removeAttr("disabled").html(this.beforeText);
    }

    getDataSelected(selector) {
        if (selector === "" || selector === null || selector === undefined) {
            core.util.toastAlert("Hata!", "core.util.getDataSelected kullandınız. getDataSelected için DataTable id,class(selector) giriniz", "error", "3000");
        } else {
            var table = $(selector).DataTable();
            var rows = table.rows({ selected: true });
            if (rows.count() === 0) {
                return null;
            } else {
                return rows.data()[0];
            }
        }
    }

    html_filter(_container, _itemclass, _text) {
        if (this.isnull(_container) || _container == "") {
            _container = "body";
        }
        if (_itemclass == "") {
            this.alert("Uyarı", "Her bir item için niteleyen ortak class veya tag gönderilmelidir.", "warning");
            return;
        }

        _container = $(_container);

        if ($(_container).attr("data-search-text") == undefined) {
            $(_container).attr("data-search-text", "");
        }

        if (_text != "") {
            var dInput = "";
            var trCharU = ['i̇', 'İ', 'Ş', 'Ö', 'Ğ', 'Ü', 'Ç'];
            var trCharL = ['i', 'i', 'ş', 'ö', 'ğ', 'ü', 'ç'];

            for (let x = 0; x < trCharU.length; x++) {
                _text = _text.replaceAll(trCharU[x], trCharL[x]);
            }

            let nextlen = _text.length > $(_container).attr("data-search-text")
            $(_container).attr("data-search-text", _text);

            $(_itemclass + (nextlen ? "[style*=display\\:block]" : ""), _container).each(function () {
                dInput = $(this).text().replace(/\s+/g, ' ').toLowerCase();

                for (let x = 0; x < trCharU.length; x++) {
                    dInput = dInput.replaceAll(trCharU[x], trCharL[x]);
                }

                if (dInput.indexOf(_text) == -1) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
        } else {
            $(_container).attr("data-search-text", "");
            $(_itemclass, _container).show();
        }
    }


    html_filter_eski(_container, _itemclass, _text) {
        if (this.isnull(_container) || _container == "") {
            _container = "body";
        }
        if (_itemclass == "") {
            this.alert("Uyarı", "Her bir item için ortak class gönderilmelidir.", "warning");
            return;
        }

        _container = $(_container);

        if (_text != "") {
            _text = _text.replace(/ +/g, ' ').toLowerCase();

            var dInput = "";
            var trCharU = ['i̇', 'İ', 'Ş', 'Ö', 'Ğ', 'Ü', 'Ç'];
            var trCharL = ['i', 'i', 'ş', 'ö', 'ğ', 'ü', 'ç'];

            for (let x = 0; x < trCharU.length; x++) {
                _text = _text.replaceAll(trCharU[x], trCharL[x]);
            }

            $(_itemclass, _container).show().filter(function () {
                dInput = $(this).text().replace(/\s+/g, ' ').toLowerCase();

                for (let x = 0; x < trCharU.length; x++) {
                    dInput = dInput.replaceAll(trCharU[x], trCharL[x]);
                }

                return !~dInput.indexOf(_text);
            }).hide();
        } else {
            $(_itemclass, _container).show();
        }
    }
    input_value_control(_obj) {
        let isVal = false;
        switch ($(_obj).prop("tagName").toLowerCase()) {
            case "select":
                isVal = $(_obj).val() > 0;
                break;
            case "textarea":
                isVal = $(_obj).val().trim().length > 0;
                break;
            case "input":
                if ($(_obj).attr("type") == "text") {
                    isVal = $(_obj).val().trim().length > 0;
                }
                break;
        }
        if (isVal) {
            $(_obj).addClass("selected-value-cap");
        } else {
            $(_obj).removeClass("selected-value-cap");
        }
    }
    renkUret() {
        let arr = ["a", "b", "c", "d", "e", "f", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        let renk = '';
        for (let i = 1; i <= 6; i++) {
            renk += arr[this.getRndInteger(0, (arr.length - 1))];
        }
        return '#' + renk;
    };
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
    validatePassword(password) {
        var re = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{5,}$/;
        return re.test(String(password));
    };
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    filesize(fileObj) {
        let size = 0;

        if (fileObj != null && fileObj.files.length > 0) {
            for (let i = 0; i < fileObj.files.length; i++) {
                const el = fileObj.files[i];
                size += el.size;
            }
        }

        this.filesizetext(size);
    };
    filesizetext(size) {
        if (size > 0) {
            let boyut = size / 1024 / 1024;

            if (boyut > 1000) {
                boyut = boyut / 1024;
                boyut = parseFloat(boyut).toFixed(2) + ' GB';
            } else if (boyut >= 1) {
                boyut = parseFloat(boyut).toFixed(2) + ' MB';
            } else {
                boyut = size / 1024;
                boyut = parseFloat(boyut).toFixed(2) + ' KB';
            }

            return boyut;
        } else {
            return "0 KB";
        }
    };

    age(d1, d2) {
        d2 = d2 || new Date();
        var diff = d2.getTime() - d1.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }
    dateDiff(startdate, enddate) {
        if (this.isnull(startdate) || this.isnull(enddate) || startdate == "" || enddate == "")
            return null;

        let mn = startdate.split(".");
        let mx = enddate.split(".");

        startdate = mn[2] + "/" + mn[1] + "/" + mn[0];
        enddate = mx[2] + "/" + mx[1] + "/" + mx[0];

        //define moments for the startdate and enddate
        var startdateMoment = moment(startdate, "YYYY/MM/DD");
        var enddateMoment = moment(enddate, "YYYY/MM/DD");

        if (startdateMoment.isValid() === true && enddateMoment.isValid() === true) {
            //getting the difference in years
            var years = enddateMoment.diff(startdateMoment, 'years');

            //moment returns the total months between the two dates, subtracting the years
            var months = enddateMoment.diff(startdateMoment, 'months') - (years * 12);

            //to calculate the days, first get the previous month and then subtract it
            startdateMoment.add(years, 'years').add(months, 'months');
            var days = enddateMoment.diff(startdateMoment, 'days')

            return {
                years: years,
                months: months,
                days: days
            };

        }
        else {
            return undefined;
        }

    }

    validation(_owneridorclass, _showmessege) {
        let mdl = _owneridorclass + " ";

        if (_showmessege == undefined) _showmessege = true;

        $(mdl + ".is-invalid").removeClass('is-invalid');

        if ($(mdl + "[required]").length > 0) {
            $(mdl + "[required]").each(function () {
                let invalid = false;

                switch ($(this).prop('tagName').toLowerCase()) {
                    case 'input':
                        invalid = ($(this).val() == "");

                        if (!invalid) {
                            let type = $(this).attr("type");
                            invalid = (type == 'mail' && !core.u.validateEmail($(this).val()));

                            if (invalid && _showmessege) {
                                core.u.toastAlert(t("Uyarı"), t("E-Posta adresi hatalı!"), "warning", 8000);
                            }
                        }
                        break;
                    case 'select':
                        invalid = ($(this).val() == "0");
                        break;
                    case 'textarea':
                        invalid = ($(this).val() == "");
                        break;
                }

                if (invalid) {
                    $(this).addClass('is-invalid');
                }
            });

            if ($(mdl + ".is-invalid").length > 0) {
                if (_showmessege)
                    this.toastAlert("Uyarı", t("(*) ile işaretlenmiş alanları doldurmalısınız!"), "warning", 8000);

                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    filetype(fileObj) {
        let rv = null;
        if (fileObj != null && fileObj.files.length > 0) {
            rv = [];
            for (let i = 0; i < fileObj.files.length; i++) {
                switch (fileObj.files[i].type) {
                    case 'application/vnd.ms-excel':
                    case 'application/msexcel':
                    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.template':
                    case 'application/vnd.ms-excel.sheet.macroEnabled.12':
                    case 'application/vnd.ms-excel.template.macroEnabled.12':
                    case 'application/vnd.ms-excel.addin.macroEnabled.12':
                    case 'application/vnd.ms-excel.sheet.binary.macroEnabled.12':
                        rv.push('excel');
                        break;
                    case 'application/vnd.ms-word':
                    case 'application/msword':
                    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
                    case 'application/vnd.ms-word.document.macroEnabled.12':
                    case 'application/vnd.ms-word.template.macroEnabled.12':
                        rv.push('word');
                        break;
                    case 'application/vnd.ms-powerpoint':
                    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                    case 'application/vnd.openxmlformats-officedocument.presentationml.template':
                    case 'application/vnd.openxmlformats-officedocument.presentationml.slideshow':
                    case 'application/vnd.ms-powerpoint.addin.macroEnabled.12':
                    case 'application/vnd.ms-powerpoint.presentation.macroEnabled.12':
                    case 'application/vnd.ms-powerpoint.template.macroEnabled.12':
                    case 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12':
                        rv.push('powerpoint');
                        break;
                    case 'application/vnd.ms-access':
                        rv.push('access');
                        break;
                    case 'text/plain':
                        rv.push('txt');
                        break;
                    case 'application/xml':
                        rv.push('xml');
                        break;
                    case 'application/pdf':
                        rv.push('pdf');
                        break;
                    case 'image/jpeg':
                    case 'image/png':
                    case 'image/gif':
                        rv.push('image');
                        break;
                    case 'video/x-matroska':
                    case 'video/mp4':
                    case 'video/ogg':
                    case 'video/webm':
                    case 'video/quicktime':
                    case 'video/x-m4v':
                    case 'video/x-ms-wmv':
                    case 'video/x-msvideo':
                    case 'video/3gpp':
                    case 'audio/mpeg':
                    case 'audio/ogg':
                        rv.push('video');
                        break;
                    default:
                        rv.push(null);
                        break;
                }
            }
        }

        return rv;
    };

    fileicon(_filename) {
        let _filemime = _filename.split('.');
        _filemime = _filemime[_filemime.length - 1].toLowerCase();

        switch (_filemime) {
            case 'exe':
            case 'msi':
                return "fa fa-cogs";
            case 'rar':
            case 'zip':
                return "fa fa-file-archive-o";
            case 'xls':
            case 'xlsx':
            case 'csv':
                return "fa fa-file-excel-o";
            case 'doc':
            case 'docx':
            case 'rtf':
                return "fa fa-file-word-o";
            case 'mdb':
            case 'accdb':
            case 'accdt':
                return "fa fa-database";
            case 'xml':
                return "fa fa-file-code-o";
            case 'mp3':
                return "fa fa-file-audio-o";
            case 'bmp':
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'tiff':
                return "fa fa-file-image";
            case 'pdf':
                return "fa fa-file-pdf";
            case 'pptx':
            case 'pptm':
            case 'ppt':
            case 'potx':
            case 'potm':
            case 'pot':
            case 'ppsx':
            case 'pps':
            case 'ppam':
            case 'ppa':
                return "fa fa-file-powerpoint";
            case 'txt':
            case 'ini':
                return "fa fa-file-text";
            case 'avi':
            case 'mpeg':
            case 'mpg':
            case 'mp4':
                return "fa fa-file-video";
            default:
                return "fa fa-file";
        }
    }

    clipboard(_text, _message) {
        if (!this.isnull(_text) && _text != "") {
            $("body").append('<input type="text" id="clipboardtext" value="' + _text + '" style="position:fixed; left:0px; z-index:9999; top:0px; /*width:1px*/" />');

            $("#clipboardtext").select();
            document.execCommand("copy");

            setTimeout(function () {
                $("#clipboardtext").remove();

                if (!core.u.isnull(_message)) {
                    core.u.toastAlert("Bilgi", _message, "info");
                }
            }, 200);
        }
    }
    getFormToJSON(formIDorClass) {
        var formdata = $(formIDorClass).serializeArray();
        formdata.push({ name: 'detay', value: app.ilan.editor.getData() });
        var _param = null;

        for (let i = 0; i < formdata.length; i++) {
            const el = formdata[i];
            _param += (_param != "" ? "," : "") + el.name + ' : "' + el.value + '"';
        }

        eval('_param = { ' + _param + ' }');

        return _param;
    };
    flatdateobj(_obj_id_or_class, _addtime, _options) {
        if (_options === undefined) _options = null;
        if (_addtime === undefined) _addtime = false;

        return flatpickr(_obj_id_or_class, this.flatdateoption(_addtime, _options));
    };
    dateobj(_obj, _options) {
        if (_options == undefined) _options = null;
        _obj.mask('00.00.0000').datetimepicker(this.datetimepickeroption(_options));
    }
    setdate(_obj, _date) {
        _obj.datetimepicker({ value: _date });
    }
    flatdateoption(_addtime, _options) {
        //https://flatpickr.js.org/

        var defaults = {
            dateFormat: 'd.m.Y' + (_addtime ? ' H:i' : ''),
            enableTime: _addtime,
            weekNumbers: true,
            // minDate: '1900-01',
            // maxDate: '2050-12',
            firstDayOfWeek: 1,
            // mode: 'single', //"single", "multiple", or "range",
            // defaultHour: 12,
            // defaultMinute: 0,
            locale: 'tr',
            // nextArrow: '>',
            // prevArrow: '<'
        }

        let op = $.extend(defaults, _options);

        return {
            dateFormat: op.dateFormat,
            enableTime: op.enableTime,
            // minDate: op.minDate,
            // maxDate: op.maxDate,
            firstDayOfWeek: op.firstDayOfWeek,
            // mode: op.mode,
            // defaultHour: op.defaultHour,
            // defaultMinute: op.defaultMinute,
            locale: op.locale,
            // nextArrow: op.nextArrow,
            // prevArrow: op.prevArrow
        };
    }
    datetimepickeroption(_options) {

        var defaults = {
            value: null,
            format: 'd.m.Y',
            mask: false,
            timepicker: false,
            datepicker: true,
            dayOfWeekStart: 1,
            step: 60,
            minDate: '-1970/01/01',
            maxDate: '+1970/01/01'
        };

        let op = $.extend(defaults, _options);

        return {
            value: op.value,
            datepicker: op.datepicker,
            timepicker: op.timepicker,
            format: op.format,
            mask: op.mask,
            dayOfWeekStart: 1,
            step: op.step
            // minDate: op.minDate,
            // maxDate: op.maxDate
        };
    };

    getChangeNameValue($ownerIdorCLass) {
        var rv = [];
        $($ownerIdorCLass + " [name][changed]").each(function () {
            var _name = $(this).attr("name");
            //var _tagName = $(this).prop("tagName");
            var _value = $(this).val();
            switch ($(this).attr("type")) {
                case "checkbox":
                    if (!$(this).prop("checked")) {
                        _value = (_value == "true" ? "false" : "");
                    }
                    break;
            }
            rv.push({ name: _name, value: _value });
        });
        return rv;
    };
    getFileTypeName(_type) {
        _type = _type.toLowerCase();
        switch (_type) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'bmp':
            case 'gif':
                return 'Resim Dosyası (.' + _type + ')';
                break;
            case 'doc':
            case 'docx':
                return 'Word Dosyası (.' + _type + ')';
                break;
            case 'xls':
            case 'xlsx':
                return 'Excel Dosyası (.' + _type + ')';
                break;
            default:
                return _type + ' Dosyası';
                break;
        }
    };
    isnull(obj) {
        return (obj === undefined || obj === null);
    };
    convertToInt(nmdata) {
        nmdata = nmdata.trim();
        if (nmdata === "" || this.isnumeric(nmdata) === false)
            return 0;
        return parseInt(nmdata);
    };
    nulltostr(n) {
        if (this.isnull(n)) {
            return '';
        } else {
            return n;
        }
    };
    isnumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    alert(ptitle, pmessage, ptype, callback, style) {

        if (ptype == undefined) ptype = "warning";

        if (ptype.toLowerCase() === "question") {
            setTimeout(function () {
                swal.fire({
                    title: ptitle,
                    html: '<div style="float:left;width:100%;max-height:200px;overflow:auto;font-size:15px;' + (style !== undefined && style !== null && style !== "" ? style : '') + '">' + pmessage + '</div>',
                    icon: 'question',
                    // confirmButtonColor: '#3085d6',
                    // cancelButtonColor: '#d33',
                    confirmButtonText: '<i class="fa fa-check"></i> Evet',
                    cancelButtonText: '<i class="fa fa-remove"></i> Hayır',
                    // confirmButtonClass: 'swalbtn btn btn-outline-success ml-2',
                    // cancelButtonClass: 'swalbtn btn btn-outline-danger',
                    showCancelButton: true
                    // buttonsStyling: false,
                    // reverseButtons: true
                }).then(function (result) {
                    if (!core.u.isnull(callback)) {
                        switch (callback.length) {
                            case 0:
                                callback();
                                break;
                            default:
                                callback(result.value);
                                break;
                        }
                    }
                });
            }, 200);
        } else {
            setTimeout(function () {
                swal.fire({
                    title: ptitle,
                    html: '<div style="float:left; width:100%; max-height:200px; overflow:auto; font-size:15px; ' + (style !== undefined && style !== null && style !== "" ? style : '') + '">' + pmessage + '</div>',
                    icon: ptype,
                    confirmButtonText: 'Tamam',
                    // confirmButtonClass: 'swalbtn btn btn-success'
                }).then(function (result) {
                    if (!core.u.isnull(callback)) {
                        switch (callback.length) {
                            case 0:
                                callback();
                                break;
                            default:
                                callback(result.value);
                                break;
                        }
                    }
                });
            }, 200);
        }
    };
    toastAlert(title, message, type, timeout, callback) {
        //https://codeseven.github.io/toastr/demo.html
        if (typeof timeout == "function") {
            callback = timeout;
            timeout = 3000;
        }

        if (timeout == false) {
            toastr.options.hideAfter = false;
            toastr.options.timeOut = null;
            toastr.options.closeDuration = null;
            toastr.options.extendedTimeOut = null;
        } else {
            if (timeout == undefined || this.isnull(timeout)) {
                timeout = 3000;
            }
            toastr.options.timeOut = timeout;
            toastr.options.closeDuration = timeout;
            toastr.options.extendedTimeOut = timeout;
        }

        toastr.options.closeButton = true;
        toastr.options.progressBar = true;
        //toastr.options.escapeHtml = true;
        toastr.options.allowHtml = true;

        setTimeout(function () {
            switch (type) {
                case "success":
                    toastr.success(message, title);
                    break;
                case "error":
                    toastr.error(message, title);
                    break;
                case "warning":
                    toastr.warning(message, title);
                    break;
                case "info":
                    toastr.info(message, title);
                    break;
            }

            if (callback != undefined) {
                setTimeout(function () {
                    callback();
                }, timeout);
            }

        }, 100);
    };
    TITLEBR() {
        return "&#013;";
    };
    isFunctionKey(keycode) {
        if (keycode === undefined || keycode === null)
            return false;
        return (this.FonksiyonKey().indexOf("," + keycode + ",") > -1);
    };
    FonksiyonKey() {
        return ",27,113,115,118,119,120,122,123,38,37,40,39,13,16,18,17,93,46,35,34,45,36,33,44,145,19,90,";
    };
    isForbiddenKey(keycode) {
        if (keycode === undefined || keycode === null)
            return false;
        return (this.YasakliKey().indexOf("," + keycode + ",") > -1);
    };
    YasakliKey() {
        return ",9,16,17,18,19,20,27,33,34,35,36,37,38,39,40,45,91,92,93,106,107,109,110,111,112,113,114,115,116,117,118,119,120,121,123,122,144,145,186,187,188,189,190,191,192,219,220,221,222,";
    };
    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    getToday(ayrac, addTime, addDateDays) {
        if (ayrac === undefined) {
            ayrac = ".";
        }

        if (addTime == undefined) addTime = false;

        var today = new Date();

        if (addDateDays != undefined) {
            today.setDate(today.getDate() + addDateDays);
        }

        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        var HH = today.getHours();
        var MI = today.getMinutes();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (HH < 10) {
            HH = '0' + HH;
        }
        if (MI < 10) {
            MI = '0' + MI;
        }
        today = dd + ayrac + mm + ayrac + yyyy + (addTime === true ? " " + HH + ":" + MI : "");
        return today;
    };
    getTimeNow(addSecond = false) {
        var today = new Date();
        var HH = today.getHours();
        var MI = today.getMinutes();
        var SS = today.getSeconds();

        if (HH < 10) {
            HH = '0' + HH;
        }
        if (MI < 10) {
            MI = '0' + MI;
        }
        if (SS < 10) {
            SS = '0' + SS;
        }
        return HH + ":" + MI + (addSecond ? ":" + SS : "");
    };
    addToday(number, noformat = false) {
        if (number == undefined) number = 0;
        var today = new Date();
        today.setDate(today.getDate() + parseInt(number));
        if (noformat) {
            return today;
        } else {
            return core.u.getDateFormat(today);
        }
    };
    dateformat(date, ayrac, addTime) {
        return this.getDateFormat(date, ayrac, addTime);
    }
    getDateFormat(date, ayrac, addTime) {
        if (ayrac === undefined) {
            ayrac = ".";
        }
        var today = date;
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var HH = today.getHours();
        var MI = today.getMinutes();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (HH < 10) {
            HH = '0' + HH;
        }
        if (MI < 10) {
            MI = '0' + MI;
        }
        today = dd + ayrac + mm + ayrac + yyyy + (addTime === true ? " " + HH + ":" + MI : "");
        return today;
    };
    getDateBetween(date1, date2) {
        var MS_one_day = 1000 * 60 * 60 * 24;
        date1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        date2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
        return Math.floor((date2 - date1) / MS_one_day);
    };
    getDayToTextTime(days) {
        var YILSONUC = days / 365.25;
        var YILTEXT = 0;
        var YILKALAN = 0;
        var AYSONUC = 0;
        var AYTEXT = 0;
        var AYKALAN = 0;
        var GUNSONUC = 0;
        var GUNTEXT = 0;
        var GUNKALAN = 0;
        var RV = "";
        if (YILSONUC >= 1) {
            YILTEXT = Math.floor(YILSONUC);
            YILKALAN = YILSONUC - Math.floor(YILSONUC);
        } else {
            YILKALAN = YILSONUC;
        }
        AYSONUC = YILKALAN * 12;
        if (AYSONUC >= 1) {
            AYTEXT = Math.floor(AYSONUC);
            AYKALAN = AYSONUC - Math.floor(AYSONUC);
        } else {
            AYKALAN = AYSONUC;
        }
        GUNSONUC = AYKALAN * (365.25 / 12);
        if (GUNSONUC >= 1) {
            GUNTEXT = Math.floor(GUNSONUC);
            GUNKALAN = GUNSONUC - Math.floor(GUNSONUC);
        } else {
            GUNKALAN = GUNSONUC;
        }
        if (GUNKALAN >= 0.5) {
            GUNTEXT = GUNTEXT + 1;
        }
        if (AYTEXT === 11 && GUNTEXT === 30) {
            YILTEXT = YILTEXT + 1;
            AYTEXT = 0;
            GUNTEXT = 0;
        }
        if (YILTEXT > 0) {
            RV = YILTEXT + ' ' + t('Yıl');
        }
        if (AYTEXT > 0) {
            RV = (RV !== '' ? RV + ' ' : '') + AYTEXT + ' ' + t('Ay');
        }
        if (GUNTEXT > 0) {
            RV = (RV !== '' ? RV + ' ' : '') + GUNTEXT + ' ' + t('Gün');
        }
        if (RV === '') {
            RV = t('Bugün');
        }
        return RV;
    };
    getDateText(mydate, addMounth = true, addYear = false, addDayName = false) {
        if (this.isnull(addYear) || addYear == '') {
            if (addYear != true && addYear != false)
                addYear = true;
        }
        if (this.isnull(addDayName) || addDayName == '') {
            if (addDayName != true && addDayName != false)
                addDayName = true;
        }

        if (mydate === "") {
            return false;
        }
        var ayrac = "";
        for (var i = 0; i < mydate.length; i++) {
            if ("./-".indexOf(mydate.substr(i, 1)) > -1) {
                ayrac = mydate.substr(i, 1);
                break;
            }
        }
        if (ayrac === "")
            ayrac = ".";
        var parseDate = mydate.split(ayrac);
        var dateText = "...";
        var objDate = new Date(parseInt(parseDate[2]), (parseInt(parseDate[1]) - 1), parseInt(parseDate[0]));
        var dayOfWeek = objDate.getDay();
        dateText = (addMounth ? parseDate[0] + " " + this.getMonthName(parseInt(parseDate[1])) + (addYear ? " " + parseDate[2] : "") : "") +
            (addDayName ? (addMounth ? " - " : "") + this.getDayName(dayOfWeek) : "");

        return dateText;
    };
    getMonthName(monthNm) {
        var arr = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
        return t(arr[monthNm - 1]);
    };
    getDayName(dayNm) {
        var arr = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
        return t(arr[dayNm]);
    };
    adddays(date, days, isformat) {
        let copy = new Date(Number(date))
        copy.setDate(date.getDate() + days)

        if (isformat) {
            copy = core.u.getDateFormat(copy, ".");
        }
        return copy
    }
    selectOptions(arr, valueMember, textMember, secinizVL, secinizTX, selectedValue, datasubtext, datasubtext_baslik) {
        return this.getSelectOptions(arr, valueMember, textMember, secinizVL, secinizTX, selectedValue, datasubtext, datasubtext_baslik);
    };
    getSelectOptions(arr, valueMember, textMember, secinizVL, secinizTX, selectedValue, datasubtext, datasubtext_baslik) {
        var rv = "";
        if (secinizVL !== undefined && secinizVL !== null && secinizVL != "") {
            rv = "<option value='" + secinizVL + "'>" + secinizTX + "</option>";
        }
        if (arr !== undefined && arr !== null && arr.length > 0) {
            var vl = "";
            var tx = "";
            var subtx = "";
            for (var i = 0; i < arr.length; i++) {
                eval("vl = arr[i]." + valueMember + ".toString();");
                eval("tx = arr[i]." + textMember + ".toString();");
                if (datasubtext !== undefined && datasubtext !== null)
                    eval("subtx = arr[i]." + datasubtext + ".toString();");
                rv += '<option value="' + vl + '" ' +
                    (subtx !== '' ? 'data-subtext="' + (datasubtext_baslik !== undefined ? datasubtext_baslik : "") + subtx + '"' : '') +
                    ((selectedValue === undefined && selectedValue !== null && i === 0) || (selectedValue !== undefined && selectedValue !== null && vl.toString() === selectedValue.toString()) ? ' selected="true"' : '') + '>' + tx + '</option>';
            }
        }
        return rv;
    };

    reloadDataTable(selector) {
        if ($(selector).length > 0) {
            let api = new $.fn.dataTable.Api(selector);
            api.ajax.reload();
        }

    }

    languageDataTable() {
        var lang = {
            "sProcessing": "İşleniyor...",
            "sLengthMenu": "Sayfada _MENU_ Kayıt Göster",
            "sZeroRecords": "Eşleşen Kayıt Bulunmadı",
            "sInfo": "  _TOTAL_ Kayıttan _START_ - _END_ Arası Kayıtlar",
            "sInfoEmpty": "Kayıt Yok",
            "sInfoFiltered": "( _MAX_ Kayıt İçerisinden Bulunan)",
            "sInfoPostFix": "",
            "sSearch": "Bul:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "İlk",
                "sPrevious": "Önceki",
                "sNext": "Sonraki",
                "sLast": "Son"
            },
            "buttons": {
                "print": "Yazdır",
                "excel": "Excel'e Aktar",
                "pdf": "PDF'e Aktar",
                "reset": "Yenile",
                "reload": "Yeniden Yükle",
                "colvis": "Kolon",
                "copyTitle": 'Panoya Kopyalandı',
                "copyInfo": {
                    _: 'Toplam %d kayıt kopyalandı',
                    1: 'Tek adet kopyalandı'
                },
                "copySuccess": {
                    _: 'Toplam %d adet kayıt toplandı',
                    1: 'Bir adet kayıt kopyalandı'
                }
            }
        };
        return lang;
    };
    dataTableButtons(_title) {
        if (_title == null || _title == undefined) {
            _title = 'NBYS İBYS';
        }
        var buttons = [
            {
                extend: 'collection',
                text: '<i class="fa fa-clone"></i> Kolonlar',
                buttons: [{
                    extend: 'columnsToggle',
                    columns: ':not([data-visible="false"])'
                }],
                className: 'btn btn-primary btn-sm assets-select-btn toolbox-delete-selected marginRight5'
            },
            // {
            //     extend: 'copyHtml5',
            //     text: '<i class="fa fa-files-o"></i>',
            //     titleAttr: 'Kopyala',
            //     className: 'copy'
            //
            // },
            {
                extend: 'excelHtml5',
                text: '<i class="fa fa-file-excel-o"></i>',
                titleAttr: "Excel' e Aktar",
                className: 'excel',
                charset: 'utf-8',
                filename: 'nbysisg_excel',
                title: _title
            },
            {
                extend: 'csvHtml5',
                charset: 'utf-8',
                text: '<i class="fa fa-file-text"></i>',
                titleAttr: "CSV' e Aktar",
                className: 'csv',
                filename: 'nbysisg_csv',
                title: _title
            },
            {
                extend: 'pdfHtml5',
                charset: 'utf-8',
                text: '<i class="fa fa-file-pdf-o"></i>',
                titleAttr: "PDF' e Aktar",
                className: 'pdf',
                filename: 'nbysisg_pdf',
                title: _title
            }
        ];
        return buttons;
    };
    addDisabledBlock(idOrClass, message, boxstyle, textstyle) {
        if ($(".disabledBlock", $(idOrClass)).length > 0) {
            this.removeDisabledBlock(idOrClass);
        }

        if (boxstyle === undefined || boxstyle === null) {
            boxstyle = "";
        }
        if (textstyle == undefined || textstyle == null) {
            textstyle = "";
        }

        boxstyle = (boxstyle !== "" ? "style='" + boxstyle + "'" : "");
        textstyle = (textstyle !== "" ? "style='" + textstyle + "'" : "");

        $(idOrClass).addClass("disabledBlockCont").append('<div class="disabledBlock" ' + boxstyle + '><span ' + textstyle + '>' + message + '</span></div>');
    };
    removeDisabledBlock(idOrClass) {
        $(".disabledBlock", $(idOrClass)).remove();
        $(idOrClass).removeClass("disabledBlockCont");
    };
    moneyformat(value, decimalength, symbol = "") {
        if (decimalength === undefined)
            decimalength = 2;

        if (value == null) {
            return "0" + this.decimalChr + "00";
        }

        value = value.toString();

        let rv = "0";
        // let last = (value.length > (decimalength + 1) ? value.substr((decimalength + 1) * -1) : value) ;
        // let indxof = last.indexOf(",");
        // if (indxof == -1) {
        //     indxof = last.indexOf(".");
        // }
        // if (indxof == -1) {
        //     return value + ",00";
        // }

        // last = value.substr((last.length - (indxof + 1)) * -1);
        // let first = value.substr(0, value.length - last.length);

        // first = first.replaceAll(".", "").replaceAll(",", "");
        // value = first + this.decimalChr + last;


        rv = accounting.formatMoney(value.toString().replace(this.tousendChr, this.decimalChr), "", decimalength, this.tousendChr, this.decimalChr);

        let last = rv.toString().substr(decimalength * -1);
        rv = rv.toString().substr(0, rv.length - (last.length + 1)).replaceAll(",", ".") + "," + last;

        return rv + (symbol != "" ? " " + symbol : "");
    };
    // moneyformat(value, decimalength) {
    //     if (decimalength === undefined)
    //         decimalength = 2;

    //     if (value == null) {
    //         return "0" + this.decimalChr + "00";
    //     }
    //     if (value !== undefined || value !== "")
    //         //.replace(".", "").replace(",", ".")
    //         return accounting.formatMoney(value.toString().replace(this.tousendChr, this.decimalChr), "", decimalength, this.tousendChr, this.decimalChr);
    //     else
    //         return accounting.formatMoney(value.toString().replace(this.tousendChr, this.decimalChr), "", decimalength, this.tousendChr, this.decimalChr);
    // };
    HTMLTagClear(data) {
        if (data === undefined || data == null || data.trim() === "")
            return "";
        var spl = data.trim().split(">");
        var topla = "";
        if (spl.length === 1) {
            return data;
        }
        for (var i = 0; i < spl.length; i++) {
            if (spl[i].trim() !== "") {
                var pr = spl[i].split("<");
                topla += (topla !== "" ? " " : "") + pr[0];
            }
        }
        return topla;
    };
    text_space_control(_text) {
        return (_text !== null && _text.replace(/<br\s*\/?>/gi, '').replace(/<p>/g, "").replace(/<\/p>/g, "").trim() !== "" ? _text : '');
    }
    codegenerate(_length, _is_symbol = "aA0") {
        return this.koduret(_length, _is_symbol);
    }
    koduret(uzunluk, semboller) {
        if (uzunluk == undefined) uzunluk = 4;
        if (semboller == undefined) semboller = 'aA0';

        var maske = '';
        if (semboller.indexOf('a') > -1) maske += 'abcdefghijklmnopqrstuvwxyz';
        if (semboller.indexOf('A') > -1) maske += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (semboller.indexOf('0') > -1) maske += '0123456789';
        if (semboller.indexOf('#') > -1) maske += '~!@#$%^&*()_+-={}[]:;<>?.';

        var sel = [0, 0, 0, 0];
        var sonuc = '';
        var chars = '';

        for (var i = uzunluk; i > 0; --i) {
            if (semboller.indexOf('A') > -1 && sel[1] == 0) {
                chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                sonuc += chars[Math.floor(Math.random() * chars.length)];
                sel[1] = 1;
            } else if (semboller.indexOf('a') > -1 && sel[0] == 0) {
                chars = 'abcdefghijklmnopqrstuvwxyz';
                sonuc += chars[Math.floor(Math.random() * chars.length)];
                sel[0] = 1;
            } else if (semboller.indexOf('0') > -1 && sel[2] == 0) {
                chars = '0123456789';
                sonuc += chars[Math.floor(Math.random() * chars.length)];
                sel[2] = 1;
            } else if (semboller.indexOf('#') > -1 && sel[3] == 0) {
                chars = '~!@#$%^&*()_+-={}[]:;<>?.';
                sonuc += chars[Math.floor(Math.random() * chars.length)];
                sel[3] = 1;
            } else {
                sonuc += maske[Math.floor(Math.random() * maske.length)];
            }
        }

        return sonuc;
    };

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}
