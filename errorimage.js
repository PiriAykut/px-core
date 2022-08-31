var _default_image = "/images/default-image.jpg";

function imageerror(img) {
    img.onerror = null;
    let default_image  = _default_image;

    // if (img.attr("data-error-path") != undefined){
    //     default_image = img.attr("data-error-path");

    //     img.removeAttr("data-error-path");
    // }

    if (img.parentNode.tagName == "PICTURE") {
        let _webpIndex = [-1, "", ""];
        let _imageIndex = [-1, "", ""];

        for (let i = 0; i < img.parentNode.children.length; i++) {
            const el = img.parentNode.children[i];

            if (el.tagName == "SOURCE") {
                switch (el.type) {
                    case "image/webp":
                        _webpIndex = [i, el.srcset, el.type];
                        break;
                    default:
                        _imageIndex = [i, el.srcset, el.type];
                        break;
                }
            }
        }

        if (_webpIndex[0] == 0) {
            var http = new XMLHttpRequest();
            let _url = _imageIndex[1];

            if (_url.substring(0, 4) == "http"){
                _url = _url;
            }else{
                _url = window.location.origin + (_url.substring(0,1) != "/" ? "/" : "") + _url;
            }

            http.open('HEAD', _url, false);
            http.send();

            if (http.status != 404) {
                img.parentNode.children[0].srcset = _imageIndex[1];
                img.parentNode.children[0].type = _imageIndex[2];

                img.src = _imageIndex[1];
            } else {
                img.parentNode.children[0].srcset = default_image;
                img.parentNode.children[0].type = "image/jpg";
                img.src = default_image;
            }

            img.parentNode.removeChild(img.parentNode.children[_imageIndex[0]]);
        } else {
            img.parentNode.children[0].srcset = default_image;
            img.parentNode.children[0].type = "image/jpg";
            img.src = default_image;
        }
    } else {
        img.src = default_image;
    }
}