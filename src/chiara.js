/*
/*
 * Chiara
 */

 $(document).ready(function(){Chiara.init()});

// Base configuration
var Chiara = {

	initFunctions : [],

	init : function(){

		if(typeof Chiara.intf != 'undefined') Chiara.intf.init();
		if(typeof Chiara.wall != 'undefined') Chiara.wall.init();
		if(typeof Chiara.panel != 'undefined') Chiara.panel.init();
		if(typeof Chiara.modal != 'undefined') Chiara.modal.init();
		if(typeof Chiara.multipage != 'undefined') Chiara.multipage.init();
    		if(typeof Chiara.live != 'undefined') Chiara.live.init();
		if(typeof Chiara.wizard != 'undefined') Chiara.wizard.init();
		if(typeof Chiara.translator != 'undefined') Chiara.translator.init();
		if(typeof Chiara.datatable != 'undefined') Chiara.datatable.init();
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
        onError: function(){},

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
						Chiara.req.onError({level: 2, text:'Error', description:'Service unvailable.'});
					else{
						try{
							Chiara.req.onError({level: 2, text:'Error', description:j.responseText});
						}catch(e){
							Chiara.req.onError({level: 2, text:'Error', description:'Error on server connection'});
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

		open: function(id, opt){

      var set = $.extend({
        draggable: true,
        btnClose:true,
        onOpen: function(){},
        onClose: function(){}
      }, opt);

			if($.isArray(id)){
				var tmpId = id[0];
				Chiara.modal.sequence = id.slice(1);
				id=tmpId;
			}else{
				if($('.c-modal.open').length>0){
					Chiara.modal.sequence.push(id);
					return;
				}
			}
			if( $(id).length==0 ) return;
			Chiara.modal.showMask();
      $(id).data('c-modal', set);
			if( $(id+' .modal-body').length <= 0 ){$(id).wrapInner('<div class="modal-body" />');}
			if( $(id+' .modal-head').length <= 0 ){$(id).prepend('<div class="modal-head" />');}
			if( $(id+' > a.close').length <= 0 && set.btnClose ){
				$(id).prepend('<a href="javascript:void(0);" class="close" onclick="Chiara.modal.close()">x</a>');
			}
			if( $(id+' .modal-foot').length <= 0 ){$(id).append('<div class="modal-foot" />');}

			$(id).css({
				left: (($(window).width()/2) - ($(id).width()/2)) + 'px'
			});
      if(set.draggable) $(id).draggable({handle: '.modal-head'});

			if(typeof set.onOpen == 'function'){
        set.onOpen($(id));
      }else if(typeof set.onOpen == 'string'){
				eval( set.onOpen + "($(id));" );
			}

      setTimeout(function(){$(id).addClass('open');}, 10)

			$(window).resize(function(){
				$(id).css({left: (($(window).width()/2) - ($(id).width()/2)) + 'px'});
			});

			$(document).on('keyup', Chiara.modal.checkEscPress);

		},

		close: function(){
      var o = $('.c-modal.open');
      if(o.length==0) return;

      o.removeClass('open');
      var set = o.data('c-modal');

			if(Chiara.modal.sequence.length==0){
				Chiara.modal.hideMask();
			}

      if(typeof set.onClose == 'function'){
        set.onClose(o);
      }else if(typeof set.onClose == 'string'){
				eval( set.onClose + "(o);" );
			}

			if(Chiara.modal.sequence.length>0){
				var id2 = Chiara.modal.sequence[0];
				Chiara.modal.sequence = Chiara.modal.sequence.slice(1);
				Chiara.modal.open(id2);
			}

			$(document).off('keyup', Chiara.modal.checkEscPress);
		},

		checkEscPress: function(e){
			if(e.which == 27) Chiara.modal.close();
		},

    modalize: function(id){
      var o = $(id);
      if(o.length<=0)return;
      var idM = 'C-Modal-'+new Date().getTime();
      var html='<div class="c-modal" id="'+idM+'">';
      html += '<div class="modal-body"></div>';
      html += '</div>';
      $(html).width(o.width() + parseInt(o.css('padding-left')) + parseInt(o.css('padding-right')))
      .height(o.height() + parseInt(o.css('padding-bottom')) + parseInt(o.css('padding-top')))
      .css({top:o.offset().top+'px', left:o.offset().left+'px'})
      .appendTo('body');
      Chiara.modal.open('#'+idM, {btnClose:false});
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

/*********** LEFT PANEL ******/
$.extend( Chiara, {

	panel : {

		hBind : null,
		loaded: false,
		opened: false,

		open: function(id){
			if(Chiara.panel.opened) return;
			Chiara.panel.opened = true;
			$(id).addClass('opened', 600, 'easeOutQuint');
			$('#MobileMenuLink').addClass('opened');
		},

		close: function(id){

			if(!Chiara.panel.opened) return;
			Chiara.panel.opened = false;

			if(typeof id != 'string'){
				id = '.c-panel';
			}
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

		navigator: [],
		navigatorIndex: -1,

		init: function(){

			if($('.c-page').length==0) return;

			$('.c-page').each(function(){
				$(this).data('page-class', $(this).attr('class').replace('first', ''));
			})

			if( $('.c-page.first').length>0 ){
				Chiara.multipage.open($('.c-page.first'));
			}
			else {
				Chiara.multipage.open($('.c-page:eq(0)'));
			}

			$('.c-page.first').removeClass('first');
		},

  	open: function(e, opt){
      var set = $.extend({
        effect: false,
        duration: 0,
        onEnd: function(){}
      }, opt);

      $('.c-page').each(function(){
        $(this).attr('class', $(this).data('page-class') ).css({zIndex: 0});
      });
      $(e).addClass('open').css({zIndex: 9});
      Chiara.live.go(e, {effect:set.effect, onEnd: function(){
        $(e).css({zIndex: 10});
        if(set.onEnd) set.onEnd();
      }});

  		if(Chiara.multipage.navigatorIndex>=0) Chiara.multipage.navigator = Chiara.multipage.navigator.slice(0, Chiara.multipage.navigatorIndex+1);
  		Chiara.multipage.navigator.push(e);
  		Chiara.multipage.navigatorIndex++;
  	},

  	close: function(opt){
  		Chiara.multipage.prev(opt);
  	},

  	prev: function(opt){

      var set = $.extend({
        effect: false,
        duration: 0,
        onEnd: function(){}
      }, opt);

  		var eOld = Chiara.multipage.navigator[Chiara.multipage.navigatorIndex];
  		var eNew = Chiara.multipage.navigator[--Chiara.multipage.navigatorIndex];

      $('.c-page:not(.open)').each(function(){
  			$(this).attr('class', $(this).data('page-class') ).css({zIndex: 0});
  		})
  		$(eOld).removeClass('open');
      $(eNew).addClass('open').css({zIndex: 9});
  		Chiara.live.go(eNew, {effect:'fadeIn'});
  		Chiara.live.go(eOld, {effect:set.effect, onEnd: function(){
        $(eOld).css({zIndex: 0});
        $(eNew).css({zIndex: 10});
        if(set.onEnd) set.onEnd();
      }});

  	},

  	next: function(efct, cb){

      //TODO...

    }
  }
});

/*********** LIVE ******/
$.extend( Chiara, {

	live : {
    init: function(){

		},

		go: function(e, opt){

      var set = $.extend({
        effect: false,
        duration: 0,
        onEnd: function(){}
      }, opt);

      var obj = $(e);
      obj.addClass('c-live')
      if(set.effect){
        obj.css('animation-name', set.effect);
        var durStr = obj.css('animation-duration');
        if(durStr && durStr.length>0){
          if(durStr.substring(0,1) == '.') durStr = '0'+durStr;
          set.duration = durStr.indexOf('m') >= 0 ? parseFloat(durStr) : parseFloat(durStr) * 1000;
        }
      }
      setTimeout(function() {
        $(obj).removeClass('c-live').css('animation-name', '');
        if(set.onEnd) set.onEnd();
      }, set.duration);

		}
	}
});

/*********** WALL **********/
$.extend( Chiara, {

	wall : {

		init: function(){
			$('.c-wall').each(function(){Chiara.wall.create(this);})
		},

		wallize: function(id){
			var set = $(id).parent().data('c-wall');
			$(id).css({
				position:'absolute',
				top: 0,
				left: 0,
				margin:0,
				margin: set.border+'px'
			}).attr('tabindex', $(id).parent().find(set.itemSelector).index(id))
			.addClass('wallized');
			Chiara.wall.move(id);
		},

		move: function(id){
			var set = $(id).parent().data('c-wall');
			var idx = $(id).attr('tabindex');
			var h = $(id).height();
			var nOnRow = idx % set.columnsNumber;
			var nOnCol = idx / set.columnsNumber;
			var left = Math.ceil((nOnRow * set.boxWidth) + (nOnRow-1)*set.border) ;
			var top = set.columnsHeight[nOnRow];
			set.columnsHeight[nOnRow] = top + h + set.border + parseInt($(id).css('padding-top'))+ parseInt($(id).css('padding-bottom'));
			$(id).show();
			setTimeout(function(){
				$(id).css({
					left: left+'px',
					top: top+'px',
					width: set.boxWidth+'px'
				});
			}, 10);
			var wallH = 0;
			for(i in set.columnsHeight){if(set.columnsHeight[i]>wallH) wallH=set.columnsHeight[i]+10}
			$(id).parent().height(wallH);
		},

		create: function(id, opt){

			var o = $(id);
			if(o.attr('data-c-wall')){return;}

			var set = {
				type : o.attr('data-c-type') ? o.data('c-type') : 'column',
				maxWidth: o.attr('data-c-max-width') ? o.data('c-max-width') : 200,
				maxHeight: o.attr('data-c-max-height') ? o.data('c-max-height') : 1000,
				border: o.attr('data-c-border') ? o.data('c-border') : 6,
				containerSelector: '.c-wall',
				itemSelector: '.c-wall-item'
			};
			if(opt) set = $.extend(set, opt);
			o.data('c-wall', set);

			Chiara.wall.resize(o);

			o.find('.c-wall-item').each(function(){
				Chiara.wall.wallize(this);
			});

			$(window).resize(function(){Chiara.wall.resize(o);});

		},

    addItems: function(id){
      var n = $(id).find('.c-wall-item').length;
      $(id).find('.c-wall-item').each(function(){
				Chiara.wall.wallize(this);
        if(--n<=0)Chiara.wall.resize(id);
			});
    },

		resize: function(id){

			var o = $(id);
			var set = o.data('c-wall');
			var w = o.width();

			if(w<=0){
				var tmpObj = o.parent();
				while(true){
					if(tmpObj.width()>0 || tmpObj.prop("tagName")=='html'){
						w = tmpObj.width();
						break;
					}
					tmpObj = tmpObj.parent();
				}
			}

			set.columnsNumber = Math.floor(w / (set.maxWidth + (set.border*2)));
			set.boxWidth = ((w+set.border)/set.columnsNumber) - set.border;
			set.columnsHeight = [];
			for(i=0; i<set.columnsNumber; i++ ){set.columnsHeight[i] = 0;}
			o.find('.wallized').each(function(){
				Chiara.wall.move(this);
			});
		}
	}
});

/*********** INTERFACE ******/
$.extend( Chiara, {

	intf : {

		init: function(){
			$(window).scroll(Chiara.intf.doFixto);
			Chiara.intf.doFixto();

			$(window).resize(Chiara.intf.doFullscreen);
			Chiara.intf.doFullscreen();

			Chiara.intf.doAccordion();

			Chiara.intf.doButtons();

			Chiara.intf.doDropdown();

			$(document).on('click', function(ev){
				Chiara.intf.resetDropdown(ev);
			});
		},


		doFixto: function(){
			$('[data-c-fixto]').each(function(){
				var h = $(this).data('c-fixto');
				if(h=='fullscreen') h = $(window).height();
				if( $(this).data('c-fixto-fixing') !== true &&
					$(window).scrollTop() > h ){
					$(this).data('c-fixto-fixing', true).data('c-fixto-oldPos', $(this).css('position')).css({position:'fixed'});
				}else if( $(this).data('c-fixto-fixing') === true &&
					$(window).scrollTop() < h ){
					$(this).data('c-fixto-fixing', false).css({position:$(this).data('c-fixto-oldPos')});
				}
			});
		},

			$('.fsbox').css({height: $(window).height()+'px'})
			.find('.middle').each(function(){
				$(this).css({'line-height': $(this).closest('.fsbox').height()+'px',margin:0, padding:0});
			});
			$('.fsbox img.bg').each(function(){

				var e = this;
				$(e).closest('.fsbox').css('background', 'transparent');
				var image = new Image();
				image.src = $(e).attr("src");
				image.onload = function() {
					var w = $(window).width();
					var h = Math.ceil(w * this.naturalHeight / this.naturalWidth);
					if( h < $(window).height()){
						h = $(window).height();
						$(e).css({width: 'auto', height: h+'px'});
					}else{
						$(e).css({width: w+'px', height: 'auto'});
					}

					$(e).css( 'margin-left', -(($(e).width()-$(window).width())/2) + 'px');
					$(e).css( 'margin-top', -(($(e).height()-$(window).height())/2) + 'px');
				}

			});
		},

		doAccordion: function(){
			$('.c-accordion').children().addClass('c-accordion-box');
			$('.c-accordion .c-accordion-content').hide();
			$('.c-accordion .c-accordion-opened').show();
			$('.c-accordion .c-accordion-handler').click(function(){
				var acc = $(this).closest('.c-accordion');
				var box = $(this).closest('.c-accordion-box');
				var cnt = box.find('.c-accordion-content');
				if(cnt.hasClass('c-accordion-opened')) return;
				acc.find('.c-accordion-content').removeClass('c-accordion-opened').slideUp();
				cnt.addClass('c-accordion-opened').slideDown();
			});
		},

		doButtons: function(){
			$('.btn-check').click(function(){
				if($(this).hasClass('active')) $(this).removeClass('active');
				else $(this).addClass('active');
			})
		},

		doDropdown: function(id){

			$( id ? id : '.dropdown').each(function(){

				if($('#C-Dropdown-C').length==0) $('<div id="C-Dropdown-C" />').prependTo('body');
				var h = $(this).find('.dropdown-handler');
				var c = $(this).find('.dropdown-content');

				var open = function(dd, ev){
					var h = $(dd).find('.dropdown-handler');
					if(h.hasClass('active')) return;
					h.addClass('active');
					var off = $(dd).offset();
					off.top = off.top + $(dd).height();
					off.left = off.left + $(dd).width();
					var cc = c.clone(true, true).css({
						position:'absolute',
						display:'block',
						zIndex:200
					}).offset(off).appendTo('#C-Dropdown-C');
					$(dd).data('dropdown-cnt', cc);
					setTimeout(function(){$('#C-Dropdown-C > div.dropdown-content:last').addClass('open');}, 1);
					return cc;
				};
				var close = function(dd, ev){
					var e = $(dd).data('dropdown-cnt');
					if($.contains(dd, ev.toElement) || $.contains(e, ev.toElement) || e[0] === ev.toElement){
						return;
					}
					var remOn = e ? parseFloat(e.css('transition-duration')) * 1000 : 1000;

					if($(e).length>0){
						e.removeClass('open')
						setTimeout(function(){e.remove()}, remOn);
					}
					h.removeClass('active');
					$(dd).data('dropdown-cnt', false);
				};

				if(h.hasClass('dropdown-click')){

					h.on('click', function(ev){
						var dd = $(this).closest('.dropdown');
						if(!$(this).hasClass('active')){
							open(dd, ev);
						}else{
							close(dd, ev);
						}

					});
				}else{
					$(this).on('mouseenter', function(ev){
						var cc = open(this, ev)
						var dd = $(this);
						cc.on('mouseleave', function(ev){
							close(dd, ev);
						});
					});
					$(this).on('mouseleave', function(ev){
						close(this, ev);
					});
				}
			});

		},

		resetDropdown: function(ev){

      if( $(ev.toElement).hasClass('dropdown-content') && $(ev.toElement).hasClass('open'))return;

      if( $(ev.toElement).closest('.dropdown-content').length>0){
        if( $(ev.toElement).closest('.dropdown-content').hasClass('open') ) return;
      }

      var clickHndlr = false;
			if( $(ev.toElement).hasClass('dropdown-handler') ||
				$(ev.toElement).closest('.dropdown-handler').length>0){
          clickHndlr = $(ev.toElement).closest('.dropdown').data('dropdown-cnt');
      }

			$('#C-Dropdown-C > div').each(function(){
        if(clickHndlr[0] === $(this)[0]) return;
				var e = $(this);
				var remOn = parseFloat(e.css('transition-duration')) * 1000;
				e.removeClass('open')
				setTimeout(function(){e.remove()}, remOn);
				$('.dropdown .dropdown-handler').removeClass('active');
			});
		}

	}
});

/*
 * WIZARD
 */
$.extend( Chiara, {

	wizard : {

		opt: {},

		init: function(){
			$('.c-wizard').each(function(){Chiara.wizard.create(this);})
		},

		create: function(id, opt){

			var wzr = $(id);
			var cfg = {
				currentBox : 0,
				boxWidth: wzr.width(),
				speed: 500,
				boxNumber: wzr.find('.c-wizard-box').length,
				beforeMove: function(d){return true;},
				afterMove: function(d){return true;},
			}

			if(cfg.boxWidth<=0){
				var tmpObj = wzr.parent();
				while(true){
					if(tmpObj.width()>0 || tmpObj.prop("tagName")=='html'){
						cfg.boxWidth = tmpObj.width();
						break;
					}
					tmpObj = tmpObj.parent();
				}

			}
			cfg = $.extend(cfg, opt);

			var tmpattr = wzr.data('c-beforemove');
			if(tmpattr){
				cfg.beforeMove = tmpattr;
			}

			var tmpattr = wzr.data('c-aftermove');
			if(tmpattr){
				cfg.afterMove = tmpattr;
			}

			if(wzr.find('.c-wizard-container').length != 1){
				wzr.find('.c-wizard-box').wrapAll('<div class="c-wizard-container" />')
			}

			wzr.width(cfg.boxWidth);
			wzr.find('.c-wizard-container').css('width', (cfg.boxWidth * cfg.boxNumber ) + ( 10 * cfg.boxNumber ) + 'px' );
			wzr.find('.c-wizard-box').width(cfg.boxWidth);

			wzr.data('ct-wizard', cfg);

			$(window).resize(function(){
				Chiara.wizard.create(this);

			})
		},

		getStep: function(id){
			var cfg = $(id).data('c-wizard');
			return cfg.currentBox;
		},

        prev: function(id) {
        	var cfg = $(id).data('c-wizard');
        	if(typeof cfg.beforeMove === 'function'){
        		if(!cfg.beforeMove(cfg)) return;
        	}else if(typeof cfg.beforeMove === 'string'){
        		if( eval( cfg.beforeMove + '(cfg)') === false ) return;
        	}
			var prevBox = cfg.currentBox;
        	cfg.currentBox = Math.max(cfg.currentBox - 1, 0);
            Chiara.wizard.scrollBox(id, $(id).find('.c-wizard-box:eq('+prevBox+')').width() * cfg.currentBox, cfg.speed);
            $(id).data('c-wizard', cfg);
        },

        next: function(id) {
        	var cfg = $(id).data('c-wizard');
        	if(typeof cfg.beforeMove === 'function'){
        		if(!cfg.beforeMove(cfg)) return;
        	}else if(typeof cfg.beforeMove === 'string'){
        		if( eval( cfg.beforeMove + '(cfg)') === false ) return;
        	}
			var prevBox = cfg.currentBox;
        	cfg.currentBox = Math.min(cfg.currentBox + 1, cfg.boxNumber - 1);
			Chiara.wizard.scrollBox(id, $(id).find('.c-wizard-box:eq('+prevBox+')').width() * cfg.currentBox, cfg.speed);
            $(id).data('c-wizard', cfg);
        },

        scrollBox: function(id, distance, duration) {

        	var wzr = $(id);
        	var cfg = $(id).data('c-wizard');
			if(!cfg) return;
        	wzr.find('.c-wizard-box').css({'transition-duration': duration + 'ms', 'transition-timing-function': 'cubic-bezier(0.645, 0.045, 0.355, 1)'});

            //inverse the number we set in the css
            var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
            wzr.find('.c-wizard-box').css("transform", "translate(" + value + "px,0)");
            if(wzr.find('.c-wizard-steps').length>0){
            	wzr.find('.c-wizard-steps li').removeClass('active');
            	wzr.find('.c-wizard-steps li:eq('+cfg.currentBox+')').addClass('active')
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


// DATATABLE
$.extend( Chiara, {
		datatable : {

		setting : {
			selector: '.datatable'
		},

		init: function(){

			$(Chiara.datatable.setting.selector).each(function(){
				Chiara.datatable.create(this);
			});
		},

		create: function(obj){

			var obj = $(obj);

			var opt = {

				// params
				id : obj.attr('id'),
				url: '',
				requestDelay : 500,
				rowLengthSelector: '',
				rowsLength: [ 10, 25, 50, 100 ],
				showRowsLength: true,
				columns: [], // list of: {n: 0, name: 'param name', sort: true, direction: 'up'}

				// support
				totalItems: 0,
				totalPages: 0,
				currentPage: 0,
				trClassName: '',
				headRow: false,

				// method
				requestData: false,
				returnedData: false,
				drawRow: false,
				clickRow: false
			};

			opt.url = obj.data('c-service');

			// set pagesize
			var tmpattr = obj.data('c-pagesize');
			if(tmpattr && tmpattr.length>0){
				var ary = tmpattr.split(",");
				for(i in ary) ary[i] = parseInt(ary[i]);
				opt.rowsLength = ary;
			}

			// Show or not rows lengthselect
			var tmpattr = obj.data('c-pagesizeshow');
			opt.showRowsLength = (tmpattr === false) ? false : true;

			// request delay
			var tmpattr = obj.data('c-pagesizecontainer');
			if(tmpattr){
				opt.pageSizeContainer = tmpattr;
			}

			// request delay
			var tmpattr = obj.data('c-requestdelay');
			if(tmpattr){
				opt.requestDelay = tmpattr;
			}

			// request delay
			var tmpattr = obj.data('c-clickable');
			if(tmpattr){
				opt.clickRow = tmpattr;
			}

			// Edit data on request
			var tmpattr = obj.data('c-editdata');
			if(tmpattr){
				opt.requestData = tmpattr;
			}

			// Edit data on request
			var tmpattr = obj.data('c-editreturneddata');
			if(tmpattr){
				opt.returnedData = tmpattr;
			}

			// Edit row
			var tmpattr = obj.data('c-editrow');
			if(tmpattr){
				opt.drawRow = tmpattr;
			}

			// tabella totali
			var tmpattr = obj.data('c-totalsbox');
			if(tmpattr){
				opt.totalsBox = tmpattr;
			}

			// TR class
			opt.trClassName = obj.find('tbody tr').attr('class');

			var columns = [];
			for(var i = 0; i < obj.find('tbody td').length; i++){
				var tmpObj = {	n: i,
								name: false,
								sorted: true,
								valuecolumn: false,
								direction: 'ASC',
								sort:false,
								checkCol: false,
								html: '',
								className: obj.find('tbody td').eq(i).attr('class') };

				var prm = obj.find('tbody td').eq(i).data('c-check-column');
				if(prm === true){
					tmpObj.checkCol = true;
				}

				prm = obj.find('tbody td').eq(i).data('c-param');
				if(typeof prm == 'string'){
					tmpObj.name = prm;
				}

				prm = obj.find('tbody td').eq(i).data('c-orderable');
				tmpObj.sorted = prm===false ? false : true;

				prm = obj.find('tbody td').eq(i).data('c-valuecolumn');
				tmpObj.valuecolumn = (prm === true) ? true : false;

				tmpObj.html = obj.find('tbody td').eq(i).html();

				columns.push(tmpObj);
			}
			opt.columns = columns;

			// Sorting
			opt.headRow = obj.find('thead tr:eq(0)');
			if( obj.find('thead tr.sortrow').length > 0 ){
				opt.headRow = obj.find('thead tr.sortrow');
			}else{
				opt.headRow.addClass('sortrow');
			}
			opt.headRow.find('th').each(function(i) {

				if(opt.columns[i].sorted && opt.columns[i].name){
					$(this).append(
						$('<span class="sortIcon fa fa-sort-amount-asc disabled"></span>').click(function(){
							eval('(Chiara.datatable.sort("#'+opt.id+'", "'+opt.columns[i].name+'"))');
						})
					).addClass('column-name-' + opt.columns[i].name)
					.data('column-name', opt.columns[i].name)
					.data('column-sort', false)
					.data('column-sort-direction', 'ASC');
				}

				if($(this).data('c-check-column')){
					$(this).addClass('nopad').css({width: '30px'})
					.html($('<input type="checkbox" /">').click(function(){
						if($(this).is(':checked'))
							Chiara.datatable.selectAllRow($(this).closest('.Chiara.datatable'))
						else
							Chiara.datatable.deselectAllRow($(this).closest('.Chiara.datatable'))
					}));
				}
			});

			opt.rowLengthSelector = opt.id + 'RowSelector';
			obj.data('Chiara.datatable', opt);

			//HEADER
			var header = $('<div id="'+opt.id+'HEADER" class="Chiara.datatable_header" />');
			if(opt.pageSizeContainer){
				$(opt.pageSizeContainer).append( Chiara.datatable.getSizeSelector(obj) );
			}else if(opt.showRowsLength){
			    header.append( Chiara.datatable.getSizeSelector(obj) );
			}
			header.insertBefore(obj);

			//FOOTER
			var footer = $('<div id="'+opt.id+'FOOTER" class="Chiara.datatable_footer" />');
			footer.append('<div class="totals" />');
			footer.append('<div class="navigator" />');
		    footer.insertAfter(obj);

			Chiara.datatable.search(obj);
		},

		search: function(obj){
			var obj = $(obj);
			var opt = obj.data('Chiara.datatable');

			if(opt.currentPage>=opt.totalPages) opt.currentPage = opt.totalPages-1;
			if(opt.currentPage<0) opt.currentPage = 0;
			var length = $('#'+opt.rowLengthSelector).val();

			var dt = {
				page: opt.currentPage,
				size: length ? length : 10,
				columns: opt.columns
			}
			if(typeof opt.requestData == 'string') dt = eval(opt.requestData+'(dt)');

			Chiara.req.post(opt.url, dt, function(d){

				if(typeof opt.returnedData == 'string') d = eval(opt.returnedData+'(d)');
				opt.totalItems = d.paginator.totalElements;
				opt.totalPages = d.paginator.totalPages;

				obj.data('Chiara.datatable-data', d);

				var tb = obj.find('tbody');
				tb.css({height: tb.height()+'px'}).html('');
				if(d.paginator.list == null || d.paginator.list.length==0){
					tb.append($('<tr class="emptyData" />')
									.append($('<td colspan="'+opt.columns.length+'" />')
											.text(Chiara.getLabel('datatable.zeroRecords'))));
				}else{
					for(r in d.paginator.list){
						var rowData = d.paginator.list[r];
						var row = $('<tr />').data('c-row', rowData).attr('class', opt.trClassName)
						.click(function(){$(this).toggleClass('c-active')})
						.hover(function(){$(this).addClass('c-hover')}, function(){$(this).removeClass('c-hover')});
						for(c in opt.columns){
							var td = $('<td />').attr('class', opt.columns[c].className);
							if(opt.columns[c].valuecolumn) td.addClass('column-value');
							if(opt.columns[c].checkCol){
								td.html($('<input type="checkbox" />').click(function(){
									if($(this).closest('tr').hasClass('c-selected')){
										$(this).closest('tr').removeClass('c-selected');
									}else{
										$(this).closest('tr').addClass('c-selected');
									}
									Chiara.datatable.refreshDataShowed($(this).closest('table'));
								})).addClass('checkable-cell')
							}else if(opt.columns[c].html != ''){
								var tmpHtml = $('<div>'+opt.columns[c].html+'</div>');
								for(l in tmpHtml.find('[data-c-param]')){
									var div = tmpHtml.find('[data-c-param]');
									div.eq(l).text(rowData[div.data('c-param')]);
								}
								td.html(tmpHtml);
							}else if(opt.columns[c].name){
								td.html(rowData[opt.columns[c].name]);
							}
							row.append(td);
						}

						if(typeof opt.clickRow == 'string' && opt.clickRow.length>0){
							row.find('td:not(.checkable-cell)').click(function(){
								var opt = $(this).closest('table.Chiara.datatable').data('Chiara.datatable');
								eval(opt.clickRow+'($(this).data(\'c-row\'))');
							}).addClass('clickable');
						}

						if(typeof opt.drawRow == 'string') row = eval(opt.drawRow+'(row, rowData)');
						tb.append(row);
					}
				}
				tb.css({height: 'auto'});

				Chiara.datatable.pagination(obj);
				Chiara.datatable.refreshDataShowed(obj);
			})
		},

		pagination : function(obj){
			var obj = $(obj);
			var opt = obj.data('Chiara.datatable');
			var lastData = obj.data('Chiara.datatable-data');

		    var htPg = '<nav><ul class="pagination">';
		    htPg += '<li class="prev'+(opt.currentPage==0 ? ' disabled' : '')+'">';
		    htPg += '<a href="#" '+(opt.currentPage!=0 ? 'data-c-goto="'+(opt.currentPage-1)+'"' : '')+'>'+Chiara.getLabel('datatables.previus')+'</a>';
		    htPg += '</li>';
		    htPg += '<li class="'+(opt.currentPage==0 ? 'active' : '')+'"><a href="#" '+(opt.currentPage!=0 ? 'data-c-goto="0"' : '')+'>1</a></li>';

		    if(opt.totalPages<7){
		    	for(var i=1; i<opt.totalPages-1; i++){
		    		htPg += '<li class="'+(opt.currentPage==i ? 'active' : '')+'"><a href="#" '+(opt.currentPage!=i ? 'data-c-goto="'+(i)+'"' : '')+'>'+(i+1)+'</a></li>';
		    	}
		    }else{
		    	if(opt.currentPage>2){
			    	htPg += '<li class="disabled"><a href="#">...</a></li>';
		    	}else{
		    		htPg += '<li class="'+(opt.currentPage==1 ? 'active' : '')+'"><a href="#" '+(opt.currentPage!=1 ? 'data-c-goto="1"' : '')+'>2</a></li>';
		    		htPg += '<li class="'+(opt.currentPage==2 ? 'active' : '')+'"><a href="#" '+(opt.currentPage!=2 ? 'data-c-goto="2"' : '')+'>3</a></li>';
			    	htPg += '<li class="'+(opt.currentPage==3 ? 'active' : '')+'"><a href="#" '+(opt.currentPage!=3 ? 'data-c-goto="3"' : '')+'>4</a></li>';
		    	}
			    if(opt.currentPage>2 && opt.currentPage<opt.totalPages-3){
			    	htPg += '<li><a href="#" '+(opt.currentPage!=opt.currentPage-1 ? 'data-c-goto="'+(opt.currentPage-1)+'"' : '')+'>'+ (opt.currentPage) +'</a></li>';
			    	htPg += '<li class="active"><a href="#" '+(opt.currentPage!=opt.currentPage ? 'data-c-goto="'+(opt.currentPage)+'"' : '')+'>'+ (opt.currentPage+1) +'</a></li>';
			    	htPg += '<li><a href="#" '+(opt.currentPage!=opt.currentPage+1 ? 'data-c-goto="'+(opt.currentPage+1)+'"' : '')+'>'+ (opt.currentPage+2) +'</a></li>';
			    }
		    	if(opt.currentPage<opt.totalPages-3){
		    		htPg += '<li class="disabled"><a href="#">...</a></li>';
		    	}else{
		    		htPg += '<li class="'+(opt.currentPage==(opt.totalPages-4) ? 'active' : '')+'"><a href="#" '+(opt.currentPage!=opt.totalPages-4 ? 'data-c-goto="'+(opt.totalPages-4)+'"' : '')+'>'+ (opt.totalPages-3) +'</a></li>';
			    	htPg += '<li class="'+(opt.currentPage==(opt.totalPages-3) ? 'active' : '')+'"><a href="#" '+(opt.currentPage!=opt.totalPages-3 ? 'data-c-goto="'+(opt.totalPages-3)+'"' : '')+'>'+ (opt.totalPages-2) +'</a></li>';
			    	htPg += '<li class="'+(opt.currentPage==(opt.totalPages-2) ? 'active' : '')+'"><a href="#" '+(opt.currentPage!=opt.totalPages-2 ? 'data-c-goto="'+(opt.totalPages-2)+'"' : '')+'>'+ (opt.totalPages-1) +'</a></li>';
		    	}
		    }

		    if(opt.totalPages>1) htPg += '<li class="'+(opt.currentPage==(opt.totalPages-1) ? 'active' : '')+'"><a href="#" '+(opt.currentPage!=opt.totalPages-1 ? 'data-c-goto="'+(opt.totalPages-1)+'"' : '')+'>'+opt.totalPages+'</a></li>';
		    htPg += '<li class="next'+(opt.currentPage==opt.totalPages-1 || opt.totalPages==0  ? ' disabled' : '')+'"><a href="#" '+(opt.currentPage!=opt.totalPages-1 || opt.totalPages==0 ? 'data-c-goto="'+(opt.currentPage+1)+'"' : '')+'>'+Chiara.getLabel('datatables.next')+'</a></li></ul></nav>';

		    $('#'+opt.id+'FOOTER .totals').html(Chiara.datatable.getTotalsTables(obj));
		    $('#'+opt.id+'FOOTER .navigator').html(htPg).find('li a').click(function(){
		    	if( typeof $(this).data('c-goto') != 'number' ) return;
		    	Chiara.datatable.goToPage('#'+obj.attr('id'), $(this).data('c-goto'));
		    });
		},

		sort: function(obj, name){
			var obj = $(obj);
			var opt = obj.data('Chiara.datatable');

			var thObj = obj.find('thead tr.sortrow th.column-name-'+name);
			var sortObj = thObj.find('.sortIcon');

			var col = 0;
			for(var i=0; i<obj.find('thead tr.sortrow th').length; i++ ){
				if(obj.find('thead tr.sortrow th:eq('+i+')').data('column-name') == name){
					col = i; break;
				}
			}

			if(sortObj.hasClass('disabled')){
				sortObj.removeClass('disabled');
				opt.columns[col].sort = true;
			}else if( sortObj.hasClass('fa-sort-amount-asc') ){
				sortObj.removeClass('fa-sort-amount-asc').addClass('fa-sort-amount-desc');
				opt.columns[col].direction = 'DESC';
			}else if( sortObj.hasClass('fa-sort-amount-desc') ){
				sortObj.addClass('disabled')
				sortObj.removeClass('fa-sort-amount-desc').addClass('fa-sort-amount-asc');
				opt.columns[col].sort = false;
				opt.columns[col].direction = 'ASC';
			}else{
				sortObj.removeClass('fa-sort-amount-desc').addClass('fa-sort-amount-asc');
				opt.columns[col].direction = 'ASC';
			}

			Chiara.datatable.search(obj);
		},

		getSizeSelector : function(obj){

			var obj = $(obj);
			var opt = obj.data('Chiara.datatable');

			var htCont = '<select id="'+opt.rowLengthSelector+'">';
		    for(i in opt.rowsLength){
		    	htCont += '<option value="'+opt.rowsLength[i]+'">'+opt.rowsLength[i]+'</option>';
		    }
		    htCont += '</select>';
			return $(htCont).data('table-rif', obj).change(function(){
				Chiara.datatable.search($(this).data('table-rif'));
		    });

		},

		getTotalsTables: function(obj){
			var obj = $(obj);
			var opt = obj.data('Chiara.datatable');
			var data = obj.data('Chiara.datatable-data');
			return $('<div name="'+opt.id+'TotalsTable" id="'+opt.id+'TotalsTable" class="totals" />')
			.append($('<a class="toggler" href="javascript:void(0);">'+Chiara.getLabel('datatables.totali.mostraTotali')+'</a>')
						.click(function(){
							$(this).next().toggle('slide', function(){
								if( $(this).is(':visible') ){
									$(this).prev().text(Chiara.getLabel('datatables.totali.nascondiTotali'));
								}else{
									$(this).prev().text(Chiara.getLabel('datatables.totali.mostraTotali'));
								}
							})
						}))
			.append($('<table />').hide()
					.append($('<thead />')
							.append($('<tr />').append('<th>&nbsp;</th>')
								.append('<th>'+Chiara.getLabel('datatables.totali.totalsNElements')+'</th>')
								.append('<th>'+Chiara.getLabel('datatables.totali.dare')+'</th>')
								.append('<th>'+Chiara.getLabel('datatables.totali.avere')+'</th>')
								.append('<th>'+Chiara.getLabel('datatables.totali.saldo')+'</th>'))
					).append($('<tbody />')
							.append($('<tr />').append('<td>'+Chiara.getLabel('datatables.totali.totSelezione')+'</td>')
								.append('<td class="elemSelected">0</td>')
								.append('<td class="dareSelected">0</td>')
								.append('<td class="avereSelected">0</td>')
								.append('<td class="saldoSelected">0</td>'))
							.append($('<tr />').append('<td>'+Chiara.getLabel('datatables.totali.totPagina')+'</td>')
								.append('<td class="elemPage">'+data.paginator.size+'</td>')
								.append('<td class="darePage">0</td>')
								.append('<td class="averePage">0</td>')
								.append('<td class="saldoPage">0</td>'))
							.append($('<tr />').append('<td>'+Chiara.getLabel('datatables.totali.totElenco')+'</td>')
								.append('<td class="elemList">'+data.paginator.totalElements+'</td>')
								.append('<td class="dareList">0</td>')
								.append('<td class="avereList">0</td>')
								.append('<td class="saldoList">0</td>'))
			));
		},

		nextPage: function(obj){
			var obj = $(obj);
			var opt = obj.data('Chiara.datatable');
			opt.currentPage++;
			Chiara.datatable.search(obj);
		},

		prevPage: function(obj){
			var obj = $(obj);
			var opt = obj.data('Chiara.datatable');
			opt.currentPage--;
			Chiara.datatable.search(obj);
		},

		goToPage: function(obj, p){
			var obj = $(obj);
			var opt = obj.data('Chiara.datatable');
			opt.currentPage = p;
			Chiara.datatable.search(obj);
		},

		getSelectedData: function(obj){
			var obj = $(obj);
			var list = [];
			for(var i=0; i<obj.find('tr.c-selected').length; i++)
				list.push(obj.find('tr.c-selected').eq(i).data('c-row'));
			return list;
		},

		getDataRow: function(r){
			return $(r).data('c-row');
		},

		deselectAllRow: function(tbl){
			var tbl = $(tbl);
			tbl.find('tr').removeClass('c-selected')
			.find('td:first-child input[type=checkbox]').prop('checked', false);
			Chiara.datatable.refreshDataShowed(tbl);
		},

		selectAllRow: function(tbl){
			var tbl = $(tbl);
			tbl.find('tr').addClass('c-selected')
			.find('td:first-child input[type=checkbox]').prop('checked', true);
			Chiara.datatable.refreshDataShowed(tbl);
		},

		removeSelected: function(tbl){
			var tbl = $(tbl);
			if(tbl.find('tr.c-selected').length<=0) return;
			setTimeout(function(){Chiara.datatable.search(tbl)}, 700)
			tbl.find('tr.c-selected').effect( 'fade', {}, 800);
			Chiara.datatable.refreshDataShowed(tbl);
		},

		refreshDataShowed: function(tbl){
			var tbl = $(tbl);
			var opt = tbl.data('Chiara.datatable');
			var data = tbl.data('Chiara.datatable-data');
			if($(tbl).hasClass('buttonsBarHandled'))
				Chiara.buttonsBar.refreshButtons( $(tbl).data('buttonsBarHandle') );

			var dare = 0;
			var avere = 0;
			var saldo = 0;
			var rowsList = $('td.column-value', tbl);
			for(var i = 0; i < rowsList.length; i++){
				var tmpVal = parseFloat(rowsList.eq(i).text().replace('.', '').replace(',', '.'));
				saldo += tmpVal;
				if(tmpVal>0) avere += tmpVal;
				else  dare += tmpVal;
			}
			$('#'+opt.id+'TotalsTable').find('td.darePage').html(Chiara.utils.formattaValuta(dare));
			$('#'+opt.id+'TotalsTable').find('td.averePage').html(Chiara.utils.formattaValuta(avere));
			$('#'+opt.id+'TotalsTable').find('td.saldoPage').html(Chiara.utils.formattaValuta(saldo));

			dare = avere = saldo = 0;
			rowsList = tbl.find('td.checkable-cell input:checked').closest('tr');
			for(var i = 0; i < rowsList.length; i++){
				var tmpVal = parseFloat( rowsList.eq(i).find('td.column-value').text().replace('.', '').replace(',', '.'));
				saldo += tmpVal;
				if(tmpVal>0) avere += tmpVal;
				else  dare += tmpVal;
			}
			$('#'+opt.id+'TotalsTable').find('td.dareSelected').html(Chiara.utils.formattaValuta(dare));
			$('#'+opt.id+'TotalsTable').find('td.avereSelected').html(Chiara.utils.formattaValuta(avere));
			$('#'+opt.id+'TotalsTable').find('td.saldoSelected').html(Chiara.utils.formattaValuta(saldo));

			$('#'+opt.id+'TotalsTable').find('td.elemSelected').html($(tbl).find('td.checkable-cell input:checked').length);

			$('#'+opt.id+'TotalsTable').find('td.dareList').html( Chiara.utils.formattaValuta(data.totali.dare));
			$('#'+opt.id+'TotalsTable').find('td.avereList').html( Chiara.utils.formattaValuta(data.totali.avere));
			$('#'+opt.id+'TotalsTable').find('td.saldoList').html( Chiara.utils.formattaValuta(data.totali.dare + data.totali.avere) );

		}
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
