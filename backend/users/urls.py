from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CheckEmailAvailabilityView

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("check-email/", CheckEmailAvailabilityView.as_view(), name="check-email"),
]
