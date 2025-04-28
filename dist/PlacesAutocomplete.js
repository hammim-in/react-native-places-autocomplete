var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
const PlacesAutocomplete = ({ query, apiKey, placeholder = 'Search places...', minLength = 3, debounce = 500, onPlaceSelected, }) => {
    const [inputText, setInputText] = React.useState('');
    const [predictions, setPredictions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const typingTimeout = React.useRef(null);
    const fetchPredictions = (text) => __awaiter(void 0, void 0, void 0, function* () {
        if (text.length < minLength) {
            setPredictions([]);
            return;
        }
        setLoading(true);
        try {
            const params = Object.assign({ input: text }, query);
            const queryString = Object.keys(params)
                .filter(key => params[key] !== undefined)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join('&');
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${queryString}&key=${apiKey}`;
            const response = yield fetch(url);
            const data = yield response.json();
            setPredictions(data.predictions || []);
        }
        catch (error) {
            console.error('Error fetching predictions:', error);
            setPredictions([]);
        }
        finally {
            setLoading(false);
        }
    });
    const handleInputChange = (text) => {
        setInputText(text);
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }
        typingTimeout.current = setTimeout(() => {
            fetchPredictions(text);
        }, debounce);
    };
    const handleClear = () => {
        setInputText('');
        setPredictions([]);
    };
    const handlePlacePress = (place) => {
        setInputText(place.description);
        setPredictions([]);
        if (onPlaceSelected) {
            onPlaceSelected(place);
        }
    };
    return (React.createElement(View, { style: styles.container },
        React.createElement(View, { style: styles.inputRow },
            React.createElement(TextInput, { value: inputText, onChangeText: handleInputChange, placeholder: placeholder, placeholderTextColor: "#888", style: styles.textInput }),
            inputText.length > 0 && !loading && (React.createElement(TouchableOpacity, { onPress: handleClear, style: styles.clearButton },
                React.createElement(Text, { style: styles.clearButtonText }, "\u2716\uFE0F"))),
            loading && React.createElement(ActivityIndicator, { size: "small", color: "#888", style: styles.loader })),
        React.createElement(FlatList, { data: predictions, keyExtractor: (item) => item.place_id, renderItem: ({ item }) => (React.createElement(TouchableOpacity, { onPress: () => handlePlacePress(item), style: styles.suggestionItem },
                React.createElement(Text, { style: styles.suggestionText }, item.description))), style: styles.suggestionsList, keyboardShouldPersistTaps: "handled" })));
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 10,
    },
    clearButton: {
        paddingHorizontal: 8,
    },
    clearButtonText: {
        fontSize: 16,
        color: '#888',
    },
    loader: {
        marginLeft: 8,
    },
    suggestionsList: {
        marginTop: 8,
    },
    suggestionItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    suggestionText: {
        fontSize: 16,
        color: '#333',
    },
});
export default PlacesAutocomplete;
