import axios from 'axios';
import styled from 'styled-components';
import { Alert } from 'antd';
import { useState } from 'react';

const Wrapper = styled.div`
  margin: 15px 0;
`;

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState([]);
    const [pending, setPending] = useState(false);

    const doRequest = async (props={}) => {
        try {
            setErrors(null);
            setPending(true);
            const res = await axios[method](
                url,
                { ...body, ...props }
            );
            onSuccess && onSuccess(res.data);
            return res.data;
        } catch(err) {
            let message;

            if (err.response.data.errors) {
                 message = (
                         <>
                             {err.response.data.errors.map(e =>
                                 <Alert key={e.message} type="error" banner message={e.message} />)}
                         </>
                     );
            } else {
                message = <Alert type="error" banner message="Request error" />;
            }

            setErrors(<Wrapper>{message}</Wrapper>);
        } finally {
            setPending(false);
        }
    }

    return { doRequest, errors, pending };
}