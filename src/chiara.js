/*
 * Chiara
 */


// Configurazioni di base e init dei moduli trovati
var Chiara = {
	
	initFunctions : [],
	
	init : function(){
		if(typeof Chiara.menu != 'undefined') Chiara.menu.init();
		if(typeof Chiara.panel != 'undefined') Chiara.panel.init();
		if(typeof Chiara.modal != 'undefined') Chiara.modal.init();
		if(typeof Chiara.multipage != 'undefined') Chiara.multipage.init();
		if(typeof Chiara.wizard != 'undefined') Chiara.wizard.init();
		if(typeof Chiara.translator != 'undefined') Chiara.translator.init();
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
		afterReq: false,
		beforeReq: false,
		timeout : 30000,
		baseUrl : '',
		
		ajax : function(tp,a,dt,cb,t){ // Type, Action, data, callback, timeout
			
			if(typeof Chiara.req.beforeReq === 'function') dt = Chiara.req.beforeReq(dt);
			var cBack = cb;
			return $.ajax({
				url: Chiara.req.baseUrl + a,
				type: tp == 'postp' ? 'post' : tp,
				dataType : tp == 'postp' ? 'jsonp' : 'json',
				data: dt,
				timeout: t?t:Chiara.req.timeout,
				success: function(rsp){
					if(typeof Chiara.req.afterReq === 'function'){
						rsp = Chiara.req.afterReq(rsp);
						if(rsp === false) return;
					}
					Chiara.msg.parse(rsp);
					if( typeof cBack == 'function') cBack(rsp);
				},
				error:function(j,e){
					if(e == 'timeout')
						Chiara.msg.showOverlay({level: 2, text:'Errore', description:'Il server non ripsponde.'});
					else{
						try{
							Chiara.msg.showOverlay({level: 2, text:'Errore', description:'Il server ha ritornato: '+j.responseText});
						}catch(e){
							Chiara.msg.showOverlay({level: 2, text:'Errore', description:'In connessione con il server'});
						}
					}
				}
			});
		},

		post : function(a,dt,cb,t){ // Action, data, callback, timeout
			return Chiara.req.ajax('post',a,dt,cb,t);
		},
		
		put : function(a,dt,cb,t){ // Action, data, callback, timeout
			return Chiara.req.ajax('put',a,dt,cb,t);
		},
		
		get : function(a,dt,cb,t){ // Action, data, callback, timeout
			return Chiara.req.ajax('get',a,dt,cb,t);
		},
		
		postP : function(a,dt,cb,t){ // Action, data, callback, timeout
			return Chiara.req.ajax('postp',a,dt,cb,t);
		},
		
		linkPost : function(a,d,t){// action, data, target
			
			var html = '<form action="'+Chiara.req.baseUrl+a+'" method="post" ';
			if(a=='') html = '<form action="" method="post" ';
			if(t) html += 'target="' + t + '" ';
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
		
		linkGet : function(a,t){// action, target
			
			var html = '<form action="'+Chiara.req.baseUrl+a+'" method="get" ';
			if(a=='') html = '<form action="" method="get" ';
			if(t) html += 'target="' + t + '" ';
			html += '></form>';
			$(html).appendTo('body').submit();
			
		},
		
		link : function(a){// action
			window.location.href = Chiara.req.baseUrl + a;
		}
	}
});

