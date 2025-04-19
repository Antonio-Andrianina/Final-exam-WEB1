const PREDEFINED_ACCOUNT = {
    email: "someone@gmail.com",
    password: "justsomeone123"
};


let accounts = JSON.parse(localStorage.getItem('accounts')) || [];


if (!accounts.some(acc => acc.email === PREDEFINED_ACCOUNT.email)) {
    accounts.push(PREDEFINED_ACCOUNT);
    localStorage.setItem('accounts', JSON.stringify(accounts));
}


function usePredefinedAccount() {
    document.getElementById('email').value = PREDEFINED_ACCOUNT.email;
    document.getElementById('password').value = PREDEFINED_ACCOUNT.password;
    document.getElementById('rememberMe').checked = true;
}


document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const submitBtn = this.querySelector('button');
    const loader = submitBtn.querySelector('.btn-loader');
    

    submitBtn.disabled = true;
    loader.style.display = 'inline-block';
    

    setTimeout(() => {
        const user = accounts.find(acc => acc.email === email && acc.password === password);
        
        if (user) {
            if (rememberMe) {
                localStorage.setItem('savedEmail', email);
                localStorage.setItem('savedPassword', password);
            }
            window.location.href = "SkyType.html";
        } else {
            alert("Email ou mot de passe incorrect");
        }
        
        submitBtn.disabled = false;
        loader.style.display = 'none';
    }, 800);
});


document.getElementById('registerLink').addEventListener('click', function(e) {
    e.preventDefault();
    const email = prompt("Entrez votre email :");
    if (!email) return;
    
    const password = prompt("Créez un mot de passe :");
    if (!password) return;
    
    if (accounts.some(acc => acc.email === email)) {
        alert("Un compte avec cet email existe déjà");
        return;
    }
    
    accounts.push({ email, password });
    localStorage.setItem('accounts', JSON.stringify(accounts));
    alert("Compte créé avec succès !");
    document.getElementById('email').value = email;
    document.getElementById('password').focus();
});

