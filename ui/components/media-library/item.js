import { useState } from 'react';
import { Card, Image, message } from 'antd';
import { CopyOutlined, CheckOutlined, EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import useRequest from "../../hooks/use-request";

const { Meta } = Card;

const Wrapper = styled.div`
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.active ? 'black' : 'transparent'};
  margin-bottom: 15px;
`
const CustomCard = styled(Card)`
  overflow: hidden;
  height: 100%;
`
const Cover = styled(Image)`
  cursor: pointer;
  height: 300px;
  width: auto;
  margin: 0 auto;
  &:hover {
    opacity: 0.7;
  }
`
const Item = ({ url, alt, fileName, onClick, onDelete, active }) => {
    const [showTick, setShowTick] = useState(false);

    const { doRequest, pending } = useRequest({
        url: `/api/images/${fileName}`,
        method: 'delete',
        onSuccess: () => {
            onDelete(url);
            message.success('Image deleted')
        }
    });

    const onCopyClick = () => {
        copy(`${location.origin}${url}`);
        setShowTick(true);
        setTimeout(() => setShowTick(false), 3000);
    }

    return (
        <Wrapper active={active}>
            <CustomCard
                style={{ width: 300 }}
                cover={
                    <Cover
                        alt={alt || ''}
                        src={url}
                        onClick={onClick}
                        preview={false}
                    />
                }
                actions={[
                    showTick ? (
                        <CheckOutlined
                            key="check"
                        />
                    ) : (
                        <CopyOutlined
                            key="copy"
                            onClick={onCopyClick}
                        />
                    ),
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
            </CustomCard>
        </Wrapper>
    )
}

export default Item;