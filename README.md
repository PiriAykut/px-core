
## install
> npm i jquery <br>
> npm i px-jquery-wait
> npm i px-core

## javascript - jquery
> require('px-jquery-wait');
> require('px-core');

### use
> core.run("request_url", {params}, { form: "#formid or class - optional",  waittext: "message to show until ajax result comes" }, function(e, err){ //e = data block returned as ajax result }); <br>
> let filterdata = core.json.filter(jsonarray, fieldname, value);  //core.json.sort() -- core.json.remove() <br>
> core.crypt.en("..."); core.crypt.de("...."); <br>
> core.u.{ many methods } <br>
