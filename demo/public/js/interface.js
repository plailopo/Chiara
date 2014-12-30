
var Chiara = {

	modal : {

		opt : {
			idModalMask : 'ModalMask',
			opened: false
		},

		open : function(id, cOpen, loader){
			if(Chiara.modal.opt.opened)return;
			Chiara.modal.close();
			Chiara.modal.showMask();
			if(loader!=null && loader){
				$(id).appendTo('body');
				Chiara.modal.showLoading(id);
			}else{
				$(id).appendTo('body').slideDown();
			}
			$(window).keydown(function(e){
				if(e.keyCode==27 ) Chiara.modal.close();
			});
			Chiara.modal.opt.opened = true;
		},
		
		close : function(){
			$('.modal').slideUp();
			$('.modal-msg').remove();
			Chiara.modal.destroyMask();
			Chiara.modal.opt.opened = false;
		},
		
		showLoading: function(id){
			$(id).hide();
			$('<div id="ModalLoading" />').hide().appendTo('body').fadeIn(1000);
		},
		
		hideLoading: function(id){
			$(id).slideDown();
			$('#ModalLoading').stop().fadeOut(function(){$(this).remove();});
		},
		
		showMask: function(){
			if($('#'+Chiara.modal.opt.idModalMask).length>0)return;
			var h = $(window).height() > $('body').height() ? $(document).height() : $('body').height();
			$('<div id="'+Chiara.modal.opt.idModalMask+'" />').css({
				'position': 'fixed',
				'top': '0',
				'left': '0',
				'width': '100%',
				'height': '100%',
				'background': '#000',
				'opacity':'0.7',
				'z-index':'10000',
				'display':'none'
			}).appendTo('body')
			.show()
			.click(function(){Chiara.modal.close();})
			
		},
		
		destroyMask: function(id){
			if(id!=null){
				$(id).remove();
			}
			$('#'+Chiara.modal.opt.idModalMask).clearQueue().stop().fadeOut(function(){
				$(this).remove();
			});
		}
		
	},
	
	paginator:function(id, d, fnc){
		
		var prev = parseInt(d.currentPage)-1;
		var next = parseInt(d.currentPage)+1;
		if(prev<2)prev=1;
		if(next>parseInt(d.pgTotalPage)) next=parseInt(d.pgTotalPage);
		
		var ht = '';
		ht += '<ul class="pager">';
		ht += '<li class="previous '+(parseInt(d.currentPage)<2?'disabled':'')+'"><a  href="javascript:'+fnc+'('+prev+');">previous</a></li>';
		var s = parseInt(d.currentPage) > 5 ? parseInt(d.currentPage) - 3 : 1;
		var f = parseInt(d.currentPage) > 5 ? parseInt(d.currentPage) + 3 : 10;
		if(f>parseInt(d.pgTotalPage)) f=parseInt(d.pgTotalPage);
		if(s>1){
			ht += '<li><a href="javascript:'+fnc+'(1);">1</a></li>';
			ht += ' ... ';
		}
		for (var i=s; i<= f; i++){
			ht += '<li class="'+(parseInt(d.currentPage)==i?'disabled':'')+'"><a href="javascript:'+fnc+'('+i+');">'+i+'</a></li>';
		}
		if(f<parseInt(d.pgTotalPage)){
			ht += ' ... ';
			ht += '<li><a href="javascript:'+fnc+'('+d.pgTotalPage+');">'+d.pgTotalPage+'</a></li>';
		}
		
		ht += '<li class="next '+(parseInt(d.currentPage)>=parseInt(d.pgTotalPage)?'disabled':'')+'"><a href="javascript:'+fnc+'('+next+');">next</a></li>';
		ht += '<li class="founds">'+d.pgTotalItem+' item found</li>';
		ht += '</ul>';
		$('#'+id).html(ht);
	},
	
	// check if element is offscreen
	isOffscreen: function(el) {
		el = $(el);
		var elOff = el.offset();
		return (
			  elOff.top+el.height() > $(window).height()+$(window).scrollTop()
			  || elOff.left+el.width() > $(window).width()+$(window).scrollLeft()
		);
	},
	
	scrollTo: function(id){
		$('html,body').animate({scrollTop: $(id).offset().top},'slow');
	}

};



