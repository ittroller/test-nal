// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { fetchRequest, deleteRequest } from '../saga/Blogs/blogs.action';
import BlogsComponent from '../pages/Blogs/Blogs.component';

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => {
  return {
    onFetch: params => dispatch(fetchRequest(params)),
    onDelete: params => dispatch(deleteRequest(params)),
  };
};
// const mapDispatchToProps = dispatch => ({ dispatch, ...bindActionCreators({ onFetch: fetchRequest }, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(BlogsComponent);