/******** MODAL *******/
$.extend( Chiara, {
	modal : {
		
		sequence : [],
		
		init: function(){
			
		},
		
		showMask: function(){
			if( $('#C-ModalMask').length <= 0 ) $('<div id="C-ModalMask" />').appendTo('body');
			$('#C-ModalMask:hidden').show().on('click', Chiara.modal.close);
		},
		
		hideMask: function(){
			$('#C-ModalMask:visible').fadeOut(100).off('click', Chiara.modal.close);
		},
		
		open: function(id){
			
			if($.isArray(id)){
				var tmpId = id[0];
				Chiara.modal.sequence = id.slice(1);
				id=tmpId;
			}else{
				if($('.modal:visible').length>0){
					Chiara.modal.sequence.push(id);
					return;
				}
			}
			if( $(id).length==0 )return;
			Chiara.modal.showMask();
			if( $(id+' .modal-body').length <= 0 ){$(id).wrapInner('<div class="modal-body" />');}
			if( $(id+' .modal-head').length <= 0 ){$(id).prepend('<div class="modal-head" />');}
			if( $(id+' > a.close').length <= 0 ){
				$(id).prepend('<a href="javascript:void(0);" class="close" onclick="Chiara.modal.close()">x</a>');
			}
			if( $(id+' .modal-foot').length <= 0 ){$(id).append('<div class="modal-foot" />');}
			
			var onOpen = $(id).data('c-open');
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
			}).draggable({handle: '.modal-head'});
			
			$(window).resize(function(){
				$(id).css({left: (($(window).width()/2) - ($(id).width()/2)) + 'px'});
			});
			
			$(document).on('keyup', Chiara.modal.checkEscPress);
			
		},
		
		close: function(){
			$('.modal:visible').hide({
				effect: 'drop', 
				direction: 'up', 
				duration:300,
				complete: function(){
					if(Chiara.modal.sequence.length==0){
						Chiara.modal.hideMask();
					}
					var onClose = $(this).data('c-close');
					if(onClose != null && onClose.length>0){
						var d = $(this);
						eval( onClose + "(d);" );
					}
					
					if(Chiara.modal.sequence.length>0){
						var id2 = Chiara.modal.sequence[0];
						Chiara.modal.sequence = Chiara.modal.sequence.slice(1);
						Chiara.modal.open(id2);
					}
				}
			});
			$(document).off('keyup', Chiara.modal.checkEscPress);
		},
		
		checkEscPress: function(e){
			if(e.which == 27) Chiara.modal.close();
		},
		
		openEdit: function(data, title, cb){
			if($('#C-Modal-EditModal').length>0) $('#C-Modal-EditModal').remove();
			var html='<div class="c-modal" id="C-Modal-EditModal">';
			html += '<div class="modal-head"><h3>'+title+'</h3></div>';
			html += '<div class="modal-body"><form class="form-horizontal"></form></div>';
			html += '<div class="modal-foot">';
			html += '<button onclick="Chiara.modal.close()">Close</button>';
			html += '<button onclick="Chiara.modal.saveEdit()">Save</button>';
			html += '</div>';
			html += '</div>';
			var wnd = $(html).appendTo('body');
			if(cb!=null) wnd.data('c-save-cb', cb);
			$.each(data, function(k,v){
				$(wnd).find('form').append('<div class="form-group"><label class="col-sm-2 control-label">'+k+'</label><div class="col-sm-10"><input name="'+k+'" type="text" value="'+v+'" /></div></div>');
			});
			
			Chiara.modal.open('#C-Modal-EditModal');
		},
		
		saveEdit: function(){
			Chiara.modal.close();
			console.log($('#C-Modal-EditModal form').serializeObject());
			if($('#C-Modal-EditModal').data('c-save-cb') != null){
				var cb = $('#C-Modal-EditModal').data('c-save-cb');
				cb($('#C-Modal-EditModal form').serializeObject());
			}
		}
	}
});


