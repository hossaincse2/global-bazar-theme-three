export const initialWishlistState = {
    wishlistItems: [],
};

const saveToLocalStorage = (wishlistItems) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }
};

export const wishlistReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_WISHLIST': {
            const existingItems = state.wishlistItems || [];
            const existingIndex = existingItems.findIndex((item) => item.id === action.payload.id);
            let updatedItems;
            if (existingIndex >= 0) {
                updatedItems = existingItems.filter((item) => item.id !== action.payload.id);
            } else {
                updatedItems = [...existingItems, action.payload];
            }
            saveToLocalStorage(updatedItems);
            return { ...state, wishlistItems: updatedItems };
        }
        case 'SET_WISHLIST': {
            if (typeof window === 'undefined') return state;
            const storedData = localStorage.getItem('wishlistItems');
            if (!storedData) return { ...state, wishlistItems: [] };
            try {
                return { ...state, wishlistItems: JSON.parse(storedData) };
            } catch (e) {
                return { ...state, wishlistItems: [] };
            }
        }
        default:
            return state;
    }
};
