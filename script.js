// ================================================================
// SCRIPT.JS — SmartPrompt Studio
// Read every comment. This file controls all the interactivity.
// Build and understand each section before moving to the next.
// ================================================================


// ----------------------------------------------------------------
// 1. PROMPT LIBRARY DATA
// This is an array of objects. Each object = one prompt card.
// Properties: tag, tagLabel, title, text
// You can add more prompts by copying any object and editing it.
// ----------------------------------------------------------------
const prompts = [
  {
    tag: 'study',
    tagLabel: 'Study',
    title: 'Concept Explainer',
    text: 'Explain [TOPIC] to me as if I am a complete beginner. Use simple analogies, avoid jargon, and give 2 real-world examples. End with a 3-question quiz to test my understanding.'
  },
  {
    tag: 'study',
    tagLabel: 'Study',
    title: 'Study Plan Generator',
    text: 'Create a detailed 2-week study plan for [SUBJECT/EXAM]. Break it into daily 45-minute sessions, include revision days, and prioritise the most frequently tested topics first.'
  },
  {
    tag: 'study',
    tagLabel: 'Study',
    title: 'Feynman Technique',
    text: 'I want to learn [CONCEPT] using the Feynman Technique. First explain it in plain language a 10-year-old could understand, then identify gaps, and finally give me the full accurate version.'
  },
  {
    tag: 'career',
    tagLabel: 'Career',
    title: 'Cover Letter Writer',
    text: 'Write a compelling cover letter for a [JOB TITLE] role at [COMPANY]. My background: [BRIEF BACKGROUND]. Highlight enthusiasm, 3 relevant skills, and end with a strong call to action. Keep it under 300 words.'
  },
  {
    tag: 'career',
    tagLabel: 'Career',
    title: 'Interview Prep Coach',
    text: 'I have an interview for [JOB ROLE] in [X] days. Give me the 10 most likely interview questions, model answers using the STAR method, and 3 smart questions I can ask the interviewer.'
  },
  {
    tag: 'career',
    tagLabel: 'Career',
    title: 'LinkedIn Bio Writer',
    text: 'Write a professional LinkedIn About section for someone who is a [ROLE] with [X] years of experience in [INDUSTRY]. Make it first-person, conversational, and end with what I am open to.'
  },
  {
    tag: 'creative',
    tagLabel: 'Creative',
    title: 'Story Idea Generator',
    text: 'Generate 5 unique short story concepts in the [GENRE] genre. For each, give a one-line premise, the central conflict, and a surprising twist. Make each idea distinct and emotionally resonant.'
  },
  {
    tag: 'creative',
    tagLabel: 'Creative',
    title: 'Blog Post Outline',
    text: 'Create a detailed blog post outline for the topic "[TOPIC]". Include a hook introduction, 5 main sections with subpoints, data suggestions, and a strong conclusion with a call to action. Target audience: [AUDIENCE].'
  },
  {
    tag: 'creative',
    tagLabel: 'Creative',
    title: 'Email Subject Lines',
    text: 'Write 10 creative, high-converting email subject lines for a campaign about [TOPIC]. Mix curiosity-driven, benefit-led, and question-based approaches. Include open rate tips for each.'
  },
  {
    tag: 'business',
    tagLabel: 'Business',
    title: 'Startup Pitch',
    text: 'Write a compelling 60-second elevator pitch for a startup idea: [IDEA]. Include the problem, solution, target market, unique value proposition, and a memorable closing hook that would interest an investor.'
  },
  {
    tag: 'business',
    tagLabel: 'Business',
    title: 'SWOT Analysis',
    text: 'Conduct a detailed SWOT analysis for [BUSINESS/PRODUCT] operating in [INDUSTRY]. Be specific, realistic, and include at least 3 points per quadrant. Conclude with 2 strategic recommendations.'
  },
  {
    tag: 'business',
    tagLabel: 'Business',
    title: 'Social Media Strategy',
    text: 'Create a 30-day social media content strategy for [BRAND] targeting [AUDIENCE] on [PLATFORM]. Include content pillars, posting frequency, content type mix, and 5 sample post ideas with captions.'
  },
  {
    tag: 'code',
    tagLabel: 'Coding',
    title: 'Code Reviewer',
    text: 'Review the following [LANGUAGE] code for bugs, performance issues, and best practices. Explain each issue, rate severity (high/medium/low), and provide the corrected code with comments: [PASTE CODE]'
  },
  {
    tag: 'code',
    tagLabel: 'Coding',
    title: 'Bug Debugger',
    text: 'I have a bug in my [LANGUAGE] program. Expected behaviour: [X]. Actual behaviour: [Y]. Code: [CODE]. Walk me through debugging step by step, explaining the likely root cause.'
  },
  {
    tag: 'code',
    tagLabel: 'Coding',
    title: 'Tech Concept Explainer',
    text: 'Explain [TECH CONCEPT] with a clear definition, a simple real-world analogy, a minimal code example in [LANGUAGE], and when/why a developer would use it.'
  }
];


