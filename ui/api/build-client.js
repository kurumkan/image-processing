import axios from 'axios';

const remoteUrl = 'http://www.project-demo.digital';
const localUrl = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
// const localUrl = 'http://localhost:5000';

export default ({ req }) => {
    if(typeof window === 'undefined') {
        return axios.create({
            baseURL: process.env.NODE_ENV === 'development' ? localUrl : remoteUrl,
            headers: req.headers
        });
    } else {
        return axios.create({
            baseURL: '/'
        });
    }
};