/************* MESSAGES *************/
$.extend( Chiara, {
	msg : {
			
		opt : {
			fastLevel : 0,
			fastContainer : '#UserMessageBox',
			fastTimeout : 10000
		},
		
		parse : function(e){
			if(typeof e == 'undefined' || typeof e.messages !== 'string') return true;
			if(e.messages.length > 0) for( i in e.messages){
				if(e.messages[i].type == 'overlay')
					Chiara.msg.showOverlay(e.messages[i]);
				else if(e.messages[i].type == 'field')
					Chiara.msg.showField(e.messages[i]);
				else
					Chiara.msg.showFast(e.messages[i]);
			}
		},
		
		showField : function(e){
			if(typeof e.text == 'undefined' ) return;
			if(typeof e.field == 'undefined' ) return;
			$('<span class="msgfield" />').addClass(e.level).text(e.text).insertAfter(e.field);
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
			$(Chiara.msg.opt.fastContainer).append(msgObj);
			$(msgObj).hide().slideDown().fadeIn();
			setTimeout('$("#MSG_'+UID+'").fadeOut(function(){$(this).remove();});', Chiara.msg.opt.fastTimeout);
		},
		
		showOverlay : function(e){
			
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
			$(msgObj).appendTo('body');
			Chiara.modal.open('#MSG_'+UID);
		}
	}
});

