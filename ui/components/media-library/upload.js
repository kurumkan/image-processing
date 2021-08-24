import { useState } from 'react';
import {Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useRequest from "../../hooks/use-request";

const UploadComponent = () => {
    const [fileName, setFileName] = useState('');
    const [contentType, setContentType] = useState('');
    const [uploadUrl, setUploadUrl] = useState('');

    const { doRequest } = useRequest({
        url: `http://localhost:5000/api/images`,
        method: 'post',
        body: {
            fileName,
            contentType
        },
        onSuccess: data => { console.log('data', data) || setUploadUrl(data) }
    });

    console.log('name', fileName)
    console.log('url', uploadUrl)

    const attrs = {
        name: 'file',
        showUploadList: false,
        action: uploadUrl,
        headers: {
            authorization: 'authorization-text',
        },
        beforeUpload: async file => {
            console.log('before', file)
            setContentType(file.type);
            setFileName(file.name);
            await doRequest();
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log('uploading', info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success('success',`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error('error',`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <Upload {...attrs}>
            <Button type="primary" icon={<UploadOutlined />}>Upload</Button>
        </Upload>
    )
}

export default UploadComponent;