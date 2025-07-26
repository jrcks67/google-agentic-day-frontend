import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Plus, Upload, FileText, Users, Brain, Globe2, TestTube, PenTool, 
  X, Eye, MessageSquare, Menu, Home, User, CheckCircle, Clock, Zap, ChevronRight,
  GraduationCap, BookOpen, Paperclip,
} from 'lucide-react';

// Mock data
const mockStudents = [
  { id: 1, name: "Aarti Sharma", grade: "3", language: "Hindi", learningStyle: "Visual", performance: 85 },
  { id: 2, name: "Rohan Patel", grade: "2", language: "Gujarati", learningStyle: "Kinesthetic", performance: 78 },
  { id: 3, name: "Priya Singh", grade: "4", language: "Hindi", learningStyle: "Auditory", performance: 92 },
  { id: 4, name: "Meena Joshi", grade: "1", language: "Marathi", learningStyle: "Visual", performance: 88 },
  { id: 5, name: "Arjun Kumar", grade: "3", language: "Hindi", learningStyle: "Reading", performance: 76 }
];

const mockDocuments = {
  student_data: [
    {
      id: 1,
      name: "Class Attendance Records Q1",
      type: "xlsx",
      size: "1.2 MB",
      status: "processed",
      uploadedAt: "2024-07-20T09:00:00Z",
      chunks: 25,
      category: "attendance"
    },
    {
      id: 2,
      name: "Previous Quiz Results - Math",
      type: "csv",
      size: "850 KB",
      status: "processed",
      uploadedAt: "2024-07-25T10:30:00Z",
      chunks: 18,
      category: "assessment"
    }
  ],
  subject_docs: [
    {
      id: 3,
      name: "Mathematics Basics Grade 1-3",
      type: "pdf",
      size: "2.4 MB",
      status: "processed",
      uploadedAt: "2024-07-20T09:00:00Z",
      chunks: 45,
      subject: "Math"
    },
    {
      id: 4,
      name: "Science Experiments Local Context",
      type: "docx",
      size: "1.8 MB",
      status: "ready_immediate",
      uploadedAt: "2024-07-26T08:30:00Z",
      chunks: 23,
      subject: "Science"
    },
    {
      id: 5,
      name: "Hindi Stories for Grade 2-4",
      type: "pdf",
      size: "3.1 MB",
      status: "processing",
      uploadedAt: "2024-07-26T10:15:00Z",
      chunks: 0,
      subject: "Hindi"
    }
  ]
};

const mockConversations = [
  {
    id: 1,
    title: "Math story problems for mixed grades",
    lastMessage: "Create story problems using local festival context...",
    timestamp: "2024-07-26T10:30:00Z",
    agent: "content"
  },
  {
    id: 2,
    title: "Assessment for Aarti's Hindi progress",
    lastMessage: "Generate quiz for Grade 3 Hindi comprehension...",
    timestamp: "2024-07-26T09:15:00Z",
    agent: "quiz"
  },
  {
    id: 3,
    title: "Student performance analysis",
    lastMessage: "Analyze learning patterns across grades...",
    timestamp: "2024-07-25T16:20:00Z",
    agent: "rag"
  }
];

