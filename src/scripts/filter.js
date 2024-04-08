document.addEventListener('DOMContentLoaded', () => {
  const filterLabels = document.querySelectorAll('.section-blog__filter-label');
  const dropDownMenus = document.querySelectorAll('.section-blog__filter-dropdown');
  const searchInput = document.querySelector('.section-blog__filter-search input');
  const clearAllBtn = document.querySelector('.section-blog__filter-clear .section-blog__filter-clear-btn');

  // Toggle class active to the filter items
  filterLabels.forEach(label => {
    label.addEventListener('click', () => {
      label.parentElement.classList.toggle('active');
    });
  });

  // Toggle class active to the filter buttons and display relevant clear button
  dropDownMenus.forEach(dropdown => {
    const filterBtns = dropdown.querySelectorAll('button');
    const clearBtn = dropdown.querySelector('.section-blog__filter-clear-btn');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        // Check if any filter button in this dropdown is active and toggle clear button accordingly
        if (checkActiveFilters(dropdown)) {
          clearBtn.style.display = 'block';
          clearAllBtn.style.display = 'block';
        } 
        // filter resource items in the relevant dropdown menu
        filterResourceItems(dropdown);
      });
    });

    // Add event listener to clear button to remove active classes
    clearBtn.addEventListener('click', () => {
      filterBtns.forEach(btn => {
        btn.classList.remove('active');
      });
      clearBtn.style.display = 'none';
      filterResourceItems(dropdown);
      // Check if any filter button in any dropdown is active and toggle clear all button accordingly
      if(checkActiveFilters()){
        clearAllBtn.style.display = 'block';
      } else{
        clearAllBtn.style.display = 'none';
      }
    });
  });

  // Add event listener for clear all buttons
  clearAllBtn.addEventListener('click', clearAllFilters);

  // Add event listener for search input
  searchInput.addEventListener('input', () => {
    filterResourceItems();
    if (searchInput.value.trim() === '') {
      clearAllBtn.style.display = checkActiveFilters() ? 'block' : 'none';
    } else {
      clearAllBtn.style.display = 'block';
    }
  });
});

// Function to check if any filter button in a dropdown is active
function checkActiveFilters() {
  const allFilterBtns = document.querySelectorAll('.section-blog__filter-dropdown button');
  let activeFiltersCount = 0;
  allFilterBtns.forEach(btn => {
    if (btn.classList.contains('active')) {
      activeFiltersCount++;
    }
  });
  return activeFiltersCount > 0;
}

// Function to filter resource items based on active filter buttons and search input
function filterResourceItems() {
  const resourceItems = document.querySelectorAll('.section-blog__resources-item');
  let shouldShowAtLeastOne = false; // Flag to track if at least one item should be shown
  const searchInputValue = document.querySelector('.section-blog__filter-search input').value.trim().toLowerCase();

  resourceItems.forEach(item => {
    const title = item.querySelector('.section-blog__resources-item-title').textContent.toLowerCase();
    const datasetTopic = item.dataset.topic;
    const datasetType = item.dataset.type;
    const datasetIndustry = item.dataset.industry;

    const activeTopicFilters = Array.from(document.querySelectorAll('.section-blog__filter-item--topics button.active')).map(btn => btn.textContent);
    const activeTypeFilters = Array.from(document.querySelectorAll('.section-blog__filter-item--type button.active')).map(btn => btn.textContent);
    const activeIndustryFilters = Array.from(document.querySelectorAll('.section-blog__filter-item--industry button.active')).map(btn => btn.textContent);

    let shouldShow = true;

    // Check if item matches active topic filters
    if (activeTopicFilters.length > 0 && !activeTopicFilters.includes(datasetTopic)) {
      shouldShow = false;
    }

    // Check if item matches active type filters
    if (activeTypeFilters.length > 0 && !activeTypeFilters.includes(datasetType)) {
      shouldShow = false;
    }

    // Check if item matches active industry filters
    if (activeIndustryFilters.length > 0 && !activeIndustryFilters.includes(datasetIndustry)) {
      shouldShow = false;
    }

    // Check if item matches search input
    if (searchInputValue && !title.includes(searchInputValue)) {
      shouldShow = false;
    }

    // Show or hide the item based on filter matching
    if (shouldShow) {
      item.style.display = 'block';
      shouldShowAtLeastOne = true;
    } else {
      item.style.display = 'none';
    }
  });

  // Show or hide noArticlesMessage based on if at least one item should be shown
  const noArticlesMessage = document.querySelector('.section-blog__resources-message');
  if (!shouldShowAtLeastOne) {
    noArticlesMessage.style.display = 'block';
  } else {
    noArticlesMessage.style.display = 'none';
  }
}

// Function to clear all active filters
function clearAllFilters() {
  const allFilterBtns = document.querySelectorAll('.section-blog__filter-dropdown button');
  const clearAllBtn = document.querySelector('.section-blog__filter-clear .section-blog__filter-clear-btn');
  const searchInput = document.querySelector('.section-blog__filter-search input');

  allFilterBtns.forEach(btn => {
    btn.classList.remove('active');
  });

  // Hide all clear buttons
  const clearBtns = document.querySelectorAll('.section-blog__filter-clear-btn');
  clearBtns.forEach(btn => {
    btn.style.display = 'none';
  });

  // Clear search input and update resource items display
  searchInput.value = '';
  filterResourceItems();

  // Hide the clear all button
  clearAllBtn.style.display = 'none';
}