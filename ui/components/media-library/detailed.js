import { useEffect, useState } from 'react';
import { Card, Button,  message, Empty } from 'antd';
import styled from 'styled-components';
import useRequest from "../../hooks/use-request";

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
  overflow: hidden;
`;

const Img = styled.img`
  width: auto;      
  height: 100%;
`;

const CustomLabel = styled.label`
  font-weight: 600;
`

const CustomInput = styled.input` 
    width: 100%;
    display: inline-block;
    margin: 5px 0 15px 0;
`

const Detailed = props => {
    const [ title, setTitle ] = useState('');
    const [ alt, setAlt ] = useState('');

    useEffect(() => {
        setTitle(props.title);
        setAlt(props.alt);
    }, [props.url, props.alt, props.title]);

    const { doRequest } = useRequest({
        url: `/api/meta/${props.fileName}`,
        method: 'put',
        body: {
            title,
            alt
        },
        onSuccess: () => {
            props.onUpdate({
                title,
                alt,
                url: props.url
            });
            message.success('Metadata has been saved');
        }
    });

    const onSubmit = e => {
        e.preventDefault();
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
                                placeholder={
                                    <Image
                                        preview={false}
                                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                                        width={200}
                                    />
                                }
                            />
                        </If>
                        <If condition={!props.url}>
                            <Empty description="Select an image" />
                        </If>
                    </ImgWrapper>
                }
            >
                <form onSubmit={onSubmit}>
                    <div>
                        <CustomLabel>Title</CustomLabel>
                        <CustomInput
                            name="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <CustomLabel>Description</CustomLabel>
                        <CustomInput
                            name="alt"
                            value={alt}
                            onChange={e => setAlt(e.target.value)}
                        />
                    </div>
                    <Button type="primary" htmlType="submit" block>
                        Save
                    </Button>
                </form>
            </CustomCard>
        </Wrapper>
    )
}

export default Detailed;