import { useState, useEffect } from 'react';
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

const MediaLibraryPage =  ({ images: imagesProps = [] }) => {
    const [currentImage, setCurrentImage] = useState({
        title: '',
        alt: '',
        url: '',
        fileName: ''
    });

    const [images, setImages] = useState(imagesProps);

    const onUpload = image => {
        setImages([{ alt: '', title: '', ...image }, ...images]);
    }

    const onDelete = deletedUrl => {
        const newImages = images.filter(({ url }) => deletedUrl !== url);
        setImages(newImages);
        setCurrentImage(newImages[0] || { alt: '', url: '', title: '' });
    }

    const onUpdate = ({ title, alt, url }) => {
        const index = images.findIndex(i => i.url === url);
        const newImages = [...images];
        newImages[index].title = title;
        newImages[index].alt = alt;
        setImages(newImages);
    }

    const selectImage = image => setCurrentImage({ ...image })

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
                        <Upload onUpload={onUpload} />
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
                        {...currentImage}
                        onUpdate={onUpdate}
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
                                <Col key={image.url}>
                                    <Item
                                        {...image}
                                        active={image.url === currentImage.url}
                                        onDelete={onDelete}
                                        onClick={() => selectImage(image)}
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