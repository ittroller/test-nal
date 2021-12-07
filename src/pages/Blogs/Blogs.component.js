import { memo, useEffect, useMemo } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Pagination from 'react-bootstrap/Pagination';
import PropTypes from 'prop-types';

import BlogDetail from '../Blog/BlogDetail.component';
import BlogItem from './BlogItem/BlogItem.component';
import { Header } from '../../components';
import { MODAL_KEY } from '../../constants';
import { rangePage } from '../../utils';
import blogsHook from './blogs.hooks';
import { fetchRequest } from '../../saga/Blogs/blogs.action';

const BlogsComponent = ({ blogsReducer, onDelete }) => {
  const dispatch = useDispatch();
  const { blogs, totalPages } = blogsReducer;
  const { LIMIT, blogsRender, setBlogsRender, state, setState, modal, setModal } = blogsHook();

  const onFetchListRequest = async params => {
    await dispatch(fetchRequest(params));
  };

  const changeAndFetch = async (key, value) => {
    setState({ ...state, [key]: value });
    const cloneState = { ...state, [key]: value };

    await onFetchListRequest({ ...cloneState, page: 1 });
  };

  const handlePageChange = pageNum => setState({ ...state, page: pageNum });

  useEffect(() => {
    onFetchListRequest();
  }, []);

  useMemo(() => {
    const { page } = state;
    const indexEnd = LIMIT * page;
    const indexStart = indexEnd - LIMIT;

    setBlogsRender(blogs.slice(indexStart, indexEnd));
  }, [blogs, state.page]);

  return (
    <>
      <Header />
      <Container>
        <div className="wrap-search">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control shadow-none"
              onChange={e => setState({ ...state, search: e.target.value })}
              placeholder="Enter keyword"
            />
            <div className="input-group-prepend">
              <button className="btn btn-primary shadow-none" onClick={() => onFetchListRequest(state)} type="button">
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="wrap-sort">
          <Button
            className="shadow-none"
            onClick={() =>
              setModal({
                ...modal,
                type: MODAL_KEY.CREATE,
              })
            }
          >
            Create blog
          </Button>
          <div className="filter">
            <select
              onChange={e => changeAndFetch('sortBy', e.target.value)}
              className="form-control shadow-none"
              id="exampleFormControlSelect1"
            >
              <option value="">Sort By</option>
              <option value="createAt">Create at</option>
            </select>
            <select
              onChange={e => changeAndFetch('order', e.target.value)}
              className="form-control shadow-none"
              id="exampleFormControlSelect1"
            >
              <option value="">Order</option>
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>
        <hr />
        <ul className="list-unstyled">
          {blogsRender?.length
            ? blogsRender.map((item, index) => (
                <BlogItem blog={item} key={index} setModal={setModal} onDelete={onDelete} />
              ))
            : ''}
        </ul>
        {blogs?.length ? (
          <Pagination className="px-4">
            {rangePage(1, totalPages).map((_, index) => (
              <Pagination.Item
                onClick={() => handlePageChange(index + 1)}
                key={index + 1}
                active={index + 1 === state.page}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        ) : (
          ''
        )}
      </Container>
      {modal?.type ? <BlogDetail modalData={modal} state={state} setModal={setModal} /> : ''}
    </>
  );
};

BlogsComponent.propTypes = {
  onDelete: PropTypes.func,
  blogsReducer: PropTypes.object,
};

export default memo(BlogsComponent);
