document.getElementById('start-button').addEventListener('click', function() {
    document.getElementById('btn-text').style.display = 'none';
    document.getElementById('btn-spinner').style.display = 'block';

    setTimeout(function() {
        document.getElementById('landing').classList.remove('active');
        document.getElementById('onboarding').classList.add('active');
    }, 1000);
});
/* this is the event listener for the second onboarding screen 
 and it is responsible for rotating the button animation */
document.getElementById('start-button2').addEventListener('click', function() {
    document.getElementById('btn-text2').style.display = 'none';
    document.getElementById('btn-spinner2').style.display = 'block';
// this is the timeout function that will remove the onboarding screen and add the next screen after 1 second
    setTimeout(function() {
        document.getElementById('onboarding').classList.remove('active');
        document.getElementById('onboarding-2').classList.add('active');
    }, 1000);
});