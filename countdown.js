"use strict";

(() => {
    const deadlineElement = document.getElementById("launch-deadline");
    const statusElement = document.getElementById("countdown-status");

    const outputs = {
        days: document.getElementById("countdown-days"),
        hours: document.getElementById("countdown-hours"),
        minutes: document.getElementById("countdown-minutes"),
        seconds: document.getElementById("countdown-seconds")
    };

    let intervalId = null;

    function stopCountdown() {
        if (intervalId !== null) {
            window.clearInterval(intervalId);
            intervalId = null;
        }
    }

    function parseUtcDeadline(value) {
        // Accept an explicit UTC timestamp with whole seconds.
        const utcPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

        if (!utcPattern.test(value)) {
            return null;
        }

        const timestamp = Date.parse(value);

        if (!Number.isFinite(timestamp)) {
            return null;
        }

        // Reject dates that the parser silently normalizes.
        const normalized = new Date(timestamp).toISOString();

        if (normalized !== value.replace("Z", ".000Z")) {
            return null;
        }

        return timestamp;
    }

    const deadlineMs = parseUtcDeadline(
        deadlineElement.getAttribute("datetime") ?? ""
    );

    function writeUnits(days, hours, minutes, seconds) {
        outputs.days.textContent = String(days).padStart(2, "0");
        outputs.hours.textContent = String(hours).padStart(2, "0");
        outputs.minutes.textContent = String(minutes).padStart(2, "0");
        outputs.seconds.textContent = String(seconds).padStart(2, "0");
    }

    function renderCountdown() {
        if (deadlineMs === null) {
            writeUnits(0, 0, 0, 0);
            statusElement.textContent =
                "Countdown unavailable: invalid UTC deadline.";
            stopCountdown();
            return false;
        }

        // Always derive remaining time from the current clock.
        const remainingMs = Math.max(0, deadlineMs - Date.now());

        if (remainingMs === 0) {
            writeUnits(0, 0, 0, 0);
            statusElement.textContent = "The launch time has arrived.";
            stopCountdown();
            return false;
        }

        // Round up so zero is shown only when the deadline is reached.
        const totalSeconds = Math.ceil(remainingMs / 1000);

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        writeUnits(days, hours, minutes, seconds);
        statusElement.textContent = "Counting down to launch.";

        return true;
    }

    function startCountdown() {
        // Restart safely without accumulating intervals.
        stopCountdown();

        const isRunning = renderCountdown();

        if (isRunning && !document.hidden) {
            intervalId = window.setInterval(renderCountdown, 250);
        }
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopCountdown();
        } else {
            startCountdown();
        }
    });

    window.addEventListener("pagehide", stopCountdown);
    window.addEventListener("pageshow", startCountdown);

    startCountdown();
})();