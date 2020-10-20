from django.core import serializers
from django.shortcuts import render
from .forms import Form
from .models import Client
import hashlib

from django.contrib.auth.models import User, Group
from rest_framework import status, viewsets
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from django.http import HttpResponse

from rest_framework.response import Response
from .serializers import ClientSerializer, AccountSerializer, TransactionSerializer
from .models import Client, Account, Transaction
from .managers import ClientManager
from django.db import IntegrityError, transaction
from rest_framework.decorators import action, api_view
from rest_framework.views import APIView

# Create your views here.
@api_view(['POST'])
def register(request):
    serializer = ClientSerializer(data=request.data)
    if serializer.is_valid():
        try:
            with transaction.atomic():
                created_first_name = serializer.data['first_name'] # need to have this as part of posting in API --> tell front end!!!
                created_last_name = serializer.data['last_name']
                created_email = serializer.data['email']
                created_password = request.data['password']
                created_superuser = serializer.data['is_superuser']

                client_entry = Client(
                    email = created_email,
                    first_name = created_first_name,
                    last_name = created_last_name,
                    is_staff = created_superuser,
                    is_superuser = created_superuser
                )
                client_entry.set_password(created_password)
                client_entry.save()

        except IntegrityError as ex:
            return Response({'error': str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({'status': 'Register successful'})
    else:
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

class ClientViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, pk=None):
        queryset = Client.objects.all()
        client = get_object_or_404(queryset, pk=pk)

        print(request.user)
        print(client)
        if client == request.user:
            serializer = ClientSerializer(client)
            return Response(serializer.data)
        else:
            return HttpResponse('Unauthorized', status=403)

class AccountViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows accounts to be viewed or edited.
    """
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    # permission_classes = [permissions.IsAuthenticated]


    @action(detail=True, methods=['post'])
    def deposit(self, request, pk=None):
        """
        Expecting this JSON structure example: {'amount': 5.00, 'location': 'Online', 'memo': 'Deposit #1' }
        """
        account = self.get_object()
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    amount_for_deposit = serializer.data['amount'] # need to have this as part of posting in API --> tell front end!!!
                    if amount_for_deposit < 0:
                        return Response({'error': 'Deposit cannot be negative '}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    location_deposited = serializer.data['location']
                    memo_on_deposit = serializer.data['memo']
                    check_path_confirmed = serializer.data['check_path']

                    account.balance = account.balance + amount_for_deposit
                    account.save()
                    transaction_entry = Transaction(
                        account = account,
                        amount = amount_for_deposit,
                        check_path = check_path_confirmed,
                        trans_type = 'Deposit',
                        location = location_deposited,
                        memo = memo_on_deposit
                    )
                    transaction_entry.save()
            except IntegrityError as ex:
                return Response({'error': str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'status': 'deposit successful'})
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        """
        Expecting this JSON structure example: {'amount': 5.00, 'location': 'Online', 'check_path': '1', 'memo': 'withdraw #1' }
        """
        account = self.get_object()
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    amount_for_withdraw = serializer.data['amount'] # need to have this as part of posting in API --> tell front end!!!
                    if amount_for_withdraw > account.balance:
                        return Response({'error': 'withdraw over the balance. '}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    elif amount_for_withdraw < 0:
                        return Response({'error': 'withdraw cannot be negative '}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    location_withdrawn = serializer.data['location']
                    memo_on_withdrawn = serializer.data['memo']

                    account.balance = account.balance - amount_for_withdraw
                    account.save()
                    transaction_entry = Transaction(
                        account = account,
                        amount = amount_for_withdraw,
                        trans_type = 'Withdraw #1',
                        location = location_withdrawn,
                        memo = memo_on_withdrawn
                    )
                    transaction_entry.save()
            except IntegrityError as ex:
                return Response({'error': str(ex)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'status': 'withdraw successful'})
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)



class TransactionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

# TO DO LIST
  # AUTOMATED BILL PAYMENTS
# reset password - API
    # enter new password in
# create user - API $
# login  - API 
