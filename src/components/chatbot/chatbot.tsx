// Chatbot.tsx
import React, { useState, useEffect, useRef, FC } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';
import styles from './Chatbot.module.css';

const predefinedQuestions = [
  {
    id: 'services',
    question: '¿Qué servicios dispone el spa?',
    answer: 'Ofrecemos una amplia gama de servicios para tu bienestar, incluyendo: Masaje Anti-stress, Masaje Descontracturante, Masaje con Piedras Calientes, Masaje Circulatorio, Lifting de Pestaña y Depilación Facial. ¡Te esperamos para que te sientas renovado/a!'
  },
  {
    id: 'appointment',
    question: '¿Cómo saco un turno?',
    answer: 'Puedes sacar un turno muy fácilmente. Llámanos al +54 911 23 152163 o envíanos un WhatsApp al mismo número. También puedes hacer clic en el botón "Reservá tu turno" en la parte superior de esta página.'
  },
  {
    id: 'hours',
    question: '¿Qué horarios se tienen disponible?',
    answer: 'Nuestros horarios de atención son de Lunes a Sábado de 9:00 a 20:00 hs. Te recomendamos contactarnos para confirmar la disponibilidad para el servicio específico que deseas, ¡así te aseguramos tu lugar!'
  },
  {
    id: 'location',
    question: '¿Dónde están ubicados?',
    answer: 'Nos encontramos en Av. Rep Argentina & Humberto Primo, Resistencia - Chaco. Puedes ver la ubicación exacta y abrirla en Google Maps desde la sección "Sobre Nosotros" de nuestra página.'
  }
];

type Message = {
  text: string;
  sender: 'user' | 'bot';
  type?: 'initial';
};

type Question = {
  id: string | number;
  question: string;
  answer: string;
};

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow: FC<ChatWindowProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    setMessages([
      {
        text: '¡Hola! Soy tu asistente virtual. Selecciona una pregunta de la lista para ayudarte.',
        sender: 'bot',
        type: 'initial',
      },
    ]);
  }, []);

  const handleQuestionClick = (question: string, answer: string) => {
    const newMessages: Message[] = [
      ...messages.filter((msg) => msg.type !== 'initial'),
      { text: question, sender: 'user' },
      { text: answer, sender: 'bot' },
    ];
    setMessages(newMessages);
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <span className={styles.chatHeaderTitle}>Asistente Virtual</span>
        <button onClick={onClose} className={styles.closeButton} aria-label="Cerrar chat">
          <FaTimes />
        </button>
      </div>
      <div className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.sender === 'user'
                ? styles.userMessage
                : msg.type === 'initial'
                ? styles.initialBotMessage
                : styles.botMessage
            }`}
            dangerouslySetInnerHTML={
              msg.sender === 'bot' ? { __html: msg.text } : undefined
            }
          >
            {msg.sender === 'user' ? msg.text : null}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.questionsListContainer}>
        {predefinedQuestions.map((q: Question) => (
          <button
            key={q.id}
            className={styles.questionButton}
            onClick={() => handleQuestionClick(q.question, q.answer)}
          >
            {q.question}
          </button>
        ))}
      </div>
    </div>
  );
};

export const ChatbotIcon: FC = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <>
      <div
        className={styles.chatbotIcon}
        onClick={toggleChat}
        role="button"
        aria-label="Abrir chat"
      >
        <FaComments />
      </div>
      {isChatOpen && <ChatWindow onClose={toggleChat} />}
    </>
  );
};
