import { useState } from 'react';
import { Col, Row, Layout, Menu, Empty, Button } from 'antd';
import styled from 'styled-components';
import Item from '../../../components/media-library/item';
import Detailed from '../../../components/media-library/detailed';
import Upload from '../../../components/media-library/upload';
const { Header, Content, Sider } = Layout;
const ContentWrapper = styled(Content)`
  margin: 74px 60px 30px 380px;
`

const EmptyWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
  padding-left: 350px;
`;

/*
    - list images
    - change metadata
    - get a single image
    - delete images
    - upload images
 */

const MediaLibraryPage =  ({ images = [] }) => {
    const [currentImage, setCurrentImage] = useState({
        title: '',
        alt: '',
        displayName: '',
        url: ''
    });

    return (
        <Layout>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <Row justify="space-between">
                    <Col>
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']}>
                            <Menu.Item key={0}>Library</Menu.Item>
                            <Menu.Item key={1}>Transformations</Menu.Item>
                        </Menu>
                    </Col>
                    <Col>
                        <Upload />
                    </Col>
                    <Col>
                        <Button>
                            Sign out
                        </Button>
                    </Col>
                </Row>
            </Header>
            <Layout>
                <Sider width={350}>
                    <Detailed
                        title={currentImage.title}
                        alt={currentImage.alt}
                        displayName={currentImage.displayName}
                        url={currentImage.url}
                    />
                </Sider>
            </Layout>
            <ContentWrapper>
                <If condition={!images.length}>
                    <EmptyWrapper>
                        <Empty />
                    </EmptyWrapper>
                </If>
                <If condition={images.length}>
                    <Row gutter={20}>
                        {
                            images.map(image => (
                                <Col key={image.id}>
                                    <Item
                                        {...image}
                                        onClick={() => console.log('click', image) || setCurrentImage(image)}
                                    />
                                </Col>
                            ))
                        }
                    </Row>
                </If>
            </ContentWrapper>
        </Layout>
    )
}

MediaLibraryPage.getInitialProps = async (context, client) => {
    try {
        const { data } = await client.get('/api/meta');
        console.log('images', data);
        return { images: data };
    } catch (e) {
        console.log('Fetch images error: ', e);
        return { images: [] }
    }
}

export default MediaLibraryPage;