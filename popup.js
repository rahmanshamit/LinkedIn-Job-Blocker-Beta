document.addEventListener('DOMContentLoaded', () => {
  const companyList = document.getElementById('companyList');

  // Function to load blocked companies
  function loadBlockedCompanies() {
    chrome.storage.local.get({ blockedCompanies: [] }, (data) => {
      const blockedCompanies = data.blockedCompanies;

      // Clear the list before re-populating
      companyList.innerHTML = '';

      // Populate the list
      blockedCompanies.forEach((company, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'company-item';

        const companyName = document.createElement('span');
        companyName.textContent = company;

        const unblockButton = document.createElement('button');
        unblockButton.textContent = 'Unblock';
        unblockButton.className = 'unblock-btn';
        unblockButton.addEventListener('click', () => {
          removeFromBlockedCompanies(index);
        });

        listItem.appendChild(companyName);
        listItem.appendChild(unblockButton);
        companyList.appendChild(listItem);
      });
    });
  }

  // Function to remove a company from the blocked list
  function removeFromBlockedCompanies(index) {
    chrome.storage.local.get({ blockedCompanies: [] }, (data) => {
      const blockedCompanies = data.blockedCompanies;

      // Remove the company at the specified index
      blockedCompanies.splice(index, 1);

      chrome.storage.local.set({ blockedCompanies }, () => {
        console.log('Company removed from blocked list');
        loadBlockedCompanies(); // Refresh the list
      });
    });
  }

  // Initial load
  loadBlockedCompanies();
});


