## install

> npm i jquery <br>
> npm i sweetalert2 <br>
> npm i toastr <br/>
> npm i px-jquery-wait <br>
> npm i px-core

## javascript - jquery

> require('px-jquery-wait'); or import 'px-jquery-wait'; <br>
> require('px-core'); or import 'px-core'; <br>
> core.default_root = "api"; //**optional** first segment to be used in each request eg api/...

## css

> @import "px-jquery-wait/px-wait.css"; //vite <br>
> @import "~px-jquery-wait/px-wait.css"; //mix <br><br>
> @import "toastr"; //vite <br>
> @import "~toastr"; //mix <br>

### use

> - core.run("request_url", {params}, { form: "#formid or class - optional", waittext: "message to show until ajax result comes" }, function(e, err){ //e = data block returned as ajax result }); <br>
> - let filterdata = core.json.filter(jsonarray, fieldname, value); //core.json.sort() -- core.json.remove() <br>
> - core.crypt.en("..."); core.crypt.de("...."); <br>
> - core.u.{ many methods } <br>
