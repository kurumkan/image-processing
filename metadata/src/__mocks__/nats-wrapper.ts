export const natsWrapper = {
    client: {
        // with this we can check if function is called
        publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
            callback();
        })
    }
};
