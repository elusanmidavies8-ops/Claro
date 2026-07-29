document.getElementById('start-button').addEventListener('click', function() {
    document.getElementById('btn-text').style.display = 'none';
    document.getElementById('btn-spinner').style.display = 'block';

    setTimeout(function() {
        document.getElementById('landing').classList.remove('active');
        document.getElementById('onboarding').classList.add('active');
    }, 1000);
});

document.getElementById('start-button2').addEventListener('click', function() {
    document.getElementById('btn-text').style.display = 'none';
    document.getElementById('btn-spinner').style.display = 'block';

    setTimeout(function() {
        document.getElementById('onboarding').classList.remove('active');
        document.getElementById('onboarding-2').classList.add('active');
    }, 1000);
});