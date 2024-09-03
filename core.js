/*
    core
    20.08.2022
    Piri AYKUT - piriaykut@gmail.com
    https://www.linkedin.com/in/piri-aykut-ba395b70/
 */

import './core.property.js';

import { CoreEvents } from './core.events.js';
import { CoreUtilities } from './core.utilities.js';
import { CoreJSON } from './core.json.js';
import { CoreCRYPT } from './core.crypt.js';
import { CoreDatatable } from './core.datatable.js';

export class Core {


    constructor() {
        this.events = new CoreEvents();
        this.util = new CoreUtilities();
        this.json = new CoreJSON();
        this.crypt = new CoreCRYPT();

        this.cr = this.crypt;
        this.c = this.crypt;
        this.u = this.util;
        this.j = this.json;
        this.e = this.events;

        this.default_root = "";

        this.gtoken = "";
        this.gtoken_secretkey = "";

        this.modaloptions = { keyboard: false, backdrop: 'static' };
        this.isRunning = false;

        this.rooturl = window.location.protocol + "//" + window.location.host;
        this.prefix = "";

        this.u.cdnurl = $("span[data-cdn]").html();

        $("span[data-cdn]").remove();

        console.log(this.rooturl);
    }

    async gtoken_generate() {
        try {
            await grecaptcha.enterprise.execute(core.gtoken_secretkey, { action: 'security' }).then(function (token) {
                core.gtoken = token;
            });
        } catch (error) {
        }

    }

    datatable(_tableid) {
        return new CoreDatatable(_tableid);
    }

    /**
     * Forma ait tutarlılık kontrollerini yapar.
     * Kütüphane Örnek Adresi: https://jqueryvalidation.org/validate/
     *
     * @constructor
     * @param options = { form : '', rules : {}, message: {} }
     * @param callback = function(state, message) { }
     * @param _________ OR ________
     * @param return bool;
     */
    validator(options, callback) {
        var defaults = {
            form: null,
            rules: null,
            message: null
        };
        options = $.extend(defaults, options);
        if (options.form === undefined || options.form === null || options.form === "" || $(options.form).length === 0) {
            swal("Önemli Hata", "validator için geçerli bir form id veya class ı göndermelisiniz!", "error");
            return;
        }
        //        if (options.rules === undefined || options.rules === null || options.rules === "") {
        //            swal("Önemli Hata", "validator için geçerli bir rol belirtmelisiniz!", "error");
        //            return;
        //        }
        var validator = $(options.form).validate({
            highlight: function (el) {
                $(el).addClass('input_error_prime');
            },
            unhighlight: function (el) {
                toastr.remove();
                $(el).removeClass('input_error_prime');
            },
            errorPlacement: function (er, el) {
                toastr.remove();
                core.u.toastAlert("", $(er).text(), "error");
            }
        });
        if (options.rules !== undefined && options.rules !== null) {
            validator.rules = options.rules;
        }
        if (options.message !== undefined && options.message !== null) {
            validator.messages = options.message;
        }
        validator.form();
        if (callback !== undefined && callback !== null && callback !== "") {
            if (validator.valid()) {
                switch (callback.length) {
                    case 0:
                        callback();
                        break;
                    case 1:
                        callback({ durum: true, validdata: '' });
                        break;
                }
            }
            else {
                var arr = [];
                $.each(validator.errorMap, function (index, value) {
                    arr.push({ id: index, message: value });
                });
                callback({ durum: false, validdata: arr });
            }
        }
        else {
            return validator.valid();
        }
    };


    run(_request, _parametters, _options, _callback) {
        let defaultOptions = { request: _request, response_false_show_msg: false };

        if (_parametters != null && _parametters != undefined) {
            if (_parametters.form != undefined || _parametters.formdata != undefined || _parametters.param != undefined || _parametters.waittext != undefined) {
                defaultOptions = Object.assign(defaultOptions, _parametters);
            } else {
                defaultOptions = Object.assign(defaultOptions, { param: _parametters });
            }
        }

        if (_options != undefined && _callback != undefined) {
            if (_parametters){
                if (!_options.param) {
                    _options.param = { ..._parametters, ..._options.param };
                } else {
                    _options.param = _parametters;
                }
            }

            defaultOptions = Object.assign(defaultOptions, _options);
        } else if (_callback == undefined && _options != undefined) {
            _callback = _options;
        }

        this.runAjax(defaultOptions, _callback);
    };
    runajax(options, callback, say) {
        this.runAjax(options, callback, say);
    };

