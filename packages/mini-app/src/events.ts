/**
 * Event types that can be received by the mini app from the client.
 *
 * @see {@link https://core.telegram.org/api/bots/webapps#incoming-events-client-to-mini-app Mini Apps • Incoming Events}
 */
export interface IncomingEvents {
  back_button_pressed: void
}

/**
 * Event types that can be emitted by the mini app to the client.
 *
 * @see {@link https://core.telegram.org/api/web-events#event-apis Mini Apps • Outgoing Events}
 */
export interface OutgoingEvents {
  web_app_setup_back_button: {
    is_visible: boolean
  }
}
