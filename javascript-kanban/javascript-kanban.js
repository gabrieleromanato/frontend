'use strict';

(function() {
    

    function createTextContent(parts = 5) {
        const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.,Pellentesque malesuada magna nec nisl porttitor, tempor congue sapien ullamcorper.,Nam id magna quis turpis gravida elementum id nec odio.,Nunc auctor augue eu orci fermentum efficitur.,Aliquam efficitur lectus et cursus accumsan.,Fusce egestas tellus vel mauris tincidunt mattis.,Praesent sit amet justo in lectus accumsan egestas et at enim.,Nullam volutpat orci a neque pulvinar, at dictum ex pellentesque.,Fusce vitae dolor id urna vehicula scelerisque.,Integer lacinia nulla ut odio aliquet, eget faucibus mauris mattis.,Donec in est vel quam porttitor sagittis eu pellentesque lectus.,Fusce auctor enim vitae nisl gravida mattis.,Morbi laoreet est ut sodales ultricies.,Nunc et massa quis est porttitor condimentum sit amet maximus mi.,Nunc ac libero porta, consequat est in, bibendum eros.,Donec faucibus quam eu leo aliquam eleifend.,In finibus nunc ac risus euismod, eu dictum ipsum convallis.,Integer eget erat quis justo laoreet ornare ac ut diam.,Aenean sit amet augue sit amet leo imperdiet efficitur eget vel ipsum.,Sed blandit odio eget ligula imperdiet, sed fermentum tortor efficitur.,Pellentesque luctus metus nec risus molestie, a tempus velit commodo.,Nullam laoreet nulla at aliquam mattis.,Praesent eleifend augue semper suscipit pulvinar';
        const lines = text.split(',').sort(() => Math.random() - 0.5);
        let content = '';
        for(let i = 0; i < parts; i++) {
            let index = Math.floor(Math.random() * lines.length);
            content += lines[index];
        }
        return content;

    }

    function createItem(wrapper, content) {
        const item = document.createElement('li');
        item.className = 'kanban-item';
        item.setAttribute('draggable', 'true');
        item.textContent = content;
        wrapper.appendChild(item);
    }

    function createColumns(wrapper) {
        const columns = ['In Progress', 'Pending', 'Done'];
        for(const column of columns) {
            const col = document.createElement('div');
            col.className = 'kanban-column';
            const header = document.createElement('header');
            header.className = 'kanban-header';
            header.innerHTML = `<h2>${column}</h2>`;
            col.appendChild(header);
            const list = document.createElement('ul');
            list.className = 'kanban-items';
            col.appendChild(list);
            const itemsNo = 3;
            for(let i = 0; i < itemsNo; i++) {
                let content = createTextContent(6);
                createItem(list, content);
            }
            wrapper.appendChild(col);

        }
    }

function dragItems() {
  document.querySelectorAll('.kanban-items').forEach((container) => {

    container.addEventListener('dragstart', (e) => {
      if (e.target && e.target.classList.contains('kanban-item')) {
        e.target.classList.add('dragged');
        e.dataTransfer.effectAllowed = 'move';
      }
    });

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
         container.appendChild(copy);
         draggedEl.remove();
      }
      e.preventDefault();
    });
  });
}


    document.addEventListener('DOMContentLoaded', () => {
        const kanban = document.querySelector('.kanban');
        createColumns(kanban);
        dragItems();
    });
})();