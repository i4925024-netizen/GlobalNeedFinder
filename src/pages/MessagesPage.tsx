import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  subscribeToUserConversations,
  subscribeToMessages,
  sendMessage,
} from '../services/conversationsService';
import { Conversation, Message } from '../types';
import {
  MessageSquare,
  Send,
  User,
  Clock,
  Layers,
  Search,
  ArrowLeft,
  CheckCheck,
} from 'lucide-react';

interface MessagesPageProps {
  navigate: (path: string) => void;
  urlParams: URLSearchParams;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ navigate, urlParams }) => {
  const { currentUser, userProfile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(urlParams.get('id') || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to user conversations
  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeToUserConversations(currentUser.uid, (list) => {
      setConversations(list);
      if (!activeConvId && list.length > 0 && !urlParams.get('id')) {
        setActiveConvId(list[0].id);
      }
    });
    return () => unsub?.();
  }, [currentUser]);

  // Sync activeConvId if query param changes
  useEffect(() => {
    const qId = urlParams.get('id');
    if (qId) {
      setActiveConvId(qId);
    }
  }, [urlParams]);

  // Subscribe to messages in active conversation
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }
    const unsub = subscribeToMessages(activeConvId, (msgs) => {
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
    return () => unsub?.();
  }, [activeConvId]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !activeConvId || !inputText.trim() || isSending) return;

    const otherParticipantId =
      activeConv?.participants.find((p) => p !== currentUser.uid) || '';

    try {
      setIsSending(true);
      await sendMessage(
        activeConvId,
        currentUser.uid,
        userProfile?.displayName || 'User',
        inputText.trim(),
        otherParticipantId
      );
      setInputText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-lg font-bold">Please sign in to view messages</h2>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  const getRecipientName = (conv: Conversation) => {
    const otherId = conv.participants.find((p) => p !== currentUser.uid);
    if (!otherId) return 'Participant';
    return conv.participantNames?.[otherId] || 'User';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">NeedFinder Messages</h1>
          <p className="text-xs text-slate-500">
            Secure, end-to-end direct communication with buyers and providers
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[720px]">
        {/* Left: Conversation List */}
        <div
          className={`w-full md:w-80 border-r border-slate-200 flex flex-col ${
            activeConvId ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Conversations ({conversations.length})
            </h3>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {conversations.length > 0 ? (
              conversations.map((conv) => {
                const isSelected = conv.id === activeConvId;
                const otherName = getRecipientName(conv);
                const timeStr = conv.updatedAt?.seconds
                  ? new Date(conv.updatedAt.seconds * 1000).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      navigate(`/messages?id=${conv.id}`);
                    }}
                    className={`p-4 cursor-pointer transition select-none ${
                      isSelected
                        ? 'bg-blue-50/80 border-l-4 border-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {otherName[0].toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {otherName}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{timeStr}</span>
                    </div>

                    {conv.needTitle && (
                      <div className="mt-1 text-[11px] text-blue-600 font-medium truncate flex items-center gap-1">
                        <Layers className="w-3 h-3 shrink-0" />
                        <span className="truncate">{conv.needTitle}</span>
                      </div>
                    )}

                    <p className="mt-1 text-xs text-slate-500 truncate">{conv.lastMessageText}</p>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                No active conversations yet. Reach out to providers or receive quotes to start chatting.
              </div>
            )}
          </div>
        </div>

        {/* Right: Message Thread */}
        <div
          className={`flex-1 flex flex-col bg-slate-50/30 ${
            !activeConvId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConv ? (
            <>
              {/* Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConvId(null)}
                    className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                    {getRecipientName(activeConv)[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {getRecipientName(activeConv)}
                    </h3>
                    {activeConv.needTitle && (
                      <p
                        onClick={() =>
                          activeConv.needId && navigate(`/need/${activeConv.needId}`)
                        }
                        className="text-[11px] text-blue-600 hover:underline cursor-pointer truncate max-w-sm"
                      >
                        Regarding: {activeConv.needTitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {messages.length > 0 ? (
                  messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.uid;
                    const timeStr = msg.createdAt?.seconds
                      ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <div
                            className={`mt-1 text-[10px] flex items-center justify-end gap-1 ${
                              isMe ? 'text-blue-100' : 'text-slate-400'
                            }`}
                          >
                            <span>{timeStr}</span>
                            {isMe && <CheckCheck className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-20 text-center text-xs text-slate-400">
                    No messages yet. Send a message to start this discussion.
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 text-xs border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No conversation selected</h3>
              <p className="text-xs text-slate-400 mt-1">
                Choose a conversation from the sidebar to read and reply.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
