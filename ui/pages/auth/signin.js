import { useState, useEffect } from 'react';
import Router  from 'next/router';
import Link from 'next/link';
import { Form, Input, Button, Typography, Space } from 'antd';
import useRequest from '../../hooks/use-request';
import { Wrapper } from '../../components/auth/wrapper';

const { Title } = Typography;

const Signin = ({ user }) => {
    useEffect(() => {
        if (user) {
            Router.push('/console/media_library');
            return;
        }
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: { email, password },
        onSuccess: () => { Router.push('/console/media_library'); }
    });

    const onSubmit = () => {
        doRequest();
    }

    return (
        <Wrapper>
            <Title>Sign in</Title>
            {errors}
            <Form
                layout="vertical"
                onFinish={onSubmit}
            >
                <Form.Item
                    label="Email address"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please, enter your email',
                        },
                        {
                            type: 'email',
                            message: 'Must be a valid email'
                        }
                    ]}
                >
                    <Input value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    type="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please, enter your password'
                        },
                    ]}
                >
                    <Input.Password value={password} onChange={e => setPassword(e.target.value)}  />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Sign in
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="dashed" block>
                        <Link href="/">
                            Cancel
                        </Link>
                    </Button>
                </Form.Item>
                <Space>
                    Need an account? <Link href="/auth/signup">Sign Up »</Link>
                </Space>
            </Form>
        </Wrapper>
    );
}

Signin.getInitialProps = async (context, client, user) => {
    return { user };
}

export default Signin;
