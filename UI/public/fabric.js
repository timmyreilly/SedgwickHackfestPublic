var TableElements = document.querySelectorAll(".ms-Table");
for (var i = 0; i < TableElements.length; i++) {
    new fabric['Table'](TableElements[i]);
}

var TextFieldElements = document.querySelectorAll(".ms-TextField");
for (var i = 0; i < TextFieldElements.length; i++) {
    new fabric['TextField'](TextFieldElements[i]);
}

var SpinnerElements = document.querySelectorAll(".ms-Spinner");
for (var i = 0; i < SpinnerElements.length; i++) {
    new fabric['Spinner'](SpinnerElements[i]);
}

var ButtonElements = document.querySelectorAll(".ms-Button");
for (var i = 0; i < ButtonElements.length; i++) {
    new fabric['Button'](ButtonElements[i], function () {

    });
}

