import {Card, notification} from 'antd';
import { EditOutlined, EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { encode } from "../../utils";
import useRequest from "../../hooks/use-request";

const { Meta } = Card;

const Wrapper = styled.div`
  margin-bottom: 10px;
`
const Cover = styled.img`
  display: block;
  margin: 0 auto;
  width: auto;
  max-width: 100%;
  height: 300px;      
  cursor: pointer;      
  &:hover {
    opacity: 0.7;
  }
`
const Item = ({ url, alt, displayName, onClick, remove }) => {
    const { doRequest } = useRequest({
        url: `/api/meta/${encode(url)}`,
        method: 'delete',
        onSuccess: () => { notification.success('Image deleted') }
    });

    return (
        <Wrapper>
            <Card
                style={{ width: 300 }}
                cover={
                    <Cover
                        alt={alt || ''}
                        src={url}
                        onClick={onClick}
                    />
                }
                actions={[
                    <EditOutlined key="edit" />,
                    <DeleteOutlined key="delete"
                        onClick={doRequest}
                    />,
                    <EllipsisOutlined key="ellipsis" />,
                ]}
            >
                <Meta
                    title={displayName}
                    description={alt}
                />
            </Card>
        </Wrapper>
    )
}

export default Item;