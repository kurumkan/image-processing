import { Button, Col, Menu, Row, Layout } from "antd";
import Link from "next/link";
import Upload from "./upload";

const { Header } = Layout;

export default props => {
    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <Row justify="space-between">
                <Col>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[props.active]}>
                        <Menu.Item key={0}>
                            <Link href="/console/media_library">Library</Link>
                        </Menu.Item>
                        <Menu.Item key={1}>
                            <Link href="/console/transformations">Transformations</Link>
                        </Menu.Item>
                    </Menu>
                </Col>
                {
                    props.showUpload && (
                        <Col>
                            <Upload onUpload={props.onUpload} />
                        </Col>
                    )
                }
                <Col>
                    <Button>
                        <Link href="/auth/signout">
                            Sign out
                        </Link>
                    </Button>
                </Col>
            </Row>
        </Header>
    )
}