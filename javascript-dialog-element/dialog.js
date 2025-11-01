'use strict';

(function() {
    const openModal = document.querySelector('.open-modal');
    const openDialog = document.querySelector('.open-dialog');
    const closeModal = document.querySelector('.modal-close');
    const modal = document.querySelector('.modal');

    const handleOpenModal = () => {
        return modal.showModal();
    };

    const handleOpenDialog = () => {
        return modal.show();
    };

    const handleCloseModal = () => {
        return modal.close();
    };

    document.addEventListener('DOMContentLoaded', () => {
        openModal.addEventListener('click', handleOpenModal, false);
        openDialog.addEventListener('click', handleOpenDialog, false);
        closeModal.addEventListener('click', handleCloseModal, false);
    }, false);

})();