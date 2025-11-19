// Simple client-side logic for validation and dropdown chaining
const disposableDomains = ["tempmail.com","10minutemail.com","mailinator.com","disposablemail.com","yopmail.com"];

const countryStateCity = {
  "IN":{
    "Maharashtra":["Mumbai","Pune","Nagpur"],
    "Karnataka":["Bengaluru","Mysore","Hubli"]
  },
  "US":{
    "California":["Los Angeles","San Francisco","San Diego"],
    "New York":["New York City","Buffalo","Rochester"]
  },
  "GB":{
    "England":["London","Manchester"],
    "Scotland":["Edinburgh","Glasgow"]
  },
  "AU":{
    "New South Wales":["Sydney","Newcastle"],
    "Victoria":["Melbourne","Geelong"]
  }
};

const regForm = document.getElementById("regForm");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const messages = document.getElementById("form-messages");

const fields = {
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  gender: [...document.querySelectorAll("input[name='gender']")],
  country: document.getElementById("country"),
  state: document.getElementById("state"),
  city: document.getElementById("city"),
  password: document.getElementById("password"),
  confirmPassword: document.getElementById("confirmPassword"),
  terms: document.getElementById("terms")
};

function setError(elName, msg){
  const el = fields[elName] || document.querySelector(`[name="${elName}"]`);
  const small = document.querySelector(`small.error[data-for="${elName}"]`);
  if(small){ small.textContent = msg || ""; }
  if(el){
    if(msg) el.classList.add("invalid"); else el.classList.remove("invalid");
  }
}

function showTopMessage(type, text){
  messages.innerHTML = `<div class="${type==='success'?'successTop':'errTop'}">${text}</div>`;
  setTimeout(()=> { if(type==='success') messages.innerHTML = ""; }, 5000);
}

function isDisposable(email){
  const domain = email.split("@")[1] || "";
  return disposableDomains.includes(domain.toLowerCase());
}

function validateEmail(){
  const v = fields.email.value.trim();
  if(!v){ setError("email","Email is required"); return false; }
  if(!v.includes("@")){ setError("email","Email must be valid"); return false; }
  if(isDisposable(v)){ setError("email","Disposable email addresses are not allowed"); return false; }
  setError("email","");
  return true;
}

function validateName(which){
  const v = fields[which].value.trim();
  if(!v){ setError(which, which==="firstName"?"First name is required":"Last name is required"); return false; }
  setError(which,"");
  return true;
}

function validatePhone(){
  const v = fields.phone.value.trim();
  const country = fields.country.value;
  if(!v){ setError("phone","Phone is required"); return false; }
  if(country){
    // basic: phone must start with +<countrycode> e.g. +91 or +1
    if(!v.startsWith("+")){ setError("phone","Phone must start with country code like +91"); return false; }
    // ensure digits after +
    if(!/^\+\d{6,15}$/.test(v)) { setError("phone","Phone must contain only digits after + and be 6-15 digits"); return false; }
  } else {
    // if no country selected, allow a loose check
    if(!/^\+?\d{6,15}$/.test(v)) { setError("phone","Phone must be valid"); return false; }
  }
  setError("phone","");
  return true;
}

function validateGender(){
  const picked = fields.gender.some(r=>r.checked);
  if(!picked){ setError("gender","Please select gender"); return false; }
  setError("gender","");
  return true;
}

function validateDropdown(name){
  const el = fields[name];
  if(!el.value){ setError(name, "This field is required"); return false; }
  setError(name,"");
  return true;
}

