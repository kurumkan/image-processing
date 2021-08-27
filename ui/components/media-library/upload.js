import { useState } from 'react';
import axios from 'axios';
import { message, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadComponent = ({ onUpload }) => {
    const [ pending, setPending ] = useState(false);

    const onFileSelect = async ({ file }) => {
        setPending(true);
        try {
            const {data: { uploadUrl, resultUrl }} = await axios.post('/api/images', {
                fileName: file.name,
                contentType: file.type
            });

            const res = await axios.put(uploadUrl, file, {
                headers: {
                    'Content-Type': file.type,
                    'x-amz-acl': 'public-read'
                }
            });
            message.success('File has been uploaded');
            console.log('upload', res);

            onUpload({ fileName: file.name, url: resultUrl });
        } catch (e) {
            message.error('Failed to upload the file');
        } finally {
            setPending(false);
        }
    }

    return (
        <Upload
            accept="image/*"
            customRequest={onFileSelect}
            showUploadList={false}
        >
            <Button
                icon={<UploadOutlined/>}
                type="primary"
                loading={pending}
            >
                Upload
            </Button>
        </Upload>
    );
}

export default UploadComponent;