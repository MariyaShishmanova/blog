class BlogFilter {
    constructor() {


        // Initialize blog state
        this.blogState = {
            activeFilters: {
                topic: [],
                type: [],
                industry: []
            },
            items: [],
            filteredItems: [],
        };

        // Initialize event listeners
        this.initializeListeners();
    }

    getDomElements() {
        // Store references to frequently accessed DOM elements
        this.filterLabels = document.querySelectorAll('.section-blog__filter-label');
        this.dropDownMenus = document.querySelectorAll('.section-blog__filter-dropdown');
        this.searchInput = document.querySelector('.section-blog__filter-search input');
        this.clearAllBtn = document.querySelector('.section-blog__filter-clear .section-blog__filter-clear-btn');
        this.resourceItems = document.querySelectorAll('.section-blog__resources-item');
        this.filterButtons = document.querySelectorAll('.section-blog__filter-dropdown button')
    }

    handleInitialState() {
        this.blogState.items = Array.from(document.querySelectorAll('.section-blog__resources-item'));
        this.blogState.filteredItems = this.blogState.items;
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
        if (this.checkActiveFilters(dropdown)) {
            clearBtn.style.display = 'block';
            this.clearAllBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
    }

    updateFiltersAndResourceItems() {
        this.filterResourceItems();
        // this.toggleClearAllButton();
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
    }

    handleDropdownClearButtonVisibility(filterType, button) {
        const activeFilters = this.blogState.activeFilters[filterType];

        button.style.display = activeFilters.length > 0 ? 'block' : 'none';
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

        this.handleNoResults(this.resourceItems.filter(item => item.style.display === 'block'));
    }


    clearFilterButtons(filterBtns) {
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
        });
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

        this.searchInput.value = '';

        this.filterResourceItems();
    }

    handleNoResults(visibleItems) {
        visibleItems.length === 0 ? noArticlesMessage.style.display = 'block' : noArticlesMessage.style.display = 'none';
    }
}

const blogFilter = new BlogFilter();