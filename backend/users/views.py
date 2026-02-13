from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from .models import User
from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = (MultiPartParser, FormParser)


class CheckEmailAvailabilityView(APIView):
    """
    Check if an email is already used.
    GET /api/users/check-email/?email=test@example.com
    """

    def get(self, request):
        email = request.query_params.get("email")
        if not email:
            return Response(
                {"error": "Email parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email_exists = User.objects.filter(email__iexact=email).exists()

        return Response(
            {"available": not email_exists},
            status=status.HTTP_200_OK,
        )
