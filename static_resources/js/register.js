function register() {
	var $containerInPage = $('#content-container');
	$('.loading-spinner').show();
	$.post(
		".",
		$('#register-form').serialize(),
		function(output) {
			var $nextPage = $('#content-container', output);
			$containerInPage.fadeOut(function() {
				$containerInPage.html($nextPage.html());
				$containerInPage.find('ul.errorlist').addClass("alert alert-error")
				ajaxRegister();
				if($.browser.msie && parseInt($.browser.version, 10) < 10) {
					$('input, textarea').placeholder();
				}
			});
			$containerInPage.fadeIn();
		}
	);
}

function ajaxRegister() {
	$('#register-form').submit(function(event) {
		event.preventDefault();
		register();
	});
}

$(document).ready(function() {
	ajaxRegister();
});