import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SendMessage from '../pages/chat/send-message';

const mockStore = configureStore([]);

const mockSocket = {
  emit: jest.fn(),
};

describe('SendMessage Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      room: { currentRoom: 'testRoom', currentUsername: 'testUser' },
    });
  });

  test('renders input field and send button', () => {
    render(
      <Provider store={store}>
        <SendMessage socket={mockSocket} />
      </Provider>
    );

    expect(screen.getByPlaceholderText('Message...')).toBeInTheDocument();
    expect(screen.getByAltText('Send Message')).toBeInTheDocument();
  });

  test('updates input value on change', () => {
    render(
      <Provider store={store}>
        <SendMessage socket={mockSocket} />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Message...');
    fireEvent.change(input, { target: { value: 'Hello' } });

    expect(input).toHaveValue('Hello');
  });

  test('emits message and clears input on send', () => {
    render(
      <Provider store={store}>
        <SendMessage socket={mockSocket} />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Message...');
    const sendButton = screen.getByAltText('Send Message');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    expect(mockSocket.emit).toHaveBeenCalledWith('send_message', {
      username: 'testUser',
      room: 'testRoom',
      message: 'Hello',
      __createdAt__: expect.any(Number),
    });

    expect(input).toHaveValue('');
  });

  test('does not send an empty message', () => {
    render(
      <Provider store={store}>
        <SendMessage socket={mockSocket} />
      </Provider>
    );

    const sendButton = screen.getByAltText('Send Message');
    fireEvent.click(sendButton);

    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});
