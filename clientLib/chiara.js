/*
 * Chiara
 */
$(document).ready(function(){
	Chiara.init();
});

// Configurazioni di base e init dei moduli trovati
var Chiara = {

	BaseUrl : 	'',
	
	initFunctions : [],
	
	init : function(){
		if(typeof Chiara.menu != 'undefined') Chiara.menu.init();
		if(typeof Chiara.panel != 'undefined') Chiara.panel.init();
		if(typeof Chiara.dialog != 'undefined') Chiara.dialog.init();
		Chiara.loader.init();
		
	}
};

/************ LOADER  ************/
$.extend( Chiara, {
	
	loader : {
		operations: 0,
		content: 'Loading...',
		init: function(){
			$(document).ajaxComplete(Chiara.loader.close);
		},
		open:function(){

			Chiara.loader.operations++;
			if(Chiara.loader.operations>1) return;
			
			if ($('#C-LoaderContainer').length <= 0){
				
				$('<div id="C-LoaderContainer" />')
				.append('<div class="image" />')
				.append('<div class="text">'+Chiara.loader.content+'</div>')
				.appendTo('body');
				
				if ($('#C-LoaderMask').length <= 0) $('<div id="C-LoaderMask" />').appendTo('body');
			}
			
			$('#C-LoaderContainer').show({effect:'fade', duration:200});
			$('#C-LoaderMask').show();
			
		},
		
		close:function(){

			Chiara.loader.operations--;
			if(Chiara.loader.operations>0){
				return;
			}
			$('#C-LoaderContainer').stop().hide({effect:'fade', duration:200});
			$('#C-LoaderMask').hide();
			Chiara.loader.operations = 0;
		}
	}
});


