import axiosInstance from "../config/axiosConfig";
import API_CODE from "../constants/api_code";

// Fetch contacts with optional query parameters (pagination, etc.)
export const getContacts = async (params: object) => {
    return await axiosInstance.get(API_CODE.API_CONTACT_001, {
        params: {
            ...params,
        },
    });
};

// Create a new contact
export const createContact = async (contactData: any) => {
    return await axiosInstance.post(API_CODE.API_CONTACT_001, contactData);
};

// Update a contact's details by ID
export const updateContact = async (id: string | undefined, contactData: any) => {
    return await axiosInstance.put(`${API_CODE.API_CONTACT_001}/${id}`, contactData);
};

// Delete a contact by ID
export const deleteContact = async (id: string | undefined) => {
    return await axiosInstance.delete(`${API_CODE.API_CONTACT_001}/${id}`);
};
