import axios from 'axios';
import { message, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadComponent = () => {
    const onFileSelect = async ({ file }) => {
        console.log('onfilechange', file)
        try {
            const {data: {url}} = await axios.post('/api/images', {
                fileName: file.name,
                contentType: file.type
            });

            await axios.put(url, file, {
                headers: {
                    'Content-Type': file.type,
                    'x-amz-acl': 'public-read'
                }
            });
            message.success('File has been uploaded');
        } catch (e) {
            message.error('Failed to upload the file');
        }
    }

    return (
        <Upload
            accept="image/*"
            customRequest={onFileSelect}
            showUploadList={false}
        >
            <Button icon={<UploadOutlined/>} type="primary">
                Upload
            </Button>
        </Upload>
    );
}

export default UploadComponent;