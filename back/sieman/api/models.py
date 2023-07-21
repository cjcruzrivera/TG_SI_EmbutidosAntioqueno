from django.contrib.auth.models import AbstractUser, UserManager as DefaultUserManager
from django.db import models

class UserManager(DefaultUserManager):
    def _create_user(self, username, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set.')
        email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    username = models.CharField(max_length=150, unique=False)  # Change unique to False
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'  # Set email as the username field
    REQUIRED_FIELDS = ['username']

    objects = UserManager()
