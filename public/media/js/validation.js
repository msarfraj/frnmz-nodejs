function validateForm(register) {
    if (register.name.value == "") {
        alert("Name Must be filled out");
        return false;
    }
    if (register.email.value == "") {
        alert("Email Must be filled out");
        return false;
    }
    if (register.password.value == "") {
        alert("Password Must be filled out");
        return false;
    }
    if (register.amount.value == "") {
        alert("You Must the Ampount");
        return false;
    }
}
