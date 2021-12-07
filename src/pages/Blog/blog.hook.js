import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { MODAL_KEY } from '../../constants';
import { fetchRequest } from '../../saga/Blogs/blogs.action';

const blogsHook = (modalData, setModal, state) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    setModal({
      type: '',
      modal: null,
    });
  };

  const [previewImg, setPreviewImg] = useState({
    path: '',
    file: '',
    errorImage: '',
  });

  const renderType = () => {
    const { type } = modalData;
    let modalTitle = '';
    let isEditForm = false;

    switch (type) {
      case MODAL_KEY.UPDATE:
        modalTitle = 'UPDATE BLOG';
        isEditForm = false;
        break;

      case MODAL_KEY.CREATE:
        modalTitle = 'CREATE BLOG';
        isEditForm = false;
        break;

      case MODAL_KEY.DETAIL:
        modalTitle = 'DETAIL BLOG';
        isEditForm = true;
        break;

      default:
        break;
    }

    return {
      isEditForm,
      modalTitle,
    };
  };

  const handleChangeFile = e => {
    const { files } = e.target;
    const cloneFile = files[0];

    if (cloneFile.size > 1024 * 1024 * 5) {
      e.target.files = null;
      setPreviewImg({
        path: '',
        file: '',
        errorImage: 'File size must be less than 5MB',
      });
    } else {
      setPreviewImg({
        errorImage: '',
        file: cloneFile,
        path: URL.createObjectURL(cloneFile),
      });
    }
  };

  const callbackSubmit = async () => {
    await dispatch(fetchRequest(state));
    await handleClose();
  };

  return {
    handleClose,
    previewImg,
    renderType,
    handleChangeFile,
    callbackSubmit,
  };
};

export default blogsHook;