/******** CHECKLIST *********/
(function($){
	
	var methods = {
			
			init : function( options ) {

				return this.each(function(){
					
					var set = {
							onCheck : function(){},
							onUncheck : function(){}
					};
					$.extend(set, options);
					$(this).data('checklist', set);
					
					$(this).click(function(){
						$(this).checklist('toggle');
					});
					if($(this).hasClass('checked')) $(this).checklist('check');
				});
			},
			
			destroy : function( ) {

				return this.each(function(){
					$(this).removeData('checklist');
				});
			},
			
			toggle : function(){
				return this.each(function(){
					if($(this).hasClass('checked')) $(this).checklist('uncheck');
					else $(this).checklist('check');
				});
			},
			
			check : function(){
				return this.each(function(){
					$(this).removeClass('unchecked').addClass('checked');
					var set = $(this).data('checklist');
					if(set.onCheck!=null) set.onCheck(this);
				});
			},
			
			uncheck : function(){
				return this.each(function(){
					$(this).removeClass('checked').addClass('unchecked');
					var set = $(this).data('checklist');
					if(set.onUncheck!=null) set.onUncheck(this);
				});
			}
	};

	$.fn.checklist = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.checklist' );
		}    

	};

})( jQuery );


/******** SEARCH on LIST *********/
(function($){
	
	var methods = {
			
			init : function( options ) {

				return this.each(function(){
					
					var set = {
							input : '',
							itemList: 'tbody tr'
					};
					
					$.extend(set, options);
					$(this).data('searchOnList', set);
					
					$(set.input).data('searchOnListTable', this)
								.keyup(function(){
									$($(this).data('searchOnListTable')).searchOnList('search');
								});
				});
			},
			
			destroy : function( ) {
				return this.each(function(){
					$(this).removeData('searchOnList');
				});
			},
			
			showAll : function(){
				var set = $(this).data('searchOnList');
				$(this).find(set.itemList).show();
			},
			
			search : function(){
				var set = $(this).data('searchOnList');
				
				var searchString = $.trim($(set.input).val().toLowerCase());
				if( searchString == ''){
					$(this).find(set.itemList).show();
				}
				
				$(this).find(set.itemList).each(function(){
					$(this).hide();

					var str = $(this).text().toLowerCase();
					if( str.search(searchString) >= 0){
						$(this).show();
					};
				});
			}
	};

	$.fn.searchOnList = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.searchOnList' );
		}    

	};

})( jQuery );

/******** MODAL *********/








