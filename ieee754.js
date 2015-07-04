
function calcIeee(dec) {
	var fail = false;
	// get sign
	var sign = 0;
	if(dec.charAt(0)=="-") {
		// negative number
		sign = 1;
		dec = dec.substr(1, dec.length-1);
	}
	else if(dec.charAt(0)=="+") {
		// positive number, but signed
		sign = 0;
		dec = dec.substr(1, dec.length-1);
	}

	var seperator_index = dec.indexOf(".");
	if(seperator_index<0) {
		seperator_index = dec.length;
	}

	// calculate binary (string) from left part of dec
	var left_dec = dec.substring(0, seperator_index);
	var left_bin = parseInt(left_dec, 10).toString(2);
	var left_bin_length = left_bin.length;

	// calulate binary representation from right part of dec
	var right_dec = parseFloat("0." + dec.substring(seperator_index+1, dec.length));
	var right_bin_length = $("#ieee_settings_mant_len").val() - left_bin_length + 1;
	var right_bin = "";
	for(var i = 0; i < right_bin_length; i++) {
		right_dec *= 2;
		if(right_dec>=1) {
			right_dec -= 1;
			right_bin = right_bin + "1";
		}
		else {
			right_bin = right_bin + "0";
		}
	}

	// calulate exponent (assuming hidden bit)
	var exponent = left_bin_length-1;

	// calculate characteristica
	var ieee_settings_carc_len = parseInt($("#ieee_settings_carc_len").val());
	var carc = exponent + Math.pow(2, (ieee_settings_carc_len - 1)) - 1;
	var carc_bin = carc.toString(2);
	// make carc_bin length to $("#ieee_settings_carc_len").val()
	if(carc_bin.length > ieee_settings_carc_len) {
		fail = true;
		carc_bin = carc_bin.substr(carc_bin.length - ieee_settings_carc_len, ieee_settings_carc_len);
	}
	else if(carc_bin.length < ieee_settings_carc_len) {
		while((ieee_settings_carc_len - carc_bin.length) > 0) {
			carc_bin = "0" + carc_bin;
		}
	}

	// mantissa
	var mantissa_bin = (left_bin + right_bin).substring(1);
	// length of mantissa is $("#ieee_settings_mant_len").val()

	// hidden bit is not set
	if((!$("#ieee_settings_hidden").prop("checked"))) {
		mantissa_bin = "1" + mantissa_bin;
	}

	// special case: number ist zero
	if(parseFloat(dec)==0) {
		carc_bin = "";
		mantissa_bin = "";
		for(i = 0; i < parseInt($("#ieee_settings_carc_len").val()); i++) {
			carc_bin += "0";
		}
		for(i = 0; i < parseInt($("#ieee_settings_mant_len").val()); i++) {
			mantissa_bin += "0";
		}
	}

	// display number
	displayIeee(sign, carc_bin, mantissa_bin);

	if(fail) {
		alert("Error: number to large.")
	}
}

function displayIeee(sign, carc_bin, mantissa_bin) {// Color td background
	// sign
	if(sign==1) {
		$("#out_ieee_sign_table").find("tbody tr td:nth-child(1)").css("background-color", "#111111");
	}
	else {
		$("#out_ieee_sign_table").find("tbody tr td:nth-child(1)").css("background-color", "#eeeeee");
	}
	// characterisic
	var out_ieee_carc_table = $("#out_ieee_carc_table");
	out_ieee_carc_table.find("tbody tr").empty();
	for(var j = 0; j < carc_bin.length; j++) {
		out_ieee_carc_table.find("tbody tr").append("<td>&nbsp;</td>");
		if(carc_bin.charAt(j)=="1") {
			out_ieee_carc_table.find("tbody tr td:nth-child("+(j+1).toString()+")").css("background-color", "#111111");
		}
		else {
			out_ieee_carc_table.find("tbody tr td:nth-child("+(j+1).toString()+")").css("background-color", "#eeeeee");
		}
	}
	// mantissa
	var out_ieee_mant_table = $("#out_ieee_mant_table");
	out_ieee_mant_table.find("tbody tr").empty();
	for(var k = 0; k < mantissa_bin.length; k++) {
		out_ieee_mant_table.find("tbody tr").append("<td>&nbsp;</td>");
		if(mantissa_bin.charAt(k)=="1") {
			out_ieee_mant_table.find("tbody tr td:nth-child("+(k+1).toString()+")").css("background-color", "#111111");
		}
		else {
			out_ieee_mant_table.find("tbody tr td:nth-child("+(k+1).toString()+")").css("background-color", "#eeeeee");
		}
	}
}