// ----------------------------------------------------------------
// 2. GLOBAL STATE VARIABLES
// These store the currently selected tone and format.
// When the user clicks a chip, we update these variables.
// Then generatePrompt() reads them to build the output.
// ----------------------------------------------------------------
let selectedTone   = 'professional'; // default tone
let selectedFormat = 'paragraph';    // default format
let activeFilter   = 'all';          // default library filter


// ----------------------------------------------------------------
// 3. INIT — runs when the page loads
// Calls all the setup functions in order.
// ----------------------------------------------------------------
function init() {
  buildFilterButtons(); // create filter buttons for library
  renderLibrary();      // display all prompt cards
  renderSaved();        // display saved prompts from localStorage
  setupChips();         // make tone/format chips clickable
  setupScrollReveal();  // animate elements as they scroll into view
}


// ================================================================
// SECTION A: PROMPT LIBRARY
// ================================================================

// ----------------------------------------------------------------
// buildFilterButtons()
// Creates the "All | Study | Career | ..." filter buttons
// and injects them into #filterRow in the HTML.
// ----------------------------------------------------------------
function buildFilterButtons() {
  // Define all categories and their display labels
  const categories = [
    { value: 'all',      label: 'All' },
    { value: 'study',    label: 'Study' },
    { value: 'career',   label: 'Career' },
    { value: 'creative', label: 'Creative' },
    { value: 'business', label: 'Business' },
    { value: 'code',     label: 'Coding' }
  ];

  // Get the container element from the HTML
  const filterRow = document.getElementById('filterRow');

  // Loop through each category and create a button
  categories.forEach(function(cat) {

    // Create a <button> element
    const btn = document.createElement('button');

    // Add the CSS class
    btn.className = 'filter-btn';

    // If this is the active filter, also add 'active' class
    if (cat.value === activeFilter) {
      btn.classList.add('active');
    }

    // Set the button text
    btn.textContent = cat.label;

    // When clicked, update filter and re-render cards
    btn.onclick = function() {
      // Update the active filter variable
      activeFilter = cat.value;

      // Remove 'active' class from ALL filter buttons
      document.querySelectorAll('.filter-btn').forEach(function(b) {
        b.classList.remove('active');
      });

      // Add 'active' class to THIS button
      btn.classList.add('active');

      // Re-render the library with the new filter
      renderLibrary();
    };

    // Add the button to the page
    filterRow.appendChild(btn);
  });
}


// ----------------------------------------------------------------
// renderLibrary()
// Reads the prompts array, filters by activeFilter,
// then builds and injects HTML cards into #libraryGrid.
// ----------------------------------------------------------------
function renderLibrary() {
  const grid = document.getElementById('libraryGrid');

  // Clear existing cards
  grid.innerHTML = '';

  // Filter the prompts array
  // If filter is 'all', show everything
  // Otherwise only show prompts where tag matches activeFilter
  const filtered = (activeFilter === 'all')
    ? prompts
    : prompts.filter(function(p) { return p.tag === activeFilter; });

  // Loop through filtered prompts and create a card for each
  filtered.forEach(function(p) {

    // Create a div for the card
    const card = document.createElement('div');
    card.className = 'prompt-card';

    // Build the inner HTML of the card
    // encodeURIComponent(p.text) safely encodes the prompt text
    // so it can be passed into the onclick attribute
    card.innerHTML = `
      <span class="prompt-card-tag tag-${p.tag}">${p.tagLabel}</span>
      <h4>${p.title}</h4>
      <p>${p.text}</p>
      <button class="card-copy-btn" onclick="copyCardPrompt(this, '${encodeURIComponent(p.text)}')">
        📋 Copy Prompt
      </button>
    `;

    // Add card to the grid
    grid.appendChild(card);
  });
}


// ----------------------------------------------------------------
// copyCardPrompt(btn, encodedText)
// Called when user clicks "Copy Prompt" on a library card.
// Decodes the text and copies it to clipboard.
// ----------------------------------------------------------------
function copyCardPrompt(btn, encodedText) {
  // Decode the URL-encoded text back to normal
  const text = decodeURIComponent(encodedText);

  // Use browser clipboard API to copy
  navigator.clipboard.writeText(text).then(function() {
    // Change button text to show success
    btn.textContent = '✅ Copied!';
    btn.classList.add('copied');

    // Show a toast notification
    showToast('Prompt copied to clipboard!');

    // Reset button after 2 seconds
    setTimeout(function() {
      btn.textContent = '📋 Copy Prompt';
      btn.classList.remove('copied');
    }, 2000);
  });
}


