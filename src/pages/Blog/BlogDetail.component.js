import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { Modal, Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import { Fieldset } from '../../components';
import { patchRequest } from '../../saga/Blogs/blogs.action';
import blogHook from './blog.hook';

const validationSchema = Yup.object().shape({
  title: Yup.string().max(50, 'Title max length 50 characters').required('Title is required'),
  content: Yup.string().max(200, 'Content max length 200 characters').required('Content is required'),
});

const Blog = ({ modalData, setModal, state }) => {
  const dispatch = useDispatch();
  const { error } = useSelector(state => state.blogsReducer);

  const { handleClose, previewImg, renderType, callbackSubmit } = blogHook(modalData, setModal, state);

  const { modal, type } = modalData;

  const handleSubmitForm = async values => {
    // if (previewImg.errorImage) {
    //   return;
    // }

    try {
      // const fd = new FormData();
      // fd.append('title', values?.title || '');
      // fd.append('content', values?.content || '');
      // fd.append('image', previewImg?.file || '');
      const randomIdImage = Math.floor(Math.random() * 100);
      await dispatch(
        patchRequest(
          {
            id: modal?.id || '',
            title: values?.title || '',
            content: values?.content || '',
            image: values?.image || `https://picsum.photos/id/${randomIdImage}/200/300`,
          },
          callbackSubmit,
        ),
      );
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Modal className="blog-modal" size="xl" animation={true} show={!!type} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{renderType()?.modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Fieldset isFieldset={renderType()?.isEditForm}>
          <Formik
            initialValues={{
              title: modal?.title || '',
              content: modal?.content || '',
              image: modal?.image || 'https://picsum.photos/200/300',
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={handleSubmitForm}
          >
            {({ handleSubmit, handleBlur, handleChange, values, errors, submitCount }) => {
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
                      className="shadow-none"
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
                      className="shadow-none"
                    />
                  </Form.Group>
                  {errors.content && <div className="error">{errors.content}</div>}

                  {renderType()?.isEditForm ? (
                    <Form.Group className="mb-3">
                      {previewImg?.path || values?.image ? (
                        <img className="preview-img" src={previewImg?.path || values?.image} />
                      ) : (
                        ''
                      )}
                    </Form.Group>
                  ) : (
                    ''
                  )}

                  {!!submitCount && error?.statusText ? <div className="error mt-3">{error?.statusText}</div> : ''}
                  {/* <Form.Group className="mb-3">
                  <Form.Label>Images</Form.Label>

                  <Form.Control
                  className="shadow-none"
                  accept="image/*"
                  type="file"
                  onChange={handleChangeFile}
                  name="image"
                  />

                  {previewImg?.path || values?.image ? (
                    <img className="preview-img" src={previewImg?.path || values?.image} />
                  ) : (
                    ''
                  )}
                  {previewImg.errorImage && <div className="error">{previewImg.errorImage}</div>}
                </Form.Group> */}

                  <Button className="btns btns-submit shadow-none" variant="primary" type="submit">
                    Save Changes
                  </Button>

                  <Button className="btns btns-close shadow-none" variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </form>
              );
            }}
          </Formik>
        </Fieldset>
      </Modal.Body>
    </Modal>
  );
};

Blog.propTypes = {
  modalData: PropTypes.object,
  setModal: PropTypes.func,
  state: PropTypes.object,
};

export default Blog;
