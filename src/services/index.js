import { AxiosClient } from './Axios';

const Axios = new AxiosClient(process.env.REACT_APP_URL_API);

export default Axios;
