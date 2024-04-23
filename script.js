$(document).ready(function () {
    let secretNumber = '';
    let timerInterval;

    $('#threeDigits').click(() => startGame(3));
    $('#fourDigits').click(() => startGame(4));

    function startGame(numDigits) {
        secretNumber = generateSecret(numDigits);
        $('#inputArea').empty().show();
        for (let i = 0; i < numDigits; i++) {
            $('<input>', {
                type: 'text',
                maxlength: '1',
                'data-index': i,
                class: 'form-control d-inline-block'
            }).appendTo('#inputArea');
        }
        setupInputListeners();
        $('#result').empty(); // Clear previous results
        startTimer(20); // Start with 20 seconds timer
    }

    function generateSecret(numDigits) {
        let secret = '';
        while (secret.length < numDigits) {
            secret += Math.floor(Math.random() * 10);
        }
        return secret;
    }

    function setupInputListeners() {
        $('input[type="text"]').on('input', function () {
            const $currentInput = $(this);
            const nextIndex = parseInt($currentInput.data('index')) + 1;
            if ($currentInput.val().length === 1) {
                if (nextIndex < $currentInput.parent().children().length) {
                    $('input[data-index="' + nextIndex + '"]').focus();
                } else {
                    // Check if all inputs are filled before submitting
                    if ($('input[type="text"]').map(function () { return $(this).val(); }).get().join('').length === $currentInput.parent().children().length) {
                        submitGuess();
                    }
                }
            }
        });
    }

    function submitGuess() {
        const guess = $('input[type="text"]').map(function () { return $(this).val(); }).get().join('');
        if (guess.length === $('input[type="text"]').length) { // Ensure full guess length matches required digits
            const feedback = checkGuess(guess);
            displayFeedback(guess, feedback);
            $('input[type="text"]').val(''); // Clear all inputs after submitting guess
            $('input[data-index="0"]').focus(); // Focus the first input after submitting
            if (feedback.every(color => color === 'green')) {
                alert('Parabéns! Você descobriu a sequência!');
                clearInterval(timerInterval);
            }
        }
    }

    function checkGuess(guess) {
        return guess.split('').map((digit, i) => {
            if (digit === secretNumber[i]) {
                return 'green';
            } else if (secretNumber.includes(digit)) {
                return 'yellow';
            } else {
                return 'gray';
            }
        });
    }

    function displayFeedback(guess, feedback) {
        const $result = $('#result');
        const $guessDisplay = $('<div>').addClass('guess-history');
        guess.split('').forEach((digit, index) => {
            $('<span>', {
                class: 'digit',
                text: digit,
                css: { backgroundColor: feedback[index] }
            }).appendTo($guessDisplay);
        });
        $guessDisplay.appendTo($result);
    }

    function startTimer(timeLimit) {
        let timeLeft = timeLimit;
        timerInterval = setInterval(() => {
            timeLeft--;
            $('#progressBar').css('width', (timeLeft / timeLimit * 100) + '%');
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert('Tempo esgotado! Jogo encerrado.');
            }
        }, 1000);
    }
});
