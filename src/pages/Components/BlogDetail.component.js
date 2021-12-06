import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import { patchRequest } from '../../saga/Blogs/blogs.action';
import { MODAL_KEY } from '../../constants';

const validationSchema = Yup.object().shape({
  title: Yup.string().max(50, 'Title max length 50 characters').required('Title is required'),
  content: Yup.string().max(200, 'Content max length 50 characters').required('Content is required'),
});

const Blog = ({ modalData, setModal }) => {
  const dispatch = useDispatch();
  const { error } = useSelector(state => state.blogs);
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

  const { modal, type } = modalData;

  const renderType = () => {
    let modalTitle = '';
    let isShowUpload = false;

    switch (type) {
      case MODAL_KEY.UPDATE:
        modalTitle = 'UPDATE BLOG';
        isShowUpload = false;
        break;

      case MODAL_KEY.CREATE:
        modalTitle = 'CREATE BLOG';
        isShowUpload = false;
        break;

      case MODAL_KEY.DETAIL:
        modalTitle = 'DETAIL BLOG';
        isShowUpload = false;
        break;

      default:
        break;
    }

    return {
      isShowUpload,
      modalTitle,
    };
  };

  // eslint-disable-next-line
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

  return (
    <Modal className="blog-modal" size="xl" show={!!type} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{renderType()?.modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            title: modal?.title || 'Minh nè',
            content: modal?.content || 'Minh nè',
            image: modal?.image || '',
          }}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={async values => {
            // if (previewImg.errorImage) {
            //   return;
            // }

            try {
              // const fd = new FormData();
              // fd.append('title', values?.title || '');
              // fd.append('content', values?.content || '');
              // fd.append('image', previewImg?.file || '');

              const response = await dispatch(
                patchRequest({
                  id: modal?.id || '',
                  title: values?.title || '',
                  content: values?.content || '',
                }),
              );

              console.log(response);
            } catch (error) {
              alert(error);
            }
          }}
        >
          {({ handleSubmit, handleBlur, handleChange, values, errors }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title}
                    name="title"
                  />
                </Form.Group>
                {errors.title && <div className="error">{errors.title}</div>}

                <Form.Group>
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter content"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.content}
                    name="content"
                  />
                </Form.Group>
                {errors.content && <div className="error">{errors.content}</div>}

                {renderType()?.isShowUpload ? (
                  previewImg?.path || values?.image ? (
                    <img className="preview-img" src={previewImg?.path || values?.image} />
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}

                {error?.statusText && <div className="error mt-3">{error?.statusText}</div>}
                {/* <Form.Group className="mb-3">
                  <Form.Label>Images</Form.Label>

                  <Form.Control accept="image/*" type="file" onChange={handleChangeFile} name="image" />

                  {previewImg?.path || values?.image ? (
                    <img className="preview-img" src={previewImg?.path || values?.image} />
                  ) : (
                    ''
                  )}
                  {previewImg.errorImage && <div className="error">{previewImg.errorImage}</div>}
                </Form.Group> */}

                <Button className="btns btns-submit" variant="primary" type="submit">
                  Save Changes
                </Button>

                <Button className="btns btns-close" variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </form>
            );
          }}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

Blog.propTypes = {
  modalData: PropTypes.object,
  setModal: PropTypes.func,
};

export default Blog;
