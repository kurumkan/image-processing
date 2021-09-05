import { useState, useRef, useEffect } from 'react';
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
  margin-top: 70px;
  padding-left: 10px;
  background: transparent;
  display: flex;
  justify-content: center;
`;

const Code = styled.div`
  word-break: break-all;
  margin-top: 10px;
`;

const CustomSpace = styled(Space)`
  display: flex;
`;

const SpinnerWrapper = styled.div`
  min-width: 350px;
  min-height: 350px;
  width: 100%;
  height: 100%;
  opacity: 75%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 350px;
  min-height: 350px;
  border: 1px solid #d9d9d9;
  padding: 5px;
  background: #fff;
`;

const ImgRefHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const selectOptions = [
    'blur', // 1 argument
    'brightness',// 1 argument
    'contrast', // 1 argument
    'grayscale', // 0 arguments
    'invert', // 0 arguments
    'resize' // 2 arguments
];

const FormRow = ({ field, remove, options, imgRef }) => {
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
                        initialValue={0}
                    >
                        <InputNumber
                            style={{ width: 200 }}
                            min={0}
                            max={Math.min(imgRef.current.clientWidth, imgRef.current.clientHeight)}
                            formatter={val => `${val}px`}
                            parser={value => {
                                const str = value.replace('px', '');
                                return Math.floor(parseFloat(str));
                            }}
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
                        initialValue={0}
                    >
                        <InputNumber
                            style={{ width: 200 }}
                            min={-100}
                            max={100}
                            formatter={val => `${val}%`}
                            parser={value => {
                                const str = value.replace('%', '');
                                return Math.floor(parseFloat(str));
                            }}
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
                        initialValue={0}
                    >
                        <InputNumber
                            style={{ width: 200 }}
                            min={-100}
                            max={100}
                            formatter={val => `${val}%`}
                            parser={value => {
                                const str = value.replace('%', '');
                                return Math.floor(parseFloat(str));
                            }}
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
                        initialValue={imgRef.current.clientWidth}
                    >
                        <InputNumber
                            style={{ width: 120 }}
                            min={1}
                            max={1000}
                            formatter={val => `${val}px`}
                            parser={value => {
                                const str = value.replace('px', '');
                                return Math.floor(parseFloat(str));
                            }}
                        />
                    </Form.Item>,
                    <Form.Item
                        {...field}
                        label="Height"
                        name={[field.name, 'height']}
                        fieldKey={[field.fieldKey, 'height']}
                        rules={[{ required: true, message: 'Missing value' }]}
                        initialValue={imgRef.current.clientHeight}
                    >
                        <InputNumber
                            style={{ width: 120 }}
                            min={1}
                            max={1000}
                            formatter={val => `${val}px`}
                            parser={value => {
                                const str = value.replace('px', '');
                                return Math.floor(parseFloat(str));
                            }}
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
                    prevValues.list.length !== curValues.list.length
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
            <Form.Item
                noStyle
                shouldUpdate={(prevValues, curValues) =>
                    prevValues.list.length !== curValues.list.length
                }
            >
                { valueField }
            </Form.Item>
            <MinusCircleOutlined onClick={() => remove(field.name)} />
        </CustomSpace>
    )
}

const defaultUrl = 'data:image/png;base64,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';

const Transformations = props => {
    const [url, setUrl] = useState('');

    const [form] = Form.useForm();
    const imgRef = useRef();

    const onFinish = values => {
        console.log('onFinish', values, imgRef);
        if (values.list && values.list.length > 0) {
            const query = values.list.reduce((acc, { type, value, width, height }) => {
                if (width !== undefined && height !== undefined) {
                    return `${acc},${type}:${width}:${height}`;
                }
                if (value !== undefined) {
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

    return (
        <Container>
            <Header active="1" />
            <CustomSider width="35%">
                <ImageWrapper>
                    <ImgRefHolder ref={imgRef}>
                        <Image
                            loading
                            preview={false}
                            src={url || defaultUrl}
                            fallback="https://imgproc-storage.ams3.digitaloceanspaces.com/404.jpeg"
                            placeholder={
                                <SpinnerWrapper>
                                    <Spin size="large" />
                                </SpinnerWrapper>
                            }
                        />
                    </ImgRefHolder>
                </ImageWrapper>
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
                        onValuesChange={(current, all) => console.log('onchange', current, all)}
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
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(field => (
                                      <FormRow
                                          key={field.key}
                                          field={field}
                                          remove={remove}
                                          options={getOptions()}
                                          imgRef={imgRef}
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
