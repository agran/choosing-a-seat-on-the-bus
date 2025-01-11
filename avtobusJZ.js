var $svg;
var allMestaTxt = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20';
var lastHasheChageTime = 0;
$( document ).ready(function() {
    console.log( "ready!" );
	

	
	var svgtxt = getFile('avtobusJZ3.svg');
	var doc = (new DOMParser).parseFromString(svgtxt, 'image/svg+xml');

	$svg = $('svg', doc);

	$svg.find("#_Сидушка-"+20).attr('xlink:href', '#_СидушкаКрас');
	$svg.find("#_Спинка-"+20).attr('xlink:href', '#_СпинкаКрас');
	$svg.find(".Место-"+20).css('fill', '#7A7C6C');
	$('#imgParent').prepend($svg);
	console.log($svg.attr('id'));
	
	var mestaTableHtml = '';
	
	for (let i = 1; i <= 19; i++){
		mestaTableHtml += "<div class=line-mesto data-mesto="+i+"><span class='mesto-n'>"+i+".</span> <span class='mesto-status mesto-status-svob'>Свободно</span> <button class=bZan>Занять</button></div>";
	}
	mestaTableHtml += "<div class=line-mesto data-mesto="+20+"><span class='mesto-n'>"+20+".</span> <span class='mesto-status mesto-status-zan'>Занято</span> <button class=bOsv>Освободить</button></div>";	
	$('#mestaTable').html(mestaTableHtml);
	
	function update(){
		var i = 0;
		var mestaTxt = '';
		var mestaZanTxt = '';
		$('.mesto-status').each(function(){
			i ++;
			if($(this).hasClass('mesto-status-svob')){
				mestaTxt += i+',';
				
				$svg.find("#_Сидушка-"+i).attr('xlink:href', '#_СидушкаЗел');
				$svg.find("#_Спинка-"+i).attr('xlink:href', '#_СпинкаЗел');
				$svg.find(".Место-"+i).css('fill', '#f4f7e0');				
				
			}else{
				mestaZanTxt += i+',';
				$svg.find("#_Сидушка-"+i).attr('xlink:href', '#_СидушкаКрас');
				$svg.find("#_Спинка-"+i).attr('xlink:href', '#_СпинкаКрас');
				$svg.find(".Место-"+i).css('fill', '#7A7C6C');
			}
		});
		
		if (mestaTxt.length > 0 && mestaTxt[mestaTxt.length-1] === ","){
			mestaTxt = mestaTxt.slice(0,-1);
		}
		if (mestaZanTxt.length > 0 && mestaZanTxt[mestaZanTxt.length-1] === ","){
			mestaZanTxt = mestaZanTxt.slice(0,-1);
		}

		$('#mestaSvobodnInput').val(mestaTxt);
		if(mestaTxt !== '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19'){
			lastHasheChageTime = Date.now();
			window.location.hash = mestaTxt;		
		}else if(window.location.hash!==''){
			lastHasheChageTime = Date.now();
			window.location.hash = '';
			history.replaceState(null, null, ' ');
		}
		$('#mestaZanyatyInput').val(mestaZanTxt);
		
		//const XML = new XMLSerializer().serializeToString($svg[0]);
		//const SVG64 = utf8_to_b64(XML);
		
		//$('img').attr('src', 'data:image/svg+xml;base64,' + SVG64);
		
		SVGToImage({
			svg: $svg[0],
			mimetype: "image/png",
			width: 1550,
			quality: 1
		}).then(function(base64image){
			$('img').attr('src', base64image);
		}).catch(function(err){
			console.log(err);
		});
		
	}
	
 	$( document ).on('click', '.bZan', function() {
		var lineMesto = $(this).parent();
		lineMesto.find('.mesto-status').removeClass('mesto-status-svob').addClass('mesto-status-zan').html('Занято');
		lineMesto.find('button').removeClass('bZan').addClass('bOsv').html('Освободить');
		
		update();
	});

 	$( document ).on('click', '.bOsv', function() {
		var lineMesto = $(this).parent();
		lineMesto.find('.mesto-status').removeClass('mesto-status-zan').addClass('mesto-status-svob').html('Свободно');
		lineMesto.find('button').removeClass('bOsv').addClass('bZan').html('Занять');
		
		update();
	});
	
	$( document ).on('dblclick', 'path', function() {
		console.dir($(this).attr('id'));
		var mestoN = Number($(this).attr('id').match(/\d+/)[0]);
		console.dir(mestoN);
		var lineMesto = $('.line-mesto[data-mesto="'+mestoN+'"]');
		lineMesto.find('button').click();
	});
	
	$( document ).on('click', '.copy', function(e) {

		const canvas = document.createElement("canvas");
		var img = $('img')[0];
		
		canvas.width = 1550;
		canvas.height = 642;
		canvas.getContext("2d").drawImage(img, 0, 0, 1550, 642);
		canvas.toBlob((blob) => {
		  navigator.clipboard.write([
			  new ClipboardItem({ "image/png": blob })
		  ]);
		}, "image/png");
	});
	$( document ).on('click', '.copyClose', function(e) {
			
		const canvas = document.createElement("canvas");
		var img = $('img')[0];
		
		canvas.width = 1550;
		canvas.height = 642;
		canvas.getContext("2d").drawImage(img, 0, 0, 1550, 642);

		canvas.toBlob((blob) => {
		  navigator.clipboard.write([
			  new ClipboardItem({ "image/png": blob })
		  ]);
		  
		  setTimeout(function(){open(location, '_self').close();}, 50);
		}, "image/png");
	});
	
	$( document ).on('click', '.save', function(e) {
		var data  = $('img').attr('src');
		console.dir(data);
		
		var a = document.createElement('a');
		a.href = data;
		a.download = "Свободные места.png";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	});
	
	$( document ).on('change', '#mestaZanyatyInput', function() {
		var arrMestaZan = $(this).val().replace(/[^\d,\s]/g, '').split(/[\s,]+/);
		var arrMestaSvob = allMestaTxt.split(",");
		
		arrMestaZan.forEach(function(mestoN){
			mestoN = mestoN.trim();
			
			var index = arrMestaSvob.indexOf(mestoN);
			if (index !== -1) {
				arrMestaSvob.splice(index, 1);
			}
			
		});
		
		$('#mestaSvobodnInput').val(arrMestaSvob.join(','));
		
		$('#mestaSvobodnInput').trigger('change');
		
	});
	
	$( document ).on('change', '#mestaSvobodnInput', function() {
		
		$('.line-mesto').each(function(){
			var lineMesto = $(this);
			
			lineMesto.find('.mesto-status').removeClass('mesto-status-svob').addClass('mesto-status-zan').html('Занято');
			lineMesto.find('button').removeClass('bZan').addClass('bOsv').html('Освободить');			
		});
		
		var arrMesta = $(this).val().replace(/[^\d,\s]/g, '').split(/[\s,]+/);
		var arrMestaZan = allMestaTxt.split(",");
		
		arrMesta.forEach(function(mestoN){
			mestoN = mestoN.trim();
			
			var index = arrMestaZan.indexOf(mestoN);
			if (index !== -1) {
				arrMestaZan.splice(index, 1);
			}
			
			var lineMesto = $('.line-mesto[data-mesto="'+mestoN+'"]');

			lineMesto.find('.mesto-status').removeClass('mesto-status-zan').addClass('mesto-status-svob').html('Свободно');
			lineMesto.find('button').removeClass('bOsv').addClass('bZan').html('Занять');
		
			console.log(mestoN);
		});
		
		$('#mestaZanyatyInput').val(arrMestaZan.join(','));
		
		update();
	});
	
	$( document ).on('click', '.copyMesta', function() {
		$(this).parent().find('input').select();
		document.execCommand("copy");
	});
	
	$( document ).on('click', '.pastMesta', function() {
		var inputMesta = $(this).parent().find('input');
		//$(this).parent().find('input').select();
		navigator.clipboard.readText()
			.then(text => {
			inputMesta.val(text);
			
			$('input.pasted').removeClass('pasted');
			if(RegExp(/[^\d,\s]/g).test(text)){
				inputMesta.addClass('pasted');
				$('.mestButton').css('color', 'red');
			}else{
				inputMesta.trigger('change');
			}
		});
	});
	
	$( document ).on('click', '.mestButton', function() {
		$('.mestButton').css('color', '');
		$('input.pasted').removeClass('pasted').trigger('change');
	});
	
	$( document ).on('click', '.clearButton', function() {
		$('#mestaSvobodnInput').val('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19');
		$('#mestaZanyatyInput').val('20');
		$('#mestaSvobodnInput').trigger('change');
	});

	$( window ).on( 'hashchange', function( e ) {
		console.log('hashchange');
		console.log(Date.now());
		console.log(lastHasheChageTime);
		console.log(Date.now() - lastHasheChageTime);
		if((lastHasheChageTime == 0) || (Date.now() - lastHasheChageTime > 500)){
			$('#mestaSvobodnInput').val(window.location.hash.substring(1));
			$('#mestaSvobodnInput').trigger('change');
		}
	});
	
	if(window.location.hash != ''){
		$( window ).trigger("hashchange");
	}else{
		$('#mestaSvobodnInput').val('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19');
		$('#mestaZanyatyInput').val('20');
		update();
	}
	
});

