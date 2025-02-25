import api from './index';

export const sendMessage = async (
    token,
    chatId,
    chatValue,
    updateMessages,
) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        headers['Authorization'] = `Bearer ${token}`;

        const body = {
            text: chatValue,
        };

        const response = await api.post(`/api/message/${chatId}`, body, {headers});
        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }

        updateMessages((prevMessages) => [
            ...prevMessages,
            {text: response.data.data.text, isBot: true},
        ]);

    } catch (error) {
        const errorMessage =
            error.response?.data?.error?.message ||
            error.message ||
            'Request failed';
        console.error('Message sending failed:', errorMessage);
        updateMessages((prevMessages) => [
            ...prevMessages,
            { text: 'Error: ' + errorMessage, isBot: true },
        ]);
    }
};

export const getAllChatMessages = async (token, chatId) => {
    try {
        const response = await api.get(`/api/message/${chatId}/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.successful) {
            const result = response.data.data;
            return result;
        } else {
            throw new Error(response.data.error);
        }
    } catch (error) {
        console.error('Error getting messages: ', error);
        return error;
    }
};

export const base64StringToUrl = async (fileData) => {
    console.log(fileData)
    try {
        const response = await api.post(`/api/message/image`, 
            fileData,
        );

        if (response.data.successful) {
            const result = response.data.data.url;
            return result;
        } else {
            throw new Error(response.data.error);
        }
    } catch (error) {
        console.error('Error convert to url:', error);
        return error;
    }
};
