import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Plus, Upload, FileText, Users, Brain, Globe2, TestTube, PenTool, 
  X, MessageSquare, Menu, Home, User, CheckCircle, Clock, Zap, ChevronRight,
  GraduationCap, BookOpen, Paperclip, AlertCircle, Wifi, WifiOff
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useChat } from '../../../hooks/useChat';
import { useCurrentUser } from '../../../hooks/useAuth';


const Chat = ({ selectedClass, onBackToClasses, onLogout }) => {
  // Get URL parameters
  const { feedId } = useParams();
  // Get current authenticated user
  const { data: currentUser, isLoading: userLoading, error: userError } = useCurrentUser();

  // Real hooks instead of dummy data
  const {
    isConnected,
    isLoading,
    error,
    messages,
    selectedAgent,
    setSelectedAgent,
    sendMessage,
    startNewChat,
    loadExistingChat,
    updateContext,
    clearAllErrors,
    hasActiveChat
  } = useChat();

  // Local state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('conversations');
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Agent configurations
  const agents = {
    rag_agent: {
      name: "RAG Agent",
      icon: Brain,
      color: "bg-emerald-500",
      description: "Student context & memory management",
      shortDesc: "Student data & context"
    },
    hyperlocal_generator: {
      name: "Hyper-Local Generator", 
      icon: Globe2,
      color: "bg-blue-500",
      description: "Culturally relevant content creation",
      shortDesc: "Cultural content creation"
    },
    quiz_generator: {
      name: "Quiz Generator",
      icon: TestTube,
      color: "bg-purple-500", 
      description: "Multi-grade assessment creation",
      shortDesc: "Quiz & assessments"
    },
    assessment_agent: {
      name: "Assessment Agent",
      icon: PenTool,
      color: "bg-orange-500",
      description: "Handwritten work evaluation", 
      shortDesc: "Work evaluation"
    }
  };

  // Initialize chat when component mounts
  useEffect(() => {
    if (selectedClass && !hasActiveChat && currentUser?.id) {
      const initChat = async () => {
        // If feedId exists in URL, load existing chat
        if (feedId) {
          console.log('Loading existing chat from URL:', feedId);
          const result = await loadExistingChat(feedId, selectedClass.id);
          if (!result.success) {
            console.error('Failed to load existing chat:', result.error);
            // If loading existing chat fails, start a new one
            await startNewChat({
              userId: currentUser.id,
              classId: selectedClass.id,
              title: `${selectedClass.name} Chat`,
              contextData: `Working with ${selectedClass.name} - Grades: ${selectedClass.grades?.join(', ') || 'Multi-grade'}`,
              selectedAgents: Object.keys(agents)
            });
          }
        } else {
          // No feedId in URL, start new chat
          const result = await startNewChat({
            userId: currentUser.id,
            classId: selectedClass.id,
            title: `${selectedClass.name} Chat`,
            contextData: `Working with ${selectedClass.name} - Grades: ${selectedClass.grades?.join(', ') || 'Multi-grade'}`,
            selectedAgents: Object.keys(agents)
          });

          if (!result.success) {
            console.error('Failed to initialize chat:', result.error);
          }
        }
      };

      initChat();
    }
  }, [selectedClass, hasActiveChat, startNewChat, loadExistingChat, currentUser, feedId]);

  // Update context when documents/students change
  useEffect(() => {
    updateContext(selectedDocuments, selectedStudents);
  }, [selectedDocuments, selectedStudents, updateContext]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [currentMessage]);

  // Send message handler
  const handleSendMessage = () => {
    if (!currentMessage.trim() || isLoading) return;

    const result = sendMessage(currentMessage);
    if (result.success) {
      setCurrentMessage('');
    } else {
      console.error('Failed to send message:', result.error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Create new conversation
  const createNewConversation = async () => {
    if (!currentUser?.id) {
      console.error('No authenticated user found');
      return;
    }

    const result = await startNewChat({
      userId: currentUser.id,
      classId: selectedClass.id,
      title: "New Conversation",
      contextData: `New chat for ${selectedClass.name}`,
      selectedAgents: Object.keys(agents)
    });

    if (result.success) {
      // Add to conversations list
      const newConversation = {
        id: result.feedId,
        title: "New Conversation",
        lastMessage: "",
        timestamp: new Date().toISOString(),
        agent: selectedAgent
      };
      setConversations([newConversation, ...conversations]);
      setSelectedConversation(newConversation);
    }
  };

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className={`flex items-center space-x-2 text-sm ${
      isConnected ? 'text-green-600' : 'text-red-600'
    }`}>
      {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
      <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
    </div>
  );

  // Error display
  const ErrorDisplay = () => error && (
    <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
      <AlertCircle className="text-red-500" size={16} />
      <span className="text-red-700 text-sm">{error}</span>
      <button 
        onClick={clearAllErrors}
        className="text-red-600 hover:text-red-800 ml-auto"
      >
        <X size={16} />
      </button>
    </div>
  );

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        {/* Header */}
        <div className="h-20 p-4 border-b border-gray-200 flex items-center">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            
            {!sidebarCollapsed && (
              <div className="flex-1 mx-4">
                <h1 className="text-lg font-bold text-gray-900">Sahayak</h1>
                <p className="text-sm text-gray-600">{selectedClass?.name}</p>
              </div>
            )}
          </div>
        </div>

        {!sidebarCollapsed && (
          <>
            {/* Connection Status */}
            <div className="px-4 py-2 border-b border-gray-200">
              <ConnectionStatus />
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'conversations', label: 'Chats', icon: MessageSquare },
                  { id: 'students', label: 'Students', icon: Users },
                  { id: 'documents', label: 'Docs', icon: FileText }
                ].map(tab => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id)}
                      className={`flex-1 py-3 px-2 text-xs font-medium border-b-2 flex items-center justify-center space-x-1 ${
                        activeSection === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <IconComponent size={14} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {activeSection === 'conversations' && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Conversations</h3>
                    <button
                      onClick={createNewConversation}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      disabled={!isConnected}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  {conversations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="mx-auto mb-3 text-gray-400" size={32} />
                      <p className="text-sm">No conversations yet</p>
                      <p className="text-xs">Start a new chat to begin</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {conversations.map(conversation => (
                        <div
                          key={conversation.id}
                          onClick={() => setSelectedConversation(conversation)}
                          className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                            selectedConversation?.id === conversation.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-transparent hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`p-1 rounded ${agents[conversation.agent]?.color || 'bg-gray-500'} text-white`}>
                              {React.createElement(agents[conversation.agent]?.icon || MessageSquare, { size: 12 })}
                            </div>
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {conversation.title}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                          <span className="text-xs text-gray-400">
                            {new Date(conversation.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'students' && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Students</h3>
                    <span className="text-xs text-gray-500">{selectedStudents.length} selected</span>
                  </div>
                  
                  <div className="text-center py-8 text-gray-500">
                    <Users className="mx-auto mb-3 text-gray-400" size={32} />
                    <p className="text-sm">No student data loaded</p>
                    <p className="text-xs">Upload student roster to see students</p>
                  </div>
                </div>
              )}

              {activeSection === 'documents' && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Documents</h3>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload size={16} />
                    </button>
                  </div>
                  
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="mx-auto mb-3 text-gray-400" size={32} />
                    <p className="text-sm">No documents uploaded</p>
                    <p className="text-xs">Upload PDFs, DOCX files to get started</p>
                  </div>
                </div>
              )}
            </div>

            {/* AI Agent Selection */}
            <div className="border-t border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">AI Teaching Agents</h3>
              <div className="space-y-2">
                {Object.entries(agents).map(([key, agent]) => {
                  const IconComponent = agent.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedAgent(key)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedAgent === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      disabled={!isConnected}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded ${agent.color} text-white`}>
                          <IconComponent size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{agent.name}</div>
                          <div className="text-xs text-gray-500">{agent.shortDesc}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={onLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
              >
                <User size={16} />
                <span>Logout</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-20 bg-slate-50 border-b border-gray-200 px-6 flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${agents[selectedAgent]?.color || 'bg-gray-500'} text-white`}>
                {React.createElement(agents[selectedAgent]?.icon || Brain, { size: 20 })}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{agents[selectedAgent]?.name || 'AI Agent'}</h2>
                <p className="text-sm text-gray-600">{agents[selectedAgent]?.description || 'AI Assistant'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBackToClasses}
                className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
              >
                <Home size={16} />
                <span>Back to Classes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        <ErrorDisplay />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 ${agents[selectedAgent]?.color || 'bg-gray-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {React.createElement(agents[selectedAgent]?.icon || Brain, { size: 32, className: "text-white" })}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to {agents[selectedAgent]?.name || 'AI Assistant'}</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">{agents[selectedAgent]?.description || 'Your AI teaching assistant'}</p>
              
              {!isConnected && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto mb-6">
                  <div className="flex items-center space-x-2 text-yellow-800">
                    <AlertCircle size={16} />
                    <span className="text-sm">Connecting to chat server...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'} rounded-lg p-4 shadow-sm`}>
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`p-1.5 rounded ${agents[message.agent]?.color || 'bg-gray-500'} text-white`}>
                          {React.createElement(agents[message.agent]?.icon || Brain, { size: 16 })}
                        </div>
                        <span className="font-medium text-gray-900">{agents[message.agent]?.name || 'AI Assistant'}</span>
                      </div>
                    )}
                    
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500 mb-2">Sources used:</div>
                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((source, index) => (
                            <div key={index} className="bg-gray-50 px-2 py-1 rounded text-xs text-gray-600 flex items-center space-x-1">
                              <FileText size={12} />
                              <span>{source}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className={`text-xs mt-3 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm max-w-xs">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-1.5 rounded ${agents[selectedAgent]?.color || 'bg-gray-500'} text-white`}>
                        {React.createElement(agents[selectedAgent]?.icon || Brain, { size: 16 })}
                      </div>
                      <span className="font-medium text-gray-900">{agents[selectedAgent]?.name || 'AI Assistant'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-6">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? `Message ${agents[selectedAgent]?.name || 'AI Assistant'}...` : "Connecting..."}
                className="w-full shadow px-6 py-4 bg-white border focus:ring-1 focus:ring-slate-300 focus:outline-none border-slate-200/50 rounded-2xl resize-none min-h-[56px] max-h-32"
                rows={1}
                disabled={isLoading || !isConnected}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading || !isConnected}
              className="p-4 bg-white/90 hover:bg-white text-slate-700 rounded-2xl transition-colors shadow-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-3 text-xs text-slate-500 text-center">
            {isConnected ? (
              <>Press Enter to send • Shift+Enter for new line • {agents[selectedAgent]?.name || 'AI Assistant'} ready</>
            ) : (
              <>Connecting to server...</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