/*! jquery-dateFormat 05-10-2014 */
var DateFormat={};!function(a){var b=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],c=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],d=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],e=["January","February","March","April","May","June","July","August","September","October","November","December"],f={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"},g=/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}[Z\-+]?(\d{2}:?\d{2})?/;a.format=function(){function a(a){return b[parseInt(a,10)]||a}function h(a){return c[parseInt(a,10)]||a}function i(a){var b=parseInt(a,10)-1;return d[b]||a}function j(a){var b=parseInt(a,10)-1;return e[b]||a}function k(a){return f[a]||a}function l(a){var b,c,d,e,f,g=a,h="";return-1!==g.indexOf(".")&&(e=g.split("."),g=e[0],h=e[1]),f=g.split(":"),3===f.length?(b=f[0],c=f[1],d=f[2].replace(/\s.+/,"").replace(/[a-z]/gi,""),g=g.replace(/\s.+/,"").replace(/[a-z]/gi,""),{time:g,hour:b,minute:c,second:d,millis:h}):{time:"",hour:"",minute:"",second:"",millis:""}}function m(a,b){for(var c=b-String(a).length,d=0;c>d;d++)a="0"+a;return a}return{parseDate:function(a){var b={date:null,year:null,month:null,dayOfMonth:null,dayOfWeek:null,time:null};if("number"==typeof a)return this.parseDate(new Date(a));if("function"==typeof a.getFullYear)b.year=String(a.getFullYear()),b.month=String(a.getMonth()+1),b.dayOfMonth=String(a.getDate()),b.time=l(a.toTimeString()+"."+a.getMilliseconds());else if(-1!=a.search(g))values=a.split(/[T\+-]/),b.year=values[0],b.month=values[1],b.dayOfMonth=values[2],b.time=l(values[3].split(".")[0]);else switch(values=a.split(" "),6===values.length&&isNaN(values[5])&&(values[values.length]="()"),values.length){case 6:b.year=values[5],b.month=k(values[1]),b.dayOfMonth=values[2],b.time=l(values[3]);break;case 2:subValues=values[0].split("-"),b.year=subValues[0],b.month=subValues[1],b.dayOfMonth=subValues[2],b.time=l(values[1]);break;case 7:case 9:case 10:b.year=values[3],b.month=k(values[1]),b.dayOfMonth=values[2],b.time=l(values[4]);break;case 1:subValues=values[0].split(""),b.year=subValues[0]+subValues[1]+subValues[2]+subValues[3],b.month=subValues[5]+subValues[6],b.dayOfMonth=subValues[8]+subValues[9],b.time=l(subValues[13]+subValues[14]+subValues[15]+subValues[16]+subValues[17]+subValues[18]+subValues[19]+subValues[20]);break;default:return null}return b.date=new Date(b.year,b.month-1,b.dayOfMonth),b.dayOfWeek=String(b.date.getDay()),b},date:function(b,c){try{var d=this.parseDate(b);if(null===d)return b;for(var e=(d.date,d.year),f=d.month,g=d.dayOfMonth,k=d.dayOfWeek,l=d.time,n="",o="",p="",q=!1,r=0;r<c.length;r++){var s=c.charAt(r),t=c.charAt(r+1);if(q)"'"==s?(o+=""===n?"'":n,n="",q=!1):n+=s;else switch(n+=s,p="",n){case"ddd":o+=a(k),n="";break;case"dd":if("d"===t)break;o+=m(g,2),n="";break;case"d":if("d"===t)break;o+=parseInt(g,10),n="";break;case"D":g=1==g||21==g||31==g?parseInt(g,10)+"st":2==g||22==g?parseInt(g,10)+"nd":3==g||23==g?parseInt(g,10)+"rd":parseInt(g,10)+"th",o+=g,n="";break;case"MMMM":o+=j(f),n="";break;case"MMM":if("M"===t)break;o+=i(f),n="";break;case"MM":if("M"===t)break;o+=m(f,2),n="";break;case"M":if("M"===t)break;o+=parseInt(f,10),n="";break;case"y":case"yyy":if("y"===t)break;o+=n,n="";break;case"yy":if("y"===t)break;o+=String(e).slice(-2),n="";break;case"yyyy":o+=e,n="";break;case"HH":o+=m(l.hour,2),n="";break;case"H":if("H"===t)break;o+=parseInt(l.hour,10),n="";break;case"hh":hour=0===parseInt(l.hour,10)?12:l.hour<13?l.hour:l.hour-12,o+=m(hour,2),n="";break;case"h":if("h"===t)break;hour=0===parseInt(l.hour,10)?12:l.hour<13?l.hour:l.hour-12,o+=parseInt(hour,10),n="";break;case"mm":o+=m(l.minute,2),n="";break;case"m":if("m"===t)break;o+=l.minute,n="";break;case"ss":o+=m(l.second.substring(0,2),2),n="";break;case"s":if("s"===t)break;o+=l.second,n="";break;case"S":case"SS":if("S"===t)break;o+=n,n="";break;case"SSS":o+=l.millis.substring(0,3),n="";break;case"a":o+=l.hour>=12?"PM":"AM",n="";break;case"p":o+=l.hour>=12?"p.m.":"a.m.",n="";break;case"E":o+=h(k),n="";break;case"'":n="",q=!0;break;default:o+=s,n=""}}return o+=p}catch(u){return console&&console.log&&console.log(u),b}},prettyDate:function(a){var b,c,d;return("string"==typeof a||"number"==typeof a)&&(b=new Date(a)),"object"==typeof a&&(b=new Date(a.toString())),c=((new Date).getTime()-b.getTime())/1e3,d=Math.floor(c/86400),isNaN(d)||0>d?void 0:60>c?"just now":120>c?"1 minute ago":3600>c?Math.floor(c/60)+" minutes ago":7200>c?"1 hour ago":86400>c?Math.floor(c/3600)+" hours ago":1===d?"Yesterday":7>d?d+" days ago":31>d?Math.ceil(d/7)+" weeks ago":d>=31?"more than 5 weeks ago":void 0},toBrowserTimeZone:function(a,b){return this.date(new Date(a),b||"MM/dd/yyyy HH:mm:ss")}}}()}(DateFormat),function(a){a.format=DateFormat.format}(jQuery);


var labels = {
		weekdays : ['Luned&igrave;', 'Marted&igrave;', 'Mercoled&igrave;', 'Gioved&igrave;', 'Venerd&igrave;', 'Sabato', 'Domenica'],
		months : ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
}