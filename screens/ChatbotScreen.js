import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 Hi! I’m your health assistant. How can I help you today?' }
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const sendMessage = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || loading) return;

    const timestamp = new Date().toISOString();
    const newMsgs = [...messages, { role: 'user', content: trimmedQuery, timestamp }];
    setMessages(newMsgs);
    setQuery('');
    setLoading(true);

    try {
      const res = await axios.post('http://192.168.1.6:8080/api/chatbot', {
        message: trimmedQuery,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.data,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Failed to fetch response.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: null })}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map((msg, idx) => (
          <View
            key={idx}
            style={[
              styles.bubble,
              msg.role === 'user' ? styles.user : styles.bot,
            ]}
          >
            <Text style={styles.messageText}>
              {msg.role === 'assistant' ? '🤖' : '🧑'} {msg.content}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        ))}

        {loading && (
          <View style={[styles.bubble, styles.bot]}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={[styles.messageText, { marginLeft: 8 }]}>
              Typing...
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Ask something about health..."
          value={query}
          onChangeText={setQuery}
          editable={!loading}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          placeholderTextColor="grey"
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={[
            styles.sendButton,
            { backgroundColor: !query.trim() || loading ? '#ccc' : '#007bff' },
          ]}
          disabled={!query.trim() || loading}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefefe' },
  chatArea: { flex: 1 },
  chatContent: { padding: 10, paddingBottom: 20 },
  bubble: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  user: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  bot: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f3f6',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

