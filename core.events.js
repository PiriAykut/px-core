/* 
    core.events
    20.08.2022
    Piri AYKUT - piriaykut@gmail.com
    https://www.linkedin.com/in/piri-aykut-ba395b70/
 */

export class CoreEvents {
    constructor() {
        this.events();

        let self = this;
        setTimeout(() => {
            self.lazy_load();
        }, 1000);
    }

    events() {
        $("body")
            // .on("click", "input[autocomplete='off']", function () {
            //     $(this).removeAttr("readonly").focus();
            // })
            // .on("blur", "input[autocomplete='off']", function () {
            //     $(this).attr("readonly");
            // })
            .on("change", ".moneyonly", function () {
                if ($(this).val().trim().length > 0) {
                    let add = $(this).val().indexOf(",") == -1;
                    let t = "";
                    let d = "";

                    if (!add) {
                        let p = $(this).val().split(",");
                        t = p[0].replaceAll(".", "");
                        if (t === "") t = "0";
                        d = p[1];
                    } else {
                        t = $(this).val().replaceAll(".", "");
                        d = "00";
                    }

                    let money = t + "," + d;
                    $(this).attr("data-val", money.toString().replace(",", ".")).val(core.u.moneyformat(money));
                } else {
                    $(this).attr("data-val", "0.00").val("0,00");
                }
            }).on("input", ".core-filter", function () {
                core.u.html_filter($(this).attr("data-container"), $(this).attr("data-item"), $(this).val());
            }).on("input", ".input-filter", function () {
                let cont = $(this).attr("data-container");
                let item = $(this).attr("data-item");
                let text = $(this).val();

                if (cont == undefined || cont == "" || item == undefined || item == "") {
                    return;
                }

                core.u.html_filter(cont, item, text);

            }).on("click", ".input-group-append", function () {
                if ($(".form-control", $(this).parent()).length > 0)
                    $(".form-control", $(this).parent()).focus();
            }).on("click", ".date-group .input-group-addon", function () {
                //tarih kutucuklarında butona basıldığında takvimi açmak için
                $("input", $(this).parent()).datepicker("show");
            }).on("focus", "input.readonlyinput", function () {
                //autocomplati engellemek için eklendi
                if ($(this).attr('readonly') !== undefined) {
                    $(this).removeAttr('readonly');
                }
            }).on("blur", "input.readonlyinput", function () {
                //autocomplati engellemek için eklendi
                $(this).attr("readonly", "readonly");
            }).on('click', 'a.dropdown-item', function (event) {
                //child menülerde menü grubuna tıklandığında kapanma sorunu için eklendi.
                if ($(this).parent().hasClass("dropdown-submenu")) {
                    event.stopPropagation();
                }
            }).on("click", ".datetimepicker", function () {
                //datetimepicker click lendiğinde readonly ise takvimi açma
                if ($(this).attr("readonly") != undefined || $(this).attr("disabled") != undefined) {
                    $(this).datetimepicker('destroy');
                }
            }).on("click", "[data-ng-click]", function () {
                if ($(this).attr("data-ng-click") !== undefined)
                    eval($(this).attr("data-ng-click"));
            }).on("click", "[data-click]", function () {
                if ($(this).attr("data-click") !== undefined)
                    eval($(this).attr("data-click"));
            }).on("dblclick", "[data-ng-dblclick]", function () {
                if ($(this).attr("data-ng-dblclick") !== undefined)
                    eval($(this).attr("data-ng-dblclick"));
            }).on("dblclick", "[data-dblclick]", function () {
                if ($(this).attr("data-dblclick") !== undefined)
                    eval($(this).attr("data-dblclick"));
            }).on("change", "[data-change]", function () {
                if ($(this).attr("data-change") !== undefined)
                    eval($(this).attr("data-change"));
            }).on("change", "[data-ng-change]", function () {
                if ($(this).attr("data-ng-change") !== undefined)
                    eval($(this).attr("data-ng-change"));
            }).on("keyup", "[data-keyup]", function (e) {
                if ($(this).attr("data-keyup") !== undefined && core.u.YasakliKey().indexOf("," + e.which + ",") === -1)
                    eval($(this).attr("data-keyup"));
            }).on("keyup", "[data-ng-keyup]", function (e) {
                if ($(this).attr("data-ng-keyup") !== undefined && core.u.YasakliKey().indexOf("," + e.which + ",") === -1)
                    eval($(this).attr("data-ng-keyup"));
            }).on("focus", ".focus-select-text", function () {
                if ($(this).val().length > 0)
                    $(this).select();
            }).on("focus", ".selecttext", function (e) {
                $(this).select();
            }).on("focus", ".seltext", function (e) {
                $(this).select();
            }).on("input", ".firstupper", function (e) {
                if ($(this).val().length == 1) {
                    $(this).val($(this).val().toTrUpperCase());
                }
            }).on("input", ".upper", function (e) {
                //sadece küçük harflerde çalış
                //if ((e.which >= 97 && e.which <= 122) || (e.which >= 65 && e.which <= 90) || "ç,ş,ğ,ü,ö,i,ə,".indexOf(e.key + ",") > -1) {
                $(this).val($(this).val().toTrUpperCase());
                //}
            }).on("input", ".lower", function (e) {
                //sadece küçük harflerde çalış
                //if ((e.keyCode >= 97 && e.keyCode <= 122) || (e.keyCode >= 65 && e.keyCode <= 90) || "Ç,Ş,Ğ,Ü,Ö,İ,Ə,".indexOf(e.key + ",") > -1) {
                $(this).val($(this).val().toTrLowerCase());
                //}
            }).on("keypress", ".moneyonly", function (event) {
                var keyCode = event.which;
                if (keyCode > 0 && (keyCode < 48 || keyCode > 57)) {
                    if ("|8|46|44|".indexOf("|" + keyCode + "|") === -1 && "|37|39|".indexOf("|" + keyCode + "|") === -1) {
                        event.preventDefault();
                    }
                }

                return;
                var desAscii = (core.u.decimalChr === "," ? 46 : 44); //"," : "."
                var controlAscii = (core.u.decimalChr === "," ? 44 : 46); //"." : ","

                var keyCode = event.which;

                if (controlAscii === event.which) {
                    var parca = $(this).val().split(core.u.decimalChr);
                    if (!(parca.length >= 2)) {
                        var vl = $(this).val().trim();

                        $(this).val((vl.length === 0 ? "0" : vl) + core.u.decimalChr);
                    }

                    event.preventDefault();
                }

                if (keyCode > 0 && event.which !== desAscii && (event.which < 48 || event.which > 57)) {
                    if (("|8|").indexOf("|" + event.which + "|") === -1 && ("|37|39|").indexOf("|" + event.keyCode + "|") === -1) {
                        event.preventDefault();
                    }
                } else if (event.which === desAscii) {
                    var parca = $(this).val().split(core.u.decimalChr);
                    if (parca.length >= 2) {
                        event.preventDefault();
                    }
                }


            }).on("keypress", ".numericonly", function (event) {
                var keyCode = event.which;
                if (keyCode > 0 && (keyCode < 48 || keyCode > 57)) {
                    if ("|8|46|".indexOf("|" + keyCode + "|") === -1 && "|37|39|".indexOf("|" + keyCode + "|") === -1) {
                        event.preventDefault();
                    }
                }
            }).on("change", ".numericonly", function () {
                var str = "";
                var chr = "";
                var ascii;

                for (var i = 0; i < $(this).val().length; i++) {
                    chr = $(this).val().substr(i, 1);
                    ascii = chr.charCodeAt(0);
                    //console.log(chr + " => " + ascii);
                    if ((ascii >= 48 && ascii <= 57) || ascii == 46) {
                        str += chr;
                    }
                }

                $(this).val(str);

            }).on("click", ".clearselectdata", function () {
                var owner = $(this);
                do {
                    owner = $(owner).parent();
                } while (!$(owner).hasClass("input-group"));

                $("input", $(owner)).val("");

            }).on("keypress", "[data-dateformat]", function (event) {
                var format = $(this).attr("data-dateformat");
                var ayrac = "";

                for (var i = 0; i < format.length; i++) {
                    if ("./-".indexOf(format.substr(i, 1)) > -1) {
                        ayrac = format.substr(i, 1);
                        break;
                    }
                }

                if (ayrac === "") {
                    ayrac = ".";
                }

                if (event.which < 48 || event.which > 57) {
                    if (event.char !== ayrac)
                        event.preventDefault();
                }
            }).on("keyup", "[data-dateformat]", function (event) {
                /*dd == gün; mm=ay; yyyyy = yıl*/
                if (event.which === 8) {
                    return;
                }
                var format = $(this).attr("data-dateformat");
                var ayrac = "";

                for (var i = 0; i < format.length; i++) {
                    if ("./-".indexOf(format.substr(i, 1)) > -1) {
                        ayrac = format.substr(i, 1);
                        break;
                    }
                }

                if (ayrac === "") {
                    ayrac = ".";
                }

                var parse = format.split(ayrac);

                var textParse = $(this).val().split(ayrac);

                var newText = "";

                for (var i = 0; i < textParse.length; i++) {
                    newText += textParse[i];

                    if (i < 2 && textParse[i].length === parse[i].length) {
                        newText += ayrac;
                    }
                }

                $(this).val(newText);

            }).on("input", ".notnullvalid", function () {
                $(this).removeClass('notnullvalid');
            }).on("change", ".notnullvalid", function () {
                $(this).removeClass('notnullvalid');
            }).on("shown.bs.modal", ".modal", function () {
                if ($(".modal.show").length > 1) {
                    let zindexModal = 1050;
                    let indx = 0;

                    $(".modal.show").each(function () {
                        $(this).css("z-index", zindexModal);
                        $(".modal-backdrop.show:eq(" + indx + ")").css("z-index", (zindexModal - 1));

                        zindexModal += 5;
                        indx++;
                    });
                }
            }).on("click", "[data-dismiss='modal']", function () {
                $(this).parents(".modal").modal("hide");
            })

        //extras
        $(document).keydown(function (event) {
            if (event.keyCode === 123) {//F12 Engelle
                return false;
            } else if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
                return false;  //Prevent from ctrl+shift+i
            }
        });
    }

    lazy_load() {
        window.lazyLoad = target => {
            const io = new IntersectionObserver((entries, observer) => {

                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0) {
                        const _target = entry.target;

                        if ($(_target).is('picture')) {
                            let source = $(_target).find('[data-lazy]');

                            source.each(function () {
                                if ($(this).is('source')) {
                                    $(this).attr('srcset', $(this).attr('data-lazy'));
                                } else {
                                    $(this).attr('src', $(this).attr('data-lazy'));
                                }
                                $(this).removeAttr('data-lazy')
                            });
                        } else {
                            switch ($(_target).attr('data-lazy')) {
                                case "number":
                                    core_number_say($(_target), 0, parseInt($(_target).attr('data-number')));
                                    break;
                                case "appointment":
                                    app.loader.load_appointment($(_target).attr("data-doctorid"));
                                    break;
                                default:
                                    if ($(_target).attr("onerror") == undefined) {
                                        $(_target).attr("onerror", core.u.image_error_attr())
                                    }

                                    $(_target).attr('src', $(_target).attr('data-lazy'));
                                    break;
                            }

                            $(_target).removeAttr('data-lazy')
                        }

                        observer.disconnect();
                    }
                });
            });
            io.observe(target)
        };

        const targets = document.querySelectorAll('[data-lazy]');
        targets.forEach(lazyLoad);
    }
}


function core_number_say(obj, vl, max) {
    if (max > 100) {
        vl += Math.floor(Math.random() * (max / 50));
    } else {
        vl++;
    }

    if (vl > max) {
        obj.html(max + (obj.attr("data-string") !== undefined ? obj.attr("data-string") : ""));
        return;
    }

    obj.html(vl + (obj.attr("data-string") !== undefined ? obj.attr("data-string") : ""));

    setTimeout(() => {
        core_number_say(obj, vl, max);
    }, (max > 100 ? 50 : 100));
}