const Chat = ({ selectedClass, onBackToClasses, onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('conversations');
  const [activeDocumentTab, setActiveDocumentTab] = useState('subject_docs');
  const [selectedAgent, setSelectedAgent] = useState('content');
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [documents, setDocuments] = useState(mockDocuments);
  const [students] = useState(mockStudents);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('subject_docs');
  const [uploadMode, setUploadMode] = useState('single');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const agents = {
    rag: {
      name: "RAG Agent",
      icon: Brain,
      color: "bg-emerald-500",
      description: "Student context & memory management",
      shortDesc: "Student data & context"
    },
    content: {
      name: "Hyper-Local Generator", 
      icon: Globe2,
      color: "bg-blue-500",
      description: "Culturally relevant content creation",
      shortDesc: "Cultural content creation"
    },
    quiz: {
      name: "Quiz Generator",
      icon: TestTube,
      color: "bg-purple-500", 
      description: "Multi-grade assessment creation",
      shortDesc: "Quiz & assessments"
    },
    assessment: {
      name: "Assessment Agent",
      icon: PenTool,
      color: "bg-orange-500",
      description: "Handwritten work evaluation", 
      shortDesc: "Work evaluation"
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [currentMessage]);

  // Load conversation when selected
  useEffect(() => {
    if (selectedConversation) {
      const allDocs = [...documents.student_data, ...documents.subject_docs];
      const mockHistory = [
        {
          id: 1,
          type: 'user',
          content: selectedConversation.lastMessage,
          timestamp: new Date(selectedConversation.timestamp),
          agent: selectedConversation.agent
        },
        {
          id: 2,
          type: 'ai',
          content: `I'll help you with that request. Based on your class context with students from grades ${selectedClass?.grades.join(', ')}, I can create appropriate content. Let me analyze the available documents and student profiles to provide the best response.`,
          timestamp: new Date(selectedConversation.timestamp),
          agent: selectedConversation.agent,
          sources: allDocs.filter(d => d.status === 'processed').slice(0, 2)
        }
      ];
      setChatMessages(mockHistory);
      setSelectedAgent(selectedConversation.agent);
    }
  }, [selectedConversation, selectedClass, documents]);

  const createNewConversation = () => {
    const newConversation = {
      id: conversations.length + 1,
      title: "New Conversation",
      lastMessage: "",
      timestamp: new Date().toISOString(),
      agent: selectedAgent
    };
    setConversations([newConversation, ...conversations]);
    setSelectedConversation(newConversation);
    setChatMessages([]);
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      content: currentMessage,
      timestamp: new Date(),
      agent: selectedAgent,
      context: {
        selectedStudents: selectedStudents.length > 0 ? selectedStudents : null,
        selectedDocuments: selectedDocuments.length > 0 ? selectedDocuments : null
      }
    };

    setChatMessages([...chatMessages, newMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Update conversation title if it's the first message
    if (selectedConversation && selectedConversation.title === "New Conversation") {
      const updatedConversation = {
        ...selectedConversation,
        title: currentMessage.slice(0, 50) + (currentMessage.length > 50 ? '...' : ''),
        lastMessage: currentMessage
      };
      setConversations(prev => prev.map(c => c.id === selectedConversation.id ? updatedConversation : c));
      setSelectedConversation(updatedConversation);
    }

    // Simulate AI response
    setTimeout(() => {
      const contextInfo = [];
      if (selectedStudents.length > 0) {
        contextInfo.push(`Working with ${selectedStudents.length} selected students`);
      }
      if (selectedDocuments.length > 0) {
        contextInfo.push(`Using ${selectedDocuments.length} documents as reference`);
      }

      const aiResponse = {
        id: chatMessages.length + 2,
        type: 'ai',
        content: `${agents[selectedAgent].name} response: I understand you want to work with "${currentMessage}". ${contextInfo.length > 0 ? contextInfo.join(' and ') + '. ' : ''}Based on your class context and the ${agents[selectedAgent].description.toLowerCase()}, I'll help you create the appropriate content for your multi-grade classroom.`,
        timestamp: new Date(),
        agent: selectedAgent,
        sources: selectedDocuments.length > 0 ? selectedDocuments : [...documents.student_data, ...documents.subject_docs].filter(d => d.status === 'processed').slice(0, 2),
        context: {
          studentsAnalyzed: selectedStudents.length || students.length,
          documentsUsed: selectedDocuments.length || [...documents.student_data, ...documents.subject_docs].filter(d => d.status === 'processed').length
        }
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleStudentSelection = (student) => {
    setSelectedStudents(prev => 
      prev.find(s => s.id === student.id)
        ? prev.filter(s => s.id !== student.id)
        : [...prev, student]
    );
  };

  const toggleDocumentSelection = (document) => {
    setSelectedDocuments(prev =>
      prev.find(d => d.id === document.id)
        ? prev.filter(d => d.id !== document.id)
        : [...prev, document]
    );
  };

  const handleFileUpload = (files) => {
    const newDocuments = Array.from(files).map((file, index) => ({
      id: [...documents.student_data, ...documents.subject_docs].length + index + 1,
      name: file.name,
      type: file.type.split('/')[1] || 'unknown',
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      status: uploadMode === 'immediate' ? 'ready_immediate' : 'processing',
      uploadedAt: new Date().toISOString(),
      chunks: uploadMode === 'immediate' ? Math.floor(Math.random() * 30) + 10 : 0,
      subject: uploadCategory === 'subject_docs' ? "General" : undefined,
      category: uploadCategory === 'student_data' ? "general" : undefined
    }));
    
    setDocuments(prev => ({
      ...prev,
      [uploadCategory]: [...prev[uploadCategory], ...newDocuments]
    }));
    setSelectedFiles([]);
    setShowUploadModal(false);
  };

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Upload Documents</h3>
          <button 
            onClick={() => setShowUploadModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Document Category</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setUploadCategory('student_data')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                uploadCategory === 'student_data'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Student Data</div>
                  <div className="text-sm text-gray-500">Attendance, results, quiz scores</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setUploadCategory('subject_docs')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                uploadCategory === 'subject_docs'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <BookOpen size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Subject Documents</div>
                  <div className="text-sm text-gray-500">Math, science, history materials</div>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        {/* Processing Mode */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Processing Mode</label>
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input 
                type="radio" 
                value="single" 
                checked={uploadMode === 'single'}
                onChange={(e) => setUploadMode(e.target.value)}
                className="mr-3"
              />
              <div>
                <span className="font-medium text-sm">Background Processing</span>
                <p className="text-xs text-gray-500">2-5 minutes • Best quality analysis</p>
              </div>
            </label>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input 
                type="radio" 
                value="immediate" 
                checked={uploadMode === 'immediate'}
                onChange={(e) => setUploadMode(e.target.value)}
                className="mr-3"
              />
              <div className="flex items-center">
                <div>
                  <span className="font-medium text-sm">Quick Mode</span>
                  <p className="text-xs text-gray-500">30-60 seconds • Instant availability</p>
                </div>
                <Zap className="ml-2 text-yellow-500" size={16} />
              </div>
            </label>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input 
                type="radio" 
                value="bulk" 
                checked={uploadMode === 'bulk'}
                onChange={(e) => setUploadMode(e.target.value)}
                className="mr-3"
              />
              <div>
                <span className="font-medium text-sm">Bulk Upload</span>
                <p className="text-xs text-gray-500">5-15 minutes • Multiple files</p>
              </div>
            </label>
          </div>
        </div>
        
        {/* File Drop Area */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto text-gray-400 mb-3" size={40} />
          <p className="text-lg font-medium text-gray-700 mb-1">Drop files here or click to browse</p>
          <p className="text-sm text-gray-500">PDF, DOCX, TXT, CSV, XLSX files supported</p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple={uploadMode === 'bulk'}
          accept=".pdf,.docx,.txt,.csv,.xlsx"
          onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
          className="hidden"
        />
        
        {selectedFiles.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Selected Files ({selectedFiles.length})</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-white p-2 rounded border">
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-blue-500" />
                    <span className="text-gray-900">{file.name}</span>
                  </div>
                  <span className="text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setShowUploadModal(false)}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => handleFileUpload(selectedFiles)}
            disabled={selectedFiles.length === 0}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        {/* Header - Fixed height for alignment */}
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
                <p className="text-sm text-gray-600">{selectedClass.name}</p>
              </div>
            )}
          </div>
        </div>

        {!sidebarCollapsed && (
          <>
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
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
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
                          <div className={`p-1 rounded ${agents[conversation.agent].color} text-white`}>
                            {React.createElement(agents[conversation.agent].icon, { size: 12 })}
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
                </div>
              )}

              {activeSection === 'students' && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Students</h3>
                    <span className="text-xs text-gray-500">{selectedStudents.length} selected</span>
                  </div>
                  
                  <div className="space-y-2">
                    {students.map(student => (
                      <div
                        key={student.id}
                        onClick={() => toggleStudentSelection(student)}
                        className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                          selectedStudents.find(s => s.id === student.id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{student.name}</div>
                            <div className="text-xs text-gray-500">
                              Grade {student.grade} • {student.language} • {student.learningStyle}
                            </div>
                          </div>
                          <div className="text-xs font-medium text-blue-600">
                            {student.performance}%
                          </div>
                        </div>
                      </div>
                    ))}
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
                  
                  {/* Document Category Tabs */}
                  <div className="mb-4">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                      <button
                        onClick={() => setActiveDocumentTab('subject_docs')}
                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all ${
                          activeDocumentTab === 'subject_docs'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Subject Docs
                      </button>
                      <button
                        onClick={() => setActiveDocumentTab('student_data')}
                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all ${
                          activeDocumentTab === 'student_data'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Student Data
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {documents[activeDocumentTab].map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => toggleDocumentSelection(doc)}
                        className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                          selectedDocuments.find(d => d.id === doc.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText size={16} className="text-blue-500" />
                          <span className="font-medium text-sm truncate">{doc.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{doc.size}</span>
                          <div className="flex items-center space-x-1">
                            {doc.status === 'processed' && <CheckCircle className="text-green-500" size={12} />}
                            {doc.status === 'processing' && <Clock className="text-yellow-500 animate-spin" size={12} />}
                            {doc.status === 'ready_immediate' && <Zap className="text-blue-500" size={12} />}
                            <span className={`px-1.5 py-0.5 rounded text-xs ${
                              doc.status === 'processed' ? 'bg-green-100 text-green-800' :
                              doc.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {doc.status === 'processed' ? 'Ready' : 
                               doc.status === 'processing' ? 'Processing' : 'Quick'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
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
        {/* Chat Header - Fixed height for alignment */}
        <div className="h-20 bg-slate-50 border-b border-gray-200 px-6 flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${agents[selectedAgent].color} text-white`}>
                {React.createElement(agents[selectedAgent].icon, { size: 20 })}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{agents[selectedAgent].name}</h2>
                <p className="text-sm text-gray-600">{agents[selectedAgent].description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {selectedStudents.length > 0 && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {selectedStudents.length} students
                    </span>
                  )}
                  {selectedDocuments.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {selectedDocuments.length} docs
                    </span>
                  )}
                </div>
              )}
              
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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatMessages.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 ${agents[selectedAgent].color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {React.createElement(agents[selectedAgent].icon, { size: 32, className: "text-white" })}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to {agents[selectedAgent].name}</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">{agents[selectedAgent].description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="bg-gray-50 p-4 rounded-lg text-left">
                  <h4 className="font-medium text-gray-900 mb-2">Example Prompts:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedAgent === 'content' && (
                      <>
                        <li>• Create math story problems about local festivals</li>
                        <li>• Write science experiments using regional materials</li>
                        <li>• Generate Hindi stories for mixed grades</li>
                      </>
                    )}
                    {selectedAgent === 'quiz' && (
                      <>
                        <li>• Create quiz for Grade 2-3 mathematics</li>
                        <li>• Generate assessment for Hindi comprehension</li>
                        <li>• Make science questions with local context</li>
                      </>
                    )}
                    {selectedAgent === 'rag' && (
                      <>
                        <li>• Show me struggling students in mathematics</li>
                        <li>• Analyze learning patterns by grade</li>
                        <li>• Find students who prefer visual learning</li>
                      </>
                    )}
                    {selectedAgent === 'assessment' && (
                      <>
                        <li>• Evaluate uploaded worksheet images</li>
                        <li>• Provide feedback on student responses</li>
                        <li>• Analyze handwriting assessment results</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-left">
                  <h4 className="font-medium text-gray-900 mb-2">Context Available:</h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Students in class:</span>
                      <span className="font-medium">{students.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Documents uploaded:</span>
                      <span className="font-medium">{[...documents.student_data, ...documents.subject_docs].filter(d => d.status === 'processed').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Grades covered:</span>
                      <span className="font-medium">{selectedClass.grades.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {chatMessages.map(message => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'} rounded-lg p-4 shadow-sm`}>
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`p-1.5 rounded ${agents[message.agent].color} text-white`}>
                          {React.createElement(agents[message.agent].icon, { size: 16 })}
                        </div>
                        <span className="font-medium text-gray-900">{agents[message.agent].name}</span>
                      </div>
                    )}
                    
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    
                    {message.context && message.type === 'ai' && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>📊 {message.context.studentsAnalyzed} students analyzed</span>
                          <span>📚 {message.context.documentsUsed} documents used</span>
                        </div>
                      </div>
                    )}
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500 mb-2">Sources used:</div>
                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((source, index) => (
                            <div key={index} className="bg-gray-50 px-2 py-1 rounded text-xs text-gray-600 flex items-center space-x-1">
                              <FileText size={12} />
                              <span>{source.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className={`text-xs mt-3 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm max-w-xs">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-1.5 rounded ${agents[selectedAgent].color} text-white`}>
                        {React.createElement(agents[selectedAgent].icon, { size: 16 })}
                      </div>
                      <span className="font-medium text-gray-900">{agents[selectedAgent].name}</span>
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
        <div className=" p-6">
          {/* Context Preview */}
          {(selectedStudents.length > 0 || selectedDocuments.length > 0) && (
            <div className="mb-4 p-4 bg-white rounded-2xl border border-slate-400">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">Context for this message:</span>
                <button
                  onClick={() => {
                    setSelectedStudents([]);
                    setSelectedDocuments([]);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedStudents.map(student => (
                  <div key={student.id} className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm flex items-center space-x-2">
                    <User size={14} />
                    <span>{student.name} (Grade {student.grade})</span>
                    <button
                      onClick={() => toggleStudentSelection(student)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {selectedDocuments.map(doc => (
                  <div key={doc.id} className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center space-x-2">
                    <FileText size={14} />
                    <span>{doc.name}</span>
                    <button
                      onClick={() => toggleDocumentSelection(doc)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Enhanced Input Area */}
          <div className="flex items-end gap-3 bg-slate">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Let me help you with your teaching needs...`}
                className="w-full shadow px-6 py-4 bg-white border focus:ring-1 focus:ring-slate-300 focus:outline-none border-slate-200/50 rounded-2xl resize-none min-h-[56px] max-h-32"
                rows={1}
                disabled={isTyping}
              />
              
              {/* Attachment Button */}
              <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                <button
                  onClick={() => setShowDocumentSelector(!showDocumentSelector)}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 shadow rounded-lg transition-colors"
                  title="Attach documents"
                >
                  <Paperclip size={18} />
                </button>
              </div>
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!currentMessage.trim() || isTyping}
              className="p-4 bg-white/90 hover:bg-white text-slate-700 rounded-2xl transition-colors shadow-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Quick Document Selector */}
          {showDocumentSelector && (
            <div className="mt-3 p-4 bg-slate-50/80 border border-slate-200/50 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">Quick attach documents:</span>
                <button
                  onClick={() => setShowDocumentSelector(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                {[...documents.student_data, ...documents.subject_docs]
                  .filter(doc => doc.status === 'processed' || doc.status === 'ready_immediate')
                  .map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      toggleDocumentSelection(doc);
                      setShowDocumentSelector(false);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all text-sm ${
                      selectedDocuments.find(d => d.id === doc.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <FileText size={16} className="text-blue-500" />
                      <span className="font-medium truncate">{doc.name}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{doc.size}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-3 text-xs text-slate-500 text-center">
            Press Enter to send • Shift+Enter for new line • {agents[selectedAgent].name} will use {selectedStudents.length || 'all'} students and {selectedDocuments.length || 'available'} documents
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && <UploadModal />}
    </div>
  );
};

export default Chat;