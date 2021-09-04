import { useState } from 'react';
import {
    Layout,
    Image,
    InputNumber,
    Input,
    Typography,
    Form,
    Button,
    Space,
    Select,
    Spin
} from "antd";
import styled from 'styled-components';
import Header from '../../../components/media-library/header';
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Text } = Typography;

const Container = styled(Layout)`
  min-height: 100vh;
`;

const CustomLayout = styled(Layout)`
  margin-top: 70px;
`
const CustomContent = styled(Content)`
  margin: 50px auto;
  width: 600px;
`
const CustomSider = styled(Sider)`
  margin-top: 64px;
  margin-left: 10px;
  background: transparent;
`;

const Code = styled.div`
  word-break: break-all;
  margin-top: 10px;
`;

const CustomSpace = styled(Space)`
  display: flex;
`;

const SpinnerWrapper = styled.div`
  min-width: 300px;
  min-height: 300px;
  width: 100%;
  height: 100%;
  opacity: 75%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomImage = styled(Image)`
  min-width: 350px;
`;

const selectOptions = [
    'blur', // 1 argument
    'brightness',// 1 argument
    'contrast', // 1 argument
    'grayscale', // 0 arguments
    'invert', // 0 arguments
    'resize' // 2 arguments
];

const FormRow = ({ field, remove, options }) => {
    const [valueField, setValueField] = useState(null);
    const [width, setWidth] = useState(470);

    const getValueField = val => {
        let result = null;
        let resultWidth = 200;
        switch(val) {
            case 'blur': {
                resultWidth = 200;
                result = (
                    <Form.Item
                        {...field}
                        label="Value"
                        name={[field.name, 'value']}
                        fieldKey={[field.fieldKey, 'value']}
                        rules={[{ required: true, message: 'Missing value' }]}
                    >
                        <InputNumber
                            style={{ width: 200 }}
                        />
                    </Form.Item>
                );
                break;
            }
            case 'brightness': {
                resultWidth = 200;
                result = (
                    <Form.Item
                        {...field}
                        label="Value"
                        name={[field.name, 'value']}
                        fieldKey={[field.fieldKey, 'value']}
                        rules={[{ required: true, message: 'Missing value' }]}
                    >
                        <InputNumber
                            style={{ width: 200 }}
                        />
                    </Form.Item>
                );
                break;
            }
            case 'contrast': {
                resultWidth = 200;
                result = (
                    <Form.Item
                        {...field}
                        label="Value"
                        name={[field.name, 'value']}
                        fieldKey={[field.fieldKey, 'value']}
                        rules={[{ required: true, message: 'Missing value' }]}
                    >
                        <InputNumber
                            style={{ width: 200 }}
                        />
                    </Form.Item>
                );
                break;
            }
            case 'grayscale': {
                resultWidth = 470;
                result = null;
                break;
            }
            case 'invert': {
                resultWidth = 470;
                result = null;
                break;
            }
            case 'resize': {
                resultWidth = 120;
                result = [
                    <Form.Item
                        {...field}
                        label="Width"
                        name={[field.name, 'width']}
                        fieldKey={[field.fieldKey, 'width']}
                        rules={[{ required: true, message: 'Missing value' }]}
                    >
                        <InputNumber
                            style={{ width: 120 }}
                        />
                    </Form.Item>,
                    <Form.Item
                        {...field}
                        label="Height"
                        name={[field.name, 'height']}
                        fieldKey={[field.fieldKey, 'height']}
                        rules={[{ required: true, message: 'Missing value' }]}
                    >
                        <InputNumber
                            style={{ width: 120 }}
                        />
                    </Form.Item>
                ];
                break;
            }
            default: {
                result = null;
            }
        }
        setWidth(resultWidth);
        setValueField(result);
    }

    return (
        <CustomSpace
            key={field.key}
            align="baseline"
        >
            <Form.Item
                noStyle
                shouldUpdate={(prevValues, curValues) =>
                    prevValues.list !== curValues.list
                }
            >
                {() => (
                    <Form.Item
                        {...field}
                        label="Type"
                        name={[field.name, 'type']}
                        fieldKey={[field.fieldKey, 'type']}
                        rules={[{ required: true, message: 'Select transformation' }]}
                    >
                        <Select style={{ width }} onChange={getValueField}>
                            {options.map(s => (
                                <Select.Option key={s} value={s}>
                                    {s}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}
            </Form.Item>
            { valueField }
            <MinusCircleOutlined onClick={() => remove(field.name)} />
        </CustomSpace>
    )
}

const defaultUrl = 'data:image/png;base64,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';

const Transformations = props => {
    const [url, setUrl] = useState('');

    const onFinish = values => {
        if (values.list) {
            const query = values.list.reduce((acc, { type, value, width, height }) => {
                if (width && height) {
                    return `${acc},${type}:${width}:${height}`;
                }
                if (value) {
                    return `${acc},${type}:${value}`;
                }
                return `${acc},${type}`
            }, '');

            const targetUrl = values.imageUrl || url;
            let result = targetUrl;

            if (targetUrl.indexOf('/images/transform/') > -1) {
                const start = targetUrl.indexOf('/transform/') + 11;
                const end = targetUrl.indexOf('/', start);
                result = targetUrl.slice(0, start) + query.slice(1) + targetUrl.slice(end);
            } else {
                const start = targetUrl.indexOf('/images/') + 8;
                result = targetUrl.slice(0, start) + "transform/" + query.slice(1) + "/" + targetUrl.slice(start);
            }
            console.log('resultUrl', result);
            setUrl(result);
        } else if (values.imageUrl) {
            setUrl(values.imageUrl);
        }
    }

    const getOptions = () => {
        const result = selectOptions.filter(option => {
            return !form.getFieldsValue().list.find(item => item && item.type === option)
        });
        return result;
    }

    const [form] = Form.useForm();

    return (
        <Container>
            <Header active="1" />
            <CustomSider width="35%">
                <CustomImage
                    preview={false}
                    src={url || defaultUrl}
                    fallback="https://imgproc-storage.ams3.digitaloceanspaces.com/404.jpeg"
                    placeholder={
                        <SpinnerWrapper>
                            <Spin size="large" />
                        </SpinnerWrapper>
                    }
                />
                <If condition={!!url}>
                    <Code>
                        <Text code copyable>
                            {url}
                        </Text>
                    </Code>
                </If>
            </CustomSider>
            <CustomLayout>
                <CustomContent>
                    <Form
                        form={form}
                        name="transformations"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Image url"
                            name="imageUrl"
                            rules={[
                                { required: true, message: 'Please enter image url' },
                                { type: 'url', message: 'Invalid url' }
                            ]}
                        >
                            <Input style={{ width: 440 }} />
                        </Form.Item>
                        <Form.List name="list">
                            {(fields, { add, remove}) => (
                                <>
                                    {fields.map(field => (
                                      <FormRow
                                          key={field.key}
                                          field={field}
                                          remove={remove}
                                          options={getOptions()}
                                      />
                                    ))}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                            disabled={form.getFieldsValue().list && form.getFieldsValue().list.length >= selectOptions.length}
                                        >
                                            Add transformation
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Refresh preview
                            </Button>
                        </Form.Item>
                    </Form>
                </CustomContent>
            </CustomLayout>
        </Container>
    );
}

export default Transformations;
