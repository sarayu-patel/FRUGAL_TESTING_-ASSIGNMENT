This project implements a validated Registration Form using HTML/CSS/JS and a Selenium automation suite to test negative, positive, and logic flows. The automation captures screenshots, validates UI behavior, and saves DOM snapshots.


IntelligentRegistrationSystem/
│── index.html
│── styles.css
│── script.js
│── automation/
│     ├── selenium_test.py
│     └── automation_outputs/
│           ├── error-state.png
│           ├── error-state.html
│           ├── success-state.png
│           ├── success-state.html
│           └── flowC-state.html
│── README.md

Technologies:
  -HTML, CSS, JavaScript
  -Python, Selenium WebDriver
  -WebDriver-Manager
  -Chrome Browser

Features:
  -Required fields with inline validation
  -Email validation (blocks disposable domains)
  -Phone validation (country-based)
  -Gender selection
  -Dynamic Country → State → City dropdowns
  -Password strength meter
  -Confirm password validation
  -Submit button disabled until form is valid
  -Success message on valid submission

Install Dependencies:
  1.pip install selenium webdriver-manager pillow
  2.python .\automation\selenium_test.py --url "file:///C:/Users/pitta/Downloads/IntelligentRegistrationSystem/IntelligentRegistrationSystem/index.html"
  3.Headless mode:
  python .\automation\selenium_test.py --url "file:///C:/Users/pitta/Downloads/IntelligentRegistrationSystem/IntelligentRegistrationSystem/index.html" --headless


Automation Outputs:

-Generated in:
  automation/automation_outputs/

    -error-state.png → Negative flow screenshot
    -error-state.html
    -success-state.png → Positive flow screenshot
    -success-state.html
    -flowC-state.html

  Automation Flow Summary:

  Flow A – Negative

    -Last Name intentionally skipped
    -Inline error appears
    -Error field highlighted
    -Screenshot saved → error-state.png

  Flow B – Positive
    -All valid fields entered
    -T&C checked
    -Forced submit if disabled
    -Real success or injected success banner captured
    -Screenshot → success-state.png
    
  Flow C – Logic Checks

    -Country → State → City change verified
    -Password strength meter tested
    -Confirm password mismatch validated
    -Submit enable/disable tested
    -Snapshot → flowC-state.html
