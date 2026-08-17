import { toast } from 'react-toastify';

export const initialCompareState = {
    compareItems: [],
};

const saveToLocalStorage = (compareItems) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('compareItems', JSON.stringify(compareItems));
    }
};

export const compareReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_COMPARE': {
            const existingItems = state.compareItems || [];
            const existingIndex = existingItems.findIndex((item) => item.id === action.payload.id);
            let updatedItems;

            if (existingIndex >= 0) {
                // Remove item
                updatedItems = existingItems.filter((item) => item.id !== action.payload.id);
            } else {
                // Add item if < 4
                if (existingItems.length >= 4) {
                    toast.warning('You can only compare up to 4 products at a time.', { toastId: 'compare-limit' });
                    return state;
                }
                updatedItems = [...existingItems, action.payload];
            }

            saveToLocalStorage(updatedItems);
            return { ...state, compareItems: updatedItems };
        }
        case 'REMOVE_COMPARE': {
            const updatedItems = (state.compareItems || []).filter((item) => item.id !== action.payload.id);
            saveToLocalStorage(updatedItems);
            return { ...state, compareItems: updatedItems };
        }
        case 'CLEAR_COMPARE': {
            saveToLocalStorage([]);
            return { ...state, compareItems: [] };
        }
        case 'SET_COMPARE': {
            if (typeof window === 'undefined') return state;
            const storedData = localStorage.getItem('compareItems');
            if (!storedData) return { ...state, compareItems: [] };
            try {
                return { ...state, compareItems: JSON.parse(storedData) };
            } catch (e) {
                return { ...state, compareItems: [] };
            }
        }
        default:
            return state;
    }
};
