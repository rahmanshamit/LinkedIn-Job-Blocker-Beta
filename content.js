// Function to add a company to the "blocked" list in chrome.storage.local
function addToBlockedCompanies(companyName) {
  chrome.storage.local.get({ blockedCompanies: [] }, (data) => {
    const blockedCompanies = data.blockedCompanies;

    if (!blockedCompanies.includes(companyName)) {
      blockedCompanies.push(companyName);
      chrome.storage.local.set({ blockedCompanies }, () => {
        console.log(`Company added to blocked list: ${companyName}`);
        hideBlockedJobs(); // Immediately hide jobs for the newly blocked company
      });
    }
  });
}

// Function to clear old "Block" buttons and add a new one beside the company name
function insertBlockButton() {
  const companyNameContainer = document.querySelector(
    'div.job-details-jobs-unified-top-card__company-name'
  );

  if (companyNameContainer) {
    const companyNameElement = companyNameContainer.querySelector('a');

    if (companyNameElement) {
      const companyName = companyNameElement.innerText.trim();

      // Remove any existing Block button to avoid duplicates
      const existingButton = companyNameContainer.querySelector('.block-company-btn');
      if (existingButton) {
        existingButton.remove();
      }

      // Create the Block button
      const blockButton = document.createElement('button');
      blockButton.className = 'block-company-btn';
      blockButton.title = 'Block this company';

      // Styling
      blockButton.style.display = 'inline-flex';
      blockButton.style.alignItems = 'center';
      blockButton.style.padding = '4px 8px';
      blockButton.style.border = '1px solid #ccc';
      blockButton.style.borderRadius = '4px';
      blockButton.style.backgroundColor = '#f5f5f5';
      blockButton.style.color = '#333';
      blockButton.style.fontSize = '14px';
      blockButton.style.fontWeight = '500';
      blockButton.style.marginLeft = '8px';
      blockButton.style.cursor = 'pointer';

      // Add the block icon
      const blockIcon = document.createElement('img');
      blockIcon.src = chrome.runtime.getURL('icons/block-icon-48.png');
      blockIcon.alt = 'Block Icon';
      blockIcon.style.width = '16px';
      blockIcon.style.height = '16px';
      blockIcon.style.marginRight = '6px';

      // Add the "Block" text
      const blockText = document.createElement('span');
      blockText.innerText = 'Block';

      // Append the icon and text to the button
      blockButton.appendChild(blockIcon);
      blockButton.appendChild(blockText);

      // Add click event listener to store the company name
      blockButton.addEventListener('click', () => {
        addToBlockedCompanies(companyName);
        alert(`Blocked Company: ${companyName}`);
      });

      // Append the button to the company name container
      companyNameContainer.appendChild(blockButton);
    }
  }
}

// Function to hide all job postings from blocked companies
function hideBlockedJobs() {
  chrome.storage.local.get({ blockedCompanies: [] }, (data) => {
    const blockedCompanies = data.blockedCompanies;

    // Select all job list items in the jobs list
    const jobListItems = document.querySelectorAll('ul > li[data-occludable-job-id]'); // Target each job's <li>

    jobListItems.forEach((jobItem) => {
      // Find the company name within the job card
      const companyNameElement = jobItem.querySelector(
        '.artdeco-entity-lockup__subtitle span'
      );

      if (companyNameElement) {
        const companyName = companyNameElement.innerText.trim();

        // Hide the job list item if the company is in the blocked list
        if (blockedCompanies.includes(companyName)) {
          jobItem.style.display = 'none';
        } else {
          jobItem.style.display = ''; // Reset display for non-blocked jobs
        }
      }
    });
  });
}


// Function to monitor the job details pane for updates
function observeJobDetails() {
  const jobDetailsContainer = document.querySelector('div.jobs-search__job-details--container');

  if (!jobDetailsContainer) {
    console.warn('Job details container not found. Retrying...');
    setTimeout(observeJobDetails, 500);
    return;
  }

  let lastContentHash = '';

  const observer = new MutationObserver(() => {
    const currentHash = jobDetailsContainer.innerText;

    // Only update if the content has changed
    if (currentHash !== lastContentHash) {
      lastContentHash = currentHash; // Update hash
      insertBlockButton(); // Re-insert Block button
    }
  });

  // Observe changes to the job details container
  observer.observe(jobDetailsContainer, { childList: true, subtree: true });

  // Initial run
  insertBlockButton();
}

// Function to periodically check and hide blocked jobs
function periodicallyHideBlockedJobs() {
  hideBlockedJobs(); // Run once initially
  setInterval(hideBlockedJobs, 2000); // Check every 2 seconds for new jobs
}

// Start observing and hiding jobs
observeJobDetails(); // Observe changes in job details
periodicallyHideBlockedJobs(); // Periodically hide blocked jobs
