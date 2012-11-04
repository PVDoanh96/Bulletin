from django.contrib.auth.models import User
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.utils.translation import ugettext, ugettext_lazy as _

class RegistrationForm(forms.ModelForm):
    error_messages = {
        'duplicate_email'   : _("A user with that email already exists"),
        'password_mismatch' : _("The two passwords did not match"),
    }

    email = forms.EmailField(label=_('Email'), 
                             max_length=40, 
                             required=True)
    first_name = forms.CharField(label=_("First Name"), 
                                 max_length=40,
                                 required=True)
    last_name = forms.CharField(label=_("Last Name"),
                                max_length=40,
                                required=True)
    password1 = forms.CharField(widget=forms.PasswordInput, label=_("Password"))
    password2 = forms.CharField(widget=forms.PasswordInput, label=_("Confirm Password"))

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password1', 'password2',)

    def clean_email(self):
        '''
        Check for a clean email.  If the user exists and is active, throw an
        exception (since this will mean there is a duplicate email in the database).

        If the user exists with the same email but is not active, then
        it's okay to send the confirmation email again because the account has never
        been activated in the first place.
        '''
        email = self.cleaned_data['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return email

        if user.is_active:
            raise forms.ValidationError(self.error_messages['duplicate_email'])
        else:
            # User is deleted as the email is the same.  A new user is constructed
            # when calling self.save()
            # TODO: Is this really a good idea?
            user.delete()
            return email

    def clean_password2(self):
        password1 = self.cleaned_data['password1']
        password2 = self.cleaned_data['password2']
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(self.error_messages['password_mismatch'])
        return password2

    def save(self, commit=True):
        '''
        In this instance, the username is set to be the email,
        so that we don't have to worry about uniqueness.  This
        is indeed a little bit of a hack, so maybe this can be changed
        later by making a custom User class (like what was planned
        in the first place).
        '''
        user = super(RegistrationForm, self).save(commit=False)
        user.username = self.cleaned_data['email']

        ''' Don't activate a user until the email is sent! '''
        user.is_active = False 
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user
