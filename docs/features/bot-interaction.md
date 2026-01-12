# Bot Interaction

Mini apps have several methods to interact with the bot seamlessly through Telegram.
Availability of each method depends on the app's [launch mode](../guide/launch-modes.md).

## Data Sending

Mini app launched from [keyboard button](../guide/launch-modes.md#keyboard-button) can send custom data to the bot via Telegram.

<!-- TODO: code example; usecases; demo; size limits (1-4096 bytes in official JS SDK); -->

### How it works

Upon receiving [`web_app_data_send`](https://core.telegram.org/api/web-events#web-app-data-send) event from the app, client will invoke [`sendWebViewData`](https://core.telegram.org/method/messages.sendWebViewData) API method.
Mini app will be closed, and bot will receive an update with [`web_app_data`](https://core.telegram.org/bots/api#update:~:text=a%20video%20chat-,web_app_data,-WebAppData) service message.

## Inline Query

Mini app launched from [inline mode](../guide/launch-modes.md#inline-mode) can make the client switch back to inline mode, pre-filling the query with custom text.

<!-- TODO: code example; usecases; demo; -->

### How it works

Upon receiving [`web_app_switch_inline_query`](https://core.telegram.org/api/web-events#web-app-switch-inline-query) event from the app, client will insert the passed `query` string in the chat's input field after the bot's username.
If the `chat_types` array is specified and is non-empty, client will first prompt the user to choose a chat of the specified type(s).
Otherwise, client will switch back to inline mode in the current chat.
Mini app will be closed, and bot will receive an update with the new [inline query](https://core.telegram.org/bots/api#update:~:text=a%20few%20minutes.-,inline_query,-InlineQuery).

## Mini App Query

Mini app launched from an [inline button](../guide/launch-modes.md#inline-button), [menu button](../guide/launch-modes.md#menu-button), or [attachment menu](../guide/launch-modes.md#attachment-menu) initiates a web view session with a corresponding _mini app query_ (a.k.a. web app query).

<!-- TODO: code example; usecases; demo; -->

### How it works

Mini app query works similarly to [inline query](https://core.telegram.org/bots/inline).
It enables your bot to send a custom message on behalf of the user after they complete an interaction in your mini app.
While the web view session is active (i.e., user is still using the mini app), **bot** can answer the query by calling the [`answerWebAppQuery`](https://core.telegram.org/bots/api#answerwebappquery) Bot API method.

Below is the typical flow of using the feature:

1. **Launch**: When a mini app is launched in one of the mentioned modes, client initiates a mini app query.
   The app will receive [init data](./launch-params.md#init-data) which contains, among other parameters:
   - `query_id` — unique identifier of the mini app query;
   - `can_send_after` — minimum number of seconds to wait before the bot can send an answer to the query.
2. **User Interaction**: User interacts with the app (e.g., selects items, fills a form).
3. **Submission**: When ready, the app sends init data (including `query_id`) and other relevant data to your bot's server (e.g., via HTTP request).
4. **Query Answer**: Bot [validates](./launch-params.md#validation) the received init data and, after waiting at least `can_send_after` seconds from launch, calls the [`answerWebAppQuery`](https://core.telegram.org/bots/api#answerwebappquery) method, providing the `query_id` and message content.
   On success, an inline message from the user will be sent to the chat where the app was launched, and the app will be closed.
