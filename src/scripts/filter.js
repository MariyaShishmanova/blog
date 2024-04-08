document.addEventListener('DOMContentLoaded', () => {
  const filterLabels = document.querySelectorAll('.section-blog__filter-label');
  const dropDownMenus = document.querySelectorAll('.section-blog__filter-dropdown');

  // Function to check if any filter button in a dropdown is active
  function checkActiveFilters(dropdown) {
    const filterBtns = dropdown.querySelectorAll('button');
    let isActive = false;
    filterBtns.forEach(btn => {
      if (btn.classList.contains('active')) {
        isActive = true;
      }
    });
    return isActive;
  }

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
      btn.addEventListener("click", () => {
        btn.classList.toggle('active');
        // Check if any filter button in this dropdown is active and toggle clear button accordingly
        if (checkActiveFilters(dropdown)) {
          clearBtn.style.display = 'block';
        } else {
          clearBtn.style.display = 'none';
        }
      });
    });

    // Add event listener to clear button to remove active classes
    clearBtn.addEventListener('click', () => {
      filterBtns.forEach(btn => {
        btn.classList.remove('active');
      });
      clearBtn.style.display = 'none';
    });
  });
});