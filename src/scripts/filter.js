class BlogFilter {
  constructor() {
    // Initialize blog state
    this.blogState = {
      activeFilters: {
        topic: [],
        type: [],
        industry: [],
        search: ''
      },
      items: [],
      filteredItems: []
    };

    // Initialize event listeners
    this.initializeListeners();
  }

  getDomElements() {
    this.filterLabels = document.querySelectorAll('.section-blog__filter-label');
    this.dropDownMenus = document.querySelectorAll('.section-blog__filter-dropdown');
    this.searchInput = document.querySelector('.section-blog__filter-search input');
    this.clearAllBtn = document.querySelector('.section-blog__filter-clear .section-blog__filter-clear-btn');
    this.resourceItems = document.querySelectorAll('.section-blog__resources-item');
    this.filterButtons = document.querySelectorAll('.section-blog__filter-dropdown button');
  }

  handleInitialState() {
    this.blogState.items = Array.from(this.resourceItems);
    this.blogState.filteredItems = this.blogState.items;

    this.updateFiltersAndResourceItems();
  }

  initializeListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.getDomElements();
      this.handleInitialState();

      this.filterLabels.forEach(label => {
        label.addEventListener('click', () => {
          label.parentElement.classList.toggle('active');
        });
      });

      this.dropDownMenus.forEach(dropdown => {
        const filterBtns = dropdown.querySelectorAll('button');
        const clearBtn = dropdown.querySelector('.section-blog__filter-clear-btn');
        const { filterType } = dropdown.dataset;

        if (filterBtns.length > 0) {
          filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
              this.handleButtonFiltersClick(filterType, btn.dataset.filterName);
              this.toggleFilterButton(btn);
              this.handleDropdownClearButtonVisibility(filterType, clearBtn);
            });
          });
        }

        clearBtn.addEventListener('click', () => {
          this.clearFilterButtons(filterBtns);
          this.updateFiltersAndResourceItems();
          this.toggleClearButton(clearBtn);
        });
      });

      this.clearAllBtn.addEventListener('click', () => {
        this.clearAllFilters();
      });

      this.searchInput.addEventListener('input', () => {
        this.updateFiltersAndResourceItems();
      });
    });
  }

  toggleFilterButton(btn) {
    btn.classList.toggle('active');
  }

  toggleClearButton(clearBtn) {
    const dropdown = clearBtn.closest('.section-blog__filter-dropdown');
    if (this.getActiveDropdownButtons(dropdown)) {
      clearBtn.style.display = 'block';
      this.clearAllBtn.style.display = 'block';
    } else {
      clearBtn.style.display = 'none';
    }
  }

  updateFiltersAndResourceItems() {
    this.blogState.activeFilters.search = this.searchInput.value.trim().toLowerCase();
    this.filterResourceItems();
    this.toggleClearAllButton();
  }

  clearActiveFilters() {
    this.blogState.activeFilters = {
      topic: [],
      type: [],
      industry: []
    };
  }

  handleButtonFiltersClick(filterType, name) {
    const activeFilters = this.blogState.activeFilters[filterType];
    const filterIndex = activeFilters.indexOf(name);

    if (filterIndex === -1) {
      activeFilters.push(name);
    } else {
      activeFilters.splice(filterIndex, 1);
    }

    // Update filters and resource items immediately after a filter button is clicked
    this.updateFiltersAndResourceItems();
  }

  handleDropdownClearButtonVisibility(filterType, button) {
    const activeFilters = this.blogState.activeFilters[filterType];

    button.style.display = activeFilters.length > 0 ? 'block' : 'none';
  }

  toggleClearAllButton() {
    const shouldShowClearAllBtn = this.getActiveDropdownButtons() || this.searchInput.value.trim() !== '';
    this.clearAllBtn.style.display = shouldShowClearAllBtn ? 'block' : 'none';
  }

  getActiveDropdownButtons(dropdown) {
    const allFilterBtns = dropdown ? dropdown.querySelectorAll('button') : this.filterButtons;
    return Array.from(allFilterBtns).some(btn => btn.classList.contains('active'));
  }

  filterResourceItems() {
    const searchInputValue = this.blogState.activeFilters.search;
    this.resourceItems.forEach(item => {
      const title = item.querySelector('.section-blog__resources-item-title').textContent.toLowerCase();
      const { dataset: { topic: datasetTopic, type: datasetType, industry: datasetIndustry } } = item;
      const {topic:activeTopicFilters, type: activeTypeFilters, industry: activeIndustryFilters} = this.blogState.activeFilters;

      let shouldShow = true;

      if (activeTopicFilters.length > 0 && !activeTopicFilters.includes(datasetTopic)) {
        shouldShow = false;
      }

      if (activeTypeFilters.length > 0 && !activeTypeFilters.includes(datasetType)) {
        shouldShow = false;
      }

      if (activeIndustryFilters.length > 0 && !activeIndustryFilters.includes(datasetIndustry)) {
        shouldShow = false;
      }

      if (searchInputValue && !title.includes(searchInputValue)) {
        shouldShow = false;
      }

      item.style.display = shouldShow ? 'block' : 'none';
    });

    this.handleNoResults(this.blogState.items.filter(item => item.style.display === 'block'));
  }

  clearFilterButtons(filterBtns) {
    const dropdown = filterBtns[0].closest('.section-blog__filter-dropdown');
    const filterType = dropdown.dataset.filterType;

    filterBtns.forEach(btn => {
      btn.classList.remove('active');
    });

    // Clear active filters for the specific dropdown
    this.blogState.activeFilters[filterType] = [];
    // Update filters and resource items immediately after clearing filters
    this.updateFiltersAndResourceItems();
  }

  removeActiveClassFromFilterButtons() {
    this.filterButtons.forEach(btn => {
      btn.classList.remove('active');
    });
  }

  clearAllClearButtons() {
    this.dropDownMenus.forEach(dropdown => {
      const clearBtn = dropdown.querySelector('.section-blog__filter-clear-btn');
      clearBtn.style.display = 'none';
    });
  }

  clearAllFilters() {
    this.removeActiveClassFromFilterButtons();
    this.clearAllClearButtons();
    this.clearActiveFilters();
    this.searchInput.value = '';
    this.updateFiltersAndResourceItems();
  }

  handleNoResults(visibleItems) {
    const noArticlesMessage = document.querySelector('.section-blog__resources-message');
    visibleItems.length === 0 ? (noArticlesMessage.style.display = 'block') : (noArticlesMessage.style.display = 'none');
  }
}

new BlogFilter();
