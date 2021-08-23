import axios from 'axios';
import styled from 'styled-components';
import { Alert } from 'antd';
import { useState } from 'react';

const Wrapper = styled.div`
  margin: 15px 0;
`;

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState([]);

    const doRequest = async (props={}) => {
        try {
            setErrors(null);
            const res = await axios[method](
                url,
                { ...body, ...props }
            );
            onSuccess && onSuccess(res.data);
            return res.data;
        } catch(err) {
            let message;
            console.log(err)

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
        }
    }

    return { doRequest, errors };
}