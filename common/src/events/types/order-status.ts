export enum OrderStatus {
    // order created, ticket is not reserved
    Created = 'created',
    // ticket reserved or when order is cancelled
    // or order expires before payment
    Cancelled = 'cancelled',
    // order reserved the ticket
    AwaitingPayment = 'awaiting:payment',
    // order reserved the ticket and was paid
    Complete = 'complete'
};