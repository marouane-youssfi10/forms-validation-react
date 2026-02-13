from django.contrib import admin

from users.models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ["id", "first_name", "last_name", "email", "image"]


admin.site.register(User, UserAdmin)
