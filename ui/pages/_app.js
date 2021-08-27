import 'antd/dist/antd.css';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return <Component currentUser={currentUser} {...pageProps} />;
};

AppComponent.getInitialProps = async context => {
    const client = buildClient(context.ctx);

    try {
        const { data } = await client.get('/api/users/currentuser');

        let pageProps = {};

        if (context.Component.getInitialProps) {
            pageProps = await context.Component.getInitialProps(context.ctx, client, data.currentUser);
        }

        console.log('_app fetch data:', data);

        return { pageProps, ...data }
    } catch (e) {
        console.log('Error _app:', e);
    }

    return { pageProps: {} }
}

export default AppComponent;