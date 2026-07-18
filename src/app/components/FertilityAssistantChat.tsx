import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  topic?: string;
}

interface FertilityAssistantChatProps {
  onClose: () => void;
}

const topics = [
  {
    id: 'success-rate',
    title: 'Personal Success Chances',
    icon: '📊',
    questions: [
      "Let's start by understanding your personal situation. How old are you?",
      "Do you have any known fertility-related conditions? (e.g., PCOS, endometriosis, low ovarian reserve, or male factor infertility)",
      "Have you had any fertility testing done? If so, what were the results?",
      "Based on what you've shared, I recommend discussing your specific success rates with your doctor. Factors like age, ovarian reserve, and any medical conditions can significantly impact your chances. Your doctor can provide personalized statistics based on your situation."
    ]
  },
  {
    id: 'treatment-rounds',
    title: 'Treatment Rounds Needed',
    icon: '🔄',
    questions: [
      "Now let's talk about treatment rounds. What is your goal for family building? How many children would you like to have?",
      "Research shows that 45% of patients achieve pregnancy after 3 IVF cycles. Some succeed after just one cycle, while others may need more. Are you prepared financially and emotionally for multiple rounds if needed?",
      "Each cycle consists of 10-14 days of ovarian stimulation medications followed by an egg retrieval procedure. After retrieval, you'll know how many eggs were collected and can discuss with your doctor whether another cycle is recommended. Does this timeline work for you?"
    ]
  },
  {
    id: 'storage',
    title: 'Embryo & Egg Storage',
    icon: '🏥',
    questions: [
      "Let's discuss storage options. Do you have a preference for where your eggs or embryos will be stored?",
      "Some clinics store tissue onsite, while others use third-party facilities like TMRW Life Sciences or HavenCryo. Would you like to know more about the storage options at specific clinics?",
      "Storage fees typically range from $500-$1,000 per year. This is an ongoing cost to factor into your budget. Have you considered long-term storage costs?"
    ]
  },
  {
    id: 'side-effects',
    title: 'Treatment Side Effects',
    icon: '💊',
    questions: [
      "Let's talk about what to expect during treatment. Are you aware of the common side effects of ovarian stimulation?",
      "Common side effects include bloating, soreness and bruising at injection sites, moodiness, anxiety, and headaches. Do any of these concern you?",
      "There's also a rare but serious condition called OHSS (Ovarian Hyperstimulation Syndrome) that occurs in less than 5% of cycles. It's more common in younger patients and those with PCOS. Do you have any risk factors for OHSS?",
      "I recommend discussing your specific risk profile with your doctor and asking about strategies to minimize side effects based on your medical history."
    ]
  },
  {
    id: 'costs',
    title: 'Treatment Costs',
    icon: '💰',
    questions: [
      "Let's discuss the financial aspect. What is your budget range for fertility treatment?",
      "Costs typically include consultation, medications, procedures, lab work, and storage. Have you looked into insurance coverage or payment plans?",
      "Many clinics offer financial assistance programs, medication rebates, discounted pharmacy options, and fertility grants. Would you like me to help you find clinics that offer these programs?",
      "Resources like Compassionate Care can help with medication costs. I can help you compare total costs across different clinics in our search results."
    ]
  },
  {
    id: 'contact',
    title: 'Point of Contact',
    icon: '👥',
    questions: [
      "Finally, let's talk about communication during treatment. How important is direct doctor access to you?",
      "In many clinics, a nurse or nursing team will be your primary contact once treatment starts. Are you comfortable with this arrangement?",
      "Would you like to know how to set up dedicated time with your doctor for questions or concerns outside of regular appointments?",
      "I recommend asking about communication protocols during your consultation - how results are shared, who to call with questions, and response times."
    ]
  }
];

