// Represents an event that can be published and received by subscribers.
export abstract class EventBase {

    // Unique value representing the event.
    public abstract get eventKey(): string;
}