function passwordStrength(pw){
  let score = 0;
  if(pw.length >= 8) score++;
  if(/[A-Z]/.test(pw)) score++;
  if(/[0-9]/.test(pw)) score++;
  if(/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0..4
}

function validatePassword(){
  const pw = fields.password.value;
  const conf = fields.confirmPassword.value;
  const score = passwordStrength(pw);
  const meter = document.getElementById("pwMeter");
  const strengthText = document.getElementById("pwStrength");
  meter.value = score;
  const labels = ["Very weak","Weak","Okay","Good","Strong"];
  strengthText.textContent = `Strength: ${labels[score]}`;
  if(score < 2){ setError("password","Password is too weak (min 8 chars, include upper case, digits)"); return false; }
  setError("password","");
  if(conf && pw !== conf){ setError("confirmPassword","Passwords do not match"); return false; }
  setError("confirmPassword","");
  return true;
}

function validateConfirmPassword(){
  const pw = fields.password.value;
  const conf = fields.confirmPassword.value;
  if(!conf){ setError("confirmPassword","Please confirm password"); return false; }
  if(pw !== conf){ setError("confirmPassword","Passwords do not match"); return false; }
  setError("confirmPassword","");
  return true;
}

function validateTerms(){
  if(!fields.terms.checked){ setError("terms","You must accept terms"); return false; }
  setError("terms","");
  return true;
}

function validateForm(){
  const v = [
    validateName("firstName"),
    validateName("lastName"),
    validateEmail(),
    validatePhone(),
    validateGender(),
    validateDropdown("country"),
    validateDropdown("state"),
    validateDropdown("city"),
    validatePassword(),
    validateConfirmPassword(),
    validateTerms()
  ];
  const ok = v.every(x=>x===true);
  submitBtn.disabled = !ok;
  return ok;
}

// wiring events
fields.firstName.addEventListener("input", ()=>{ validateName("firstName"); validateForm(); });
fields.lastName.addEventListener("input", ()=>{ validateName("lastName"); validateForm(); });
fields.email.addEventListener("input", ()=>{ validateEmail(); validateForm(); });
fields.phone.addEventListener("input", ()=>{ validatePhone(); validateForm(); });
fields.password.addEventListener("input", ()=>{ validatePassword(); validateForm(); });
fields.confirmPassword.addEventListener("input", ()=>{ validateConfirmPassword(); validateForm(); });
fields.country.addEventListener("change", ()=>{
  populateStates();
  validateDropdown("country");
  validatePhone();
  validateForm();
});
fields.state.addEventListener("change", ()=>{ populateCities(); validateDropdown("state"); validateForm(); });
fields.city.addEventListener("change", ()=>{ validateDropdown("city"); validateForm(); });
fields.terms.addEventListener("change", ()=>{ validateTerms(); validateForm(); });
document.querySelectorAll("input[name='gender']").forEach(r=>r.addEventListener("change", ()=>{ validateGender(); validateForm(); }));

function populateStates(){
  const c = fields.country.value;
  const stateEl = fields.state;
  stateEl.innerHTML = '<option value="">Select State</option>';
  fields.city.innerHTML = '<option value="">Select City</option>';
  if(!c || !countryStateCity[c]) return;
  Object.keys(countryStateCity[c]).forEach(s=>{
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    stateEl.appendChild(opt);
  });
}

function populateCities(){
  const c = fields.country.value;
  const s = fields.state.value;
  const cityEl = fields.city;
  cityEl.innerHTML = '<option value="">Select City</option>';
  if(!c || !s) return;
  const list = countryStateCity[c][s] || [];
  list.forEach(ci=>{
    const opt = document.createElement("option");
    opt.value = ci;
    opt.textContent = ci;
    cityEl.appendChild(opt);
  });
}

// form submit
regForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  messages.innerHTML = "";
  const ok = validateForm();
  if(!ok){
    showTopMessage("error","Please fix the highlighted fields and try again.");
    return;
  }
  // Simulate backend submission (here we just show success and reset)
  showTopMessage("success","Registration Successful! Your profile has been submitted successfully.");
  // capture form data (for potential ajax)
  const data = new FormData(regForm);
  // reset form
  regForm.reset();
  document.getElementById("pwMeter").value = 0;
  document.getElementById("pwStrength").textContent = "Strength: ";
  submitBtn.disabled = true;
});

// reset button
resetBtn.addEventListener("click", ()=>{
  regForm.reset();
  document.querySelectorAll(".error").forEach(s=>s.textContent = "");
  document.querySelectorAll(".invalid").forEach(i=>i.classList.remove("invalid"));
  document.getElementById("pwMeter").value = 0;
  document.getElementById("pwStrength").textContent = "Strength: ";
  submitBtn.disabled = true;
});

// initial call to ensure UI responds if used by automation
populateStates();