function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function isset() {
	// +   original by: Kevin van Zonneveld 
	// +   improved by: FremyCompany
	// +   improved by: Onno Marsman
	// *     example 1: isset( undefined, true);
	// *     returns 1: false
	// *     example 2: isset( 'Kevin van Zonneveld' );
	// *     returns 2: true

	var a = arguments,
		l = a.length,
		i = 0;

	if (l === 0) {
		throw new Error('Empty isset');
	}

	while (i !== l) {
		if (typeof(a[i]) == 'undefined' || a[i] === null) {
			return false;
		} else {
			i++;
		}
	}
	return true;
}

function getFile(strUrl, type) {
	
	if(!isset(type)){
		type = 'text';
	}
	
	var fileReturn;
	
	jQuery.ajax({
		url: strUrl,
		dataType: type,
		success: function(data) {
			fileReturn = data;
		},
		async: false
	});
	
	return fileReturn;
}

function addZero(n) {
	return (parseInt(n) < 10 ? "0" : "") + parseInt(n);
}
function pad(n) { return ("00000000" + n).substr(-8); }
function natural_expand(a) { return a.replace(/\d+/g, pad) };
function natural_compare(a, b) {
    return natural_expand(a).localeCompare(natural_expand(b));
}

function isInt(value) {
  return !isNaN(value) &&
         parseInt(Number(value)) == value &&
         !isNaN(parseInt(value, 10));
}

