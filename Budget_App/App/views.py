from django.shortcuts import render,redirect
from django.contrib.auth import  authenticate,login as login_user
from .forms import  UserForm
# Create your views here.


def index(request):
    return render(request,'index.html');

def registration(request):
    if request.method=='POST':
        form=UserForm(request.POST)
        if form.is_valid():
            user=form.save(commit=False)
            username=form.cleaned_data['username']
            password=form.cleaned_data['password']
            print(username)
            print(password)
            print("ASDASDASDASDASDASDASD")
            user.set_password(password)
            user.save()
            user=authenticate(username=username,password=password)
            login_user(request,user)
            return redirect(login)
    else:
        form=UserForm()
    return render(request,'registration.html',{'form':form})

def login(request):
    current_user=request.user
    return render(request,'login.html',{'user':current_user})
