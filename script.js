// Find the landing page start button in the HTML.
const landingButton = document.getElementById('start-button');
// Find the onboarding step buttons by their IDs.
const step1Button = document.getElementById('start-button2');
const step2Button = document.getElementById('start-button3');
const step3Button = document.getElementById('start-button4');
const step4Button = document.getElementById('start-button5');
const step5Button = document.getElementById('start-button6');
// toggleSpinner shows or hides the spinner and text inside a button.
// visible === true means show the spinner and hide the text.
function toggleSpinner(button, textId, spinnerId, visible) {
    document.getElementById(textId).style.display = visible ? 'none' : 'block';
    document.getElementById(spinnerId).style.display = visible ? 'block' : 'none';
}

// When the landing button is clicked, start the animation and move to onboarding.
landingButton.addEventListener('click', function() {
    toggleSpinner(landingButton, 'btn-text', 'btn-spinner', true);

    // Wait 1 second before switching visible screens.
    setTimeout(function() {
        document.getElementById('landing').classList.remove('active');
        document.getElementById('onboarding').classList.add('active');
    }, 1000);
});

// updateRadioButtonState enables a button only when one option in the radio group is selected.
function updateRadioButtonState(name, button) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    button.disabled = !checked; // disabled if nothing is selected
}

// updateCheckboxButtonState enables a button when the required number of checkboxes are selected.
// It can also disable unchecked options when the maximum allowed selection is reached.
function updateCheckboxButtonState(name, button, minRequired = 1, maxAllowed = Infinity) {
    const inputs = document.querySelectorAll(`input[name="${name}"]`);
    const checkedCount = Array.from(inputs).filter(input => input.checked).length;

    // disable the button until enough items are checked
    button.disabled = checkedCount < minRequired;

    if (maxAllowed !== Infinity) {
        inputs.forEach(input => {
            if (!input.checked) {
                input.disabled = checkedCount >= maxAllowed; // prevent extra selection
            } else {
                input.disabled = false; // keep already selected items enabled
            }
        });
    }
}

// Step 1: watch the status radio inputs to enable the continue button.
const step1Inputs = document.querySelectorAll('input[name="status"]');
step1Inputs.forEach(input => {
    input.addEventListener('change', () => updateRadioButtonState('status', step1Button));
});
// Set initial state on page load.
updateRadioButtonState('status', step1Button);

// Step 2: watch the priority checkboxes and allow 1 to 3 selections.
const step2Inputs = document.querySelectorAll('input[name="priority"]');
step2Inputs.forEach(input => {
    input.addEventListener('change', () => updateCheckboxButtonState('priority', step2Button, 1, 3));
});
updateCheckboxButtonState('priority', step2Button, 1, 3);

// Step 3: watch the hours radio inputs to enable the final continue button.
const step3Inputs = document.querySelectorAll('input[name="hours"]');
step3Inputs.forEach(input => {
    input.addEventListener('change', () => updateRadioButtonState('hours', step3Button));
});
updateRadioButtonState('hours', step3Button);

// Step 4: watch the challenge radios and allow one selection only.
const step4Inputs = document.querySelectorAll('input[name="goal"]');
step4Inputs.forEach(input => {
    input.addEventListener('change', () => updateRadioButtonState('goal', step4Button));
});
updateRadioButtonState('goal', step4Button);

// When step 1 continues, show spinner and move to step 2.
step1Button.addEventListener('click', function() {
    toggleSpinner(step1Button, 'btn-text2', 'btn-spinner2', true);

    setTimeout(function() {
        document.getElementById('onboarding').classList.remove('active');
        document.getElementById('onboarding-2').classList.add('active');
    }, 1000);
});

// When step 2 continues, show spinner and move to step 3.
step2Button.addEventListener('click', function() {
    toggleSpinner(step2Button, 'btn-text3', 'btn-spinner3', true);

    setTimeout(function() {
        document.getElementById('onboarding-2').classList.remove('active');
        document.getElementById('onboarding-3').classList.add('active');
    }, 1000);
});