/********** REQUEST **********/
$.extend( Chiara, {

	req : {

		opt : {
			timeout : 30000,
			baseUrl : ''
		},

		post : function(a,dt,cb,t){ // Action, data, callback, timeout
			return $.ajax({
				url: Chiara.req.opt.baseUrl+a,
				type: 'post',
				data: dt,
				timeout: t?t:Chiara.req.opt.timeout,
				success: function(rsp){
					Chiara.msg.parse(rsp);
					if(cb!=null)cb(rsp);
				},
				error:function(j,e){
					if(e=='timeout')
						Chiara.msg.showFast({level: 2, message:'Request timeout!'});
					else{
						try{
							Chiara.msg.parse(eval('('+j.responseText+')'));
						}catch(e){
							Chiara.msg.showFast({type: 2, message:'Server error! Re-try'});
						}
					}
				}
			});
		},
		
		postP : function(a,dt,cb,t){ // Action, data, callbackname, timeout
			return $.ajax({
				url: Chiara.req.opt.baseUrl+a+'?fnc='+cb,
				type: 'post',
				dataType: 'jsonp',
				data: dt,
				timeout: t?t:Chiara.req.opt.timeout,
				error:function(j,e){return false;}
			});
		},
		
		linkPost : function(a,d,b){// action, data, blank
			
			var html = '<form action="'+Chiara.req.opt.baseUrl+a+'" method="post" ';
			if(a=='') html = '<form action="" method="post" ';
			if(b) html += 'target="_blank" ';
			html += '>';
			if(typeof(d)=='object') for(var i=0;i<d.length;i++){
				if($.isArray(d[i].value)){
					for(var l=0;l<d[i].value.length;l++){
						if (typeof d[i].value[l]=="string") d[i].value[l] = d[i].value[l].replace(/"/g, '\\');
						html += '<input type="hidden" name="'+d[i].name+'[]" value="'+d[i].value[l]+'" />';
					}
				}else{
					if (typeof d[i].value=="string") d[i].value = d[i].value.replace(/"/g, '\'');
					html += '<input type="hidden" name="'+d[i].name+'" value="'+d[i].value+'" />';
				}
			}
			html += '</form>';
			$(html).appendTo('body').submit();
			
		},
		
		link : function(a){// action
			window.location.href = Chiara.req.opt.baseUrl + a;
		}
	}
});

/******** DIALOG *******/
$.extend( Chiara, {
	dialog : {
		
		sequence : [],
		
		init: function(){
			
		},
		
		open: function(id){
			
			if($.isArray(id)){
				var tmpId = id[0];
				Chiara.dialog.sequence = id.slice(1);
				id=tmpId;
			}else{
				if($('.ct-dialog:visible').length>0){
					Chiara.dialog.sequence.push(id);
					return;
				}
			}
			if( $(id).length==0 )return;
			if( $('#C-DialogMask').length <= 0 ) $('<div id="C-DialogMask" />').appendTo('body');
			if( $(id+' .ct-body').length <= 0 ){$(id).wrapInner('<div class="ct-body" />');}
			if( $(id+' .ct-head').length <= 0 ){$(id).prepend('<div class="ct-head" />');}
			if( $(id+' > a.ct-close').length <= 0 ){
				$(id).prepend('<a href="javascript:void(0);" class="ct-close" onclick="Chiara.dialog.close()">x</a>');
			}
			if( $(id+' .ct-foot').length <= 0 ){$(id).append('<div class="ct-foot" />');}
			$('#C-DialogMask:hidden').show().on('click', Chiara.dialog.close);
			var onOpen = $(id).data('ct-open');
			$(id).css({
				left: (($(window).width()/2) - ($(id).width()/2)) + 'px'
			}).show({
				effect: 'drop', 
				direction: 'up', 
				duration:500, 
				easing: 'easeOutQuint',
				complete: function(){
					if(onOpen != null && onOpen.length>0){
						var d = $(id);
						eval( onOpen + "(d);" );
					}
				}
			}).draggable({handle: '.ct-head'});
			
			$(window).resize(function(){
				$(id).css({left: (($(window).width()/2) - ($(id).width()/2)) + 'px'});
			});
			
			$(document).on('keyup', Chiara.dialog.checkEscPress);
			
		},
		
		close: function(){
			$('.ct-dialog:visible').hide({
				effect: 'drop', 
				direction: 'up', 
				duration:300,
				complete: function(){
					if(Chiara.dialog.sequence.length==0){
						$('#C-DialogMask:visible').fadeOut(100).off('click', Chiara.dialog.close);
					}
					var onClose = $(this).data('ct-close');
					if(onClose != null && onClose.length>0){
						var d = $(this);
						eval( onClose + "(d);" );
					}
					
					if(Chiara.dialog.sequence.length>0){
						var id2 = Chiara.dialog.sequence[0];
						Chiara.dialog.sequence = Chiara.dialog.sequence.slice(1);
						Chiara.dialog.open(id2);
					}
				}
			});
			$(document).off('keyup', Chiara.dialog.checkEscPress);
		},
		
		checkEscPress: function(e){
			if(e.which == 27) Chiara.dialog.close();
		},
		
		openEdit: function(data, title, cb){
			if($('#C-Dialog-EditDialog').length>0) $('#C-Dialog-EditDialog').remove();
			var html='<div class="ct-dialog" id="C-Dialog-EditDialog">';
			html += '<div class="ct-head"><h3>'+title+'</h3></div>';
			html += '<div class="ct-body"><form class="form-horizontal"></form></div>';
			html += '<div class="ct-foot">';
			html += '<button onclick="Chiara.dialog.close()">Close</button>';
			html += '<button onclick="Chiara.dialog.saveEdit()">Save</button>';
			html += '</div>';
			html += '</div>';
			var wnd = $(html).appendTo('body');
			if(cb!=null) wnd.data('ct-save-cb', cb);
			$.each(data, function(k,v){
				$(wnd).find('form').append('<div class="form-group"><label class="col-sm-2 control-label">'+k+'</label><div class="col-sm-10"><input name="'+k+'" type="text" value="'+v+'" /></div></div>');
			});
			
			Chiara.dialog.open('#C-Dialog-EditDialog');
		},
		
		saveEdit: function(){
			Chiara.dialog.close();
			console.log($('#C-Dialog-EditDialog form').serializeObject());
			if($('#C-Dialog-EditDialog').data('ct-save-cb') != null){
				var cb = $('#C-Dialog-EditDialog').data('ct-save-cb');
				cb($('#C-Dialog-EditDialog form').serializeObject());
			}
		}
	}
});

/*********** MODAL **********/
Chiara.prototype = {

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
		
	}
}

/************* MESSAGES *************/
Chiara.prototype = {
	msg : {
			
		opt : {
			fastLevel : 0,
			fastContainerId : 'UserMessageBox',
			fastTimeout : 10000
		},
		
		parse : function(e){
			if(e.messages==null) return true;
			if(e.messages.length > 0) for( i in e.messages){
				if(e.messages[i].type == 'overlay')
					Chiara.msg.showOverlay(e.messages[i]);
				else
					Chiara.msg.showFast(e.messages[i]);
			}
		},
		
		showFast : function(e){
			if(typeof e.text == 'undefined' ) return;
			UID = new Date().getTime();
			
			var msgObj = $('<div id="MSG_'+UID+'" class="alert" />');
			
			if(e.level>=8) msgObj.addClass('alert-green');
			else if(e.level<8 && e.level>=6) msgObj.addClass('alert-info');
			else if(e.level<6 && e.level>=4) msgObj.addClass('');
			else if(e.level<4) msgObj.addClass('alert-error');
			msgObj.append('<a class="close" onclick="$(\'#MSG_'+UID+'\').fadeOut(function(){$(this).remove();});" href="javascript:void(0);">x</a>');
			if(typeof e.text=='string') msgObj.append('<div class="alert-heading">'+e.text+'</div>');
			if(typeof e.description=='string') msgObj.append(e.description);
			
			if( $.isArray(e.buttons) && e.buttons.length>0){
				var btnsCont = $('<div align="right" />').appendTo(msgObj);
				for(i in e.buttons){
					var b = $('<a class="btn" />').appendTo(btnsCont);
					if(typeof e.buttons[i].type=='string') b.addClass('btn-'+e.buttons[i].type);
					if(typeof e.buttons[i].action=='string' && e.buttons[i].action!=''){
						b.data('action', e.buttons[i].action);
						b.click(function(){
							eval('('+$(this).data('action')+')');
						});
					}
					b.html(e.buttons[i].value);
					btnsCont.append('&nbsp;');
				}
				msgObj.append(btnsCont);
			}
			$('#'+Chiara.msg.opt.fastContainerId).append(msgObj);
			$(msgObj).hide().slideDown().fadeIn();
			setTimeout('$("#MSG_'+UID+'").fadeOut(function(){$(this).remove();});', Chiara.msg.opt.fastTimeout);
		},
		
		showOverlay : function(e){
			if(typeof e.text == 'undefined' ) return;
			UID = new Date().getTime();
			
			var msgObj = $('<div id="MSG_'+UID+'" class="modal" />');

			if(e.level==8) msgObj.addClass('modal-success');
			else if(e.level<8 && e.level>=6) msgObj.addClass('modal-info');
			else if(e.level<6 && e.level>=4) msgObj.addClass('');
			else if(e.level<4) msgObj.addClass('modal-error');
			
			if(typeof e.text=='string') msgObj.append('<div class="modal-head"><h3>'+e.text+'</h3></div>');
			if(typeof e.description=='string') msgObj.append('<div class="modal-body">'+e.description+'</div>');
			
			var btnsCont = $('<div class="modal-foot" />').appendTo(msgObj);
			$('<a class="btn" href="javascript:void(0);">Close</a>').data('idMsg',UID).click(function(){
				Chiara.modal.close();
			}).appendTo(btnsCont);
			btnsCont.append('&nbsp;');
			
			if( $.isArray(e.buttons) && e.buttons.length>0){
				
				for(i in e.buttons){
					var b = $('<a class="btn" />').appendTo(btnsCont);
					if(typeof e.buttons[i].type=='string') b.addClass('btn-'+e.buttons[i].type);
					if(typeof e.buttons[i].action=='string' && e.buttons[i].action!=''){
						b.attr('onclick', e.buttons[i].action);
					}
					b.html(e.buttons[i].value);
					btnsCont.append('&nbsp;');
				}
				msgObj.append(btnsCont);
			}
			
			Chiara.modal.showMask();
			$(msgObj).hide().appendTo('body').fadeIn();
		}
	}
}

/********* MENU ******/
$.extend( Chiara, {
	menu : {
		
		init: function(){
			
			$('.ct-menu-spastic').each(function(){
				Chiara.menu.create(this, 'spastic');
			});
			
			$('.ct-menu').each(function(){
				Chiara.menu.create(this);
			});
			
			$('.ct-menu-page').each(function(){
				Chiara.menu.create(this, 'page');				
			});
			
		},
		
		create: function(s, type){
			if(type!=null && type=='spastic'){
				
				$(s).find('li').css({ width: ( 100 / $(s).find('li').length ) + '%'});
				$(s).spasticNav({
					overlap: 0,
					easing : 'easeOutExpo'
				});
				
			}else if(type!=null && type=='page'){
				
				var cls = 'ct-menu-page-' + (Math.random()*10 + '').replace('.', '');
				var that = $(s).addClass(cls);
				
				var aIdx = 0
				that.find('a').each(function(){
					$(this).addClass('ct-menu-page-item-' + (aIdx++));
				})
				
				that.prepend($(that).find(' > ul').attr('id', 'C-MENU-PAGE-ONVIEW').clone().fadeIn().attr('id', 'C-MENU-PAGE-VIEW'));
				
				Chiara.menu.page.refresh(that);
				
			}else{
				
				$(s).find('a').click(function(){
					
					if($(this).hasClass('selected')) return;
					
					$(this).closest('.ct-menu').find('a, li').removeClass('selected');
					if( $(this).parent().hasClass('cat') ){
						$(this).closest('.ct-menu').find('li.cat ul').hide('blink');
						$(this).next().show('blink');
					}
					$(this).addClass('selected');
					
				});
				
			}
		},
		
		page:{
			next:function(obj, e){
				
				var cls = $(e).attr('class');
				var clss = cls.match(/ct-menu-page-item[a-z-\d]+/ig);
				
				if( $(e).next().prop("tagName").toLowerCase()=='ul' && clss.length==1 ){
					
					$(e).addClass('selected');
					cls = clss[0];
					$('#C-MENU-PAGE-VIEW').hide({
						effect: 'slide',
						duration: 300,
						direction: 'left',
						complete: function(){
							$(this).remove();
							
							$(obj).prepend($('#C-MENU-PAGE-ONVIEW').attr('id', '')
											.find('a.'+cls).next()
											.attr('id', 'C-MENU-PAGE-ONVIEW')
											.clone(true, true)
											.attr('id', 'C-MENU-PAGE-VIEW').
											show()
											);
							Chiara.menu.page.refresh(obj);
						}
					});
					
				}
				
			},
			prev:function(obj){
				if( $('#C-MENU-PAGE-ONVIEW').closest('ul').length > 0){
					$('#C-MENU-PAGE-VIEW').hide({
						effect: 'slide',
						duration: 300,
						direction: 'right',
						complete: function(){
							$(this).remove();
							$(obj).prepend($('#C-MENU-PAGE-ONVIEW')
											.attr('id', '')
											.parent()
											.closest('ul')
											.attr('id', 'C-MENU-PAGE-ONVIEW')
											.clone(true, true)
											.attr('id', 'C-MENU-PAGE-VIEW').
											show());
							Chiara.menu.page.refresh(obj);
						}
					});
				}
			
			},
			refresh: function(obj){
				$(obj).find('a').click(function(){
					
					if( $(this).hasClass('cat') ){
						Chiara.menu.page.next(obj, this);
					}if( $(this).hasClass('back') ){
						Chiara.menu.page.prev(obj);
					}
					
				});
			}
		}
	}
});

/*********** LEFT PANEL ******/
$.extend( Chiara, {
	
	panel : {
		
		hBind : null,
		loaded: false,
		opened: false,
		
		init: function(){
			
			if($(window).width() <= 992){
				Chiara.panel.binder();
			}
			
			$(window).resize(function(){
				if($(window).width() <= 992){
					Chiara.panel.binder();
				}else{
					Chiara.panel.unbinder();
				}
			});
		},
		
		binder: function(){
			if(Chiara.panel.loaded) return;
			
			Chiara.panel.loaded = true;
			var elm = $('body').get(0);
			Chiara.panel.hBind = new Hammer(elm);
			
			Chiara.panel.hBind.get('pan').set({ threshold: 20 });
			
			Chiara.panel.hBind.on("panright", function(ev) {
				Chiara.panel.open('.ct-panel');
			});
			
			Chiara.panel.hBind.on("panleft", function(ev) {
				Chiara.panel.close('.ct-panel');
			});
			
		},
		
		unbinder: function(){
			if(!Chiara.panel.loaded) return;
			
			Chiara.panel.loaded = false;
			Chiara.panel.hBind.destroy();
		},
		
		open: function(id){
			if(Chiara.panel.opened) return;
			Chiara.panel.opened = true;
			//$(id).css({opacity:1}).show().animate({width:'400px'}, {duration:600, easing: 'easeOutQuint'});
			$(id).addClass('opened', 600, 'easeOutQuint');
			$('#MobileMenuLink').addClass('opened');
		},
		
		close: function(id){
			
			if(!Chiara.panel.opened) return;
			Chiara.panel.opened = false;
			
			if(typeof id != 'string'){
				id = '.ct-panel';
			}
			//$(id).animate({width:'0px', opacity:0}, {duration:300, easing: 'easeOutQuint', complete:function(){$(id).hide();}});
			$(id).removeClass('opened', 600, 'easeOutQuint');
			setTimeout(function(){$('#MobileMenuLink').removeClass('opened')}, 400);
		},
		
		toggle: function(id){
			if(Chiara.panel.opened){
				Chiara.panel.close(id);
			}else{
				Chiara.panel.open(id);
			}
		}
	}
});

// Utils
$.extend( Chiara, {
	
	paginator:function(selector, d, fnc){
		
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
			ht += '<li>...</li>';
		}
		for (var i=s; i<= f; i++){
			ht += '<li class="'+(parseInt(d.currentPage)==i?'current':'')+'"><a href="javascript:'+fnc+'('+i+');">'+i+'</a></li>';
		}
		if(f<parseInt(d.pgTotalPage)){
			ht += '<li>...</li>';
			ht += '<li><a href="javascript:'+fnc+'('+d.pgTotalPage+');">'+d.pgTotalPage+'</a></li>';
		}
		
		ht += '<li class="next '+(parseInt(d.currentPage)>=parseInt(d.pgTotalPage)?'disabled':'')+'"><a href="javascript:'+fnc+'('+next+');">next</a></li>';
		ht += '<li class="founds">'+d.pgTotalItem+' item found</li>';
		ht += '</ul>';
		$(selector).html(ht);
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

});


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

/********************* JQUERY SPASTIC NAV PLUGIN *****************/
(function($) {

	$.fn.spasticNav = function(options) {
	
		options = $.extend({
			overlap : 20,
			speed : 500,
			reset : 500,
			easing : 'easeOutExpo',
			selectedClass: 'selected',
			blobClass: 'blob'
		}, options);
	
		return this.each(function() {
		
		 	var nav = $(this),
		 		currentPageItem = $('.'+options.selectedClass, nav),
		 		blob,
		 		reset;
		 	
		 	$('<li class="'+options.blobClass+'"></li>').css({
		 		width : currentPageItem.outerWidth(),
		 		height : currentPageItem.outerHeight() + options.overlap,
		 		left : currentPageItem.position().left,
		 		top : currentPageItem.position().top - options.overlap / 2	 		
		 	}).appendTo(this);
		 	
		 	blob = $('.'+options.blobClass, nav);
		 	
			$('li:not(.'+options.blobClass+')', nav).hover(function() {
				// mouse over
				clearTimeout(reset);
				blob.animate(
					{
						left : $(this).position().left,
						width : $(this).outerWidth()
					},
					{
						duration : options.speed,
						easing : options.easing,
						queue : false
					}
				);
			}, function() {
				// mouse out	
				reset = setTimeout(function() {
					blob.animate({
						width : currentPageItem.outerWidth(),
						left : currentPageItem.position().left
					}, options.speed)
				}, options.reset);
	
			}).click(function(){
				$(this).closest('ul').find('li').removeClass('selected');
				$(this).addClass('selected');
				currentPageItem = $('.'+options.selectedClass, nav);
			});
		}); // end each
	
	};

})(jQuery);

/******************** CHECKLIST PLUGIN *******/
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


/************** FORM UTILITY *********/
(function($){

	$.fn.serializeObject = function(){
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	};
	
	$.fn.saveForm = function(cb){
		$(this).each(function(){
			if($(this).length==0) return;
			
			var act = $(this).attr('action');
			var dt = $(this).serializeObject();
			
			req.post(act, dt, cb);
		})
		
	};
	
	$.fn.autoSaveForm = function(){
		
		$(this).change(function(){
			$(this).saveForm();
		});
		
	};

})( jQuery );
