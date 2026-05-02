interface RegisterMutation {
    username: string;
    password: string;
    avatar: File | null;
    displayName: string;
}

interface LoginMutation {
    username: string;
    password: string;
}

interface User {
    _id: string;
    username: string;
    token: string;
    role: string;
    googleID?: string;
    avatar?: string;
    displayName: string;
}

interface ValidationError {
    errors: {
        [key: string]: {
            name: string;
            message: string;
        }
    },
    message: string;
    name: string;
    _message: string;
}

interface GlobalError {
    error: string;
}

interface InstitutionMutation {
    title: string;
    description: string;
    image: string;
    agreeToTerms: boolean;
}

interface InstitutionListItem {
    _id: string;
    title: string;
    description: string;
    image: string;

    reviewsCount: number;
    photosCount: number;

    avgRating: number;
}

interface InstitutionDetail {
    _id: string;
    user: {
        _id: string;
        username: string;
        displayName: string;
        role: string;
    };
    title: string;
    description: string;
    image: string;

    createdAt: string;
    updatedAt: string;

    reviewsCount: number;
    photosCount: number;

    avgRating: number;
    avgQuality: number;
    avgService: number;
    avgInterior: number;
}