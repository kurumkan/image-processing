import { useEffect } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import { Spin } from 'antd';
import useRequest from '../../hooks/use-request';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default () => {
    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/')
    });

    useEffect(() => doRequest(), []);

    return (
        <Wrapper>
            <Spin size="large" />
        </Wrapper>
    );
}