function readIeee() {
	var ret = [];
	var i;
	//alert($("#out_ieee_sign_table").find("tbody tr td:nth-child(1)").css("background-color"));
	// sign
	if($("#out_ieee_sign_table").find("tbody tr td:nth-child(1)").css("background-color") == "rgb(17, 17, 17)") {
		ret["sign"] = 1;
	}
	else {
		ret["sign"] = 0;
	}
	// characterisic
	ret["carc"] = "";
	for(i = 0; i < parseInt($("#ieee_settings_carc_len").val()); i++) {
		if($("#out_ieee_carc_table").find("tbody tr td:nth-child("+(i+1).toString()+")").css("background-color") == "rgb(17, 17, 17)") {
			ret["carc"] += "1";
		}
		else {
			ret["carc"] += "0";
		}
	}
	// mantissa
	ret["mant"] = "";
	for(i = 0; i < parseInt($("#ieee_settings_mant_len").val()); i++) {
		if($("#out_ieee_mant_table").find("tbody tr td:nth-child("+(i+1).toString()+")").css("background-color") == "rgb(17, 17, 17)") {
			ret["mant"] += "1";
		}
		else {
			ret["mant"] += "0";
		}
	}
	return ret;
}

function calcIeeeSpecial(str) {
	var sign;
	var carc_bin = "";
	var mantissa_bin = "";
	var i;

	// NaNq = NaN
	if(str.match(/^(\+|-)?((N|n)a(N|n))q?$/)) {
		if(str.charAt(0)=='-') {
			sign = 1;
		}
		else {
			sign = 0;
		}
		for(i = 0; i < parseInt($("#ieee_settings_carc_len").val()); i++) {
			carc_bin += "1";
		}
		for(i = 0; i < parseInt($("#ieee_settings_mant_len").val()); i++) {
			mantissa_bin += "1";
		}
		// ES6:
		//carc_bin = "1".repeat(parseInt($("#ieee_settings_carc_len").val()));
		//mantissa_bin = "1".repeat(parseInt($("#ieee_settings_mant_len").val()));
	}
	// NaNs
	else if(str.match(/^(\+|-)?(N|n)a(N|n)s$/)) {
		if(str.charAt(0)=='-') {
			sign = 1;
		}
		else {
			sign = 0;
		}
		for(i = 1; i < parseInt($("#ieee_settings_carc_len").val()); i++) {
			carc_bin += "1";
		}
		carc_bin += "0";
		for(i = 0; i < parseInt($("#ieee_settings_mant_len").val()); i++) {
			mantissa_bin += "1";
		}
	}
	// Inf
	else {
		if(str.charAt(0)=='-') {
			sign = 1;
		}
		else {
			sign = 0;
		}
		for(i = 0; i < parseInt($("#ieee_settings_carc_len").val()); i++) {
			carc_bin += "1";
		}
		for(i = 0; i < parseInt($("#ieee_settings_mant_len").val()); i++) {
			mantissa_bin += "0";
		}
	}

	// display number
	displayIeee(sign, carc_bin, mantissa_bin);
}

function calcDec(sign, carc_bin, mantissa_bin) {
	// characterisic / exponent
	// C =  E + (2^7 - 1)
	var exp = parseInt(carc_bin, 2);
	exp = exp - Math.pow(2, parseInt($("#ieee_settings_carc_len").val())-1) + 1;
	// mantissa
	var num = 1;
	for (var i = 0; i < mantissa_bin.length; i++) {
		if(mantissa_bin.charAt(i) == '1') {
			num += (1/Math.pow(2, i+1));
		}
	}
	num = num * Math.pow(2, exp);
	// sign == 1: negative
	if(sign==1) {
		return -num;
	}
	else {
		return num;
	}
}