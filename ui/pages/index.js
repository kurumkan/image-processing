import styled from 'styled-components';
import Link from 'next/link';
import { CloudSyncOutlined } from '@ant-design/icons';
import { Layout, Menu, Space, Row, Col, Button, Typography, Image, Card } from 'antd';
const { Header, Footer } = Layout;
const { Title } = Typography;

const Logo = styled.div`
  float: left;
  width: 120px;
  font-weight: 700;
  color: #1890ff;
  cursor: pointer;
`

const Section = styled.section`
  padding: 50px 60px;
`;

const HelloSection = styled(Section)`
  background-color: #fff;
  margin-top: 60px;
`;

const CardWrapper = styled(Col)`
  margin-bottom: 15px;
`
const FeatureCard = styled(Card)`
  margin-bottom: 15px;
  height: 100%;
`

const LandingPage = () => {
    return (
        <Layout>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <Row justify="space-between">
                    <Col xs={24} md={12}>
                        <Link href="/">
                            <Logo>
                                <CloudSyncOutlined style={{ fontSize: 20 }}/>
                                <>IMGPROC</>
                            </Logo>
                        </Link>
                        <Menu theme="dark" mode="horizontal">
                            <Menu.Item key="0">
                                <Link href="#features">
                                    Features
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="1">
                                <Link href="/documentation">
                                    Documentation
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Col>
                    <Col>
                        <Space>
                            <Button type="dashed">
                                <Link href="/auth/signin">
                                    Sign in
                                </Link>
                            </Button>
                            <Button type="primary">
                                <Link href="/auth/signup">
                                    Sign up
                                </Link>
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Header>
            <HelloSection>
                <Row justify="space-around" align="middle">
                    <Col xs={24} md={12}>
                        <Title>Programmable Images</Title>
                        <Title level={5}>
                            Create & manage your images with URL based transformations
                        </Title>
                        <Space style={{ marginTop: 20, marginBottom: 20 }}>
                            <Button type="primary" size="large" shape="round">
                                <Link href="/auth/signup">
                                    Get started
                                </Link>
                            </Button>
                        </Space>
                    </Col>
                    <Col xs={24} md={12}>
                        <Image
                            src="https://i.picsum.photos/id/188/536/354.jpg?hmac=o3z5jt461cqrakGUJR34etbdfE12X5peOIQHb0Ke9n0"
                            preview={false}
                            alt="demo image"
                        />
                    </Col>
                </Row>
            </HelloSection>
            <Section>
                <Title id="features">Features</Title>
                <Row gutter={24}>
                    <CardWrapper xs={24} md={8}>
                        <FeatureCard title="Programmable images">
                            URL based transformations will allow you to have adjust your images
                            according to your design needs
                        </FeatureCard>
                    </CardWrapper>
                    <CardWrapper xs={24} md={8}>
                        <FeatureCard title="Global CDN">
                            All the images are duplicated on servers around the world.
                            Your media assets delivered fastly from the closest server.
                        </FeatureCard>
                    </CardWrapper>
                    <CardWrapper xs={24} md={8}>
                        <FeatureCard title="Automate responsive images">
                            Make sure your images look great on every device
                        </FeatureCard>
                    </CardWrapper>
                </Row>
            </Section>
            <Footer style={{ textAlign: 'center' }}>Image Processor ©2021 Created by Artur Arsalanov</Footer>
        </Layout>
    );
}

export default LandingPage;
