import { memo } from 'react';
import PropTypes from 'prop-types';

import { MODAL_KEY } from '../../constants';
import NoImage from '../../assets/images/no-image.jpg';

const BlogItem = ({ blog, setModal }) => {
  const setModalShow = type => {
    setModal({
      type: type,
      modal: blog,
    });
  };

  return (
    <li key={blog?.id || ''} className="media">
      <img src={NoImage ? NoImage : blog?.image} className="img mr-3" alt={`blog-img-${blog?.id || ''}`} />
      <div className="media-body">
        <div>
          <h5 className="mt-0 mb-1">
            {blog?.id + 1} {blog?.title || ''}
          </h5>
          <div>{blog?.content || ''}</div>
        </div>
        <div className="action">
          <a className="btns btns-detail" onClick={() => setModalShow(MODAL_KEY.DETAIL)}>
            Detail
          </a>
          <a className="btns btns-edit" onClick={() => setModalShow(MODAL_KEY.UPDATE)}>
            Edit
          </a>
        </div>
      </div>
    </li>
  );
};

BlogItem.propTypes = {
  blog: PropTypes.object,
  setModal: PropTypes.func,
};

export default memo(BlogItem);
