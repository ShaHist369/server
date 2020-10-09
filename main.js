document.addEventListener("DOMContentLoaded", loaded);

let oldMessageArray = {
                    firstName: false,
                    lastName: false,
                    email: false,
                    age: false,
                    password: false,
                    confirmPassword: false
                };
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const age = document.getElementById('age');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const submitButton = document.getElementById('submit');
const hideSubmit = document.getElementById('hideSubmit');
const genderMail = document.getElementById('btnrv1');
const form = document.getElementById('form');
const signUpAgainBtn = document.getElementById('signUpAgain');
const showUsersBtn = document.getElementById('showUsersButton');
const existUsersContainer = document.getElementById('existUsersContainer');

function loaded(){
   form.addEventListener("change",  showErrors);
   form.addEventListener("submit", (event)=>{sendForm(event,form)});
   hideSubmit.addEventListener("click",  showErrors); 
   form.addEventListener("change", toggleSubmitButton);
    signUpAgainBtn.addEventListener("click",  clearFields);
    showUsersBtn.addEventListener("click",  showExistUsers);

}





function toggleSubmitButton(){
    let isFirstNameValid = firstName.validity.valid;
    let isLastNameValid = lastName.validity.valid;    
    let isEmailValid = email.validity.valid;
    let isAgeValid = age.validity.valid;
    let isPasswordValid = password.validity.valid;
    let isConfirmPasswordValid = confirmPassword.validity.valid;

    let isSamePassword = (password.value === confirmPassword.value);



    let isAllFieldsValid = () =>{
        if(isSamePassword & isFirstNameValid & isLastNameValid & isEmailValid & isAgeValid & isPasswordValid & isConfirmPasswordValid){
            return true
        }else{
            return false
        }
    }

    if(isAllFieldsValid()){
        hideSubmit.classList.add("disactivate-hide");
        submitButton.classList.remove("disabled");
        submitButton.disabled = false;
    }else{
        hideSubmit.classList.remove("disactivate-hide");
        submitButton.classList.add("disabled");
        submitButton.disabled = true;
    }
}
    

function showErrors () {
                
                function replaceMessage(element){
                        let oldMessage = oldMessageArray[element.id];
                        let newMessage = document.createElement('p');
                        newMessage.innerHTML = element.validationMessage;
                        if(oldMessage){
                            oldMessage.remove();
                            element.after(newMessage);
                            oldMessageArray[element.id] = newMessage;
                        }else{
                            oldMessageArray[element.id] = newMessage;
                        }

                    }

                 replaceMessage(firstName);
                 replaceMessage(lastName);
                 replaceMessage(email);
                 replaceMessage(age);
                 replaceMessage(password);                   
                 replaceMessage(confirmPassword);
    }
let existUsers = {
    "user":"empty"
};
function sendForm(event,form){
    let data = new FormData(form);
    event.preventDefault();
    let object = {};
    data.forEach((value, key) => {object[key] = value});
    let json = JSON.stringify(object);

    fetch('http://localhost:3000/',
        {   method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: data,
        })
        .then((data)=>{
            return  data.json();
        })
        .then((data)=>{
            if(data.sucsess){
                showSucsessMessage(data.newUser);
                existUsers = data.existUsers;

            }else{
                alert(data.response);
            }
        });




    }

const sucsessMessage = document.getElementById('sucsess-message');
const lastNameSucsess = document.getElementById('lastNameSucsess');
const firstNameSucsess = document.getElementById('firstNameSucsess');
const genderSucsess = document.getElementById('genderSucsess');
const emailSucsess = document.getElementById('emailSucsess');
const ageSucsess = document.getElementById('ageSucsess');
const passwordSucsess = document.getElementById('passwordSucsess');


function showSucsessMessage(data){
    sucsessMessage.classList.add("active-sucsess");
    sucsessMessage.style.display = 'block';
    form.style.display = 'none';

    genderSucsess.innerHTML = data.gender;
    lastNameSucsess.innerHTML = data.lastName;
    firstNameSucsess.innerHTML = data.firstName;
    emailSucsess.innerHTML = data.email;
    ageSucsess.innerHTML = data.age;
    passwordSucsess.innerHTML = data.password;
}


function showExistUsers(){
    let usersHTML = '';
    let length = Object.keys(existUsers).length;
    let i = 0;
    while(i<length){
        usersHTML = usersHTML + getUser(existUsers[i]);
        i++;
    }
    existUsersContainer.style.display = 'block';
    existUsersContainer.innerHTML = usersHTML;
}
function getUser(user){
    let html = `
    <div class="existUser">
            <h3 class="existUser__title">${user.firstName} ${user.lastName}</h3>
            <div class="userField"><p>gender:</p><p>${user.gender}</p></div>
            <div class="userField"><p>age:</p><p>${user.age}</p></div>
            <div class="userField"><p>email:</p><p>${user.email}</p></div>
            <div class="userField"><p>password:</p><p>${user.password}</p></div>
    </div>
    `;
    return html;
}
function clearFields(){
    sucsessMessage.classList.remove("active-sucsess");
    sucsessMessage.style.display = 'none';
    existUsersContainer.style.display = 'none';
    existUsersContainer.innerHTML = '';
    form.style.display = 'grid';

    firstName.value = '';
    lastName.value = '';
    genderMail.checked = true;
    age.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    toggleSubmitButton();
}