export function FertilityAssistantChat({ onClose }: FertilityAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your Fertility Treatment Assistant. I'm here to help you understand what to expect and find the right clinic for your needs. I'll guide you through 6 important topics:\n\n📊 Your personal success chances\n🔄 Treatment rounds needed\n🏥 Storage options\n💊 Side effects to expect\n💰 Cost planning\n👥 Your care team\n\nShall we get started?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [currentTopicIndex, setCurrentTopicIndex] = useState(-1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<Set<number>>(new Set());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, type: 'ai' | 'user', topic?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      topic
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = async (content: string, topic?: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    addMessage(content, 'ai', topic);
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addMessage(userMessage, 'user');
    setInputValue('');

    // If we haven't started topics yet, start the first one
    if (currentTopicIndex === -1) {
      setCurrentTopicIndex(0);
      setCurrentQuestionIndex(0);
      await simulateTyping(topics[0].questions[0], topics[0].id);
      return;
    }

    // Move to next question in current topic
    const currentTopic = topics[currentTopicIndex];
    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < currentTopic.questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      await simulateTyping(currentTopic.questions[nextQuestionIndex], currentTopic.id);
    } else {
      // Topic completed, mark it and move to next topic
      setCompletedTopics(prev => new Set([...prev, currentTopicIndex]));
      const nextTopicIndex = currentTopicIndex + 1;

      if (nextTopicIndex < topics.length) {
        setCurrentTopicIndex(nextTopicIndex);
        setCurrentQuestionIndex(0);
        await simulateTyping(
          `Great! Let's move on to the next topic: ${topics[nextTopicIndex].icon} ${topics[nextTopicIndex].title}`,
          topics[nextTopicIndex].id
        );
        await new Promise(resolve => setTimeout(resolve, 500));
        await simulateTyping(topics[nextTopicIndex].questions[0], topics[nextTopicIndex].id);
      } else {
        // All topics completed
        await simulateTyping(
          "Thank you for sharing all that information! 🎉\n\nBased on what we've discussed, I recommend:\n\n✅ Schedule consultations with 2-3 clinics to discuss your specific situation\n✅ Ask about their success rates for patients with your profile\n✅ Inquire about financial assistance programs\n✅ Request detailed cost breakdowns including all procedures and medications\n✅ Understand their communication protocols and care team structure\n\nWould you like me to help you filter clinics based on your preferences?"
        );
      }
    }
  };

  const handleQuickStart = async () => {
    setCurrentTopicIndex(0);
    setCurrentQuestionIndex(0);
    await simulateTyping(topics[0].questions[0], topics[0].id);
  };

  const handleSkipTopic = async () => {
    if (currentTopicIndex === -1) return;

    const currentTopic = topics[currentTopicIndex];
    setCompletedTopics(prev => new Set([...prev, currentTopicIndex]));
    const nextTopicIndex = currentTopicIndex + 1;

    if (nextTopicIndex < topics.length) {
      setCurrentTopicIndex(nextTopicIndex);
      setCurrentQuestionIndex(0);
      await simulateTyping(
        `Let's move on to: ${topics[nextTopicIndex].icon} ${topics[nextTopicIndex].title}`,
        topics[nextTopicIndex].id
      );
      await new Promise(resolve => setTimeout(resolve, 500));
      await simulateTyping(topics[nextTopicIndex].questions[0], topics[nextTopicIndex].id);
    } else {
      await simulateTyping(
        "We've covered all the main topics! Would you like me to help you find clinics that match your needs?"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <Card className="w-full md:max-w-2xl h-[100vh] md:h-[85vh] flex flex-col bg-white rounded-none md:rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white">Fertility Assistant</h3>
              <p className="text-xs text-white/80">Powered by AI</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        {currentTopicIndex >= 0 && (
          <div className="px-4 py-3 bg-gray-50 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">
                Topic {currentTopicIndex + 1} of {topics.length}
              </span>
              <span className="text-xs text-gray-600">
                {completedTopics.size} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentTopicIndex + 1) / topics.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Topics Overview */}
        <div className="px-4 py-3 bg-[#F1F1E4] border-b">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {topics.map((topic, index) => (
              <button
                key={index}
                onClick={() => setCurrentTopicIndex(index)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                  completedTopics.has(index)
                    ? 'bg-green-100 text-green-700'
                    : index === currentTopicIndex
                    ? 'bg-[#313131] text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-[#313131] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-3 h-3 text-[#5e6300]" />
                      <span className="text-xs text-gray-500">Assistant</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        {currentTopicIndex === -1 && (
          <div className="px-4 py-3 border-t bg-gray-50">
            <div className="flex gap-2">
              <Button
                onClick={handleQuickStart}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Consultation
              </Button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          {currentTopicIndex >= 0 && currentTopicIndex < topics.length && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipTopic}
              className="w-full mb-2 text-gray-500 hover:text-gray-700"
            >
              Skip to next topic →
            </Button>
          )}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your response..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            This AI assistant provides general guidance. Always consult with medical professionals for personalized advice.
          </p>
        </div>
      </Card>
    </div>
  );
}