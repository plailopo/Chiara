
$(document).ready(function(){
	
	$('code').each(function(i, block) {
		hljs.highlightBlock(block);
	});
})

var app = {

	editData: function(d){
		return d;
	}

}