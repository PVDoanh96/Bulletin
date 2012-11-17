from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns("posts.views",
    url(r'^group/(?P<grpid>\d+)/post/(?P<postid>\d+)/comment/$', 'comment'),
    url(r'^group/(?P<grpid>\d+)/post/$', 'post'),
)