"use strict";

(() => {
    const form = document.getElementById("signup-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const submitButton = document.getElementById("submit-button");
    const statusElement = document.getElementById("form-status");

    const transitions = {
        idle: ["submitting"],
        submitting: ["success", "error"],
        error: ["submitting"],
        success: []
    };

    let state = "idle";
    let requestCount = 0;

    function renderState(message) {
        const isSubmitting = state === "submitting";
        const isLocked = isSubmitting || state === "success";

        form.dataset.state = state;
        form.setAttribute("aria-busy", String(isSubmitting));

        nameInput.disabled = isLocked;
        emailInput.disabled = isLocked;
        submitButton.disabled = isLocked;

        const buttonLabels = {
            idle: "Join the waitlist",
            submitting: "Submitting...",
            success: "Signup complete",
            error: "Try again"
        };

        submitButton.textContent = buttonLabels[state];
        statusElement.textContent = message;
    }

    function transitionTo(nextState, message) {
        if (!transitions[state].includes(nextState)) {
            throw new Error(
                `Invalid form transition: ${state} -> ${nextState}`
            );
        }

        state = nextState;
        renderState(message);
    }

    function simulateSignup(email) {
        requestCount += 1;
        console.info(`Mock signup request #${requestCount}`);

        return new Promise((resolve, reject) => {
            window.setTimeout(() => {
                if (email.toLowerCase() === "error@example.com") {
                    reject(new Error("Simulated signup failure."));
                    return;
                }

                resolve();
            }, 1500);
        });
    }
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");

// Use custom validation messages after JavaScript initializes.
form.noValidate = true;

function validateInputs() {
    nameInput.value = nameInput.value.trim();
    emailInput.value = emailInput.value.trim();

    let nameMessage = "";
    let emailMessage = "";

    if (nameInput.value.length === 0) {
        nameMessage = "Please enter your name.";
    } else if (nameInput.value.length > 80) {
        nameMessage = "Your name must contain at most 80 characters.";
    }

    if (emailInput.value.length === 0) {
        emailMessage = "Please enter your email.";
    } else if (emailInput.value.length > 254) {
        emailMessage = "Your email must contain at most 254 characters.";
    } else if (emailInput.validity.typeMismatch) {
        emailMessage = "Please enter a valid email address.";
    }

    nameError.textContent = nameMessage;
    emailError.textContent = emailMessage;

    nameInput.setAttribute("aria-invalid", String(Boolean(nameMessage)));
    emailInput.setAttribute("aria-invalid", String(Boolean(emailMessage)));

    if (nameMessage || emailMessage) {
        statusElement.textContent = "Please correct the highlighted fields.";

        if (nameMessage) {
            nameInput.focus();
        } else {
            emailInput.focus();
        }

        return false;
    }

    return true;
}
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Guard before starting any asynchronous work.
        if (state === "submitting" || state === "success") {
            return;
        }

        if (!validateInputs()) {
            return;
        }

        const submittedName = nameInput.value.trim();
        const submittedEmail = emailInput.value.trim();

        transitionTo("submitting", "Submitting your simulated signup...");

        try {
            await simulateSignup(submittedEmail);

            transitionTo(
                "success",
                `Thank you, ${submittedName}! Your simulated signup succeeded. No data was sent to a server.`
            );
        } catch {
            transitionTo(
                "error",
                "The simulated signup failed. Check your details and try again."
            );
        }
    });

    renderState("Ready. Enter your details to try the simulated signup.");
})();