// ================================================================
// SECTION B: PROMPT BUILDER
// ================================================================

// ----------------------------------------------------------------
// setupChips()
// Makes the tone and format chip buttons clickable.
// Clicking a chip updates the global variable and adds CSS class.
// ----------------------------------------------------------------
function setupChips() {

  // Handle TONE chips
  const toneChips = document.querySelectorAll('#toneChips .chip');
  toneChips.forEach(function(chip) {
    chip.onclick = function() {
      // Remove 'active' from all tone chips
      toneChips.forEach(function(c) { c.classList.remove('active'); });
      // Add 'active' to clicked chip
      chip.classList.add('active');
      // Update the global variable
      // data-val is the attribute set in the HTML: data-val="professional"
      selectedTone = chip.dataset.val;
    };
  });

  // Handle FORMAT chips (same logic)
  const formatChips = document.querySelectorAll('#formatChips .chip');
  formatChips.forEach(function(chip) {
    chip.onclick = function() {
      formatChips.forEach(function(c) { c.classList.remove('active'); });
      chip.classList.add('active');
      selectedFormat = chip.dataset.val;
    };
  });
}


// ----------------------------------------------------------------
// generatePrompt()
// Called when user clicks "⚡ Generate Prompt" button.
// Reads all form values, builds a structured prompt string,
// and writes it into the output box with a typewriter effect.
// ----------------------------------------------------------------
function generatePrompt() {

  // Read values from the form
  const category  = document.getElementById('cat').value;
  const task      = document.getElementById('task').value.trim();
  const targetAI  = document.getElementById('targetAI').value;

  // Validation: task is required
  if (!task) {
    showToast('⚠️ Please describe your task first!');
    return; // stop the function here
  }

  // Map category to a role description
  // This makes the AI respond as an expert in that field
  const roleMap = {
    study:    'as a knowledgeable tutor',
    career:   'as an experienced career coach',
    creative: 'as a creative writing expert',
    business: 'as a seasoned business strategist',
    code:     'as an expert software engineer'
  };

  // Get the role hint, default to 'as a helpful expert' if no category
  const roleHint = roleMap[category] || 'as a helpful expert';

  // Build the format instruction based on selected format chip
  let formatInstruction = '';
  if (selectedFormat === 'bullet points') {
    formatInstruction = 'Format the response as bullet points.';
  } else if (selectedFormat === 'step-by-step') {
    formatInstruction = 'Structure the response as a clear step-by-step guide.';
  } else if (selectedFormat === 'table') {
    formatInstruction = 'Present the information in a structured table format.';
  } else {
    formatInstruction = 'Write in clear, well-structured paragraphs.';
  }

  // Build the final prompt string using template literals
  // Backtick strings (` `) allow you to embed variables with ${variable}
  const finalPrompt =
    `Act ${roleHint}.\n\nYour task: ${task}\n\nUse a ${selectedTone} tone throughout. ${formatInstruction} Be specific, accurate, and actionable. Avoid generic advice — tailor everything to the task above.\n\n[Optimised for use with ${targetAI}]`;

  // Get the output box element
  const outputBox = document.getElementById('outputBox');

  // Clear any previous content
  outputBox.textContent = '';

  // TYPEWRITER EFFECT:
  // We reveal the text one character at a time using setInterval.
  let i = 0;
  const interval = setInterval(function() {
    outputBox.textContent += finalPrompt[i]; // add next character
    i++;
    if (i >= finalPrompt.length) {
      clearInterval(interval); // stop when done
    }
  }, 8); // 8ms per character = fast but visible

  showToast('✅ Prompt generated!');
}


// ----------------------------------------------------------------
// copyPrompt()
// Copies the text currently in the output box to clipboard.
// ----------------------------------------------------------------
function copyPrompt() {
  const text = document.getElementById('outputBox').textContent;

  // Check there's actually a prompt generated (not the placeholder)
  if (!text || text.includes('appear here')) {
    showToast('⚠️ Generate a prompt first!');
    return;
  }

  navigator.clipboard.writeText(text).then(function() {
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✅ Copied!';
    showToast('Copied to clipboard!');

    setTimeout(function() {
      btn.textContent = '📋 Copy';
    }, 2000);
  });
}


