from django.contrib.auth.models import User
from django import forms
from django.utils.translation import ugettext, ugettext_lazy as _
from models import Group

class GroupCreationForm(forms.ModelForm):
    '''
    This for will create a group with the specified name.
    It is recommended that a user be able to invite other members
    to a group via the Membership model (in groups.models)
    '''
    class Meta:
        model = Group
        fields = ('name',)
