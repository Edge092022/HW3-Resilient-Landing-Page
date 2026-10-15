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

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Guard before starting any asynchronous work.
        if (state === "submitting" || state === "success") {
            return;
        }

        if (!form.reportValidity()) {
            return;
        }

        const submittedName = nameInput.value.trim();
        const submittedEmail = emailInput.value.trim();

        if (submittedName.length === 0) {
            statusElement.textContent = "Please enter your name.";
            nameInput.focus();
            return;
        }

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