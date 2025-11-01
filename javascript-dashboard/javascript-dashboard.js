'use strict';

(function () {
  function addContentArea(wrapper = null) {
    if (!wrapper) {
      return;
    }
    const area = document.createElement('div');
    area.className = 'dashboard-content-area';
    wrapper.appendChild(area);
  }

  function createWidget(wrapper = null) {
    if (!wrapper) {
      return;
    }
    const widget = document.createElement('div');
    widget.className = 'dashboard-widget';
    widget.setAttribute('draggable', true);
    widget.innerHTML = `<h2 contenteditable>Title</h2><p contenteditable>Content</p>`;
    wrapper.appendChild(widget);
  }

  function dragWidgets(wrapper = null) {
    if (!wrapper) {
      return;
    }
    const containers = wrapper.querySelectorAll('.dashboard-content-area');
    wrapper.addEventListener('dragstart', (e) => {
        
        if (e.target && e.target.classList.contains('dashboard-widget')) {
          e.target.classList.add('dragged');
          e.dataTransfer.effectAllowed = 'move';
        }
      });
    for (const container of containers) {
      

      container.addEventListener('dragend', (e) => {
        e.preventDefault();
      });

      container.addEventListener('dragover', (e) => {
        e.preventDefault();
      });

      container.addEventListener('drop', (e) => {
        const draggedEl = document.querySelector('.dragged');
        if (draggedEl) {
          const copy = draggedEl.cloneNode(true);
          copy.classList.remove('dragged');
          container.appendChild(copy);
          draggedEl.remove();
        }
        e.preventDefault();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const dashboardContent = document.getElementById('dashboard-content');
    const addWidgetBtn = document.getElementById('add-widget-btn');
    for (let i = 0; i < 3; i++) {
      addContentArea(dashboardContent);
    }
    addWidgetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      createWidget(dashboardContent);
    });

    dragWidgets(dashboardContent);
    
  });
})();
