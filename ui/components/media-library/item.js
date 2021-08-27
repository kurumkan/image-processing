import { Card, message } from 'antd';
import { EditOutlined, EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import useRequest from "../../hooks/use-request";

const { Meta } = Card;

const Wrapper = styled.div`
  margin-bottom: 10px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.active ? 'black' : 'transparent'};
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
const Item = ({ url, alt, fileName, onClick, onDelete, active }) => {
    const { doRequest, pending } = useRequest({
        url: `/api/images/${fileName}`,
        method: 'delete',
        onSuccess: () => {
            onDelete(url);
            message.success('Image deleted')
        }
    });

    return (
        <Wrapper active={active}>
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
                    <DeleteOutlined
                        loading={pending}
                        key="delete"
                        onClick={doRequest}
                    />,
                    <EllipsisOutlined key="ellipsis" />,
                ]}
            >
                <Meta
                    title={fileName}
                    description={alt}
                />
            </Card>
        </Wrapper>
    )
}

export default Item;