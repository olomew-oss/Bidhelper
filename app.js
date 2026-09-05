(function () {
  "use strict";

  /**
   * Optional Formspree endpoint, e.g. "https://formspree.io/f/xxxxxx".
   * Leave empty to store signups in localStorage only.
   */
  var FORM_ENDPOINT = "https://formspree.io/f/xoeqlbdg";

  var STORAGE_KEY = "bidhelper_waitlist";

  var form = document.getElementById("waitlist-form");
  var statusEl = document.getElementById("form-status");

  if (!form || !statusEl) return;

  function setStatus(message, type) {
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.classList.remove("is-success", "is-error");
    if (type) statusEl.classList.add(type);
  }

  function clearFieldErrors() {
    var fields = form.querySelectorAll(".is-invalid");
    for (var i = 0; i < fields.length; i++) {
      fields[i].classList.remove("is-invalid");
    }
  }

  function markInvalid(el) {
    if (el) el.classList.add("is-invalid");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function readEntries() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveLocal(entry) {
    var entries = readEntries();
    entries.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function validate() {
    clearFieldErrors();

    var name = form.elements.namedItem("name");
    var email = form.elements.namedItem("email");
    var role = form.elements.namedItem("role");
    var location = form.elements.namedItem("location");

    var ok = true;
    var firstInvalid = null;

    if (!name.value.trim()) {
      markInvalid(name);
      ok = false;
      firstInvalid = firstInvalid || name;
    }

    if (!email.value.trim() || !isValidEmail(email.value.trim())) {
      markInvalid(email);
      ok = false;
      firstInvalid = firstInvalid || email;
    }

    if (!role.value) {
      markInvalid(role);
      ok = false;
      firstInvalid = firstInvalid || role;
    }

    if (!location.value.trim()) {
      markInvalid(location);
      ok = false;
      firstInvalid = firstInvalid || location;
    }

    return { ok: ok, firstInvalid: firstInvalid };
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var result = validate();
    if (!result.ok) {
      setStatus("Please fill in all fields with a valid email.", "is-error");
      if (result.firstInvalid) result.firstInvalid.focus();
      return;
    }

    var payload = {
      name: form.elements.namedItem("name").value.trim(),
      email: form.elements.namedItem("email").value.trim(),
      role: form.elements.namedItem("role").value,
      location: form.elements.namedItem("location").value.trim(),
      submittedAt: new Date().toISOString(),
      _subject: "BidHelper waitlist signup",
    };

    var submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    function finishSuccess(message) {
      saveLocal(payload);
      setStatus(message, "is-success");
      form.reset();
      clearFieldErrors();
      if (submitBtn) submitBtn.disabled = false;
    }

    function finishError(message) {
      setStatus(message, "is-error");
      if (submitBtn) submitBtn.disabled = false;
    }

    if (!FORM_ENDPOINT) {
      finishSuccess("You're on the list. We'll be in touch when we launch near you.");
      return;
    }

    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        return res.json().catch(function () {
          return {};
        });
      })
      .then(function () {
        finishSuccess("You're on the list. We'll be in touch when we launch near you.");
      })
      .catch(function () {
        finishError("Couldn't send right now. Please try again in a minute.");
      });
  });
})();