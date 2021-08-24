import { useEffect, useRef } from 'react';
import { Card, Form, Button, Input, notification, Empty } from 'antd';
import styled from 'styled-components';
import useRequest from "../../hooks/use-request";
import { encode } from '../../utils';

const Wrapper = styled.div`
  position: fixed;
  top: 64px;
  width: 350px;
  height: calc(100vh - 64px);
`;

const CustomCard = styled(Card)`
  height: 100%;  
`;

const ImgWrapper = styled.div`
  height: 350px;
  margin-top: 10px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
`;

const Img = styled.img`
  width: auto;      
  height: 100%;
`;

const Detailed = props => {
    const form = useRef(null);

    useEffect(() => {
        console.log('change', props)
        form.current.setFieldsValue({
            displayName: props.displayName,
            alt: props.alt,
            title: props.title
        });
    }, [props.url]);

    const { doRequest } = useRequest({
        url: `/api/meta/${encode(props.url)}`,
        method: 'put',
        body: form.current && form.current.getFieldsValue(),
        onSuccess: () => { notification.success('Saved metadata') }
    });

    const onSubmit = () => {
        doRequest();
    }

    return (
        <Wrapper>
            <CustomCard
                hoverable
                cover={
                    <ImgWrapper>
                        <If condition={props.url}>
                            <Img
                                alt={props.alt}
                                src={props.url || 'error'}
                            />
                        </If>
                        <If condition={!props.url}>
                            <Empty description="Select an image" />
                        </If>
                    </ImgWrapper>
                }
            >
                <Form
                    onFinish={onSubmit}
                    initialValues={{
                        displayName: props.displayName,
                        title: props.title,
                        alt: props.alt
                    }}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    ref={form}
                >
                    <Form.Item
                        label="Display name"
                        name="displayName"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Title"
                        name="title"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="alt"
                    >
                        <Input />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Save
                    </Button>
                </Form>
            </CustomCard>
        </Wrapper>
    )
}

export default Detailed;