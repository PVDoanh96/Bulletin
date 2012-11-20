function initCommentSlider() {
    $('.comment-unhide-btn').click(function(event) {
    	var $commentForm;
        var $post;

        event.preventDefault();
        $post = $(this).parents('.post');
        $commentForm = $post.find(".comment-form-container");
        $(this).parent().fadeOut();
        $commentForm.show("blind", function() {
			var scroll = $post.offset().top - $('.navbar').height();
			if (scroll + $(window).height() < $commentForm.offset().top + $commentForm.height()) {
				scroll += $commentForm.offset().top + $commentForm.height() - (scroll + $(window).height());
			}
            $('html, body').animate({
                scrollTop: scroll
            }, 500);
			$($commentForm).find('input[type="text"]').focus();
			var postHeight = $($post).height();
        
			$($post).children('.avatar-container').each(function() { // Avatars within posts
				$(this).find('.avatar').each(function() {
					animateResize(this, postHeight);
				});
			});
        });
    });
}

function initCommentAjax() {
	$('.comment-form').submit(function(event) {
        event.preventDefault();

        var form = $(this);
        var url = 'post/' + form.find('input[name="id_post"]').val() + '/comment/';
        var msg = form.find('#id_message').val();
        var csrf = form.find('input[name="csrfmiddlewaretoken"]').val();

        $.post(url, {message: msg, csrfmiddlewaretoken: csrf}, function(data) {
            // copy of message is returned via json, insert into page
            comment_html = "<li class=\"media new comment\"> \
                           <div class=\"avatar-container pull-left media-object\"> \
                    <img class=\"avatar new pull-left media-object\" src=\"http://www.gravatar.com/avatar/" + md5(data.author.email) + "?s=300&d=mm" + "\" alt=\"commenters's gravatar\" /> </div>\
	                <div class=\"media-body\"> \
                   		<span class=\"media-heading\"> \
	                        <strong class=\"pull-left name\">" + data.author.first_name + " " + data.author.last_name + "</strong> \
	                        <em class=\"pull-right\"><abbr class=\"timeago new\" title=\"" + data.time_stamp + "\">" + data.date_posted + "</abbr></em> \
	                        <br /> \
	                    </span> \
	                    <div class=\"comment-message\">" + data.message + "</div> \
	                </div> \
	            </li>";
            form.parent().siblings('.comments').append($(comment_html));
            form.find("#id_message").val("");
            
            $('.comment.new').each(function() { 
                var postHeight = $(this).height();
                
                $(this).children('.avatar-container').each(function() { // Avatars within posts
                    $(this).find('.avatar').each(function() {
                        resizeAvatar(this, postHeight);
                    });
                });
            });
			$post = $(form).parents('.post');
			var postHeight = $($post).height();
			$($post).children('.avatar-container').each(function() { // Avatars within posts
				$(this).find('.avatar').each(function() {
					animateResize(this, postHeight);
				});
			});
			
			$commentForm = $(form).parents('.comment-form-container');
			var scroll = window.pageYOffset - $('.navbar').height();
			if (scroll + $(window).height() < $commentForm.offset().top + $commentForm.height()) {
				scroll += $commentForm.offset().top + $commentForm.height() - (scroll + $(window).height());
				$('html, body').animate({
					scrollTop: scroll
				}, 500, function() {
					$($commentForm).find('input[type="text"]').focus();
				});
			}
            
            $('.timeago.new').timeago().fadeIn();
        }, 'json');
    });
}

function initDynamicAvatarSize() {
	$('.post').each(function() { 
        var postHeight = $(this).height();
        
        $(this).children('.avatar-container').each(function() { // Avatars within posts
            $(this).find('.avatar').each(function() {
                resizeAvatar(this, postHeight);
            });
        });
        
        $(this).find('.comment').each(function() { // Avatars within comments
            var commentHeight = $(this).height();
            $(this).find('.avatar').each(function() {
                resizeAvatar(this, commentHeight);
            });
        });
    });
}

function resizeAvatar (avatar, parentHeight) {	
	$("<img/>")
		.attr("src", $(avatar).attr("src"))
		.load(function() {
			var scale = this.width/this.height;
			var computedHeight = Math.max(Math.min(this.height, parentHeight), 65);
			$(avatar).css('height',  computedHeight + 'px');
			$(avatar).css('min-width',  computedHeight*scale + 'px');
			$(avatar).css('margin-left',  -(computedHeight*scale - 65 )/3 + 'px');
			$(avatar).fadeIn();
    });
}

function animateResize (avatar, parentHeight) {	
	$("<img/>")
		.attr("src", $(avatar).attr("src"))
		.load(function() {
			var scale = this.width/this.height;
			var computedHeight = Math.max(Math.min(this.height, parentHeight), 65);
			$(avatar).animate({"margin-left": -(computedHeight*scale - 65 )/3 + 'px',
							   "min-width": computedHeight*scale + 'px',
							   "height": computedHeight + 'px'}, 500);
    });
}

$(document).ready(function() {
	$('abbr.timeago').timeago().fadeIn();
    initCommentSlider();
    initCommentAjax();
});

$(window).load(function() {
    initDynamicAvatarSize();
	$('.avatar').fadeIn();
});