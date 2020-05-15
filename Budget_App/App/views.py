from django.shortcuts import render,redirect
from django.contrib.auth import  authenticate,login as login_user,logout as logout_user
from .forms import  UserForm
from django.contrib.auth.decorators import login_required
from django.contrib import  messages
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

            user.set_password(password)
            user.save()
            user=authenticate(username=username,password=password)
            login_user(request,user)
            return redirect(userpage)
    else:
        form=UserForm()
    return render(request,'registration.html',{'form':form})

def userpage(request):
    current_user=request.user
    if request.method=='POST':
        username=request.POST['description']
        password=request.POST['valoare']
        type=request.POST['type']
        print(username)
        print(password)
        print(type)
    return render(request,'userpage.html',{'user':current_user})

def login(request):
    if request.method=='POST':
        form=UserForm(request.POST)
        username=form.data['username']
        password=form.data['password']
        user=authenticate(request,username=username,password=password)
        if user is not None:
            login_user(request,user)
            return redirect(userpage)

        else:
            messages.error(request,'The user does not exist',)

    else:
        form=UserForm()
    return render(request,'login.html',{'form':form})



@login_required
def logout(request):
    logout_user(request);
    return redirect(index)
