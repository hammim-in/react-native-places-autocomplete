import React from 'react';
interface GooglePlacePrediction {
    description: string;
    place_id: string;
    reference: string;
    id: string;
}
interface PlacesQuery {
    sessiontoken?: string;
    offset?: number;
    location?: string;
    radius?: number;
    components?: string;
    rankby?: string;
    language?: string;
    strictbounds?: boolean;
}
interface PlacesAutocompleteProps {
    query: PlacesQuery;
    apiKey: string;
    placeholder?: string;
    minLength?: number;
    debounce?: number;
    onPlaceSelected?: (place: GooglePlacePrediction) => void;
}
declare const PlacesAutocomplete: React.FC<PlacesAutocompleteProps>;
export default PlacesAutocomplete;
