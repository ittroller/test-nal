import { useState } from 'react';

const blogsHook = () => {
  const LIMIT = 10;
  const PAGE = 1;

  const [blogsRender, setBlogsRender] = useState([]);
  const [state, setState] = useState({
    page: PAGE,
    // limit: LIMIT,
    sortBy: '',
    order: '',
    search: '',
    title: '',
    filter: '',
  });
  const [modal, setModal] = useState({
    type: '',
    modal: null,
  });

  return {
    LIMIT,
    PAGE,
    blogsRender,
    setBlogsRender,
    state,
    setState,
    modal,
    setModal,
  };
};

export default blogsHook;
