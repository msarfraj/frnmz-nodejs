function validateForm(register) {
    if (register.name.value == "") {
        alert("Name Must be filled out");
        name.focus();
        return false;
    }
    if (register.email.value == "") {
        alert("Email Must be filled out");
        email.focus();
        return false;
    }
    if (register.password.value == "") {
        alert("Password Must be filled out");
        password.focus();
        return false;
    }
    if (register.amount.value == "") {
        alert("You Must fill the Amount");
        amount.focus();
        return false;
    }
    if (register.cellno.value == "") {
        alert("Mobile Numbar Can't be Empty");
        cellno.focus();
        return false;
    }
    var phoneno = /^\d{10}$/;  
    if(!register.cellno.value.match(phoneno)){
    	alert("In correct Mobile Numbar!");
        cellno.focus();
        return false;
    }
}
