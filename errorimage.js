var _default_image = "/images/default-image.jpg";

function imageerror(img) {
    // img.onerror = null;

    // if ($(img).parent('picture').find('source:eq(0)').attr('data-error')!= 'yes'){
    //     $(img).parent('picture').find('source:eq(0)').attr('data-error','yes')
    //     img.parentNode.children[0].srcset = img.parentNode.children[1].srcset ;
    // }
    // else{
    //     $(img).parent('picture').find('source:eq(1)').attr('data-error','yes')
        
    //     img.parentNode.children[1].srcset = img.src;
    //     img.parentNode.children[0].srcset = img.src;
    // }

    // return;

    img.onerror = null;

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
            $.get(window.location.origin + "/" + _imageIndex[1])
                .done(function () {
                    img.parentNode.children[0].srcset = _imageIndex[1];
                    img.parentNode.children[0].type = _imageIndex[2];
    
                    img.src = _imageIndex[1];
                    img.parentNode.removeChild(img.parentNode.children[_imageIndex[0]]);
                }).fail(function () {
                    img.parentNode.children[0].srcset = _default_image;
                    img.parentNode.children[0].type = "image/jpg";
                    img.src = _default_image;
                    img.parentNode.removeChild(img.parentNode.children[_imageIndex[0]]);
                })
        } else {
            img.parentNode.children[0].srcset = _default_image;
            img.parentNode.children[0].type = "image/jpg";
            img.src = _default_image;
        }
    } else {
        img.parentNode.children[0].srcset = _default_image;
        img.parentNode.children[0].type = "image/jpg";
        img.src = _default_image;
    }
}