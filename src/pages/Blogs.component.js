/* eslint-disable */
import { useEffect, useMemo, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from 'react-bootstrap/Pagination';

import BlogDetail from './Components/BlogDetail.component';
import BlogItem from './Components/BlogItem.component';
import { Header } from '../components';
import { fetchRequest } from '../saga/Blogs/blogs.action';
import { MODAL_KEY } from '../constants';

const LIMIT = 10;
const PAGE = 1;

const HomeComponent = () => {
  const dispatch = useDispatch();
  const { blogs, totalPages } = useSelector(state => state.blogs);

  const [blogsRender, setBlogsRender] = useState([]);
  const [state, setState] = useState({
    page: PAGE,
    limit: LIMIT,
    sortBy: '',
    order: '',
  });
  const [modal, setModal] = useState({
    type: '',
    modal: null,
  });

  const fetchListRequest = async params => {
    await dispatch(fetchRequest(params));
  };

  const changeAndFetch = async (key, value) => {
    setState({ ...state, [key]: value });
    const cloneState = { ...state, [key]: value };
    delete cloneState['limit'];
    await fetchListRequest({
      ...cloneState,
      page: 1,
    });
  };

  useEffect(() => {
    fetchListRequest();
  }, []);

  useMemo(() => {
    const { page } = state;
    const indexEnd = LIMIT * page;
    const indexStart = indexEnd - LIMIT;

    setBlogsRender(blogs.slice(indexStart, indexEnd));
  }, [blogs, state.page]);

  const rangePage = (start, end) => {
    return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);
  };

  const handlePageChange = pageNum => {
    setState({ ...state, page: pageNum });
  };

  return (
    <>
      <Header />
      <Container>
        <div className="wrap-sort">
          <Button
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
              className="form-control"
              id="exampleFormControlSelect1"
            >
              <option value="">No sort</option>
              <option value="createAt">Create at</option>
            </select>
            <select
              onChange={e => changeAndFetch('order', e.target.value)}
              className="form-control"
              id="exampleFormControlSelect1"
            >
              <option value="">No sort</option>
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>
        <hr />
        <ul className="list-unstyled">
          {blogsRender?.length
            ? blogsRender.map((item, index) => <BlogItem blog={item} key={index} setModal={setModal} />)
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
      {modal?.type ? <BlogDetail modalData={modal} setModal={setModal} /> : ''}
    </>
  );
};

export default HomeComponent;