// ----------------------------------------------------------------
// savePrompt()
// Saves the current output box text to localStorage.
// localStorage keeps data even after the browser is closed.
// ----------------------------------------------------------------
function savePrompt() {
  const text = document.getElementById('outputBox').textContent;

  if (!text || text.includes('appear here')) {
    showToast('⚠️ Generate a prompt first!');
    return;
  }

  // getSaved() returns the current array of saved prompts
  const saved = getSaved();

  // Prevent duplicates
  if (saved.includes(text)) {
    showToast('Already saved!');
    return;
  }

  // Add the new prompt to the array
  saved.push(text);

  // Save the updated array back to localStorage as a JSON string
  localStorage.setItem('sps_saved', JSON.stringify(saved));

  // Re-render the saved list on screen
  renderSaved();

  showToast('💾 Prompt saved!');
}


// ----------------------------------------------------------------
// clearOutput()
// Resets the output box back to the placeholder text.
// ----------------------------------------------------------------
function clearOutput() {
  document.getElementById('outputBox').innerHTML =
    '<span class="output-placeholder">Your crafted prompt will appear here…</span>';
}


// ================================================================
// SECTION C: SAVED PROMPTS
// ================================================================

// ----------------------------------------------------------------
// getSaved()
// Reads saved prompts from localStorage and returns them as array.
// If nothing is saved yet, returns an empty array.
// ----------------------------------------------------------------
function getSaved() {
  try {
    // localStorage stores strings, so we parse the JSON string back to array
    return JSON.parse(localStorage.getItem('sps_saved') || '[]');
  } catch (e) {
    return []; // if parsing fails, return empty array
  }
}


// ----------------------------------------------------------------
// renderSaved()
// Reads saved prompts and builds the HTML list on screen.
// ----------------------------------------------------------------
function renderSaved() {
  const list  = document.getElementById('savedList');
  const saved = getSaved();

  // Clear the existing list
  list.innerHTML = '';

  // If nothing saved, show an empty state message
  if (saved.length === 0) {
    list.innerHTML = '<div class="empty-state">No saved prompts yet. Build and save one above! ✨</div>';
    return;
  }

  // Loop through each saved prompt and create a row
  saved.forEach(function(text, index) {

    const item = document.createElement('div');
    item.className = 'saved-item';

    // Show a truncated preview (first 200 characters)
    const preview = text.length > 200 ? text.substring(0, 200) + '…' : text;

    item.innerHTML = `
      <div class="saved-text">${preview}</div>
      <button class="saved-del" onclick="deletePrompt(${index})" title="Delete">✕</button>
    `;

    list.appendChild(item);
  });
}


// ----------------------------------------------------------------
// deletePrompt(index)
// Removes a saved prompt by its index in the array.
// ----------------------------------------------------------------
function deletePrompt(index) {
  const saved = getSaved();

  // splice(index, 1) removes 1 item at position 'index'
  saved.splice(index, 1);

  // Save the updated array back to localStorage
  localStorage.setItem('sps_saved', JSON.stringify(saved));

  // Re-render the list
  renderSaved();

  showToast('Deleted!');
}


// ================================================================
// SECTION D: UI UTILITIES
// ================================================================

// ----------------------------------------------------------------
// showToast(message)
// Shows a small popup notification at the bottom right.
// Automatically disappears after 2.5 seconds.
// ----------------------------------------------------------------
function showToast(message) {
  const toast = document.getElementById('toast');

  // Set the text
  toast.textContent = message;

  // Add 'show' class to make it visible (CSS handles the animation)
  toast.classList.add('show');

  // Remove 'show' class after 2.5 seconds
  setTimeout(function() {
    toast.classList.remove('show');
  }, 2500);
}


// ----------------------------------------------------------------
// Theme Toggle
// Switches between dark mode and light mode.
// ----------------------------------------------------------------
document.getElementById('themeToggle').onclick = function() {
  // Toggle the 'light-mode' class on <body>
  document.body.classList.toggle('light-mode');

  // Update the button label based on current mode
  const isLight = document.body.classList.contains('light-mode');
  this.textContent = isLight ? '🌙 Dark' : '☀ Light';
};


// ----------------------------------------------------------------
// setupScrollReveal()
// Uses IntersectionObserver to detect when elements enter the screen.
// When they do, adds 'visible' class which triggers the CSS animation.
// ----------------------------------------------------------------
function setupScrollReveal() {
  // Create an observer that watches elements
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      // If element is on screen, add 'visible'
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1 // trigger when 10% of element is visible
  });

  // Watch all elements with class 'reveal'
  document.querySelectorAll('.reveal').forEach(function(el) {
    observer.observe(el);
  });
}


// ================================================================
// START THE APP
// Call init() when the page loads — this kicks everything off.
// ================================================================
init();