/********* MENU ******/
$.extend( Chiara, {
	menu : {
		
		init: function(){
			
			$('.c-menu-spastic').each(function(){
				Chiara.menu.create(this, 'spastic');
			});
			
			$('.c-menu').each(function(){
				Chiara.menu.create(this);
			});
			
			$('.c-menu-page').each(function(){
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
				
				var cls = 'c-menu-page-' + (Math.random()*10 + '').replace('.', '');
				var that = $(s).addClass(cls);
				
				var aIdx = 0
				that.find('a').each(function(){
					$(this).addClass('c-menu-page-item-' + (aIdx++));
				})
				
				that.prepend($(that).find(' > ul').attr('id', 'C-MENU-PAGE-ONVIEW').clone().fadeIn().attr('id', 'C-MENU-PAGE-VIEW'));
				
				Chiara.menu.page.refresh(that);
				
			}else{
				
				$(s).find('a').click(function(){
					
					if($(this).hasClass('selected')) return;
					
					$(this).closest('.c-menu').find('a, li').removeClass('selected');
					if( $(this).parent().hasClass('cat') ){
						$(this).closest('.c-menu').find('li.cat ul').hide('blink');
						$(this).next().show('blink');
					}
					$(this).addClass('selected');
					
				});
				
			}
		},
		
		page:{
			next:function(obj, e){
				
				var cls = $(e).attr('class');
				var clss = cls.match(/c-menu-page-item[a-z-\d]+/ig);
				
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

/*********** LEFT PANEL ******
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
				Chiara.panel.open('.c-panel');
			});
			
			Chiara.panel.hBind.on("panleft", function(ev) {
				Chiara.panel.close('.c-panel');
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
				id = '.c-panel';
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
*/

/*********** TRANSLATOR ******/
$.extend( Chiara, {
	
	translator : {
		init: function(){
			
			
		},
		
		loadLang: function(url){
			
			$.getScript(url, function(){
				
				$('[data-c-translator]').each(function(){
					var l = eval($(this).data('c-translator'));
					if(l==null) l = '???_'+$(this).data('c-translator')+'_???';
					$(this).html(l);
				})
				
				$('[data-c-translatorval]').each(function(){
					var l = eval($(this).data('c-translatorval'));
					if(l==null) l = '???_'+$(this).data('c-translatorval')+'_???';
					$(this).val(l);
				})
				
				$('[data-c-translatorplace]').each(function(){
					var l = eval($(this).data('c-translatorplace'));
					if(l==null) l = '???_'+$(this).data('c-translatorplace')+'_???';
					$(this).attr('placeholder', l);
				})
			});
		},
		
		getTranslate: function(l){
			return eval(l);
		}
	}
});

/*********** MULTIPAGE ******/
$.extend( Chiara, {
	
	multipage : {
		
		transition: '',
		
		init: function(){
			
			var zI = 1000;
			for(var i=0; i < $('.page').length; i++){
				$('.page').eq(i).css('z-index', zI);
				zI++;
			}
		
			if( $('.page.first').length>0 ) $('.page.first').fadeIn() ;
			else $('.page:eq(0)').fadeIn();
		},
		
		open: function(e, transition, cb){
			
			if(transition == null) var transition = Chiara.multipage.transition;
			var eEnd = $('.page:visible');
			
			if($(e)[0] === eEnd[0]) return;
			
			if( typeof transition === 'string' && transition.length>0){
				$(e).fadeIn();
				$(eEnd).fadeOut();
			}else{
				$(e).fadeIn();
				$(eEnd).fadeOut();
			}
			
			if(typeof cb == 'function') cb();
			
		}
	}
});

/*********** LIVE ******/
$.extend( Chiara, {

	live : {
		_effects : {
			test : function(){
			}
		},
		
		run: function(opt){
			
			opt = $.extend({
				selector: '',
				effect: '',
				duration: ''
			}, opt);
			
			var jQeffects = ["blind", "bounce", "clip", "drop", "explode", "fade", "fold", "highlight", "puff", "pulsate", "scale", "shake", "size", "slide", "transfer"];
			if(opt.effect == ''){
				
			}else if($.inArray(opt.effect, jQeffects) >= 0){
				$(opt.selector).effect(opt);
			}else if(typeof Chiara.live._effects[opt.effect] == 'function'){
				
			}
			
		},
		
		show: function(opt){
			if( $(opt.selector).is(':visible') ) return;
			Chiara.live.run(opt);
		},
		
		hide: function(opt){
			if( $(opt.selector).is(':visible') ) Chiara.live.run(opt);
		},
		
		swap: function(e1, e2, opt){
			opt = $.extend(opt, {selector: e1});
			Chiara.live.hide(opt);
			opt = $.extend(opt, {selector: e2});
			Chiara.live.show(opt);
		}
	}
});

/*
 * WIZARD
 * Modulo con funzioni per la gestione dell'interfaccia
 */
$.extend( Chiara, {
	
	wizard : {
		
		opt: {},
		
		init: function(){
			$('.ct-wizard').each(function(){Chiara.wizard.create(this);})
		},
		
		create: function(id, opt){
			
			var wzr = $(id);
			var cfg = {
				currentBox : 0,
				boxWidth: wzr.width(),
				speed: 500,
				boxNumber: wzr.find('.ct-wizard-box').length,
				beforeMove: function(d){return true;},
				afterMove: function(d){return true;},
			}
			
			cfg = $.extend(cfg, opt);
			
			var tmpattr = wzr.data('ct-beforemove');
			if(tmpattr){
				cfg.beforeMove = tmpattr;
			}
			
			var tmpattr = wzr.data('ct-aftermove');
			if(tmpattr){
				cfg.afterMove = tmpattr;
			}
			
			if(wzr.find('.ct-wizard-container').length != 1){
				wzr.find('.ct-wizard-box').wrapAll('<div class="ct-wizard-container" />')
			}
			
			wzr.find('.ct-wizard-container').width( (cfg.boxWidth * cfg.boxNumber) + 10);
			wzr.find('.ct-wizard-box').width(cfg.boxWidth);
			wzr.data('ct-wizard', cfg);
		},
		
		getStep: function(id){
			var cfg = $(id).data('ct-wizard');
			return cfg.currentBox;
		},
		
        prev: function(id) {
        	var cfg = $(id).data('ct-wizard');
        	if(typeof cfg.beforeMove === 'function'){
        		if(!cfg.beforeMove(cfg)) return;
        	}else if(typeof cfg.beforeMove === 'string'){
        		if( eval( cfg.beforeMove + '(cfg)') === false ) return;
        	}
        	cfg.currentBox = Math.max(cfg.currentBox - 1, 0);
            Chiara.wizard.scrollBox(id, cfg.boxWidth * cfg.currentBox, cfg.speed);
            $(id).data('ct-wizard', cfg);
        },

        next: function(id) {
        	var cfg = $(id).data('ct-wizard');
        	if(typeof cfg.beforeMove === 'function'){
        		if(!cfg.beforeMove(cfg)) return;
        	}else if(typeof cfg.beforeMove === 'string'){
        		if( eval( cfg.beforeMove + '(cfg)') === false ) return;
        	}
        	cfg.currentBox = Math.min(cfg.currentBox + 1, cfg.boxNumber - 1);
            Chiara.wizard.scrollBox(id, cfg.boxWidth * cfg.currentBox, cfg.speed);
            $(id).data('ct-wizard', cfg);
        },
        
        scrollBox: function(id, distance, duration) {
        	
        	var wzr = $(id);
        	var cfg = $(id).data('ct-wizard');
        	wzr.find('.ct-wizard-box').css("transition-duration", (duration / 1000).toFixed(1) + "s");

            //inverse the number we set in the css
            var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
            wzr.find('.ct-wizard-box').css("transform", "translate(" + value + "px,0)");
            if(wzr.find('.ct-wizard-steps').length>0){
            	wzr.find('.ct-wizard-steps li').removeClass('active');
            	wzr.find('.ct-wizard-steps li:eq('+cfg.currentBox+')').addClass('active')
            }
            
            if(typeof cfg.afterMove === 'function'){
        		cfg.afterMove(cfg);
        	}else if(typeof cfg.afterMove === 'string'){
        		eval( cfg.afterMove + '(cfg)');
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

// Swipe
$.extend( Chiara, {
	swipedetect :function(e, opt){
	  
		var e = $(e);
		opt = $.extend({
			threshold : 30, //required min distance traveled to be considered swipe
			restraint : 1000, // maximum distance allowed at the same time in perpendicular direction
			allowedTime : 500, // maximum time allowed to travel that distance
			mouseSimulation : false,
			onStart : function(){},
			onMove : function(){},
			onComplete : function(swipedir){}
		}, opt);
		
		var swipedir,startX,startY,distX,distY,elapsedTime,startTime;
		
		e.on('touchstart'+(opt.mouseSimulation ? ' mousedown' : ''), {}, function(ev){
			if(ev.type == "mousedown"){
				startX = ev.pageX
				startY = ev.pageY
			}else{
				startX = ev.originalEvent.touches[0].pageX;
				startY = ev.originalEvent.touches[0].pageY;
			}
			//console.log('start', startX, startY);
			swipedir = 'none'
			startTime = new Date().getTime() // record time when finger first makes contact with surface
			opt.onStart(this)
			ev.preventDefault()
		})
	  
		e.on('touchmove'+(opt.mouseSimulation ? ' mousemove' : ''), function(ev){
			if(ev.type == "touchmove"){
				distX = ev.originalEvent.touches[0].pageX - startX // get horizontal dist traveled by finger while in contact with surface
				distY = ev.originalEvent.touches[0].pageY - startY // get vertical dist traveled by finger while in contact with surface
			}
			opt.onMove(this)
			ev.preventDefault() // prevent scrolling when inside DIV
		})
	  
		e.on('touchend'+(opt.mouseSimulation ? ' mouseup' : ''), function(ev){
			
			if(ev.type == "mouseup"){
				distX = ev.pageX - startX // get horizontal dist traveled by finger while in contact with surface
				distY = ev.pageY - startY // get vertical dist traveled by finger while in contact with surface
			}
			//console.log('end', distX, distY);
			elapsedTime = new Date().getTime() - startTime // get time elapsed
			
			if (elapsedTime <= opt.allowedTime){ // first condition for awipe met
				if (Math.abs(distX) >= opt.threshold && Math.abs(distY) <= opt.restraint){ // 2nd condition for horizontal swipe met
					swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
				}
				else if (Math.abs(distY) >= opt.threshold && Math.abs(distX) <= opt.restraint){ // 2nd condition for vertical swipe met
					swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
				}
			}
			opt.onComplete(this, swipedir)
			ev.preventDefault()
		})
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
