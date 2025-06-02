// src/hooks/useFinConversation.ts
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
    Message,
    FinAction,
    ApiResponse
} from '@/types/financial';
import { useForecast } from './useForecast';
import { ConversationState } from '@/types/conversation';
import { useActionProcessor } from './useActionProcessor';

export function useFinConversation(conversation: any) {
    const { getToken } = useAuth();
    const { processAction, clearProcessedActions } = useActionProcessor();

    const [state, setState] = useState<ConversationState>({
        messages: [],
        loading: false,
        error: null,
        showPlaidLink: false,
        accountData: [],
        transactionData: null,
        invoiceData: [],
        invoicePreview: null,
        paymentUrlData: null,
        showStripeConnectSetup: false,
        stripeConnectStatus: null,
        forecastData: null,  // Add this line
    });

    const {
        forecastData,
        handleForecastAction,
        runScenario,
        exportForecast,
        clearForecast
    } = useForecast();

    // Initialize messages from a conversation
    useEffect(() => {
        if (conversation?.messages) {
            const formattedMessages = conversation.messages.map((msg: any, index: number) => ({
                id: msg.id || `msg-${index}-${Date.now()}`,
                role: msg.role,
                content: msg.content
            }));
            setState(prev => ({ ...prev, messages: formattedMessages, error: null }));
        } else {
            setState(prev => ({ ...prev, messages: [] }));
        }
    }, [conversation]);

    useEffect(() => {
        setState(prev => ({ ...prev, forecastData }));
    }, [forecastData]);

    const addMessage = (message: Message) => {
        setState(prev => ({ ...prev, messages: [...prev.messages, message] }));
    };

    const updateMessages = (messages: Message[]) => {
        setState(prev => ({ ...prev, messages }));
    };

    const clearDisplays = () => {
        setState(prev => ({
            ...prev,
            accountData: [],
            transactionData: null,
            invoiceData: [],
            invoicePreview: null,
            paymentUrlData: null,
            stripeConnectStatus: null,
            showStripeConnectSetup: false,
            showPlaidLink: false,
            forecastData: null,
        }));
        clearProcessedActions();
        clearForecast();
    };

    const sendMessage = async (content: string) => {
        const newMessage: Message = { id: uuidv4(), role: 'user', content };
        const updatedMessages = [...state.messages, newMessage];

        setState(prev => ({
            ...prev,
            messages: updatedMessages,
            loading: true,
            error: null
        }));

        clearDisplays();

        try {
            const token = await getToken();
            const res = await axios.post<ApiResponse>(
                `${process.env.NEXT_PUBLIC_API_URL}/fin/conversations/query`,
                {
                    user_id: 'me',
                    query: content,
                    conversation_history: updatedMessages.map(({ role, content }) => ({ role, content })),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const reply: Message = {
                id: uuidv4(),
                role: 'assistant',
                content: res.data.message || 'Something went wrong, no reply received.',
            };

            setState(prev => ({
                ...prev,
                messages: [...updatedMessages, reply],
                loading: false
            }));

            // Process actions using the new action processor
            if (res.data.actions && Array.isArray(res.data.actions)) {
                console.log(`Processing ${res.data.actions.length} actions`);

                res.data.actions.forEach((action: FinAction, index: number) => {
                    console.log(`Action ${index + 1}:`, action);

                    // First, try to handle forecast actions
                    if (handleForecastAction(action)) {
                        console.log('Handled forecast action:', action.type);
                        return;
                    }

                    // Then process other actions
                    const processed = processAction(action, setState, addMessage);
                    if (!processed) {
                        console.warn(`Failed to process action ${index + 1}:`, action);
                    }
                });

                console.log("Final conversation state after processing actions:", state);
            }

        } catch (err: unknown) {
            console.error('Error in sendMessage:', err);

            const errorMessage: Message = {
                id: uuidv4(),
                role: 'assistant',
                content: 'I apologize, but I encountered an error processing your request. Please try again.'
            };

            setState(prev => ({
                ...prev,
                messages: [...updatedMessages, errorMessage],
                loading: false,
                error: 'Failed to fetch response. Please try again.',
            }));
        }
    };

    return {
        state,
        sendMessage,
        addMessage,
        updateMessages,
        setState,
        runScenario,
        exportForecast,
    };
}