class BlogFilter {
  constructor() {
      // Store references to frequently accessed DOM elements
      this.filterLabels = document.querySelectorAll('.section-blog__filter-label');
      this.dropDownMenus = document.querySelectorAll('.section-blog__filter-dropdown');
      this.searchInput = document.querySelector('.section-blog__filter-search input');
      this.clearAllBtn = document.querySelector('.section-blog__filter-clear .section-blog__filter-clear-btn');
      this.resourceItems = document.querySelectorAll('.section-blog__resources-item');
      this.filterButtons = document.querySelectorAll('.section-blog__filter-dropdown button')

      // Initialize blog state
      this.blogState = {
          activeFilters: {
              topic: [],
              type: [],
              industry: []
          }
      };

      // Initialize event listeners
      this.initializeListeners();
  }

  initializeListeners() {
      document.addEventListener('DOMContentLoaded', () => {
          this.filterLabels.forEach(label => {
              label.addEventListener('click', () => {
                  label.parentElement.classList.toggle('active');
              });
          });

          this.dropDownMenus.forEach(dropdown => {
              const filterBtns = dropdown.querySelectorAll('button');
              const clearBtn = dropdown.querySelector('.section-blog__filter-clear-btn');

              filterBtns.forEach(btn => {
                  btn.addEventListener('click', () => {
                      this.toggleFilterButton(btn);
                      this.updateFiltersAndResourceItems();
                      this.toggleClearButton(clearBtn);
                  });
              });

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
      if (this.checkActiveFilters(dropdown)) {
          clearBtn.style.display = 'block';
          this.clearAllBtn.style.display = 'block';
      } else {
          clearBtn.style.display = 'none';
      }
  }

  updateFiltersAndResourceItems() {
      this.updateActiveFilters();
      this.filterResourceItems();
      this.toggleClearAllButton();
  }

  updateActiveFilters() {
      this.blogState.activeFilters = {
          topic: [],
          type: [],
          industry: []
      };

      this.dropDownMenus.forEach(dropdown => {
          const filterType = dropdown.dataset.filterType;
          const activeFilters = this.blogState.activeFilters[filterType];
          dropdown.querySelectorAll('button.active').forEach(btn => {
              activeFilters.push(btn.textContent);
          });
      });
  }

  toggleClearAllButton() {
      const shouldShowClearAllBtn = this.checkActiveFilters() || this.searchInput.value.trim() !== '';
      this.clearAllBtn.style.display = shouldShowClearAllBtn ? 'block' : 'none';
  }

  checkActiveFilters(dropdown) {
      const allFilterBtns = dropdown ? dropdown.querySelectorAll('button') : this.filterButtons;
      return Array.from(allFilterBtns).some(btn => btn.classList.contains('active'));
  }

  filterResourceItems() {
      const searchInputValue = this.searchInput.value.trim().toLowerCase();

      this.resourceItems.forEach(item => {
          const title = item.querySelector('.section-blog__resources-item-title').textContent.toLowerCase();
          const datasetTopic = item.dataset.topic;
          const datasetType = item.dataset.type;
          const datasetIndustry = item.dataset.industry;

          const activeFilters = this.blogState.activeFilters;
          const activeTopicFilters = activeFilters.topic;
          const activeTypeFilters = activeFilters.type;
          const activeIndustryFilters = activeFilters.industry;

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

      this.showOrHideNoArticlesMessage();
  }

  clearFilterButtons(filterBtns) {
      filterBtns.forEach(btn => {
          btn.classList.remove('active');
      });
  }

  clearAllFilters() {
      this.filterButtons.forEach(btn => {
          btn.classList.remove('active');
      });

      this.dropDownMenus.forEach(dropdown => {
          const clearBtn = dropdown.querySelector('.section-blog__filter-clear-btn');
          this.clearFilterButtons(Array.from(dropdown.querySelectorAll('button.active')));
          this.toggleClearButton(clearBtn);
      });

      this.searchInput.value = '';
      this.updateFiltersAndResourceItems();
  }

  showOrHideNoArticlesMessage() {
      const shouldShowAtLeastOne = Array.from(this.resourceItems).some(item => item.style.display === 'block');
      const noArticlesMessage = document.querySelector('.section-blog__resources-message');
      noArticlesMessage.style.display = shouldShowAtLeastOne ? 'none' : 'block';
  }
}

const blogFilter = new BlogFilter();