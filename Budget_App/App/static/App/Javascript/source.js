

var UIController=(function(){

  return{
    addElement:function(id,type,descr,sum)
    {
      var button=document.createElement("input");
      button.type="image";
      button.src=stat+"cancel.png";
      button.className="delete";
      var val=document.createElement("div");
      val.className="value "+type;
      val.innerHTML=sum;
      var description=document.createElement("div");
      description.className="transaction-description";
      description.innerHTML=descr;
      transaction=document.createElement("div");
      transaction.className="transaction-nr"+id;
      transaction.appendChild(description);
      transaction.appendChild(val);
      transaction.appendChild(button);
      if(type=="income")
        {
          var container=document.querySelector(".income-transactions");
        }
        else
        {
          var container=document.querySelector(".expense-transactions");
        }
        container.appendChild(transaction);
    },

    toggleTransaction:function()
    {
      var select=document.querySelector(".type-transaction");
      var description_form=document.querySelector(".form.text");
      var value_form=document.querySelector(".form.number");
      var tick=document.querySelector(".tick");
      select.classList.toggle("red");
      description_form.classList.toggle("red");
      value_form.classList.toggle("red");
      if(tick.getAttribute("src")==stat+"bluetick.png")
        tick.src=stat+"tick.png";
      else
        tick.src=stat+"bluetick.png";

    },
    typeOfTransaction:function()
    {
      var select=document.querySelector(".type-transaction");
      var type_of_trasaction=select.options[select.selectedIndex].value;
      return type_of_trasaction;
    },
    checkFields:function()
    {
      var field_description=document.querySelector(".form.text");
      var field_value=document.querySelector(".form.number");
      if(field_description.value==""||field_value.value=="" || parseInt(field_value.value)<0)
        return false;
      return true;
    },
    getUserFields:function()
    {
      descr=document.querySelector(".form.text").value;
      sum=document.querySelector(".form.number").value;
      sum=parseInt(sum)
      return {
        description:descr,
        sum:sum
      }
    },
    emptyForms:function()
    {
      document.querySelector(".form.text").value="";
      document.querySelector(".form.number").value="";
    },
    UpdateBudget:function(income,expense,balance)
    {
      document.querySelector(".balance-value").innerHTML=balance+"$";
      document.querySelector(".income-value").innerHTML=income+"$";
      document.querySelector(".expense-value").innerHTML=expense+"$";
    },
    removeTransaction:function(button)
    {
      transaction=button.parentElement;
      transaction.style.position="relative";
      if(transaction.parentElement.classList.contains("income-transactions"))
        transaction.style.transform="translateX(-1000px)";
      else
        transaction.style.transform="translateX(1000px)";
      transaction.style.transitionDuration="2.5s";
      var bod=document.getElementsByTagName("body")[0];
      bod.style.overflow="hidden";
      setTimeout(function(){
        transaction.style.display="none";
        bod.style.overflow="visible";
      },1250);
    },
    animateBudget:function()
    {
      var balance=document.querySelector(".balance-value");
      var income=document.querySelector(".income-value");
      var expense=document.querySelector(".expense-value");
      balance.classList.remove("appear");
      income.classList.remove("appear");
      expense.classList.remove("appear");
      void balance.offsetWidth;
      void income.offsetWidth;
      void expense.offsetWidth;
      balance.classList.add("appear");
      income.classList.add("appear");
      expense.classList.add("appear");
    }
  }
})();


var BudgetController=(function(){
  var data={
    expenses:[],
    income:[],
    totalIncome:0,
    totalExpense:0
  }

  var Income=function(id,description,val)
  {
    this.description=description;
    this.val=val;
    this.id=id;
  }

  var Expense=function(id,description,val)
  {
    this.description=description;
    this.val=val;
    this.id=id;
  }

  return{
    //add transaction to income/expenses array
    newTransaction:function(type,description,sum){
        id=0;
        if(type=="income")
          {
            if(data.income.length!=0)
              id=data.income[data.income.length-1].id+1;
            data.totalIncome+=sum;
            income=new Income(id,description,sum);
            data.income.push(income);
            return income;
          }
          else
          {
            if(data.expenses.length!=0)
              id=data.expenses[data.expenses.length -1].id+1;
            data.totalExpense+=sum;
            expense=new Expense(id,description,sum);
            data.expenses.push(expense);
            return expense;
          }
    },
    //get all data
    check:function(){
      console.log(data);
    },
    //get the totalIncome and totalExpense
    getBudget:function()
    {
      return {
        income:data.totalIncome,
        expenses:data.totalExpense
      }
    },
    //delete element from income/expenses array
    deleteElement:function(id,type)
    {
      if(type=="income")
      {
        var element=data.income.find((transaction)=>transaction.id===id);
        data.totalIncome-=element.val;
        var index=data.income.indexOf(element);
        data.income.splice(index,1);

      }
      else
      {
        var element=data.expenses.find((transaction)=>transaction.id===id);
        data.totalExpense-=element.val;
        var index=data.expenses.indexOf(element);
        data.expenses.splice(index,1);
      }
    }
  }
})();




var Controller=(function(UICtrl,BCtrl){
  var UserInterface=UICtrl;
  var Budget=BCtrl;

  var SetupListeners=function(){

    //event when we insert a transaction
    document.querySelector(".tick").addEventListener("click",function(){

      if(!UserInterface.checkFields())
        {
          alert("Description or value is invalid")
        }
      else
        {
          var input=UserInterface.getUserFields();
          var type=UserInterface.typeOfTransaction();
          var transaction=Budget.newTransaction(type,input.description,input.sum);
          var totals=Budget.getBudget();
          UserInterface.addElement(transaction.id,type,transaction.description,transaction.val);
          UserInterface.UpdateBudget(totals.income,totals.expenses,totals.income-totals.expenses);
          UserInterface.emptyForms();
          UserInterface.animateBudget();
        }
    })

    //event when we change the type of transaction
    document.getElementsByTagName("select")[0].addEventListener("change",function(){
      UserInterface.toggleTransaction();
    })

    //event when we delete a transaction
    document.querySelector("#tranzactionContainer").addEventListener("click",function(e)
    {
      if(e.target &&e.target.classList.contains("delete"))
        {var type;
        if(e.target.parentElement.parentElement.className=="income-transactions")
          type="income";
        else
          type="expense";
        var id=parseInt(e.target.parentElement.className[e.target.parentElement.className.length-1]);
        UserInterface.removeTransaction(e.target);
        Budget.deleteElement(id,type);
        totals=Budget.getBudget();
        UserInterface.UpdateBudget(totals.income,totals.expenses,totals.income-totals.expenses);
        UserInterface.animateBudget();
        }
    })

}
  return{
    init:function()
    {
      SetupListeners();
    }
  }
})(UIController,BudgetController);

Controller.init();