function hasNumber(myString) {
  return /\d/.test(myString);
}

function SVGToImage(settings){
    let _settings = {
        svg: null,
        // Usually all SVG have transparency, so PNG is the way to go by default
        mimetype: "image/png",
        quality: 0.92,
        width: "auto",
        height: "auto",
        outputFormat: "base64"
    };

    // Override default settings
    for (let key in settings) { _settings[key] = settings[key]; }

    return new Promise(function(resolve, reject){
        let svgNode;

        // Create SVG Node if a plain string has been provided
        if(typeof(_settings.svg) == "string"){
            // Create a non-visible node to render the SVG string
            let SVGContainer = document.createElement("div");
            SVGContainer.style.display = "none";
            SVGContainer.innerHTML = _settings.svg;
            svgNode = SVGContainer.firstElementChild;
        }else{
            svgNode = _settings.svg;
        }

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d'); 

        let svgXml = new XMLSerializer().serializeToString(svgNode);
        let svgBase64 = "data:image/svg+xml;base64," + utf8_to_b64(svgXml);

        const image = new Image();

        image.onload = function(){
            let finalWidth, finalHeight;

            // Calculate width if set to auto and the height is specified (to preserve aspect ratio)
            if(_settings.width === "auto" && _settings.height !== "auto"){
                finalWidth = (this.width / this.height) * _settings.height;
            // Use image original width
            }else if(_settings.width === "auto"){
                finalWidth = this.naturalWidth;
            // Use custom width
            }else{
                finalWidth = _settings.width;
            }

            // Calculate height if set to auto and the width is specified (to preserve aspect ratio)
            if(_settings.height === "auto" && _settings.width !== "auto"){
                finalHeight = (this.height / this.width) * _settings.width;
            // Use image original height
            }else if(_settings.height === "auto"){
                finalHeight = this.naturalHeight;
            // Use custom height
            }else{
                finalHeight = _settings.height;
            }

            // Define the canvas intrinsic size
            canvas.width = finalWidth;
            canvas.height = finalHeight;

            // Render image in the canvas
            context.drawImage(this, 0, 0, finalWidth, finalHeight);

            if(_settings.outputFormat == "blob"){
                // Fullfil and Return the Blob image
                canvas.toBlob(function(blob){
                    resolve(blob);
                }, _settings.mimetype, _settings.quality);
            }else{
                // Fullfil and Return the Base64 image
                resolve(canvas.toDataURL(_settings.mimetype, _settings.quality));
            }
        };

        // Load the SVG in Base64 to the image
        image.src = svgBase64;
    });
}
