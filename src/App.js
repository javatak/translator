import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css'; // Import custom CSS file for additional styling

const supportedLanguages = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Albanian' },
  { code: 'am', name: 'Amharic' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }, 
];

const TranslationApp = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(''); // No default language selected
  const [isLoading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const translateText = async () => {
    setLoading(true);
    const sentences = inputText.split('. '); // Split by period and space
    let translatedSentences = [];

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim(); // Remove leading/trailing spaces
      if (sentence) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${selectedLanguage}&dt=t&q=${encodeURIComponent(
          sentence
        )}`;

        try {
          const response = await axios.get(url);
          const translatedSentence = response.data[0][0][0];
          translatedSentences.push(translatedSentence);
        } catch (error) {
          console.error('Error translating sentence:', error);
          translatedSentences.push(sentence); // Fallback to original sentence on error
        }
      }
    }

    setTranslatedText(translatedSentences.join('. ')); // Join translated sentences with period and space
    setLoading(false);
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="bg-gray-200 text-gray-800 text-lg font-semibold py-4 px-6">Google Translate App</h2>
        <div className="p-6">
          <textarea
            className="w-full h-32 px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition duration-300"
            placeholder="Enter text to translate..."
            value={inputText}
            onChange={handleInputChange}
          ></textarea>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">
              Select Language:
            </label>
            <select
              id="language"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition duration-300"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="">Select a language</option>
              {supportedLanguages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className={`mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={translateText}
            disabled={isLoading || !selectedLanguage}
          >
            {isLoading ? 'Translating...' : 'Translate'}
          </button>
        </div>
        {translatedText && (
          <div className="bg-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-2">Translated Text:</h3>
            <p className="text-gray-800">{translatedText}</p>
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationApp;
