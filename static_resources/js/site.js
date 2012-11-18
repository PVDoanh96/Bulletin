$(document).ready(function() {
    // Find ALL <form> tags
    $('form').submit(function(){
        // On submit disable its submit button
        $('.submit-btn', this).attr("disabled", "disabled");
    });
});

// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36110349-1']);
_gaq.push(['_setDomainName', 'bulletinapp.net']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl'
			: 'http://www')
			+ '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();

//$(window).scroll(function(){
//    if ($(window).scrollTop() != 0){
//        $('#jump-top').css("display", "inline-block");
//    } else {
//        $('#jump-top').hide();
//    }
//});

$('#jump-top').click(function() {
	$('html, body').animate({
        scrollTop: 0
    }, 200);
});

$(document).ready(function() {
    $('.tabs-left').children().each(function() {
        $(this).css("height", $(this).parent().css("height"));
    });
    // Find ALL <form> tags
    $('form').submit(function(){
        // On submit disable its submit button
        $('.submit-btn', this).attr('disabled', 'disabled');
    });
    $('abbr.timeago').timeago();

    // comment slider
    $('.comment-unhide-btn').click(function(event) {
    	var $commentForm;
        var $post;

        event.preventDefault();
        $post = $(this).parents('.post');
        $commentForm = $post.find(".comment-form-container");
        $(this).parent().fadeOut();
        $commentForm.show("blind", function() {
            $('html, body').animate({
                scrollTop: $post.offset().top - $('.navbar').height()
            }, 500);
        });
    });

    // comment ajax
    $('.comment-form').submit(function(event) {
        event.preventDefault();

        var form = $(this);
        var url = 'post/' + form.find('input[name="id_post"]').val() + '/comment/';
        var msg = form.find('#id_message').val();
        var csrf = form.find('input[name="csrfmiddlewaretoken"]').val();

        $.post(url, {message: msg, csrfmiddlewaretoken: csrf}, function(data) {
            // copy of message is returned via json, insert into page
            comment_html = "<li class=\"media comment\"> \
                    <img class=\"avatar pull-left media-object\" src=\"http://www.gravatar.com/avatar/" + md5(data.author.email) + "?s=50&d=mm" + "\" alt=\"commenters's gravatar\" /> \
	                <div class=\"media-body\"> \
                   		<span class=\"media-heading clearfix\"> \
	                        <strong class=\"pull-left\">" + data.author.first_name + " " + data.author.last_name + "</strong> \
	                        <em class=\"pull-right\"><abbr class=\"timeago\" title=\"" + data.time_stamp + "\">" + data.date_posted + "</abbr></em> \
	                        <br /> \
	                    </span> \
	                    <div class=\"comment-message\">" + data.message + "</div> \
	                </div> \
	            </li>";
            form.parent().siblings('.comments').append($(comment_html));
            form.find("#id_message").val("");
            $('abbr.timeago').timeago();
        }, 'json');
    });
    
    //I'll make this prettier later
    $('.post').each(function() { 
        var postHeight = $(this).height();
        
        $(this).children('.avatar-container').each(function() {
            $(this).children('.avatar').each(function() {
                var newImage = new Image();
                newImage.src = this.src;
                var width = newImage.width;
                var height = newImage.height;
                
                var scale = width/height;
                var computedHeight = Math.min(height, Math.max(postHeight, 75));
                var avatar = this;
                $(newImage).load(function() {
                    $(avatar).css('height',  computedHeight + 'px');
                    $(avatar).css('min-width',  computedHeight*scale + 'px');
                    $(avatar).css('margin-left',  -(computedHeight*scale -75 )/3 + 'px');
                });
            });
        });
        
        $(this).find('.comment').each(function() {
            var commentHeight = $(this).height();
            
            $(this).find('.avatar').each(function() {
                var newImage = new Image();
                newImage.src = this.src;
                var width = newImage.width;
                var height = newImage.height;
                
                var scale = width/height;
                var computedHeight = Math.min(height, Math.max(commentHeight, 75));
               
                var avatar = this;
                $(newImage).load(function() {
                    $(avatar).css('height',  computedHeight + 'px');
                    $(avatar).css('min-width',  computedHeight*scale + 'px');
                    $(avatar).css('margin-left',  -(computedHeight*scale -75 )/3 + 'px');
                });
            });
        });
    });
    $('.avatar').show();
    $('abbr.timeago').show();
});

$('#flipbox').flip({
	direction:'tb',
	onBefore: function(){
			console.log('before starting the animation');
	},
	onAnimation: function(){
			console.log('in the middle of the animation');
	},
	onEnd: function(){
			console.log('when the animation has already ended');
	}
});