// When step 3 continues, show spinner then move to the fourth onboarding screen.
step3Button.addEventListener('click', function() {
    toggleSpinner(step3Button, 'btn-text4', 'btn-spinner4', true);

    setTimeout(function() {
        document.getElementById('onboarding-3').classList.remove('active');
        document.getElementById('onboarding-4').classList.add('active');
    }, 1000);
});
// When step 4 continues, show spinner then move to the fifth onboarding screen.
step4Button.addEventListener('click', function() {
    toggleSpinner(step4Button, 'btn-text5', 'btn-spinner5', true);

    setTimeout(function() {
        document.getElementById('onboarding-4').classList.remove('active');
        document.getElementById('onboarding-5').classList.add('active');
    }, 1000);
});
// this is step 5 onboarding 6
step5Button.addEventListener('click', function() {
    toggleSpinner(step5Button, 'btn-text6', 'btn-spinner6', true);

    const nameInput = document.getElementById('txt-input');
    const greeting = document.getElementById('greetings');
    const planText = document.getElementById('plan-txt');
    const timetable = document.getElementById('timetable');
    const progressFill = document.getElementById('progress-fill');
    const growthStatus = document.getElementById('growth-status');
    const growthCount = document.getElementById('growth-count');
    const nameValue = nameInput.value.trim();
    const selectedStatus = document.querySelector('input[name="status"]:checked');
    const selectedHours = document.querySelector('input[name="hours"]:checked');
    const selectedPriorities = Array.from(document.querySelectorAll('input[name="priority"]:checked'));

    if (nameValue) {
        greeting.textContent = `Hello, ${nameValue} 👋`;
    } else {
        greeting.textContent = 'Hello, Friend';
    }

    const statusText = selectedStatus ? selectedStatus.parentElement.textContent.trim() : 'Your profile';
    const hourLabels = {
        'less-than-2': 'Less than 2 hours',
        '2-to-4': '2 to 4 hours',
        '4-to-6': '4 to 6 hours',
        'more-than-6': 'More than 6 hours'
    };
    const hoursText = selectedHours ? (hourLabels[selectedHours.value] || selectedHours.value) : 'No hours selected';

    planText.textContent = `${statusText} · ${hoursText} free daily`;

    const priorityThemes = selectedPriorities.length
        ? selectedPriorities.map(item => item.parentElement.textContent.trim())
        : ['Personal growth'];

    const dayPlans = {
        Mon: ['Morning focus block', 'Review your top goal', 'Set one 25-minute sprint', 'Write one winning insight', 'Close the day with a reset'],
        Tue: ['Deep work block', 'Learn one small thing', 'Practice a skill', 'Take a thoughtful break', 'Note what felt hard'],
        Wed: ['Movement break', 'Clear one distraction', 'Check your priorities', 'Protect your energy', 'Plan the next step'],
        Thu: ['Skill practice', 'Finish one important task', 'Review your progress', 'Prep tomorrow early', 'Celebrate one win'],
        Fri: ['Weekly review', 'Reflect on your week', 'Clear your workspace', 'Set one next action', 'Give yourself credit'],
        Sat: ['Restore and recharge', 'Do light growth work', 'Enjoy a calm habit', 'Reconnect with your purpose', 'Keep the momentum gentle'],
        Sun: ['Prepare the week ahead', 'Choose your focus', 'Plan your energy', 'Write one intention', 'Rest with clarity']
    };

    const weekItems = Object.entries(dayPlans).map(([day, tasks]) => {
        const taskMarkup = tasks.map(task => `<label class="task-item"><input type="checkbox" class="task-checkbox"> <span>${task}</span></label>`).join('');
        return `
            <div class="timetable-item">
                <details open>
                    <summary>${day}</summary>
                    <div class="task-list">${taskMarkup}</div>
                </details>
            </div>`;
    });

    timetable.innerHTML = weekItems.join('');

    const taskCheckboxes = Array.from(timetable.querySelectorAll('.task-checkbox'));
    const totalTasks = taskCheckboxes.length;

    function updateGrowthProgress() {
        const completedTasks = taskCheckboxes.filter(input => input.checked).length;
        const progressPercent = Math.round((completedTasks / totalTasks) * 100);

        progressFill.style.width = `${progressPercent}%`;
        growthCount.textContent = `${completedTasks} of ${totalTasks} tasks complete`;

        growthStatus.textContent = progressPercent >= 80
            ? 'You are building strong momentum.'
            : progressPercent >= 50
                ? 'You are staying consistent and growing.'
                : 'You are laying strong foundations for growth.';
    }

    taskCheckboxes.forEach(input => input.addEventListener('change', updateGrowthProgress));
    updateGrowthProgress();

    setTimeout(function() {
        document.getElementById('onboarding-5').classList.remove('active');
        document.getElementById('loading').classList.add('active');
    }, 1000);

    setTimeout(function() {
        document.getElementById('loading').classList.remove('active');
        document.getElementById('onboarding-7').classList.add('active');
    }, 2500);
});