    /**
     * AJAX işlemleri için kullanınır.
     *
     * @constructor
     * @param options = { controller : '', method : '', action : '', paramURL : '',  paramJSON : {}, errorShowMessage : true (default), form :"" (Form Id veya Class)  }
     * @param callback = function(jsonClass, error) { }
     */

    async runAjax(options, callback, say) {
        if (say === undefined)
            say = 1;

        var defaults = {
            progress: null, //(percent) or (complated, total) or (complated, total, percent) or ()
            root: this.default_root,
            request: "",
            paramURL: null, // p1=adc&p2=123
            param: null, //{p1: '', p2: ''}
            form: "", //formid
            formdata: null,
            formData: null, //new FormData();
            waittext: "",
            response_false_show_msg: false,
            errorShowMessage: false,
            timeout: ((1000 * 60) * 2), //120sn 2dk
            timeout_rerun: false,

            btn: null,
            btntext: null,
            btnwaittext: null,

            before_callback: null,
            callback: null
        };

        options = $.extend(defaults, options);

        if (callback == undefined) {
            callback = options.callback;
        }
        if (options.btntext != null && options.btnwaittext == null) {
            options.btnwaittext = options.btntext;
        }

        options.timeout_rerun = false;

        if ($('meta[name="csrf-token"]').length == 0) {
            core.u.alert("Önemli Hata", "csrf-token meta mevcut değil!<br/>Ajax işlemi yapılamaz...", "error");
            return;
        }

        if (core.rooturl === undefined || core.rooturl === null || core.rooturl === "") {
            core.u.alert("Önemli Hata", "Site kök path alınamadı!", "error");
            return;
        }
        if (options.request === undefined || options.request === null || options.request === "") {
            core.u.alert("Önemli Hata", "runAjax geçerli bir Request göndermelisiniz!", "error");
            return;
        }
        if (options.errorShowMessage === undefined || options.errorShowMessage === null) {
            options.errorShowMessage = false;
        }

        if (options.formdata != null) {
            options.formData = options.formdata;
        }

        let coreFormData = options.formData;

        if (coreFormData == null) {
            coreFormData = new FormData();
        }

        if (options.form !== "" && $(options.form).length > 0) {
            let tempFrm = coreFormData;
            coreFormData = new FormData($(options.form)[0]);
            // for (var pair of coreFormData.entries()) {
            //     console.log(pair);
            // }

            if (tempFrm != null) {
                for (var pair of tempFrm.entries()) {
                    coreFormData.append(pair[0], pair[1]);
                }
            }
        }
        if ((options.param !== undefined && options.param !== null)) {
            Object.keys(options.param).forEach(function (k) {
                if (Array.isArray(options.param[k]) || typeof options.param[k] == "object") {
                    coreFormData.append(k, JSON.stringify(options.param[k]));
                } else {
                    coreFormData.append(k, options.param[k]);
                }
            });
        }
        if ((options.paramURL !== undefined && options.paramURL !== null && options.paramURL !== "")) {
            let pURL = options.paramURL.split('&');
            for (let i = 0; i < pURL.length; i++) {
                const el = pURL[i].split('=');
                coreFormData.append(el[0], el[1]);
            }
        }
        if (this.isRunning === true) {
            setTimeout(function () {
                core.runAjax(options, callback, say);
            }, 300);
            return;
        }

        if (options.btn != null && $(options.btn).length > 0)
            core.u.disabled(options.btn, options.btnwaittext);

        this.isRunning = true;
        let _mod = "POST";
        // if ($('meta[name="mod"]').length > 0) {
        //     _mod = $('meta[name="mod"]').attr("content");
        // }

        // coreFormData.append("_token",  $('meta[name="csrf-token"]').attr('content'));

        core.gtoken = "";
        //await core.gtoken_generate();

        var AJX = null;
        AJX = $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'X-G-TOKEN': core.gtoken
            },
            type: _mod,
            contentType: false,
            processData: false,
            url: core.rooturl + "/" + (options.root != "" ? options.root + "/" : "") + (core.prefix != "" ? core.prefix + (core.prefix.substr(-1) != "/" ? "/" : "") : "") + options.request,
            data: coreFormData,
            timeout: options.timeout,
            xhr: function () {
                var xhr = new window.XMLHttpRequest();

                if (!core.u.isnull(options.progress) && xhr != undefined) {
                    if (xhr.upload != undefined) {
                        xhr.upload.addEventListener("progress", function (evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = Math.floor((evt.loaded / evt.total) * 100);
                                //Do something with upload progress

                                if (options.progress.length == 1) {
                                    options.progress(percentComplete);
                                } else if (options.progress.length == 2) {
                                    options.progress(evt.loaded, evt.total);
                                } else if (options.progress.length == 3) {
                                    options.progress(evt.loaded, evt.total, percentComplete);
                                } else {
                                    options.progress();
                                }
                            }
                        }, false);
                    }
                    //Download progress
                    xhr.addEventListener("progress", function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = Math.floor((evt.loaded / evt.total) * 100);
                            //Do something with download progress

                            if (options.progress.length == 1) {
                                options.progress(percentComplete);
                            } else if (options.progress.length == 2) {
                                options.progress(evt.loaded, evt.total);
                            } else if (options.progress.length == 3) {
                                options.progress(evt.loaded, evt.total, percentComplete);
                            } else {
                                options.progress();
                            }
                        }
                    }, false);

                }

                return xhr;
            },
            beforeSend: function (XMLHttpRequest) {
                if (!core.u.isnull(options.before_callback)) {
                    options.before_callback();
                }
            },
            success: function (e) {
                core.isRunning = false;

                if (options.btn != null && $(options.btn).length > 0) {
                    core.u.disabled(options.btn, false);
                }

                if (options.waittext !== "" && pxwait !== undefined && pxwait !== null)
                    pxwait.hide(true);

                if (e === null) {
                    if (callback != undefined && callback != null) {
                        switch (callback.length) {
                            case 0:
                                callback();
                                break;
                            case 1:
                                callback(null);
                                break;
                            default:
                                callback(null, "Error : No Value");
                                break;
                        }
                    }
                    return;
                }
                try {
                    e = JSON.parse(e);

                    if (e.status == false) {

                        if (e.obj == "MiddlewareLogin") {
                            core.u.alert("Önemli Uyarı", "Kullanıcı girişi yapmalısınız!", "error", function () {
                                window.location = "/login";
                            });
                            return;
                        }

                        if (options.response_false_show_msg === true) {
                            core.u.alert("Uyarı", e.mesaj, "warning");
                        }
                    }
                }
                catch (e) {
                }

                if (callback != undefined && callback != null) {
                    switch (callback.length) {
                        case 0:
                            callback();
                            break;
                        case 1:
                            callback(e);
                            break;
                        default:
                            callback(e, null);
                            break;
                    }
                }
            },
            error: function (err) {
                core.isRunning = false;

                if (err.status === 419) {
                    //window.location.reload();
                    return;
                }

                if (options.timeout_rerun == true && err.status === 0 && say === 1) {
                    if (pxwait.ajaxobject !== null) {
                        $.ajax(pxwait.ajaxobject);
                    }
                    else {
                        core.runAjax(options, callback, 2);
                    }
                    return;
                }

                if (options !== null && options.waittext !== "")
                    pxwait.hide(true);

                if (options.errorShowMessage === true) {
                    core.u.alert("Hata Oluştu (Ajax): ", "<div style='font-size:13px'>" + err.status + "\n" + err.statusText + "\n\n" + err.responseText + "</div>", "error");
                }

                if (callback != undefined && callback != null) {
                    let return_error = { status: false, message: "Hata Oluştu (ajax) : " + err.status + "\n" + err.statusText + "\n\n" + err.responseText };

                    switch (callback.length) {
                        case 0:
                            callback();
                            break;
                        case 1:
                            callback(return_error);
                            break;
                        default:
                            callback(return_error, err);
                            break;
                    }
                }
            }
        });

        if (options.waittext !== "") {
            //canceltimeout: ((options.timeout / 1000) * (options.timeout_rerun ? 2 : 1)),
            pxwait.show({ message: options.waittext, panelshow: false, spinlevel: '3', ajaxobj: AJX });
        }
    };

    showModal(options, callback) {
        var defaultOption = {
            modal: "",
            closebackdrop: false,
            closekeydown: false,
            param: null,
            buttons: null
        };
        /* buttons: [{name='', class='', attr:[{name: '', value:''},...], text:'', closed: false }, ...] */
        options = $.extend(defaultOption, options);
        if (options === undefined || options === null || options.modal === "") {
            core.u.alert("Uyarı", "Modal parametreleri hatalı!<br/>Lütfen kontrol edip tekrar deneyin.", "warning");
            return;
        }
        if ($("[data-modal-name='" + options.modal + "']").length === 0) {
        }
        else {
        }
    };
    loadModal(idORlass, path, callback) {
        //geçici eklendi silinecek
        //        if ($('.modalcontainer [data-modal-key="' + idORlass + '"]').length > 0){
        //            $('.modalcontainer [data-modal-key="' + idORlass + '"]').remove();
        //        }
        //buraya kadar....
        if ($('.modalcontainer [data-modal-key="' + idORlass + '"]').length > 0) {
            if (!$('.modalcontainer [data-modal-key="' + idORlass + '"] .modal').hasClass("fade")) {
                $('.modalcontainer [data-modal-key="' + idORlass + '"] .modal').addClass("fade");
            }
            switch (callback.length) {
                case 0:
                    callback();
                    break;
                case 1:
                    callback(true);
                    break;
                case 2:
                    callback(true, "İşlem Başarılı.");
                    break;
                case 3:
                    callback(true, false, "İşlem başarılı.");
                    break;
            }
        }
        else {
            if ($(".modalcontainer").length === 0) {
                $("body").append('<div class="modalcontainer"></div>');
            }
            $(".modalcontainer").append('<div data-modal-key="' + idORlass + '"></div>');
            $("[data-modal-key='" + idORlass + "']").load(core.rooturl + "/module/" + path, function (responseTxt, statusTxt, xhr) {
                setTimeout(function () {
                    switch (statusTxt) {
                        case "success":
                            var durum = $("[data-modal-key='" + idORlass + "'] .page404").length === 0;
                            if (!$('.modalcontainer [data-modal-key="' + idORlass + '"] .modal').hasClass("fade")) {
                                $('.modalcontainer [data-modal-key="' + idORlass + '"] .modal').addClass("fade");
                            }

                            //$('.modalcontainer [data-modal-key="' + idORlass + '"] .modal').attr("data-keyboard", "false").attr("data-backdrop", "static");

                            switch (callback.length) {
                                case 0:
                                    callback();
                                    break;
                                case 1:
                                    callback(durum);
                                    break;
                                case 2:
                                    callback(durum, (durum ? "İşlem başarılı. Modal yüklendi." : "İşlem başarısız! Modal yüklenemedi."));
                                    break;
                                case 3:
                                    callback(durum, true, (durum ? "İşlem başarılı. Modal yüklendi." : "İşlem başarısız! Modal yüklenemedi."));
                                    break;
                            }
                            break;
                        case "error":
                            switch (xhr.status.toString()) {
                                case "401":
                                    core.u.alert("Önemli Uyarı", "Kullanıcı girişi yapmalısınız!", "error", function () {
                                        window.location = "/login";
                                    });
                                    break;
                                case "500":
                                    swal("Hata", "500 - Internal Error ! - " + xhr.status + ": " + xhr.statusText, "error");
                                    break;
                                case "404":
                                    $(".layout-main #page_" + menu[0].ID).html('<div class="page404"><b>404</b><br/>Sayfa mevcut değil!<br/>' + core.rooturl + "/module/" + menu[0].URL + '</div>');
                                    break;
                                default:
                                    if (say < 4) {
                                        setTimeout(function () {
                                            app.master.loadmenupage(menuid, (say + 1));
                                        }, 200);
                                    } else {
                                        swal("Hata", "Sayfa yüklemedi! - " + xhr.status + ": " + xhr.statusText + " - " + say, "error");
                                    }
                                    break;
                            }
                            break;
                    }
                }, 100);
            });
        }
    };
};

window.core = new Core();
