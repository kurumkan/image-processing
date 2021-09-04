import { useState, useEffect } from 'react';
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
`
const Code = styled.div`
  padding: 12px;
  word-break: break-all;
`
const selectOptions = [
    'blur', // 1 argument
    'brightness',// 1 argument
    'contrast', // 1 argument
    'grayscale', // 0 arguments
    'invert', // 0 arguments
    'resize' // 2 arguments
];

const CustomSpace = styled(Space)`
  display: flex;
`
const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  opacity: 75%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`

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

const Transformations = props => {
    const [url, setUrl] = useState('');

    useEffect(() => {
        const initialUrl = 'https://imgproc.dev/api/images/61268484f0d2d6001a12dbfa/girl.jpg';
        setUrl(initialUrl);
    }, []);

    const onFinish = values => {
        const query = values.list.reduce((acc, { type, value, width, height }) => {
            if (width && height) {
                return `${acc},${type}:${width}:${height}`;
            }
            if (value) {
                return `${acc},${type}:${value}`;
            }
            return `${acc},${type}`
        }, '');

        let result = url;

        if (url.indexOf('/images/transform/') > -1) {
            const start = url.indexOf('/transform/') + 11;
            const end = url.indexOf('/', start);
            result = url.slice(0, start) + query.slice(1) + url.slice(end);
        } else {
            const start = url.indexOf('/images/') + 8;
            result = url.slice(0, start) + "transform/" + query.slice(1) + "/" + url.slice(start);
        }
        console.log('resultUrl', result);
        setUrl(result);
    }

    const getOptions = () => {
        const result = selectOptions.filter(option => {
            return !form.getFieldsValue().list.find(item => item && item.type === option)
        });
        return result;
    }

    const [form] = Form.useForm();

    return (
        <Layout>
            <Header active="1" />
            <CustomSider width="35%">
                <Image
                    preview={false}
                    src={url}
                    placeholder={
                        <SpinnerWrapper>
                            <Spin size="large" />
                        </SpinnerWrapper>
                    }
                />
                <Code>
                    <Text code copyable>
                        {url}
                    </Text>
                </Code>
            </CustomSider>
            <CustomLayout>
                <CustomContent>
                    <Form
                        form={form}
                        name="transformations"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
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
        </Layout>
    );
}

export default Transformations;
